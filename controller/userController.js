const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const User = require('../Model/User');
const UserVerification = require('../Model/OTPVerification');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const secretKey = process.env.JWT_SECRET_KEY;

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

async function signup(req, res) {
  try {
    const {
      fullName,
      email,
      age,
      gender,
      occupation,
      education,
      career,
      factor,
      password,
    } = req.body;
    console.log('Signup request received:', req.body);

    // Checking if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(405).json({
        message: 'Email already exists',
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      age,
      gender,
      occupation,
      education,
      career,
      factor,
      password: hashedPassword,
      verified: false,
    });

    await sendVerificationEmail(newUser, res);

    res.status(201).json({
      message: 'User successfully registered. Please check your email for the OTP.',
    });

    console.log('User successfully registered');
  } catch (error) {
    console.error('Error during sign-up', error);
    res.status(500).json({
      message: 'Server error',
    });
  }
}

// OTP verification endpoint
async function sendVerificationEmail(user, res) {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: user.email,
      subject: 'Verify your Email',
      text: `Your OTP code is ${otp}`,
    };

    const saltRounds = 10;
    const hashedOtp = await bcryptjs.hash(otp, saltRounds);
    const newOTPVerification = new UserVerification({
      userId: user._id,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000, // 1 hour
    });

    await newOTPVerification.save();
    await transporter.sendMail(mailOptions);

    res.json({
      status: 'Pending',
      message: 'Verification OTP email sent',
      data: {
        userId: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    res.json({
      status: 'Failed',
      message: error.message,
    });
    console.error(error);
  }
}

// Login route
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const findUser = await User.findOne({ email });

    if (!findUser) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, findUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign({ userId: findUser._id }, secretKey);
    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(200).json({
      message: 'Login successful',
      userId: findUser._id,
      fullName: findUser.fullName,
      email: findUser.email,
      token: token,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'Internal Server error',
    });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// Define routes
app.post('/signup', signup);
app.post('/login', login);
app.get('/users', getAllUsers);

module.exports = {
  signup,
  login,
  getAllUsers,
};
