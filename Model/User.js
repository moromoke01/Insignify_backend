const mongoose = require("mongoose")

const ApplicantSchema = new mongoose.Schema({
    firstName:{
        type: String
    },
    lastName:{
        type: String
    },
    age:{
        type:Date, 
        
    },
    gender:{
        type: String
    }, 
    education:{
        type: String
    },
    location:{
        type:String
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