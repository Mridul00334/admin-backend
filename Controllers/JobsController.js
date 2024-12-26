

const Analytics = require("../models/analyticsModel");
const InformationModel = require("../models/informationModel");
const SectionModel = require('../models/sectionModel');
const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const Jobs = require("../models/jobsModel");

exports.getJobsList = async (req, res) =>{
   try{

    let data =  await Jobs.find({});
    res.status(200).json({
        status:"Success",
        message:"Data fetched",
        data:data
    })
    
   }catch(err){
    res.status(500).json({
        status:"Failure",
        message:"error"
    });
   }
  }