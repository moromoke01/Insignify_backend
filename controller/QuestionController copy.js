const mongoose = require('mongoose');
const Question = require('../Model/QueModel');
const psychometricQuestions = require('../Questions.json');

async function fetchAndSaveQuestions(req, res) {
    try {
        // Insert data into the database
        const collection = mongoose.connection.db.collection('QuestionList');
        await collection.insertMany(psychometricQuestions);
        console.log('Questions saved to database');

        res.status(200).json({
            message: 'Questions saved to database'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

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

module.exports = {
    fetchAndSaveQuestions,
    getAllQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion
};
