
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
        <FontAwesome name="home" size={30} color={Colors.PRIMARY}/>
        <Text style={styles.tabLabel}>Trang chủ</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/auth/screens/LibraryScreen')}>
        <Ionicons name="library" size={30} color={Colors.PRIMARY} />
        <Text style={styles.tabLabel}>Thư viện</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/auth/screens/FriendScreen')}>
        <Ionicons name="person-add" size={30} ccolor={Colors.PRIMARY} />
        <Text style={styles.tabLabel}>Tìm bạn</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/auth/screens/ProfileScreen')}>
        <FontAwesome6 name="person" size={30} color={Colors.PRIMARY} />
        <Text style={styles.tabLabel}>Hồ sơ</Text>
      </TouchableOpacity>
      {/* <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tabItem}
        //  onPress={() => navigation.push('Home')}
         >
          <FontAwesome name="home" size={30} color={Colors.PRIMARY} />
          <Text style={styles.tabLabel}>Trang chủ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}
        onPress={() => router.push('auth/screens/LibraryScreen')}
        >
          <Ionicons name="library" size={30} color={Colors.PRIMARY} />
          <Text style={styles.tabLabel}>Thư viện</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}
        onPress={() => router.push('auth/screens/FriendScreen')}
        >
         <Ionicons name="person-add" size={30} color={Colors.PRIMARY} />
         <Text style={styles.tabLabel}>Tìm bạn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}
        onPress={() => router.push('auth/screens/ProfileScreen')}
        >
          <FontAwesome6 name="person" size={30} color={Colors.PRIMARY} />
          <Text style={styles.tabLabel}>Hồ sơ</Text>
        </TouchableOpacity>
      </View> */}
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
});
export default TabBar;
