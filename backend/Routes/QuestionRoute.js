const express = require("express");
const router = express.Router();
const upload = require('../middleware/upload'); // nếu bạn dùng multer cho file upload
const { createQuestion, generateQuestionOptions, getRandomQuizQuestion, checkAnswer } = require("../Controller/QuestionController");


router.post("/create-question", upload.single("image"), createQuestion);
// router.get("/quiz/random", getRandomQuizQuestion);
router.post("/quiz/random", getRandomQuizQuestion);

// routes/QuestionRoute.js
router.get("/generate-options/:questionId", generateQuestionOptions);
router.post('/checkAnswer',checkAnswer);

module.exports = router;
