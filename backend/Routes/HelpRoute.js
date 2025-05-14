const express = require("express");
const router = express.Router();
const { callFriendHelp, generateFriendReplyTemplates, fiftyFiftyHelp } = require("../Controller/HelpController");

// Route để lấy các mẫu câu trả lời cho các mood
router.get("/friend-reply-templates", generateFriendReplyTemplates);

// Route để gọi trợ giúp từ người thân
router.post("/call-friend-help",callFriendHelp);

router.post("/fifty-fifty-help", fiftyFiftyHelp); 

module.exports = router;
