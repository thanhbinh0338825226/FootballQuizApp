const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Tham chiếu tới bảng User
        required: true
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"], // Nếu bạn muốn giới hạn level, thêm enum
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    time: {
        type: Number, // thời gian hoàn thành (tính bằng giây)
        required: true
    }
}, { timestamps: true }); // tự động có createdAt và updatedAt

const QuizResult = mongoose.model("QuizResult", quizResultSchema, "Quiz_Results");

module.exports = QuizResult;
