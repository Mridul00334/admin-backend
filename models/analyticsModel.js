const mongoose = require('mongoose');

// Define the schema for impressionTag
const impressionTagSchema = new mongoose.Schema({
  type_name: { type: String, required: false },
  ID: { type: String, required: false },
  NAME: { type: String, required: false },
});

// Define the schema for FireBase_Remote_Config
const fireBaseRemoteConfigSchema = new mongoose.Schema({
  featureEnabled: { type: Boolean, required: false },
  colorScheme: { type: String, required: false }
});

// Define the Analytics schema
const analyticsSchema = new mongoose.Schema({
  impressionTag: { type: impressionTagSchema, required: true },
  FireBase_Remote_Config: { type: fireBaseRemoteConfigSchema, required: true },
  Keywords: { type: [String], required: true },
  views: { type: Number, required: true },
  orders: { type: Number, required: true },
  priority: { type: Number, min: 1, max: 5, required: true },
  createdDate: { type: Date, default: Date.now },  // Automatically set when the document is created
  updatedDate: { type: Date, default: Date.now }   // Automatically set when the document is created
});

// Create a pre-save hook to automatically update the `updatedDate` before saving


// Create and export the model based on the schema
const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;
