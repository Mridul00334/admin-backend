

const Analytics = require("../models/analyticsModel");
const InformationModel = require("../models/informationModel");
const SectionModel = require('../models/sectionModel');
const User = require("../models/userModel");
const Profile = require("../models/profileModel");

exports.addCategory = async (req, res) =>{
   
  }


  exports.deleteCategory =async(req,res)=>{
  
      try {
        // Get the Section_ID (or _id) from the request params
        const sectionId = req.body.id;
    
        // Find and delete the section
        const result = await SectionModel.findByIdAndDelete(sectionId);
    
        if (!result) {
          return res.status(404).json({ message: 'Section not found' });
        }
    
        // Send success response
        res.status(200).json({ message: 'Section deleted successfully' });
      } catch (error) {
        // Handle errors (e.g., invalid ID format, database issues)
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
  }


  exports.updateCategory=async(req,res)=>{
      try {
        const { categoryId } = req.params;  // Assuming categoryId is passed in the URL
        const {
          title,
          subtitle,
          analyticsEvents,
          restrictedCountries,
          enabled,
          imageURL,
          description
        } = req.body;
    
        // Find the existing category using categoryId
        const section = await SectionModel.findById(categoryId);
        if (!section) {
          return res.status(404).json({
            status: "FAILURE",
            message: "Category not found"
          });
        }
    
        // Update the InformationModel
        const info = await InformationModel.findById(section.Information_ID);
        if (info) {
          info.title = title || info.title;  // Update only if new value is provided
          info.subTitle = subtitle || info.subTitle;
          info.description = description || info.description;
          info.mediaURL = imageURL || info.mediaURL;
          info.isEnabled = enabled !== undefined ? enabled : info.isEnabled;
          await info.save();  // Save the updated InformationModel
        }
    
        // Update the Analytics Model (if needed)
        const analytic = await Analytics.findById(section.Analytics_ID);
        if (analytic) {
          // Update analytics fields as required (based on req.body or default)
          analytic.impressionTag = analyticsEvents?.impressionTag || analytic.impressionTag;
          analytic.FireBase_Remote_Config = analyticsEvents?.FireBase_Remote_Config || analytic.FireBase_Remote_Config;
          analytic.Keywords = analyticsEvents?.Keywords || analytic.Keywords;
          await analytic.save();  // Save the updated Analytics Model
        }
    
        // Update the SectionModel itself (category)
        section.Section_ID = title || section.Section_ID;
        section.restrictCountry = restrictedCountries || section.restrictCountry;
        section.type = 'CATEGORY';
        section.childrenId =section?.childrenId &&  section?.childrenId;
    
        const updatedSection = await section.save();  // Save the updated Section
    
        res.status(200).json({
          status: "SUCCESS",
          message: "Category updated successfully",
          data: updatedSection
        });
    
      } catch (err) {
        console.error(err);
        res.status(500).json({
          status: "FAILURE",
          message: "Failed to update category",
          data: err.message
        });
      }
    };
    
  
