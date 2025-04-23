import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
const GameOverScreen = () => {
    const { score , elapsedTime , level} = useLocalSearchParams();
  const router = useRouter();
    const navigation = useNavigation();
    useEffect(()=>{
        navigation.setOptions({
            headerShown: false
        })
    },[])
  // Quay lại màn hình game (hoặc màn hình câu hỏi tiếp theo)
  const handleRestart = () => {
    // router.push('/auth/screens/EasyGameIntro'); // Điều hướng đến màn hình game, điều chỉnh theo tên màn hình của bạn
    switch (level) {
      case 'easy':
        router.push('/auth/screens/EasyGameIntro');
        break;
      case 'medium':
        router.push('/auth/screens/MediumGameIntro');
        break;
      case 'hard':
        router.push('/auth/screens/HardGameIntro');
        break;
      default:
        router.push('/auth/screens/EasyGameIntro'); // fallback
    }
  };

  const QuizGame = () => {
    router.push('/auth/screens/HomeScreen'); // Điều hướng đến màn hình game, điều chỉnh theo tên màn hình của bạn
  };

  const formatTime = (elapsedTime) => {
    const minutes = Math.floor(elapsedTime / 60); // Lấy phần nguyên để tính phút
    const seconds = elapsedTime % 60; // Lấy phần dư để tính giây
  
    // Trả về kết quả dạng "X phút Y giây" hoặc chỉ "X phút" nếu không có giây
    return minutes > 0 ? `${minutes} phút ${seconds} giây` : `${seconds} giây`;
  };

  return (
    <LinearGradient
      colors={['#e0f7fa', '#fce4ec', '#fffde7']} // Xanh nhạt, hồng nhạt, vàng kem
      style={styles.container}
    >
    <Text style={styles.gameOverText}>🎮 Trò chơi kết thúc!</Text>
      <Text style={styles.finalScore}>✨ Điểm của bạn: <Text style={styles.scoreNumber}>{score}</Text></Text>
      <Text style={styles.finalScore}>⏱ Thời gian hoàn thành: </Text>
      <Text style={styles.scoreNumber}>{formatTime(elapsedTime)}</Text>
        <View style={styles.buttonWrapper}>
        <Button title="🔁 Chơi lại" onPress={handleRestart} color="#6200ee" />
        </View>
        <View style={styles.buttonWrapper}>
        <Button title="📱 Quay về trang chủ" onPress={QuizGame} color="#6200ee" />
        </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 20,
  },
  finalScore: {
    fontSize: 24,
    fontWeight: '600',
    color: '#004d40',
    marginBottom: 30,
  },
  scoreNumber: {
    fontWeight: 'bold',
    color: '#d32f2f',
    fontSize: 20,
    marginBottom: 30,
    marginTop: -10,
  },
  buttonWrapper: {
    width: '60%',
  },
});

export default GameOverScreen;
