const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const User = require('../Model/User');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Email configuration
// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: 'janetmoromoke5@gmail.com',
//     pass: 'Bello@2024',
//   },
// });

const secretKey = process.env.JWT_SECRET_KEY;

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

    // const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP

    // console.log('Generated OTP:', otp);

    await User.create({
      fullName,
      email,
      age,
      gender,
      occupation,
      education,
      career,
      factor,
      password: hashedPassword,
      // otp, // Store OTP
      // otpExpires: Date.now() + 3600000, // 1 hour expiration
      // verified: false,
    });

    // Send OTP email
    // await transporter.sendMail({
    //   to: email,
    //   subject: 'Your OTP Code',
    //   text: `Your OTP code is ${otp}`,
    // });

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
app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    if (user.otp === otp && user.otpExpires > Date.now()) {
      user.verified = true;
      user.otp = null; // Clear OTP after successful verification
      user.otpExpires = null;
      await user.save();
      return res.json({ message: 'Email verified successfully' });
    }

    res.status(400).json({ message: 'Invalid or expired OTP' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

//login route
async function login(req, res){
  try{
      const { email, password } = req.body;

      //find user by email
      const findUser = await User.findOne({email});

      if(!findUser){
          return res.status(404).json({
              message: 'User not found'
          });
  }
  //compare the provided password with the stored password
  const isPasswordValid = await bcryptjs.compare( password, findUser.password);

  if(!isPasswordValid){
      return res.status(401).json({
          message: 'Invalid email or password'
      })
  }

  //User is authenticated, generate a token or session
  const token = jwt.sign({ userId: findUser._id}, secretKey);
  res.cookie("token", token, {
    httpOnly: true,
    // Additional cookie options if needed
    // secure: true,
    // sameSite: "strict",
  });

  res.status(200).json({
      message: 'Login successful',
      userId: findUser._id,
      fullName: findUser.fullName,
      email: findUser.email,
      password: findUser.password,
      token:token
  })

  }catch(error){
      console.error('Error:', error);
      res.status(500).json({
          message: 'Internal Server error'
      })
  };
};


async function getAllUsers(req, res) {
  try {
      const Users = await Applicant.find();
      res.json(Users);
  } catch (error) {
      res.status(500).json({
          message: error.message
      });
  }
}

// app.post('/signup', signup);

module.exports = {
  signup,
  login,
};
