const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  section_id: {
    type: mongoose.Schema.Types.ObjectId, // Using ObjectId for job_id
    default: mongoose.Types.ObjectId,     
  },
  partner_id: {
    type: mongoose.Schema.Types.ObjectId, 
    default: mongoose.Types.ObjectId,     
  },
  user_id: {
    type: String,
    required: true, // Assuming this is the user ID
  },
  status: {
    type: String,
    enum: ['IN-REVIEW', 'IN-PROGRESS', 'EXPIRED'],
    required: true,
  },
  job_title: {
    type: String,
    required: true,
  },
  company_name: {
    type: String,
    required: true,
  },
  work_experience: {
    type: String, // Can store values like '1-2 years', '5 years', etc.
    required: true,
  },
  job_level: {
    type: String,
    enum: ['Entry-Level', 'Mid-Level', 'Senior-Level'],
    required: true,
  },
  job_description: [{
    type: String, // Array to hold multiple paragraphs or points in the job description
  }],
  job_type: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Internship', 'Contract'],
    required: true,
  },
  salary: {
    type: Schema.Types.Decimal128, // This stores the decimal value for salary
    required: true,
  },
  salary_currency: {
    type: String, // Store the currency symbol, e.g., USD, EUR, etc.
    required: true,
  },
  visa_requirement: {
    type: String,
    enum: ['H1b', 'CPT', 'Dynamic'],
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  location_type: {
    type: String,
    enum: ['On-site', 'Remote'],
    required: true,
  },
  job_posted_at: {
    type: Date,
    required: true,
  },
  job_expiry_date: {
    type: Date,
    required: true,
  },
  created_date: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
  updated_date: {
    type: Date,
    default: Date.now, // Automatically set the update date, can be updated during updates
  },
});

// Optionally, create indexes on frequently queried fields for optimization

jobSchema.index({ partner_id: 1 });
jobSchema.index({ job_expiry_date: 1 });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
