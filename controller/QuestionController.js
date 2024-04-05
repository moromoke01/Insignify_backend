const axios = require('axios');
const Question = require('../Model/QueModel');

const QuestionsAPI = "https://opentdb.com/api.php?amount=20&category=9&difficulty=easy&type=multiple";

async function fetchAndSaveQuestions(req, res){
    try{
        const response = await axios.get(QuestionsAPI);
        const questions = response.data.results;

        for (const q of questions){
            const newQuestion = new Question({
                question: q.question,
        correct_answer: q.correct_answer,
        incorrect_answers: q.incorrect_answers,
        category: q.category
            });
            await newQuestion.save();
        }
        res.status(200).json({
            message: 'Questions saved to database'
        });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

//get all questions
async function getAllQuestions(req, res){
    try{
        const questions = await Question.find();
        res.json(questions);
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
}

//get questions by id
async function getQuestionById(req, res){
  try{
     const question = await Question.findById(req.params.id);
     if(!questions){
        return res.status(404).json({
            message: 'Question not found'
        });
     }
     res.status(200).json(question);
  }catch(error){
    res.status(500).json({ message: error.message });
   }
}


//update questions
async function updateQuestion(req, res) {
    try {
      const question = await Question.findById(req.params.id);
      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }
      question.question = req.body.question || question.question;
      question.answer = req.body.answer || question.answer;
      question.category = req.body.category || question.category;
      await question.save();
      res.json(question);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  
  //delete questions
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
  

  module.exports ={
    fetchAndSaveQuestions,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion
  };