import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { Ionicons} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
export default function MediumGameIntro() {
    const router = useRouter();
    const navigation = useNavigation();
    useEffect(()=>{
        navigation.setOptions({
            headerShown: false
        })
    },[])
  return (
    <LinearGradient
        colors={['#fefcf8', '#f4e8d6', '#e0d4b7']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
    >
        <TouchableOpacity onPress={() => router.push('/auth/screens/HomeScreen')} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.levelTitle}>🧠 Chế độ trung bình</Text>

        <Text style={styles.description}>
            Đủ dễ để không nản, đủ khó để khiến bạn phải suy nghĩ.
        </Text>

        <View style={styles.infoBox}>
            <Text style={styles.infoItem}>📊 Độ khó: Trung bình</Text>
            <Text style={styles.infoItem}>⏱️ Thời gian: 3 phút</Text>
            <Text style={styles.infoItem}>🏆 Điểm tối đa: 10</Text>
        </View>

        <TouchableOpacity style={styles.startBtn}
        onPress={() => router.push('/auth/screens/MediumGame')}
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