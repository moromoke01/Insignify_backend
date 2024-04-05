const express = require('express');
const router = express.Router();

const{
    fetchAndSaveQuestions,
    getAllQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion
  } = require('../controller/QuestionController');

  
router.get('/fetch-and-save-questions', fetchAndSaveQuestions);
router.get('/questions', getAllQuestions);
router.get('/questions/:id', getQuestionById);
router.patch('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

module.exports = router;