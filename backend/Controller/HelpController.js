const { generateFriendReply } = require("../Controller/LifelineController");
const Question = require("../Models/Question");
const Player = require("../Models/Player");
// nhận yêu cầu và câu trả lời từ client
// const callFriendHelp = async (req, res) => {
//     try {
//         const { correctAnswer, allAnswers } = req.body;

//         // Kiểm tra dữ liệu gửi lên
//         if (!correctAnswer || !allAnswers || !Array.isArray(allAnswers)) {
//             console.log("Thiếu hoặc sai dữ liệu đầu vào");
//             return res.status(400).json({ error: "Dữ liệu không hợp lệ" });
//         }

//         // Gọi hàm xử lý trả lời
//         const reply = generateFriendReply(correctAnswer, allAnswers);

//         // Trả kết quả về client
//         return res.status(200).json({ reply });

//     } catch (error) {
//         console.error("Lỗi khi gọi trợ giúp gọi điện:", error.message);
//         return res.status(500).json({ error: error.message });
//     }
// };


const callFriendHelp = async (req, res) => {
    try {
        const { questionId, allAnswers } = req.body;

        if (!questionId || !allAnswers || !Array.isArray(allAnswers)) {
            return res.status(400).json({ error: "Thiếu thông tin câu hỏi hoặc đáp án" });
        }

        // Tìm câu hỏi theo questionId để lấy PlayerId (đáp án chính xác)
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ error: "Không tìm thấy câu hỏi" });
        }

        // Tìm PlayerId để biết đáp án chính xác
        const correctPlayer = await Player.findById(question.PlayerId);
        if (!correctPlayer) {
            return res.status(404).json({ error: "Không tìm thấy cầu thủ đúng" });
        }

        // Lấy đáp án chính xác từ correctPlayer.Name (đáp án chính xác)
        const correctAnswer = correctPlayer.Name;

        // Gọi hàm xử lý trả lời trợ giúp
        const reply = generateFriendReply(correctAnswer, allAnswers);

        // Trả kết quả về client
        return res.status(200).json({ reply });

    } catch (error) {
        console.error("Lỗi khi gọi trợ giúp gọi điện:", error.message);
        return res.status(500).json({ error: error.message });
    }
};

// cung cấp mẫu câu trả lời cho frontend
const generateFriendReplyTemplates = async (req, res) => {
    try {
        const moods = {
            confident: [
                "Chắc chắn luôn, mình chọn {answer}!",
                "Không nghi ngờ gì, đáp án là {answer}."
            ],
            unsure: [
                "Không chắc lắm, nhưng mình chọn {answer}.",
                "Mình đoán đại thôi, chắc là {answer}."
            ],
            thinking: [
                "Ơ... để mình suy nghĩ... mình chọn {answer}.",
                "Mình nhớ mang máng là {answer}."
            ]
        };

        return res.status(200).json({ moods });
    } catch (error) {
        console.error("Lỗi khi lấy mẫu câu trả lời:", error.message);
        return res.status(500).json({ error: error.message });
    }
};


const fiftyFiftyHelp = async (req, res) => {
    try {
        const { questionId, allAnswers } = req.body;

        if (!questionId || !Array.isArray(allAnswers) || allAnswers.length !== 4) {
            return res.status(400).json({ error: "Thiếu hoặc sai định dạng dữ liệu đầu vào" });
        }

        // Tìm câu hỏi
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ error: "Không tìm thấy câu hỏi" });
        }

        // Tìm cầu thủ đúng
        const correctPlayer = await Player.findById(question.PlayerId);
        if (!correctPlayer) {
            return res.status(404).json({ error: "Không tìm thấy cầu thủ đúng" });
        }

        const correctAnswer = correctPlayer.Name;

        // Lấy các đáp án sai
        const wrongAnswers = allAnswers.filter(ans => ans !== correctAnswer);
        if (wrongAnswers.length < 1) {
            return res.status(500).json({ error: "Không đủ đáp án sai để thực hiện 50/50" });
        }

        // Random 1 đáp án sai
        const randomWrong = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];

        // Ghép đáp án đúng + sai rồi random lại thứ tự
        const finalAnswers = [correctAnswer, randomWrong].sort(() => Math.random() - 0.5);

        return res.status(200).json({ answers: finalAnswers });

    } catch (error) {
        console.error("Lỗi khi xử lý trợ giúp 50/50:", error.message);
        return res.status(500).json({ error: error.message });
    }
};


module.exports = {
    callFriendHelp, generateFriendReplyTemplates, fiftyFiftyHelp
};
