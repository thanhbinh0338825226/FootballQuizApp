import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';  // Thêm icon đồng hồ từ FontAwesome
import { LinearGradient } from 'expo-linear-gradient';  // Import LinearGradient
import { API_URL } from '../../../../config';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function EasyGame() {
  const navigation = useNavigation();
  const [question, setQuestion] = useState(null);
  const [timer, setTimer] = useState(180); // 180 seconds = 3 minutes
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [usedQuestionIds, setUsedQuestionIds] = useState([]);
  const [answered, setAnswered] = useState(false); // Để kiểm tra khi người dùng đã trả lời câu hỏi
  const scoreRef = useRef(score);
  const timeoutRef = useRef(null);


  // Ẩn header
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  useEffect(() => {
    fetchQuestion(); // ← gọi API ban đầu khi vào màn hình
  }, []);

  useEffect(() => {
    scoreRef.current = score; // Cập nhật scoreRef mỗi lần score thay đổi
  }, [score]);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setGameOver(true);
      Alert.alert("⏱️ Hết giờ!", "Trò chơi đã kết thúc!");
      const elapsedTime = 180 - timer;
      router.push({ 
        pathname: '/auth/screens/GameOverScreen', 
        params: { 
          score: scoreRef.current.toString(),
          elapsedTime: elapsedTime.toString(),
          level: 'easy',
        }
      });
    }, 180000);
  
    return () => clearTimeout(timeoutRef.current);
  }, []);
  
  
  
  const fetchQuestion = async () => {
    if (usedQuestionIds.length >= 10) {
      clearTimeout(timeoutRef.current); 
      setGameOver(true);
      Alert.alert("🎉 Hoàn thành!", "Bạn đã trả lời đủ 10 câu hỏi.");
      const elapsedTime = 180 - timer;
      router.push({ 
          pathname: '/auth/screens/GameOverScreen', 
          params: { 
            score: scoreRef.current.toString(), 
            elapsedTime: elapsedTime.toString(),
            level: 'easy',
          } });
      return;
    }
    try {
      const res = await fetch(`${API_URL}/Question/quiz/random`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          difficulty: 'Easy',
          usedQuestionIds: usedQuestionIds, // truyền mảng các câu hỏi đã dùng
        }),
      });
      const responseText = await res.text();

      if (responseText.startsWith('<')) {
        throw new Error('API trả về trang lỗi HTML thay vì JSON');
      }
  
      // Nếu phản hồi là JSON hợp lệ, phân tích JSON
      const data = JSON.parse(responseText);

  
      if (data?.error === "Không đủ cầu thủ để tạo đáp án") {
        Alert.alert(
          "Lỗi hệ thống",
          "Hệ thống đang bị lỗi, vui lòng quay trở lại sau.",
          [
            {
              text: "OK",
              onPress: () => router.back(),
              style: "default"
            }
          ]
        );
        return;
      }
  
      // Lưu ID câu hỏi đã dùng để tránh lặp
      setUsedQuestionIds(prev => [...prev, data.questionId]);
      setQuestion(data);
    } catch (err) {
      console.error('Lỗi khi lấy câu hỏi:', err);
    }
  };

  useEffect(() => {
    if (timer <= 0 || gameOver) return; // Nếu game over thì không giảm thời gian nữa

    const countdown = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer, gameOver]);

  const handleAnswer = async (selectedAnswer) => {
    if (gameOver || answered) return; // Nếu game đã kết thúc, không làm gì cả
  
    try {
      const res = await fetch(`${API_URL}/Question/checkAnswer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: question.questionId,
          selectedAnswer: selectedAnswer,
        }),
      });
  
      const result = await res.json();
      if (result.message === "Trả lời đúng!") {
        setScore(prev => prev + 1);
        Alert.alert("✅ Chính xác!", "Bạn đã trả lời đúng.");
      } else {
        setGameOver(true); // Khi trả lời sai, kết thúc game
        clearTimeout(timeoutRef.current); 
        Alert.alert("❌ Sai rồi!", "Bạn đã trả lời sai. Trò chơi kết thúc.");
        const elapsedTime = 180 - timer;
        router.push({ 
          pathname: '/auth/screens/GameOverScreen', 
          params: { 
            score: score.toString(),
            elapsedTime: elapsedTime.toString(),
            level: 'easy',
          } });
      }
      setAnswered(true);
    } catch (err) {
      console.error('Lỗi khi kiểm tra đáp án:', err);
      Alert.alert("Lỗi", "Không thể kiểm tra đáp án.");
    }
  };
  

  const loadNextQuestion = async () => {
    if (gameOver) return; // Nếu game over thì không tải câu hỏi mới
  
    try {
      // Gọi fetchQuestion để lấy câu hỏi mới
      await fetchQuestion(); // Nếu fetchQuestion đã được sửa đúng cách, nó sẽ xử lý việc cập nhật câu hỏi
      setAnswered(false);
      // Không cần phải gọi thêm fetch ở đây nữa
    } catch (err) {
      console.error('Lỗi khi tải câu hỏi mới:', err);
      Alert.alert('Không thể tải câu hỏi', 'Có lỗi xảy ra khi tải câu hỏi mới. Vui lòng thử lại sau.');
    }
  };
  
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <LinearGradient
      colors={['#ADD8E6', '#FFE4B5', '#98FB98']} // Ba màu nền
      style={styles.container}
    >
      {question ? (
        <>
          <Text style={styles.title}>Câu hỏi:</Text>

          <View style={styles.timerContainer}>
            <FontAwesome name="clock-o" size={24} color="#ff6347" />
            <Text style={styles.timerText}>{formatTime(timer)}</Text>
          </View>
          <Text style={styles.scoreText}>Điểm: {score}</Text>
          {question.imageUrl && (
            <Image
              source={{ uri: question.imageUrl }}
              style={styles.image}
            />
          )}

          <Text style={styles.questionText}>
            {question.type || 'Ai là cầu thủ trong ảnh?'}
          </Text>

          {question.options?.map((opt, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleAnswer(opt.name)}
              disabled={answered}
            >
              <Text style={styles.optionText}>{opt.name}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.nextButton}
            onPress={loadNextQuestion} 
            disabled={!answered} 
          >
            <Text style={styles.nextButtonText}>Kế tiếp</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.loadingText}>Đang tải câu hỏi...</Text>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#888888',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 20,
    marginBottom: 10,
    color: 'black',
    textAlign: 'center',
    fontFamily: 'bold'
  },
  optionButton: {
    padding: 15,
    backgroundColor: '#ff6347', // Màu đỏ cam
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%', // Căn giữa các nút
  },
  optionText: {
    fontSize: 18,
    color: '#fff',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6347',
    marginLeft: 10,
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  nextButton: {
    padding: 15,
    backgroundColor: '#4CAF50', // Màu xanh lá
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    
  },
  nextButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  scoreText: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 10,
},
});



