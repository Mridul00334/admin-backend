const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema
const jobPostSchema = new Schema({
  section_id: {
    type: Schema.Types.ObjectId,  // Assuming this references another collection
    required: false
  },
  partner_id: {
    type: String,  // The partner_id is a string (e.g., 'partner_123')
    required: false
  },
  status: {
    type: String,
    enum: ['IN-REVIEW', 'OPEN', 'CLOSED'],  // Assuming 'IN-PROGRESS' is one of the possible statuses
    required: true
  },
  job_title: {
    type: String,
    required: true
  },
  company_name: {
    type: String,
    required: true
  },
  work_experience: {
    type: String,  // Range of years (e.g., "3-5 years")
    required: true
  },
  job_level: {
    type: String,  // Job level (e.g., "Mid-Level")
    required: true
  },
  job_type: {
    type: String,  // Type of job (e.g., "Full-Time")
    required: true
  },
  salary: {
    type: String,  // MongoDB Decimal128 type for precise money representation
    required: true
  },
  visa_requirement: {
    type: [String],  // Visa requirement (e.g., 'H1b')
    required: true
  },
  country: {
    type: String,  // Country of job (e.g., 'USA')
    required: true
  },
  city: {
    type: String,  // City of job (e.g., 'New York')
    required: true
  },
  location_type: {
    type: [String],  // Type of job location (e.g., 'On-site')
    required: true
  },
  job_posted_at: {
    type: Date,  // Job posted date (MongoDB Date format)
    required: true
  },
  job_expiry_date: {
    type: Date,  // Job expiry date (MongoDB Date format)
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
  user_id: {
    type: Schema.Types.ObjectId,  // Assuming this references another collection (e.g., a user)
    required: true
  }
});

// Create the model
const Job = mongoose.model('Job', jobPostSchema);

module.exports = Job;
