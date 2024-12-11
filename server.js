const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/config");
const Analytics = require("./models/analyticsModel");
const InformationModel = require("./models/informationModel");
const SectionModel = require('./models/sectionModel');
const User = require("./models/userModel");
const cors = require('cors'); 
const app = express();
app.use(cors());
// mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Database connection failed:", err));
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello from Node.js app!');
});
app.get('/get-list',async (req, res) => {
    const sections = await SectionModel.find({});
   
    const analytics = await Analytics.find({});
    const information = await InformationModel.find({});
    let result = await SectionModel.aggregate([
        // Stage 1: Lookup the child document based on `childrenId` from the parent
        // {
        //   $lookup: {
        //     from: "sections",            // The collection we're joining (same collection, "sections")
        //     localField: "childrenId",     // Field in the parent document that refers to the child (_id)
        //     foreignField: "_id",          // Matching the `_id` field in the child document
        //     as: "children"                // The array where the child document will be stored
        //   }
        // },
      
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
            _id: 1,                        // Keep the parent `_id`
            Section_ID: 1,                 // Keep the `Section_ID` of the parent
            Information_ID: 1,             // Keep the `Information_ID` of the parent
            Analytics_ID: 1,               // Keep the `Analytics_ID` of the parent
            restrictCountry: 1,            // Keep the `restrictCountry` of the parent
            createdBy: 1,                  // Keep the `createdBy` of the parent
            type: 1,                       // Keep the `type` of the parent
            childrenId: 1,                   // Keep the children
            informationDetails: 1,         // Keep the information details
            analyticsDetails: 1           // Keep the analytics details
          }
        }
      ]
      );

     

      const idMap = result.reduce((acc, item) => {
        item.children =[];
        acc[item._id] = { ...item };  // Clone the item
        
        return acc;
    }, {});
    
    // Step 2: Iterate through the data and nest children under their parent
    result.forEach((item) => {
        if (item.childrenId) {
            const parent = idMap[item.childrenId]; // Convert ObjectId to string
            if (parent) {
                parent.children.push(item);  // Nest the current item under its parent
            }
        }
    });
    
    // Step 3: Filter out items that are not parents
    const data = result.filter(item => !item.childrenId);
    
      
    res.json(data)
});

app.post("/admin/login", async (req, res) => {
  try {
      const { email, password } = req.body;

      // Step 1: Find the user by email
      const user = await User.findOne({ email });
      console.log(user)
      if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Step 2: Check password (not hashed)
      if (user.password !== password) {
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
});


app.get("/admin/fetchUser",async (req, res) =>{
  try{

    let data = await User.find({});

    res.json(data);

  }catch(err){
    console.log(err)
  }
})


app.listen(config.port, () => console.log(`Server running on port ${config.port}`));
