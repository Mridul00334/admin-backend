

const Analytics = require("../models/analyticsModel");
const InformationModel = require("../models/informationModel");
const SectionModel = require('../models/sectionModel');
const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const Jobs = require("../models/jobsModel");
const JobApplication = require('../models/jobApplicationModel');
const JobDescription = require('../models/jobDescriptionModel');
const mongoose = require('mongoose');
exports.getJobsList = async (req, res) =>{
   try{

    let data =  await Jobs.find({},{ job_description: 0,createdDate:0,updatedDate:0 });
    res.status(200).json({
        status:"SUCCESS",
        message:"Data fetched",
        data:data
    })
    
   }catch(err){
    res.status(500).json({
        status:"FALIURE",
        message:"error"
    });
   }
  }



  exports.getJobDescription= async(req,res)=>{
    console.log(req.body);
    let {jobId} = req.body;
  try {
    // Aggregate the job data with its description
    const jobDetails = await Jobs.aggregate([
      {
        $match:
          /**
           * query: The query in MQL.
           */
          {
            _id: new mongoose.Types.ObjectId(jobId),
          },
      },
      {
        $lookup:
          {
            from: "jobdescriptions",
            // Collection name of JobDescription schema
            localField: "_id",
            // The field in JobPost collection
            foreignField: "job_id",
            // The field in JobDescription collection
            as: "job_description", // Alias to store the job description data
          },
      },
      {
        $unwind:
          /**
           * path: Path to the array field.
           * includeArrayIndex: Optional name for index.
           * preserveNullAndEmptyArrays: Optional
           *   toggle to unwind null and empty values.
           */
          {
            path: "$job_description",
            preserveNullAndEmptyArrays: true, // If no matching descriptions, still return the job post
          },
      },
      {
        $project:
          /**
           * specifications: The fields to
           *   include or exclude.
           */
          {
            status: 1,
            job_title: 1,
            company_name: 1,
            city: 1,
            work_experience: 1,
            salary: 1,
            salary_currency: 1,
            job_level: 1,
            visa_requirement: 1,
            job_type: 1,
            location_type: 1,
            job_posted_at: 1,
            job_expiry_date: 1,
            created_date: 1,
            updated_date: 1,
            job_description:
              "$job_description.job_description", // Extracting job description field
          },
      },
    ]);
 
    // if (jobDetails.length === 0) {
    //   throw new Error('Job not found');
    // }

     res.json({
      status: 'SUCCESS',
      message: 'Data fetched',
      data: jobDetails[0] // Assuming you are fetching a single job, so we return the first element
    });
  } catch (error) {
    console.error('Error fetching job details:', error);
    res.json({
      status: 'FAILURE',
      message: error.message,
      data: {}
    });
  }
}

exports.createJobApplication=async(req,res)=>{
 let{ jobId, profileId, applicationStatus, interviewDate = null}=req.body;
 

// Function to create a job application
    try {
        // Check if the job exists
        const job = await Jobs.findById(jobId);
        if (!job) {
            throw new Error('Job not found');
        }

        // Check if the profile exists
        const profile = await Profile.findById(profileId);
        if (!profile) {
            throw new Error('Profile not found');
        }

        // Create the job application document
        const newJobApplication = new JobApplication({
            job_id: jobId,
            profile_id: profileId,
            application_status: applicationStatus,
            interview_date: interviewDate,
            application_date: new Date(),
            created_at: new Date(),
            updated_at: new Date()
        });

        // Save the job application to the database
        await newJobApplication.save();

        res.json( {
            status: "SUCCESS",
            message: 'Create Job Application',
            application: newJobApplication
        });
    } catch (error) {
        res.json( {
            staus: "FAILURE",
            message: error.message
        });
    }
};


exports.createNewJob = async (req, res) => {
  try {
    const { section_id, partner_id,job_description, ...jobData } = req.body;
    const {userId} = req.user;

    // Ensure section_id and partner_id are not required if they are null
    if (!section_id) jobData.section_id = null;
    if (!partner_id) jobData.partner_id = null;
    if(userId) jobData.user_id= userId;
   

    // Create a new job post
    const newJob =  new Jobs(jobData);

    // Save the new job post to the database
    let job = await newJob.save();

    const newJobDesc = new JobDescription({job_description,job_id:job._id})
    await newJobDesc.save();
    // Send success response with the created job
    res.status(201).json({
      status:"SUCCESS",
      message: 'Job created successfully',
      job: newJob
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status:"FAILURE",
      message: 'Error creating job post',
      error: error.message
    });
  }
};


exports.updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;  // Get jobId from URL parameter
    const { section_id, partner_id, ...jobData } = req.body;  // Get the data from the request body
    const { userId } = req.user;  // Get userId from the authenticated user

    // Ensure section_id and partner_id are not required if they are null
    if (!section_id) jobData.section_id = null;
    if (!partner_id) jobData.partner_id = null;
    if (userId) jobData.user_id = userId;  // Set user_id if provided by auth

    // Find and update the job by its ID
    const updatedJob = await Jobs.findByIdAndUpdate(
      jobId,  // The job ID to update
      { $set: jobData },  // The new job data to update
      { new: true, runValidators: true }  // Return the updated job and run validation on the updated data
    );

    // Check if job exists
    if (!updatedJob) {
      return res.status(404).json({
        message: 'Job not found'
      });
    }

    // Send success response with the updated job
    res.status(200).json({
      status:"SUCCESS",
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status:"FALIURE",
      message: 'Error updating job post',
      error: error.message
    });
  }
};


// Get all profiles that are associated with job applications
exports.getApplicantsList = async (req, res) => {
  try {
    const { jobId } = req.body; // Assuming the jobId is passed in the request URL as a parameter
  
    const profiles = await JobApplication.aggregate([
      {
        $match: { job_id: new mongoose.Types.ObjectId(jobId) } // Match job_id with the provided jobId in the request
      },
      {
        $lookup: {
          from: 'profiles', // The collection name for Profile in lowercase
          localField: 'profile_id', // The field in JobApplication referencing Profile
          foreignField: '_id', // The field in Profile that matches localField
          as: 'profile' // The alias for the joined Profile document
        }
      },
      {
        $unwind: '$profile' // Deconstruct the array of profiles into individual documents
      },
      {
        $project: { // Select the fields you want to return from the joined Profile
          firstName: '$profile.firstName',
          lastName: '$profile.lastName',
          profession: '$profile.profession',
          qualification: '$profile.qualification',
          specialization: '$profile.specialization',
          professionExperience: '$profile.professionExperience',
          interests: '$profile.interests',
          images: '$profile.images',
          dob: '$profile.dob',
          homeTown: '$profile.homeTown',
          language: '$profile.language',
          userId: '$profile.userId',
          job_id: 1,
          application_status: 1, // Include job application status
          application_date: 1, // Include job application date
          interview_date: 1 // Include interview date if available
        }
      }
    ]);

    console.log(profiles); // Log the result
    res.json({ status: "SUCCESS", message: "Data fetched", data: profiles }); // Return the result
  } catch (err) {
    console.error('Error fetching profiles:', err); // Error handling
    res.json({ status: "FAILURE", message: err }); // Throw error for further handling
  }
};


