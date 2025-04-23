const Player = require("../Models/Player");

const createPlayer = async (req, res) => {
    const { Name, Nationality, Position, Popularity, Era } = req.body; // Nhận dữ liệu từ body

    try {
        // Kiểm tra các trường bắt buộc
        if (!Name || !Nationality || !Position || !Popularity || !Era) {
            console.log('Missing required fields');
            return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin.' });
        }

        const existingPlayer = await Player.findOne({
            Name: { $regex: Name, $options: 'i' }
        });

        if (existingPlayer) {
            return res.status(400).json({ error: 'Tên cầu thủ đã tồn tại trong hệ thống!' });
        }

        // Tạo cầu thủ mới
        const newPlayer = new Player({
            Name,
            Nationality,
            Position,
            Popularity,
            Era
        });

        // Lưu vào database
        await newPlayer.save();

        // Trả về kết quả
        return res.status(201).json({
            message: 'Tạo cầu thủ thành công!',
            player: {
                id: newPlayer._id,
                Name: newPlayer.Name,
                Nationality: newPlayer.Nationality,
                Position: newPlayer.Position,
                Popularity: newPlayer.Popularity,
                Era: newPlayer.Era
            }
        });
    } catch (error) {
        console.log('Lỗi khi tạo cầu thủ:', error.message);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { createPlayer };
