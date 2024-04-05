const express = require('express');
const router = express.Router();

const { Signup, login} = require('../controller/userController');

router.get("/signup", Signup);
router.post("/login", login);

module.exports = router;