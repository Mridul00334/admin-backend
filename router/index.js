const express = require("express");
const { fetchUser,submitUser,loginUser,getProfileByUserId,getList,updateProfileByUserId, addCategory } = require("../Controllers/UserController");
const {getJobsList,getJobDescription,createJobApplication,createNewJob,updateJob,getApplicantsList}= require("../Controllers/JobsController");
const { authenticateToken } = require("../auth/auth");
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
router.post("/admin/addCategory",addCategory);
module.exports = router;
