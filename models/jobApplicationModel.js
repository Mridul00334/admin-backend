const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the job application schema
const jobApplicationSchema = new Schema({
    job_id: {
        type: Schema.Types.ObjectId,  // Reference to the Job collection (assuming ObjectId is used)
        required: true,
        ref: 'Job'  // Reference to the Job collection
    },
    profile_id: {
        type: Schema.Types.ObjectId,  // Reference to the Profile collection (assuming ObjectId is used)
        required: true,
        ref: 'Profile'  // Reference to the Profile collection (students/job seekers)
    },
    application_status: {
        type: Boolean,
        required: true
    },
    application_date: {
        type: Date,
        default: Date.now
    },
    interview_date: {
        type: Date,  // Optional date for the interview
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Automatically update the 'updated_at' field whenever the document is modified
jobApplicationSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

module.exports = JobApplication;
