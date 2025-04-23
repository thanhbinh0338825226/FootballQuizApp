import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { Ionicons} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
export default function HardGameIntro() {
    const router = useRouter();
    const navigation = useNavigation();
    useEffect(()=>{
        navigation.setOptions({
            headerShown: false
        })
    },[])
  return (
    <LinearGradient
        colors={['#fbe9e7', '#f8c5bb', '#d8a29d']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
    >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.levelTitle}>🧠 Chế độ khó</Text>

        <Text style={styles.description}>
            Đây không còn là trò chơi - Đây là đấu trường của những chiến lược gia.
        </Text>

        <View style={styles.infoBox}>
            <Text style={styles.infoItem}>📊 Độ khó: Khó</Text>
            <Text style={styles.infoItem}>⏱️ Thời gian: 3 phút</Text>
            <Text style={styles.infoItem}>🏆 Điểm tối đa: 10</Text>
        </View>

        <TouchableOpacity style={styles.startBtn}
        onPress={() => router.push('/auth/screens/HardGame')}
         >
            <Text style={styles.startText}>Bắt đầu chơi</Text>
        </TouchableOpacity>
    </LinearGradient>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F7F8FB',
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backBtn: {
      position: 'absolute',
      top: 50,
      left: 20,
    },
    levelTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
    },
    description: {
      fontSize: 16,
      color: '#555',
      textAlign: 'center',
      marginBottom: 30,
      lineHeight: 24,
    },
    infoBox: {
      width: '100%',
      padding: 20,
      backgroundColor: '#FFF',
      borderRadius: 16,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      marginBottom: 40,
    },
    infoItem: {
      fontSize: 16,
      color: '#444',
      marginBottom: 8,
    },
    startBtn: {
      backgroundColor: '#4C9EEB',
      paddingVertical: 14,
      paddingHorizontal: 40,
      borderRadius: 12,
    },
    startText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  