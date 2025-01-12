
const Analytics = require("../models/analyticsModel");
const InformationModel = require("../models/informationModel");
const SectionModel = require('../models/sectionModel');
const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SMS_API_KEY);
const generator = require('generate-password');

const generateRandomPassword = () => {
  return generator.generate({
    length: 10,   // Password length
    numbers: true // Include numbers in the password
  });
};


exports.getList = async (req, res) => {
  try {
    let result = await SectionModel.aggregate([
      // Stage 2: Lookup the Information collection using `Information_ID`
      {
        $lookup: {
          from: "information",         // The collection we are joining (assuming the collection name is "information")
          localField: "Information_ID", // The field in the parent document
          foreignField: "_id",         // Matching the `_id` field in the information collection
          as: "informationDetails"     // Store the result in the `informationDetails` field
        }
      },

      // Stage 3: Lookup the Analytics collection using `Analytics_ID`
      {
        $lookup: {
          from: "analytics",           // The collection we are joining (assuming the collection name is "analytics")
          localField: "Analytics_ID",   // The field in the parent document
          foreignField: "_id",         // Matching the `_id` field in the analytics collection
          as: "analyticsDetails"       // Store the result in the `analyticsDetails` field
        }
      },

      // Stage 4: Unwind the children array
      {
        $unwind: {
          path: "$children",           // Unwind the children array
          preserveNullAndEmptyArrays: true  // Retain documents without children (optional)
        }
      },

      // Stage 5: Unwind the informationDetails array
      {
        $unwind: {
          path: "$informationDetails", // Unwind the informationDetails array
          preserveNullAndEmptyArrays: true  // Retain documents without information details (optional)
        }
      },

      // Stage 6: Unwind the analyticsDetails array
      {
        $unwind: {
          path: "$analyticsDetails",   // Unwind the analyticsDetails array
          preserveNullAndEmptyArrays: true  // Retain documents without analytics details (optional)
        }
      },

      // Stage 7: Project the desired fields (optional)
      {
        $project: {
          _id: 1,                        // Keep the parent `_id`                           // Keep the `createdBy` of the parent
          type: 1,                       // Keep the `type` of the parent
          childrenId: 1,                   // Keep the children
          title:"$informationDetails.title", 
          description:"$informationDetails.description",
          isEnabled:"$informationDetails.isEnabled",
          image:"$informationDetails.mediaURL",       // Keep the information details      // Keep the analytics details
          isRestricted: 1

        }
      }
    ]
    );


    const idMap = result.reduce((acc, item) => {
      item.list = [];
      acc[item._id] = { ...item };  // Clone the item


      return acc;
    }, {});

    // Step 2: Iterate through the data and nest children under their parent
    result.forEach((item) => {
      if (item.childrenId) {
        const parent = idMap[item.childrenId]; // Convert ObjectId to string
        if (parent) {
          parent.list.push(item);  // Nest the current item under its parent
        }
      }
    });

    // Step 3: Filter out items that are not parents
    const data = result.filter(item => !item.childrenId);


    res.json({status:"SUCCESS",message:"data fetched", data:data})
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "some error occured" })
  }
};




exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Step 2: Check password (not hashed)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // Step 3: Check if the user is active
    if (user.isActive !== 'ACTIVE') {
      return res.status(403).json({ success: false, message: 'User is not active' });
    }

    // If everything matches, return success
    return res.json({ success: true, message: 'Login successful', user });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'An error occurred during login' });
  }
};


exports.fetchUser = async (req, res) => {
  try {

    let data = await User.find({});

    res.json(data);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Some error occured"
    });
  }
}



exports.submitUser = async (req, res) => {
  try {

    const { email, mobileNumber, countryCode, role, isActive, accessType, restrictedFeatures } = req.body;

    const password = generateRandomPassword();

    // Hash the password before saving it in the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new user document
    const newUser = new User({
      email,
      mobileNumber,
      countryCode,
      role,
      isActive,
      password: hashedPassword,
      accessType,
      restrictedFeatures,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();
    await sendEmail(email, password);
    // Send a success response with the saved user
    res.status(201).json({
      status: "SUCCESS",
      message: "User created successfully",
      user: savedUser
    });

  } catch (err) {
    console.log(err)
    res.status(500).json({
      status: "FAILED",
      message: "Some error occured"
    });
  }
}

async function sendEmail(userEmail, userPassword) {

  const msg = {
    to: userEmail, // Change to your recipient
    from: 'anurag@magicindi.com', // Change to your verified sender
    subject: 'Your MagicInd Account has been created',
    text: 'and easy to do anywhere, even with Node.js',
    html: `
    <p>Hi there,</p>
    <p>Your account has been successfully created! Here are your account details:</p>
    <ul>
      <li><strong>Email:</strong> ${userEmail}</li>
      <li><strong>Password:</strong> ${userPassword}</li> <!-- Again, don't use this in production -->
    </ul>
    <p>We recommend that you change your password after logging in to keep your account secure.</p>
    <p>Best regards,<br> MagicIndi Team</p>
  `,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')

    })
    .catch((error) => {
      console.error(error)

    })

};


exports.getProfileByUserId = async (req, res) => {

  let { userId } = req.user;
  await Profile.updateMany(
    {},  // This means update all documents in the collection
    { 
      $set: { resume: null }  // Initialize the 'resume' field with null or a default value
    }
  );

  Profile.findOne({ userId: userId })  // Searching for profile by userId
    .then(profile => {
      if (!profile) {
        console.log('No profile found for this user');
        return {
          message: "ERROR",
          data: []
        };
      }

      // Formatting the profile data into the desired response format
      const response = {
        status: "SUCCESS",
        message: "Data fetched",
        data: [
          {
            label: "First Name",
            key: "firstName",
            type: "text",
            value: profile.firstName
          },
          {
            label: "Last Name",
            key: "lastName",
            type: "text",
            value: profile.lastName
          },
          {
            label: "Profession",
            key: "profession",
            type: "text",
            value: profile.profession
          },
          {
            label: "Qualification",
            key: "qualification",
            type: "text",
            value: profile.qualification
          },
          {
            label: "Specialization",
            key: "specialization",
            type: "text",
            value: profile.specialization || ''
          },
          {
            label: "Professional Experience",
            key: "professionExperience",
            type: "text",
            value: profile.professionExperience
          },
          {
            label: "Interests",
            key: "interests",
            type: "list",
            value: profile.interests
          },
          {
            label: "Images",
            key: "images",
            type: "filePicker",
            value: profile.images || []
          },
          {
            label: "Date of Birth",
            key: "dob",
            type: "date",
            value: profile.dob ? profile.dob.toISOString().split('T')[0] : ''
          },
          {
            label: "Home Town",
            key: "homeTown",
            type: "text",
            value: profile.homeTown || ''
          },
          {
            label: "Language",
            key: "language",
            type: "dropdown",
            options: [
              "English",
              "Hindi",
              "Spanish",
              "French",
              "German",
              "Chinese",
              "Japanese",
              "Russian"
            ],
            value: profile.language || []
          },
            {
              label: "Resume",
              key: "Resume",
              type: "filePicker",
              value: profile.resume || null
            }
        ]
      };


      return res.status(200).json(response);
    })
    .catch(err => {
      console.error('Error fetching profile:', err);
      return res.status(500).json({
        message: "ERROR",
        data: []
      });
    });
};


exports.updateProfileByUserId = async (req, res) => {
  let { userId } = req.user;  // Extract the userId from the authenticated user
  const { firstName, lastName, profession, qualification, specialization, professionExperience, interests, images, dob, homeTown, language } = req.body; // Extract fields from the request body

  // Initialize an object to hold the fields to be updated
  const profileData = {};

  try {
    // Build the profileData object with the provided fields
    if (firstName !== undefined) profileData.firstName = firstName;
    if (lastName !== undefined) profileData.lastName = lastName;
    if (profession !== undefined) profileData.profession = profession;
    if (qualification !== undefined) profileData.qualification = qualification;
    if (specialization !== undefined) profileData.specialization = specialization;
    if (professionExperience !== undefined) profileData.professionExperience = professionExperience;
    if (interests !== undefined) profileData.interests = interests;
    if (images !== undefined) profileData.images = images;

    // Handle the date of birth field
    if (dob !== undefined) {
      profileData.dob = new Date(dob);  // Convert date string to Date object
    }

    if (homeTown !== undefined) profileData.homeTown = homeTown;
    if (language !== undefined) profileData.language = language;

    // Use findOneAndUpdate with upsert: true to either update or create the profile
    const result = await Profile.findOneAndUpdate(
      { userId: userId },  // Search by userId
      { $set: profileData },  // Update only the fields provided in the request body
      { new: true, upsert: true } // Options: return updated document, create if doesn't exist
    );

    // Return a successful response with the updated profile data
    return res.status(200).json({
      message: "SUCCESS",
      data: result
    });

  } catch (err) {
    console.error('Error updating profile:', err);
    return res.status(500).json({
      message: "ERROR",
      data: "Error updating profile"
    });
  }
};


exports.addCategory = async (req, res) => {
  try {
    let {
      title,
      subtitle,
      analyticsEvents,
      restrictedCountries,
      enabled,
      imageURL,
      description,
      parentKey
    } = req.body;

    let infodata = new InformationModel({
      title,
      subTitle: subtitle,
      description,
      Flag: "Active",
      mediaURL: imageURL,
      isVideo: false,
      isEnabled: enabled
    })
    const info = await infodata.save();

    const analytics = new Analytics({
      impressionTag: {},
      FireBase_Remote_Config: {},
      Keywords: [],
      views: 0,
      orders: 0,
      priority: 1
    });

    const analytic = await analytics.save();
    let section;
    if (parentKey) {
       section = new SectionModel({
        Section_ID: title,
        Information_ID: info._id,
        Analytics_ID: analytic._id,
        restrictCountry: restrictedCountries,
        createdBy: {
          firstName: "",
          lastName: ""
        },
        type: 'CATEGORY',
        childrenId:parentKey
      });
    } else {
       section = new SectionModel({
        Section_ID: title,
        Information_ID: info._id,
        Analytics_ID: analytic._id,
        restrictCountry: restrictedCountries,
        createdBy: {
          firstName: "",
          lastName: ""
        },
        type: 'CATEGORY'
      });
    }

    console.log(section)
    const result = await section.save();
    res.status(200).json({
      status: "SUCCESS",
      message: "data update",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      status: "SUCCESS",
      message: "data update",
      data: err
    });
  }
}

