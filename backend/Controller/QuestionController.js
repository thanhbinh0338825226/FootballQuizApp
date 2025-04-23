const Question = require("../Models/Question");
const Player = require("../Models/Player");
const cloudinary = require('../config/cloudinaryConfig'); 
const mongoose = require("mongoose");

const createQuestion = async (req, res) => {
    try {
        const { playerName, Type, Difficulty } = req.body;

        if (!playerName || !Type || !Difficulty) {
            return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ thông tin: playerName, Type, Difficulty" });
        }

        const player = await Player.findOne({ Name: playerName });
        if (!player) {
            return res.status(404).json({ error: "Không tìm thấy cầu thủ với tên đã nhập!" });
        }

        let ImageUrl = "";
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: "questions",
                use_filename: true,
                unique_filename: false,
            });
            ImageUrl = uploadResult.secure_url;
        }

        const newQuestion = new Question({
            PlayerId: new mongoose.Types.ObjectId(player._id),
            Type,
            ImageUrl,
            Difficulty
        });

        await newQuestion.save();

        return res.status(201).json({
            message: "Tạo câu hỏi thành công!",
            question: newQuestion
        });

    } catch (error) {
        console.error("Lỗi tạo câu hỏi:", error.message);
        return res.status(500).json({ error: "Đã xảy ra lỗi khi tạo câu hỏi." });
    }
};



const generateQuestionOptions = async (req, res) => {
    try {
        const { questionId } = req.params;

        // 1. Tìm câu hỏi đã được tạo
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ error: "Không tìm thấy câu hỏi" });
        }

        const { PlayerId } = question;

        // 2. Tìm player đúng
        const correctPlayer = await Player.findById(PlayerId);
        if (!correctPlayer) {
            return res.status(404).json({ error: "Không tìm thấy cầu thủ đúng" });
        }

        const { Popularity, Position, Era } = correctPlayer;

        // 3. Tìm các cầu thủ sai có cùng tiêu chí
        const similarPlayers = await Player.find({
            Popularity,
            Position,
            Era,
            _id: { $ne: correctPlayer._id }
        });

        if (similarPlayers.length < 3) {
            return res.status(400).json({ error: "Không đủ cầu thủ để tạo đáp án" });
        }

        // 4. Lấy ngẫu nhiên 3 cầu thủ sai
        const shuffled = similarPlayers.sort(() => 0.5 - Math.random());
        const wrongPlayers = shuffled.slice(0, 3);

        // 5. Tạo danh sách đáp án (chỉ chứa Name)
        const options = [
            { Name: correctPlayer.Name },
            ...wrongPlayers.map(p => ({ Name: p.Name }))
        ].sort(() => 0.5 - Math.random());

        return res.status(200).json({ options });

    } catch (error) {
        console.error("Lỗi khi generate options:", error);
        return res.status(500).json({ error: error.message });
    }
};



const getRandomQuizQuestion = async (req, res) => {
    try {
        const { difficulty, usedQuestionIds = [] } = req.body; // nhận từ client

        if (!difficulty) {
            return res.status(400).json({ error: "Vui lòng cung cấp mức độ difficulty (Easy, Medium, Hard...)" });
        }

        // 1. Đếm số câu hỏi chưa dùng
        const filter = {
            Difficulty: difficulty,
            _id: { $nin: usedQuestionIds } // loại trừ câu đã dùng
        };
        const remainingCount = await Question.countDocuments(filter);

        if (remainingCount === 0) {
            return res.status(404).json({ error: "Không còn câu hỏi phù hợp trong lượt chơi này." });
        }

        // 2. Random
        const randomIndex = Math.floor(Math.random() * remainingCount);
        const question = await Question.findOne(filter).skip(randomIndex);

        // 3. Tiếp tục như cũ
        const correctPlayer = await Player.findById(question.PlayerId);
        if (!correctPlayer) {
            return res.status(404).json({ error: "Không tìm thấy cầu thủ đúng" });
        }

        const { Popularity, Position, Era } = correctPlayer;

        const similarPlayers = await Player.find({
            Popularity,
            Position,
            Era,
            _id: { $ne: correctPlayer._id }
        });

        if (similarPlayers.length < 3) {
            return res.status(400).json({
                error: "Không đủ cầu thủ để tạo đáp án",
                missing: {
                    requiredWrongPlayers: 3,
                    currentAvailable: similarPlayers.length,
                    availablePlayers: similarPlayers.map(p => ({
                        id: p._id,
                        name: p.Name,
                        imageUrl: p.ImageUrl || null
                    })),
                    correctPlayer: {
                        id: correctPlayer._id,
                        name: correctPlayer.Name,
                        imageUrl: correctPlayer.ImageUrl || null
                    }
                }
            });
        }

        const wrongPlayers = similarPlayers.sort(() => 0.5 - Math.random()).slice(0, 3);

        const allOptions = [
            { name: correctPlayer.Name },
            ...wrongPlayers.map(p => ({ name: p.Name }))
        ].sort(() => 0.5 - Math.random());

        return res.status(200).json({
            questionId: question._id,
            type: question.Type,
            difficulty: question.Difficulty,
            imageUrl: question.ImageUrl,
            options: allOptions
        });

    } catch (error) {
        console.error("Lỗi khi lấy câu hỏi ngẫu nhiên theo difficulty:", error);
        return res.status(500).json({ error: "Đã xảy ra lỗi khi lấy câu hỏi." });
    }
};


const checkAnswer = async (req, res) => {
    
    try {
        const { questionId, selectedAnswer } = req.body;

        if (!questionId || !selectedAnswer) {
            return res.status(400).json({ error: "Thiếu thông tin câu hỏi hoặc đáp án" });
        }

        // Tìm câu hỏi theo questionId
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ error: "Không tìm thấy câu hỏi" });
        }

        // Kiểm tra xem đáp án có đúng không
        const correctPlayer = await Player.findById(question.PlayerId);
        if (!correctPlayer) {
            return res.status(404).json({ error: "Không tìm thấy cầu thủ đúng" });
        }

        // So sánh đáp án người dùng chọn với đáp án đúng
        // const isCorrect = selectedAnswer === correctPlayer.Name;
        const isCorrect =
      selectedAnswer.trim().toLowerCase() === correctPlayer.Name.trim().toLowerCase();

        if (isCorrect) {
            return res.status(200).json({ message: "Trả lời đúng!" });
        } else {
            return res.status(200).json({ message: "Trả lời sai!" });
        }

    } catch (error) {
        console.error("Lỗi khi kiểm tra đáp án:", error);
        return res.status(500).json({ error: "Đã xảy ra lỗi khi kiểm tra đáp án." });
    }
};


module.exports = {
    createQuestion, generateQuestionOptions, getRandomQuizQuestion, checkAnswer
};
