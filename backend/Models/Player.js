const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Nationality: {
        type: String,
        required: true
    },
    Position: {
        type: String,
        enum: ["Forward", "Midfielder", "Defender", "Goalkeeper"],
        required: true
    },
    Popularity: {
        type: String,
        required: true
    },
    Era: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Player = mongoose.model("Player", playerSchema, "Players");

module.exports = Player;
