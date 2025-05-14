// xử lý logic và tạo câu trả lời thực tế
function generateFriendReply(correctAnswer, allAnswers) {
    const random = Math.floor(Math.random() * 100);
    let friendAnswer;

    if (random < 80) {
        friendAnswer = correctAnswer;
    } else {
        const wrongAnswers = allAnswers.filter(ans => ans !== correctAnswer);
        friendAnswer = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
    }

    const moods = {
        confident: [
          `Chắc chắn luôn, mình chọn ${friendAnswer}!`,
          `Không nghi ngờ gì, đáp án là ${friendAnswer}.`,
          `Tôi là fan Manchester United được 20 năm rồi, tôi chắc chắn đáp án là ${friendAnswer}!`,
          `Tôi là fan Arsenal từ chức vô địch ngoại hạng Anh bất bại đến giờ, tôi đoán là ${friendAnswer}.`,
          `Tôi vừa mơ thấy ông nội chọn ${friendAnswer}, chắc là đúng đó!`,
          `Bạn hỏi đúng người rồi, đáp án 100% là ${friendAnswer}.`,
          `Mình đã xem trận đó mấy lần, chắc chắn là ${friendAnswer}.`,
          `Tôi vừa gọi cho HLV đội bạn, ông ấy nói đáp án là ${friendAnswer}.`,
          `Mình có cảm giác của một thiên tài bóng đá, chọn ${friendAnswer} là đúng rồi.`,
          `Dựa trên phân tích từ 500 trận gần nhất, mình chọn ${friendAnswer}!`
        ],
        unsure: [
          `Không chắc lắm, nhưng mình chọn ${friendAnswer}.`,
          `Mình đoán đại thôi, chắc là ${friendAnswer}.`,
          `Lúc nãy bấm đại, ra ${friendAnswer}... biết đâu đúng.`,
          `Mình chưa tỉnh ngủ lắm, nhưng cảm giác nói là ${friendAnswer}.`,
          `Mình chỉ chọn vì tên nghe ngầu: ${friendAnswer}.`,
          `Đoán mò thôi, mình không chịu trách nhiệm nếu sai nha!`,
          `Mình cũng muốn biết như bạn, thôi chọn đại ${friendAnswer} đi.`,
          `Tôi chỉ chọn vì... linh cảm từ chiếc dép tổ ong, đó là ${friendAnswer}.`,
          `Đừng tin mình quá, lần trước mình chọn sai 9/10 câu đấy.`,
          `Đáp án này giống giấc mơ đêm qua... chắc là ${friendAnswer}.`
        ],
        thinking: [
          `Ơ... để mình suy nghĩ... mình chọn ${friendAnswer}.`,
          `Mình nhớ mang máng là ${friendAnswer}.`,
          `Câu này khó đấy... nhưng nếu phải chọn thì mình nghiêng về ${friendAnswer}.`,
          `Đợi xíu... để mình "tra" trong não bộ... À, ${friendAnswer} nha.`,
          `Mình đang lục lại ký ức thời thơ ấu, hình như là ${friendAnswer}.`,
          `Nãy mình thấy cái tên này trên TikTok, chắc là ${friendAnswer}.`,
          `Tôi nhớ trận đó có gì đặc biệt... chắc là ${friendAnswer}.`,
          `Mình không chắc, nhưng tên này quen quen... ${friendAnswer}?`,
          `Mình suy nghĩ theo phong thủy thì nên chọn ${friendAnswer}.`,
          `Nếu chọn sai thì chắc là do vũ trụ trêu đùa, chứ mình vẫn chọn ${friendAnswer}.`
        ]
      };
      

    const moodKeys = Object.keys(moods);
    const randomMood = moodKeys[Math.floor(Math.random() * moodKeys.length)];
    const templates = moods[randomMood];
    return templates[Math.floor(Math.random() * templates.length)];
}

module.exports = {
    generateFriendReply
};