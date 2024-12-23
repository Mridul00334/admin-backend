const express = require("express");
const { fetchUser,submitUser,loginUser,getProfileByUserId,getList,updateProfileByUserId } = require("../Controllers/UserController");
const { authenticateToken } = require("../auth/auth");
const router = express.Router();

router.post("/admin/login",loginUser);
router.get("/admin/fetchUser",fetchUser);
router.post("/admin/submitUser",submitUser);
router.post("/admin/getprofile", authenticateToken,getProfileByUserId)
router.post("/admin/getList", authenticateToken,getList)
router.patch("/admin/updateProfile",authenticateToken,updateProfileByUserId)
module.exports = router;
