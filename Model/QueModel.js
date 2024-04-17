const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        question:{
            type: String,
            
        },
        correctAnswer:{
            type:String,
           
        },
        options:{
            type:[String]
            
        },
        section:{
            type: String
          
        }

},
{
    timestamps: true,
});

const Question = mongoose.model('PsychometricTest', questionSchema);

module.exports = Question;
