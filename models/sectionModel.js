const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the schema for createdBy
const createdBySchema = new mongoose.Schema({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false }
});

// Define the main schema for the SectionModel
const sectionModelSchema = new mongoose.Schema({
  Section_ID: { type: String, required: true },
  Information_ID: { type: Schema.Types.ObjectId, required: true },
  Analytics_ID: { type: Schema.Types.ObjectId, required: true },
  restrictCountry: { type: [String], required: true }, // Array of restricted countries
  createdBy: { type: createdBySchema, required: false }, // Embedding the createdBy schema
  type: {
    type: String,
    enum: ['DEPARTMENT', 'CATEGORY', 'SUB-CATEGORY-L1', 'SUB-CATEGORY-L2', 'SUB-CATEGORY-L3', 'SUB-CATEGORY-L4'],
    required: true
  },
  createdDate: { type: Date, default: Date.now }, // Automatically set the creation date
  updatedDate: { type: Date, default: Date.now }, // Automatically set the updated date
});

// Pre-save hook to update the updatedDate field when the document is modified
sectionModelSchema.pre('save', function (next) {
  this.updatedDate = Date.now();
  next();
});

// Create and export the model
const SectionModel = mongoose.model('Sections', sectionModelSchema);

module.exports = SectionModel;
