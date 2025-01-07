const mongoose = require('mongoose');
const { Schema } = mongoose;

// Job Description Schema


// Main Job Schema
const JobDescriptionSchema = new Schema({
  job_id: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true // Ensures each job has a unique ID
  },
  job_description: {
    type: [String],
    required: true // Ensures that job descriptions are provided
  }
});

// Create and export the model
const JobDescription = mongoose.model('JobDescription', JobDescriptionSchema);
module.exports = JobDescription;
