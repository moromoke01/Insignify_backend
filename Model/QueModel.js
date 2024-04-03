const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        question:{
            type: String,
            
        },
        correct_answer:{
            type:String,
           
        },
        incorrect_answers:{
            type:[String]
            
        },
        category:{
            type: String
          
        }

},
{
    timestamps: true,
});

const Question = mongoose.model('QuestionList', questionSchema);

module.exports = Question;
