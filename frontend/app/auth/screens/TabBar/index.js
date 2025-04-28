import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../../../constants/Colors';
 // Hoặc router của bạn

const TabBar = () => {
  const router = useRouter(); // Hoặc router của bạn nếu không dùng Next.js

  return (
    
    <View style={styles.tabContainer}>
      <TouchableOpacity onPress={() => router.push('/auth/screens/HomeScreen')}>
      <View style={styles.iconContainer}>
        <FontAwesome name="home" size={30} color={Colors.PRIMARY}/>
      </View>
        <Text style={styles.tabLabel}>Trang chủ</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/auth/screens/LibraryScreen')}>
      <View style={styles.iconContainer}>
        <Ionicons name="library" size={30} color={Colors.PRIMARY} />
      </View>
        <Text style={styles.tabLabel}>Thư viện</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/auth/screens/FriendScreen')}>
      <View style={styles.iconContainer}>
        <FontAwesome6 name="ranking-star" size={24} color={Colors.PRIMARY} />
      </View>
        <Text style={styles.tabLabel}>Bảng xếp hạng</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/auth/screens/ProfileScreen')}>
      <View style={styles.iconContainer}>
        <FontAwesome6 name="person" size={30} color={Colors.PRIMARY} />
      </View>
        <Text style={styles.tabLabel}>Hồ sơ</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: Colors.WHITE,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  tabItem: {
      alignItems: 'center', // Căn giữa cả biểu tượng và chữ
      justifyContent: 'center', // Căn giữa theo chiều dọc
      flex: 1, // Cho phép chia đều không gian
    },
    tabLabel: {
      fontSize: 10,
      textAlign: 'center',
      color: Colors.PRIMARY,
      marginTop: 5, // Khoảng cách giữa biểu tượng và chữ
    },
    iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 24, // Chiều cao cố định bằng kích thước icon
    marginBottom: 4, // Khoảng cách giữa icon và text
  },
});
export default TabBar;
