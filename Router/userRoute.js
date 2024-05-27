const express = require('express');
const router = express.Router();

const { signup, login, verifyOTP} = require('../controller/userController');

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);


module.exports = router;