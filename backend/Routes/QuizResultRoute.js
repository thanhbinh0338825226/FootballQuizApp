const express = require('express');
const router = express.Router();
const { createQuizResult , getLeaderboard } = require('../Controller/QuizResultController');

// Định nghĩa API POST
router.post('/quiz-result', createQuizResult);
router.get('/leaderboard', getLeaderboard);
module.exports = router;
