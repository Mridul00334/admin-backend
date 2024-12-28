

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

    let data =  await Jobs.find({});
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
            success: "SUCCESS",
            message: 'Create Job Application',
            application: newJobApplication
        });
    } catch (error) {
        res.json( {
            success: "FAILURE",
            message: error.message
        });
    }
};


