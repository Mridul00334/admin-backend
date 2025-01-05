const mongoose = require('mongoose');

// Define the schema for the InformationModel
const informationModelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subTitle: { type: String, required: true },
  description: { type: String, required: true },
  Flag: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }, // Assuming 'Active' or 'Inactive' for Flag
  mediaURL: { type: String, required: true },
  isVideo: { type: Boolean, required: true },  // true = video, false = image
  isEnabled: { type: Boolean, default: true }, // true = enabled, false = disabled
  createdDate: { type: Date, default: Date.now }, // Automatically set the creation date
  updatedDate: { type: Date, default: Date.now }, // Automatically set the updated date
});

// Pre-save hook to update the updatedDate field when the document is modified


// Create and export the model
const InformationModel = mongoose.model('Information', informationModelSchema);

module.exports = InformationModel;
