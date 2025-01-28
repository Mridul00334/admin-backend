const express = require("express");
const { fetchUser,submitUser,loginUser,getProfileByUserId,getList,updateProfileByUserId, addCategory,resumeUpload } = require("../Controllers/UserController2");
const {getJobsList,getJobDescription,createJobApplication,createNewJob,updateJob,getApplicantsList, searchJobsList}= require("../Controllers/JobsController");
const {deleteCategory, updateCategory}= require("../Controllers/CategoryController");
const { authenticateToken } = require("../auth/auth");
const multer = require('multer');
const storage = multer.memoryStorage();  // Store files in memory for uploading
const upload = multer({ storage: storage }).array('files');;
const router = express.Router();

router.post("/admin/login",loginUser);
router.get("/admin/fetchUser",fetchUser);
router.post("/admin/submitUser",submitUser);
router.post("/admin/getprofile", authenticateToken,getProfileByUserId)
router.post("/admin/getList", authenticateToken,getList)
router.patch("/admin/updateProfile", authenticateToken,updateProfileByUserId)
router.post("/admin/getJobList",authenticateToken,getJobsList)
router.post("/admin/getJobDescription",authenticateToken,getJobDescription)
router.post("/admin/createJobApplication",authenticateToken,createJobApplication)
router.post("/admin/createNewJob",authenticateToken,createNewJob)
router.patch("/admin/updateJob/:jobId", authenticateToken, updateJob);
router.post("/admin/getApplicantList",authenticateToken,getApplicantsList);
router.post("/admin/addCategory",multer({ storage: storage }).single('image'),addCategory);
router.post("/admin/deleteCategory",deleteCategory)
router.post("/admin/updateCategory/:categoryId",multer({ storage: storage }).single('image'),updateCategory)
router.post("/admin/uploadResume",authenticateToken,upload,resumeUpload);
router.post("/admin/searchJobsList",authenticateToken,searchJobsList)
module.exports = router;

