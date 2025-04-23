const express = require("express");
const connectDB = require("./Services/Database");
const cors = require("cors");
const UserRoute = require("./Routes/UserRoute");
const AuthRoute = require("./Routes/AuthRoute");
const PlayerRoute = require("./Routes/PlayerRoute");
const QuestionRoute = require("./Routes/QuestionRoute");
require("dotenv").config();

const app = express();
app.use(express.json()); // Middleware để đọc JSON
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Kết nối MongoDB
connectDB();

// Route test: Thêm user
app.use("/User", UserRoute);
app.use("/Auth", AuthRoute);
app.use("/Player", PlayerRoute);
app.use("/Question", QuestionRoute);
// Chạy server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
