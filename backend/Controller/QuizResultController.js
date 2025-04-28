const QuizResult = require('../Models/QuizResults');
const User = require('../Models/User');

// Controller để lưu kết quả quiz
const createQuizResult = async (req, res) => {
  try {
    const { userId, difficulty, score, time } = req.body;

    // Kiểm tra nếu thiếu dữ liệu
    if (!userId || !difficulty || score == null || time == null) {
      return res.status(400).json({ message: "Thiếu thông tin cần thiết!" });
    }

    // Kiểm tra difficulty có hợp lệ không
    const allowedDifficulties = ['easy', 'medium', 'hard'];
    if (!allowedDifficulties.includes(difficulty.toLowerCase())) {
      return res.status(400).json({ message: "Difficulty không hợp lệ! Chỉ cho phép: easy, medium, hard." });
    }

    // Kiểm tra điểm không được âm
    if (score < 0) {
      return res.status(400).json({ message: "Điểm không thể âm!" });
    }

    // Kiểm tra userId có tồn tại không
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "UserId không tồn tại!" });
    }

    // Tạo một bản ghi mới
    const newQuizResult = new QuizResult({
      userId,
      difficulty: difficulty.toLowerCase(), // luôn lưu lowercase cho đồng nhất
      score,
      time,
    });

    // Lưu vào database
    const savedResult = await newQuizResult.save();

    res.status(201).json({
      message: "Lưu kết quả thành công!",
      data: savedResult
    });
  } catch (error) {
    console.error("Lỗi khi lưu quiz result:", error);
    res.status(500).json({ message: "Lỗi server khi lưu quiz result!" });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const { difficulty } = req.query;

    // Kiểm tra xem độ khó có hợp lệ không
    const allowedDifficulties = ['easy', 'medium', 'hard'];
    if (!allowedDifficulties.includes(difficulty.toLowerCase())) {
      return res.status(400).json({ message: "Difficulty không hợp lệ! Chỉ cho phép: easy, medium, hard." });
    }

    // Truy vấn lấy danh sách điểm cao nhất và thời gian nhanh nhất cho mỗi người chơi
    const leaderboard = await QuizResult.aggregate([
      // Lọc theo difficulty
      { $match: { difficulty: difficulty.toLowerCase() } },

      // Nhóm theo userId, lấy điểm số cao nhất và thời gian nhanh nhất
      { 
        $group: {
          _id: "$userId",
          highestScore: { $max: "$score" },
          fastestTime: { $min: "$time" }
        }
      },

      // Join với bảng User để lấy thông tin người chơi (nếu cần)
      { 
        $lookup: {
          from: "Users", // Tên collection của bảng User
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },

      // Sắp xếp theo điểm cao nhất, sau đó theo thời gian nhanh nhất
      { 
        $sort: {
          highestScore: -1,  // Sắp xếp điểm cao nhất giảm dần
          fastestTime: 1    // Sắp xếp thời gian nhanh nhất tăng dần
        }
      },

      // Lấy 10 người chơi đầu tiên
      { $limit: 10 }
    ]);

    // Trả về kết quả
    res.status(200).json({
      message: `Bảng xếp hạng ${difficulty} thành công!`,
      data: leaderboard
    });
  } catch (error) {
    console.error("Lỗi khi lấy leaderboard:", error);
    res.status(500).json({ message: "Lỗi server khi lấy leaderboard!" });
  }
};

module.exports = {
  createQuizResult, getLeaderboard 
};
