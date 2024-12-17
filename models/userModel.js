const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address'],
  },
  mobileNumber: {
    type: String,
    match: [/^\+\d{1,3}\d{4,14}$/, 'Please enter a valid mobile number with country code'],
  },
  countryCode: {
    type: String,
    match: [/^\+\d{1,4}$/, 'Please enter a valid country code'],
  },
  role: {
    type: String,
    enum: [
      'CUSTOMER', 'PARTNER', 'PARTNER_TEAM', 'DELIVERY_BOY', 'FULFILLMENT',
      'FULFILLMENT_TEAM', 'ADMIN', 'MANAGER', 'SUPPORT', 'BETA_TESTER',
      'EMPLOYEES'
    ],
    required: true,
  },
  isActive: {
    type: String,
    enum: ['INACTIVE', 'ACTIVE', 'DEACTIVE', 'CLOSED'],
    default: 'INACTIVE', // Default to INACTIVE if not specified
    required: true,
  },
  password: {
    type: String,
    minlength: 12, // You can adjust the password length requirement
  },
  accessType: {
    type: String,
    enum: ['OWNER', 'EDITOR', 'VIEWER'],
  },
  restrictedFeatures: {
    type: [String],  // Array of strings
    default: [],     // Default to an empty array if no restricted features are provided
  },
  lastOnline: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
});

// Create a Mongoose model
const User = mongoose.model('User', userSchema);

module.exports = User;
