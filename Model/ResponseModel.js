const mongoose = require('mongoose');

// Define the schema for the test response
const ResponseSchema = new mongoose.Schema({
    question:{
        type: String,
        required: true
    },
  questionNumber: {
    type: Number,
    required: true
  },
  response: {
    type: String,
    required: true
  }
});

// Define the mongoose model for the test response
const ResponseModel = mongoose.model('Response', ResponseSchema);

module.exports = ResponseModel;
