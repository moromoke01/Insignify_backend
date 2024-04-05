const mongoose = require("mongoose")

const ApplicantSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    age:{
        type:Number, 
        required: true
    },
    gender:{
        type: String,
        required:true
    }, 
    education:{
        type: String,
        required: true
    },
    country:{
        type:String,
        required:true
    },
    email:{
        type: String,
        unique:true,
        required: true
    },
    password:{
        type: String,
        required: true
    }
},
// {
//     collection: "Applicants"
// },
{
    timestamps: true,
})

const Applicant = mongoose.model("Applicants", ApplicantSchema);

module.exports =Applicant