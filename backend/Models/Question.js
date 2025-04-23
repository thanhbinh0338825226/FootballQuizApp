const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    PlayerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player", // Liên kết đến bảng Players
        required: true
    },
    Type: {
        type: String,
        required: true
    },
    ImageUrl: {
        type: String,
        default: ""
    },
    Difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"], // bạn có thể tùy chỉnh enum hoặc bỏ nếu muốn string tự do
        required: true
    }
}, { timestamps: true });

const Question = mongoose.model("Question", questionSchema, "Questions");

module.exports = Question;
