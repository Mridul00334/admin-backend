const express = require("express");
const { fetchUser,submitUser,loginUser } = require("../Controllers/UserController");

const router = express.Router();

router.post("/admin/login", loginUser);
router.get("/admin/fetchUser",fetchUser);
router.post("/admin/submitUser",submitUser);
module.exports = router;
