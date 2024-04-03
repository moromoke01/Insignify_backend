const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const axios = require('axios'); // Add this line to import mongoose
const Question = require('./Model/QueModel');

const app = express();
app.use(express.json());

//database connection
mongoose.connect("mongodb://localhost:27017/QuestionApi") 
.then(() =>{
    console.log("connected to database")
})
.catch((e) => console.log(e));

const QuestionsAPI = "https://opentdb.com/api.php?amount=20&category=9&difficulty=easy&type=multiple";


// app.post('/questions', async(req, res)=>{
//     try{
//         const response = await axios.post(`${QuestionsAPI
//         }/questions`, req.body);
//         console.log(response);
//         res.status(201).json(response.data);
//     }catch(error){
//         res.status(400).json({message: error.message});
//     }
// });


app.get('/fetch-and-save-questions', async (req, res) => {
    try {
      const response = await axios.get(QuestionsAPI);
    //   console.log(response);
      const questions = response.data.results;
      console.log(questions);
      for (const q of questions) {
        const newQuestion = new Question({
          question: q.question,
          correct_answer: q.correct_answer,
          incorrect_answers: q.incorrect_answers,
          category: q.category
        });
        await newQuestion.save();
      }
  
      res.json({ message: 'Questions saved to database' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  //read all questions from the database
  app.get('/questions', async(req, res)=>{
    try{
      const questions = await Question.find();
      res.json(questions);
    }catch(error){
      re.status(500).json({
        message: error.message
      });
    }
  });

  //read a specific question by Id from the database
  app.get('/questions/:id', async(req, res)=>{
    try{
      const question = await Question.findById(req.params.id);
      if(!question){
        return res.status(404).json({
          message: 'Question not found'
        });
      }
      res.status(200).json(question);
    }catch(error){
      res.status(500).json({
        message:error.message
      });
    }
  })

  //update a question by ID in the database
  app.patch('/questions/:id', async (req, res) =>{
    try{
      const question = await Question.findById(req.params.id);
      if(!question){
        return res.status(404).json({
          message: 'Question not found'
        });
      }
      question.question = req.body.question || question.question;
      question.answer = req.body.answer || question.answer;
      question.category = req.body.category || question.category;
    await question.save();
    res.json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
    
 // Delete a specific question by ID from the database
app.delete('/questions/:id', async (req, res) => {
  try {
    const {id} =req.params;

    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.listen(5000, ()=>{
    console.log("server is running on port 5000")
});

app.use('./netlify/index', app);
module.exports.handler = serverless(app);

