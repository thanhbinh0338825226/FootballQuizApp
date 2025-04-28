// import React, { useEffect } from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import { useNavigation, useRouter } from 'expo-router';
// import { useLocalSearchParams } from 'expo-router';
// import { LinearGradient } from 'expo-linear-gradient';
// const GameOverScreen = () => {
//     const { score , elapsedTime , level} = useLocalSearchParams();
//   const router = useRouter();
//     const navigation = useNavigation();
//     useEffect(()=>{
//         navigation.setOptions({
//             headerShown: false
//         })
//     },[])
//   // Quay lại màn hình game (hoặc màn hình câu hỏi tiếp theo)
//   const handleRestart = () => {
//     // router.push('/auth/screens/EasyGameIntro'); // Điều hướng đến màn hình game, điều chỉnh theo tên màn hình của bạn
//     switch (level) {
//       case 'easy':
//         router.push('/auth/screens/EasyGameIntro');
//         break;
//       case 'medium':
//         router.push('/auth/screens/MediumGameIntro');
//         break;
//       case 'hard':
//         router.push('/auth/screens/HardGameIntro');
//         break;
//       default:
//         router.push('/auth/screens/HomeScreen'); // fallback
//     }
//   };

//   const QuizGame = () => {
//     router.push('/auth/screens/HomeScreen'); // Điều hướng đến màn hình game, điều chỉnh theo tên màn hình của bạn
//   };

//   const formatTime = (elapsedTime) => {
//     const minutes = Math.floor(elapsedTime / 60); // Lấy phần nguyên để tính phút
//     const seconds = elapsedTime % 60; // Lấy phần dư để tính giây
  
//     // Trả về kết quả dạng "X phút Y giây" hoặc chỉ "X phút" nếu không có giây
//     return minutes > 0 ? `${minutes} phút ${seconds} giây` : `${seconds} giây`;
//   };

//   return (
//     <LinearGradient
//       colors={['#e0f7fa', '#fce4ec', '#fffde7']} // Xanh nhạt, hồng nhạt, vàng kem
//       style={styles.container}
//     >
//     <Text style={styles.gameOverText}>🎮 Trò chơi kết thúc!</Text>
//       <Text style={styles.finalScore}>✨ Điểm của bạn: <Text style={styles.scoreNumber}>{score}</Text></Text>
//       <Text style={styles.finalScore}>⏱ Thời gian hoàn thành: </Text>
//       <Text style={styles.scoreNumber}>{formatTime(elapsedTime)}</Text>
//         <View style={styles.buttonWrapper}>
//         <Button title="🔁 Chơi lại" onPress={handleRestart} color="#6200ee" />
//         </View>
//         <View style={styles.buttonWrapper}>
//         <Button title="📱 Quay về trang chủ" onPress={QuizGame} color="#6200ee" />
//         </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   gameOverText: {
//     fontSize: 36,
//     fontWeight: 'bold',
//     color: '#1a237e',
//     marginBottom: 20,
//   },
//   finalScore: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: '#004d40',
//     marginBottom: 30,
//   },
//   scoreNumber: {
//     fontWeight: 'bold',
//     color: '#d32f2f',
//     fontSize: 20,
//     marginBottom: 30,
//     marginTop: -10,
//   },
//   buttonWrapper: {
//     width: '60%',
//   },
// });

// export default GameOverScreen;

//2
// import React, { useEffect } from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import { useNavigation, useRouter } from 'expo-router';
// import { useLocalSearchParams } from 'expo-router';
// import { LinearGradient } from 'expo-linear-gradient';

// const GameOverScreen = () => {
//   const { score, elapsedTime, level } = useLocalSearchParams();
//   const router = useRouter();
//   const navigation = useNavigation();

//   useEffect(() => {
//     navigation.setOptions({
//       headerShown: false
//     });
//   }, []);

//   const handleRestart = () => {
//     switch (level) {
//       case 'easy':
//         router.push('/auth/screens/EasyGameIntro');
//         break;
//       case 'medium':
//         router.push('/auth/screens/MediumGameIntro');
//         break;
//       case 'hard':
//         router.push('/auth/screens/HardGameIntro');
//         break;
//       default:
//         router.push('/auth/screens/HomeScreen');
//     }
//   };

//   const QuizGame = () => {
//     router.push('/auth/screens/HomeScreen');
//   };

//   const formatTime = (elapsedTime) => {
//     const minutes = Math.floor(elapsedTime / 60);
//     const seconds = elapsedTime % 60;
//     return minutes > 0 ? `${minutes} phút ${seconds} giây` : `${seconds} giây`;
//   };

//   return (
//     <LinearGradient
//       colors={['#a1c4fd', '#c2e9fb', '#d4fc79']} // Gradient dễ thương
//       style={styles.container}
//     >
//       <Text style={styles.gameOverText}>🎮 Trò chơi kết thúc!</Text>

//       <View style={styles.card}>
//         <Text style={styles.finalScore}>
//           ✨ Điểm của bạn:
//         </Text>
//         <Text style={styles.scoreNumber}>{score}</Text>

//         <Text style={styles.finalScore}>
//           ⏱ Thời gian hoàn thành:
//         </Text>
//         <Text style={styles.scoreNumber}>{formatTime(elapsedTime)}</Text>
//       </View>

//       <View style={styles.buttonWrapper}>
//         <Button title="🔁 Chơi lại" onPress={handleRestart} color="#6200ee" />
//       </View>

//       <View style={styles.buttonWrapper}>
//         <Button title="📱 Quay về trang chủ" onPress={QuizGame} color="#6200ee" />
//       </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   gameOverText: {
//     fontSize: 40,
//     fontWeight: '800',
//     color: '#5C6BC0',
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   card: {
//     backgroundColor: '#ffffffcc', // trắng hơi mờ
//     padding: 25,
//     borderRadius: 20,
//     alignItems: 'center',
//     width: '90%',
//     marginBottom: 40,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     elevation: 6,
//   },
//   finalScore: {
//     fontSize: 22,
//     fontWeight: '500',
//     color: '#333',
//     textAlign: 'center',
//     marginBottom: 5,
//   },
//   scoreNumber: {
//     fontWeight: 'bold',
//     color: '#FF7043',
//     fontSize: 26,
//     marginTop: 5,
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   buttonWrapper: {
//     width: '70%',
//     marginVertical: 10,
//     borderRadius: 12,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 6,
//   },
// });

// export default GameOverScreen;



import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { API_URL } from '../../../../config';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios'; // Import axios to make API requests

const GameOverScreen = () => {
  const { score, elapsedTime, level } = useLocalSearchParams();
  const [userId, setUserId] = useState(null); // state để lưu userId
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false
    });

    // Lấy userId từ SecureStore khi component load
    getUserIdFromSecureStore();
  }, []);

  useEffect(() => {
    if (userId) {
      // Gửi dữ liệu về backend khi game kết thúc
      sendQuizResult();
    }
  }, [userId]);

  // Hàm lấy userId từ SecureStore
  const getUserIdFromSecureStore = async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(atob(base64));
        const userIdFromToken = decoded.userId;

        if (userIdFromToken) {
          setUserId(userIdFromToken); // Lưu userId vào state
          // console.log('userId từ SecureStore:', userIdFromToken);
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy userId từ SecureStore:', error);
    }
  };

  // Hàm gửi kết quả quiz lên server
  const sendQuizResult = async () => {
    try {
      const elapsedTimeInMillis = Math.floor(elapsedTime * 1000);

      // console.log('Gửi kết quả lên server:', {
      //   userId: userId,
      //   difficulty: level,
      //   score: score,
      //   time: elapsedTimeInMillis,
      // });

      const response = await fetch(`${API_URL}/api/quiz-result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          difficulty: level,
          score: score,
          time: elapsedTimeInMillis,
        }),
      });

      const result = await response.json();
      // if (response.status === 201) {
      //   console.log('Kết quả đã được lưu thành công:', result);
      // } else {
      //   console.error('Lỗi khi lưu kết quả:', result);
      // }
    } catch (error) {
      console.error('Lỗi kết nối với server:', error);
    }
  };

  const handleRestart = () => {
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
        router.push('/auth/screens/HomeScreen');
    }
  };

  const QuizGame = () => {
    router.push('/auth/screens/HomeScreen');
  };

  const formatTime = (elapsedTime) => {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = Math.floor(elapsedTime % 60);
    if (minutes > 0) {
      return `${minutes} phút ${seconds} giây`;
    } else {
      return `${seconds} giây`;
    }
  };

  return (
    <LinearGradient
      colors={['#a1c4fd', '#c2e9fb', '#d4fc79']}
      style={styles.container}
    >
      <Text style={styles.gameOverText}>🎮 Trò chơi kết thúc!</Text>

      <View style={styles.card}>
        <Text style={styles.finalScore}>✨ Điểm của bạn:</Text>
        <Text style={styles.scoreNumber}>{score}</Text>

        <Text style={styles.finalScore}>⏱ Thời gian hoàn thành:</Text>
        <Text style={styles.scoreNumber}>{formatTime(elapsedTime)}</Text>
      </View>

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
    paddingHorizontal: 20,
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#5C6BC0',
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffffcc',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    width: '90%',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  finalScore: {
    fontSize: 22,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  scoreNumber: {
    fontWeight: 'bold',
    color: '#FF7043',
    fontSize: 26,
    marginTop: 5,
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonWrapper: {
    width: '70%',
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
});

export default GameOverScreen;




