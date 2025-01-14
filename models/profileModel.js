const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Profile Schema
const profileSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  profession: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: false
  },
  professionExperience: {
    type: Number,
    required: true
  },
  interests: {
    type: [String], // Array of strings for multiple interests
    required: false
  },
  images: {
    type: [String], // Array of URLs or file paths for images
    required: false
  },
  dob: {
    type: Date,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: {
    type: Date,
    default: Date.now
  },
  homeTown: {
    type: String,
    required: false
  },
  language: {
    type: [String], // Array to store multiple languages
    required: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to the User schema
    required: true
  },
  resume: {
    type: [String], 
    required: false,
    default:null
  }
});

// Create a model based on the schema
const Profile = mongoose.model('Profile', profileSchema);

// Export the model for use
module.exports = Profile;
