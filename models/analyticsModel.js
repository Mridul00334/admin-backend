const mongoose = require('mongoose');

// Define the schema for impressionTag
const impressionTagSchema = new mongoose.Schema({
  type_name: { type: String, required: true },
  ID: { type: String, required: true },
  NAME: { type: String, required: true },
});

// Define the schema for FireBase_Remote_Config
const fireBaseRemoteConfigSchema = new mongoose.Schema({
  featureEnabled: { type: Boolean, required: true },
  colorScheme: { type: String, required: true }
});

// Define the Analytics schema
const analyticsSchema = new mongoose.Schema({
  Analytics_ID: { type: String, required: true },
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
