const express = require('express');
const router = express.Router();

const{
    fetchAndSaveQuestions,
    getAllQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    submitResponses
  } = require('../controller/QuestionController');

  
router.post('/fetch-and-save-questions', fetchAndSaveQuestions);
router.get('/questions', getAllQuestions);
router.get('/questions/:id', getQuestionById);
router.patch('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);
router.post('/submitResponses', submitResponses);

module.exports = router;