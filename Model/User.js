const mongoose = require("mongoose")

const ApplicantSchema = new mongoose.Schema({
   fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  occupation: { type: String, required: true },
  education: { type: String, required: true },
  career: { type: String, required: true },
  factor: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpires: { type: Date },
  verified: { type: Boolean, default: false },
    
},
// {
//     collection: "Applicants"
// },
{
    timestamps: true,
})

const Applicant = mongoose.model("Applicants", ApplicantSchema);

module.exports =Applicant