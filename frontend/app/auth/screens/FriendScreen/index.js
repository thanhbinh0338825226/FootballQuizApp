// import { View, Text, ScrollView, StyleSheet } from 'react-native'
// import React, { useEffect } from 'react'
// import { useNavigation } from 'expo-router';
// import TabBar from '../TabBar';
// import { Colors } from '../../../../constants/Colors';
// export default function FriendScreen() {
//     const navigation = useNavigation();
//     useEffect(()=>{
//         navigation.setOptions({
//             headerShown: false
//         })
//     },[])
//   return (
//     <View style={styles.containerWithTabs}>
//         <ScrollView style={styles.container}>
//           <View style={{
//             display: 'flex',
//             flexDirection: 'row',
//             gap: 5,
            
//           }}>
//           <Text>FriendScreen</Text>
//           </View>
//           </ScrollView>
//       <TabBar />
//     </View>
//   )
// }
// const styles = StyleSheet.create({
//   containerWithTabs: {
//       flex: 1,
//     },
//     container:{
//       // padding: 25,
//       // paddingTop: 40,
//       height: '100%',
//       backgroundColor: Colors.WHITE,
//       flex: 1,
//       width: '100%',
//       paddingTop: 40,
//     },
// });

import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from 'expo-router';
import TabBar from '../TabBar';
import { Colors } from '../../../../constants/Colors';
import axios from 'axios';
import { API_URL } from '../../../../config';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';

// Football-themed components
const DifficultyTab = ({ active, label, icon, onPress }) => (
  <TouchableOpacity
    style={[styles.difficultyTab, active && styles.activeTab]}
    onPress={onPress}
  >
    <Text style={[styles.tabText, active && styles.activeTabText]}>
      {icon} {label}
    </Text>
  </TouchableOpacity>
);

const formatTime = (ms) => {
  if (!ms || isNaN(ms)) return '0 giây'; // Xử lý trường hợp không có thời gian
  
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0) {
    return `${minutes} phút ${seconds} giây`;
  } else {
    return `${seconds} giây`;
  }
};

const PlayerCard = ({ item, index }) => (
  <View style={styles.playerCard}>
    <View style={styles.rankContainer}>
      {index < 3 ? (
        <Text style={styles.medal}>
          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
        </Text>
      ) : (
        <Text style={styles.rank}>#{index + 1}</Text>
      )}
    </View>

    <Image
      source={{ uri: item.userInfo?.ImageUrl || 'https://randomuser.me/api/portraits/men/1.jpg' }}
      style={styles.avatar}
    />

    <View style={styles.playerInfo}>
      <Text style={styles.playerName}>
        {item.userInfo?.Email?.split('@')[0] || 'Anonymous'}
      </Text>
      <View style={styles.statsContainer}>
        <Text style={styles.stat}>
          <FontAwesome name="star" size={14} color="#FFD700" /> {item.highestScore}
        </Text>
        <Text style={styles.stat}>
          <MaterialIcons name="timer" size={14} color="#4CAF50" /> {formatTime(item.fastestTime)}
        </Text>
      </View>
    </View>
  </View>
);

export default function FriendScreen() {
  const [difficulty, setDifficulty] = useState('easy');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchLeaderboard = async (difficulty) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/leaderboard?difficulty=${difficulty}`);
      setLeaderboard(response.data.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    fetchLeaderboard(difficulty);
  }, [difficulty]);

  

  return (
    <View style={styles.containerWithTabs}>
      {/* Header với theme bóng đá */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Bảng Xếp Hạng</Text>
        {/* <Image 
          source={require('../../../../assets/images/logo.jpg')} 
          style={styles.trophyIcon}
        /> */}
        <Text style={styles.trophyIcon}>️🏆</Text>
      </View>

      <ScrollView style={styles.container}>
        {/* Các tab độ khó với theme bóng đá */}
        <View style={styles.tabContainer}>
          <DifficultyTab
            active={difficulty === 'easy'}
            label="Dễ"
            icon="⭐"
            onPress={() => setDifficulty('easy')}
          />
          <DifficultyTab
            active={difficulty === 'medium'}
            label="Trung Bình"
            icon="⭐⭐"
            onPress={() => setDifficulty('medium')}
          />
          <DifficultyTab
            active={difficulty === 'hard'}
            label="Khó"
            icon="⭐⭐⭐"
            onPress={() => setDifficulty('hard')}
          />
        </View>

        {/* Danh sách người chơi */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
          </View>
        ) : (
          <FlatList
            data={leaderboard}
            renderItem={({ item, index }) => <PlayerCard item={item} index={index} />}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.leaderboardContainer}
            scrollEnabled={false}
          />
        )}

        {/* Nút refresh */}
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={() => fetchLeaderboard(difficulty)}
        >
          <AntDesign name="reload1" size={20} color="white" />
          <Text style={styles.refreshText}>Làm mới</Text>
        </TouchableOpacity>
      </ScrollView>

      <TabBar />
    </View>
  )
}

const styles = StyleSheet.create({
  containerWithTabs: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#1E3A8A',
    borderBottomWidth: 4,
    borderBottomColor: '#FFD700',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 10,
    marginTop: 20,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  trophyIcon: {
    width: 30,
    height: 30,
    tintColor: '#FFD700',
    marginTop: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingHorizontal: 5,
  },
  difficultyTab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    borderWidth: 2,
    borderColor: '#BDBDBD',
  },
  activeTab: {
    backgroundColor: '#1E3A8A',
    borderColor: '#FFD700',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#424242',
  },
  activeTabText: {
    color: 'white',
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#1E3A8A',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  medal: {
    fontSize: 24,
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#757575',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFD700',
    marginHorizontal: 15,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  stat: {
    marginRight: 15,
    fontSize: 14,
    color: '#616161',
  },
  refreshButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E3A8A',
    padding: 12,
    borderRadius: 25,
    marginVertical: 20,
  },
  refreshText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#616161',
  },
});