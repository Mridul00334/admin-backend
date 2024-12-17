
const Analytics = require("../models/analyticsModel");
const InformationModel = require("../models/informationModel");
const SectionModel = require('../models/sectionModel');
const User = require("../models/userModel");
<<<<<<< HEAD
const Profile = require("../models/profileModel");
=======
>>>>>>> 229cc116130a0dbaa77f406827199dade8adc3ad
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


exports.fetchUser = async (req, res) =>{
  try{

    let data = await User.find({});

    res.json(data);

  }catch(err){
    console.log(err);
    res.status(500).json({
        success: false,
        message: "Some error occured"
      });
  }
}

<<<<<<< HEAD


=======
>>>>>>> 229cc116130a0dbaa77f406827199dade8adc3ad
exports.submitUser = async (req, res) =>{
  try{

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
      success: true,
      message: "User created successfully",
      user: savedUser
    });
    
  }catch(err){
    console.log(err)
    res.status(500).json({
        success: false,
        message: "Some error occured"
      });
  }
}

async function  sendEmail(userEmail,userPassword){

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
  let {userId} = req.body;
 
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
          message: "SUCCESS",
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
              type: "text",
              value: profile.interests ? profile.interests.join(', ') : ''
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

  
