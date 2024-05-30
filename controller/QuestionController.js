const Question = require('../Model/QueModel');
const ResponseModel = require('../Model/ResponseModel');
const psychometricQuestions = require('../Questions.json');
const axios = require('axios');

// Save questions to the database
async function fetchAndSaveQuestions(req, res) {
    try {
        const questions = psychometricQuestions;
        console.log(questions);

        for (const q of questions) {
            const newQuestion = new Question({
                section: q.section,
                question: q.question,
                correctAnswer: q.correctAnswer,
                options: q.options
            });
            await newQuestion.save();
        }
        res.status(200).json({
            message: 'Questions saved to database'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get all questions
async function getAllQuestions(req, res) {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// Get question by ID
async function getQuestionById(req, res) {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({
                message: 'Question not found'
            });
        }
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update question
async function updateQuestion(req, res) {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        question.question = req.body.question || question.question;
        question.correctAnswer = req.body.correctAnswer || question.correctAnswer;
        question.options = req.body.options || question.options;
        await question.save();
        res.json(question);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Delete question
async function deleteQuestion(req, res) {
    try {
        const { id } = req.params;
        const question = await Question.findByIdAndDelete(id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json({ message: 'Question deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// POST route for submitting responses
async function submitResponses(req, res) {
    try {
      const responses = req.body.responses;
      console.log('Received responses:', responses);
  
      // Save the responses to the database
      await ResponseModel.create({
        userId,
        question: "Sample question",
        questionNumber: 1,
        responses,
     });
      console.log('Responses saved to database');
  
      // Call the AI model for learning track prediction
      const predictionResponse = await axios.post('https://ai-model-rymy.onrender.com/predict', { responses });
      console.log('Prediction response:', predictionResponse.data);
  
      // Respond with the predicted learning track from the AI model
      const learningTrack = predictionResponse.data.learningTrack;
      res.status(200).json({ message: 'Test responses submitted successfully', learningTrack });
    } catch (error) {
      console.error('Error submitting responses:', error.message);
  
      if (error.response) {
        // The request was made and the server responded with a status code outside the 2xx range
        console.error('Response error data:', error.response.data);
        console.error('Response error status:', error.response.status);
        console.error('Response error headers:', error.response.headers);
        res.status(500).json({ error: `External API error: ${error.response.data}` });
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        res.status(500).json({ error: 'No response received from external API' });
      } else {
        // Something happened in setting up the request that triggered an error
        console.error('Request setup error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

module.exports = {
    fetchAndSaveQuestions,
    getAllQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    submitResponses
};
