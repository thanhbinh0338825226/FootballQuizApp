import { View, Text , Image, FlatList, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Touchable} from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store';
import { Colors } from '../../../../constants/Colors';
import axios from 'axios';
import { API_URL } from '../../../../config';
import AntDesign from '@expo/vector-icons/AntDesign';

import TabBar from '../TabBar';
const { width } = Dimensions.get("window");
  const images = [
    { id: "1", source: require("../../../../assets/images/homescreen.jpg") },
    { id: "2", source: require("../../../../assets/images/homescreen7.jpg") },
    { id: "3", source: require("../../../../assets/images/homescreen8.jpg") },
    { id: "4", source: require("../../../../assets/images/homescreen9.jpg") },
  ];
export default function HomeScreen() {
  const router = useRouter();
  // const flatListRef = useRef<FlatList>(null);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const [username, setUsername] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  useEffect(() => {
    const getToken = async () => {
      const token = await SecureStore.getItemAsync('accessToken');
      
      setAccessToken(token || '');
    };
    getToken();
  }, []);
  const decodeJWT = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedData = JSON.parse(atob(base64));
    return decodedData;
  };
  useEffect(() => {
    const getUserInfo = async () => {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        try {
          const decoded = decodeJWT(token);  // Giải mã thủ công
          const email = decoded.email;
          const nameBeforeAt = email.split('@')[0];
          setUsername(nameBeforeAt);
          const userId = decoded.userId; 
          const response = await axios.get(`${API_URL}/User/getUserById/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,  // Nếu cần xác thực Bearer Token
            },
          });
          
          if (response.data && response.data.imageUrl) {
            setImageUrl(response.data.imageUrl);  // Lưu imageUrl
          }
        } catch (error) {
          console.error('Lỗi khi giải mã token:', error);
        }
      } else {
        console.log('Không tìm thấy token trong SecureStore');
      }
    };
  
    getUserInfo();
  }, []);
  
  
  const navigation = useNavigation();
  useEffect(()=>{
    navigation.setOptions({
      headerShown: false,
    })
  },[])
  return (
    <View style={styles.containerWithTabs}>
    <ScrollView style={styles.container}>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        
      }}>
       <Image source={{ uri: imageUrl }} style={{ width:70, height: 70, borderRadius: 100 }} />
      <Text style={{
        fontSize: 24, fontFamily: 'outfit-bold', paddingTop: 20, paddingLeft: 5
      }}>{username || 'Loading...'}</Text>  
      </View>
       <View style={{marginTop: 5}}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Image source={item.source} style={styles.image} />
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}  // Sử dụng viewConfigRef

        onScroll={(event) => {
            const contentOffsetX = event.nativeEvent.contentOffset.x;
            const index = Math.floor(contentOffsetX / width);  // Tính toán chỉ số hiện tại
            if (index !== currentIndex) {
              setCurrentIndex(index);  // Cập nhật chỉ số khi người dùng kéo
            }
          }}
      />

      <View style={styles.dotContainer}>
        {images.map((_, index) => (
          <TouchableOpacity key={index} onPress={() => {
            flatListRef.current?.scrollToIndex({ index, animated: true });
            setCurrentIndex(index);
          }}>
            <View
              style={[
                styles.dot,
                { backgroundColor: index === currentIndex ? "#f00" : "#ccc" },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
       </View>
        {/* Khám phá , Xem tất cả */}
       <View style={{marginTop: 20, paddingLeft: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{fontSize: 24, fontFamily: 'outfit-bold'}}>Khám phá</Text>
          <TouchableOpacity style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 5}}>
          <Text style={{fontSize: 24, fontFamily: 'outfit-bold', color: 'purple'}}>Xem tất cả</Text>
          <AntDesign name="arrowright" size={24} color="purple" style={{paddingTop: 5}} />
          </TouchableOpacity>
       </View>
        {/* Ô chọn bô câu hỏi */}
        <View style={{ flex: 1, justifyContent: 'center' }}>
        <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: 'row',
          paddingHorizontal: 10,
        }}
      >
       <TouchableOpacity 
        style={styles.questionBox} 
        onPress={() => router.push('/auth/screens/EasyGameIntro')}
        >
       <View style={styles.imageContainer}>
          <Image
            source={require('../../../../assets/images/easy.jpg')}
            style={styles.thumbnail}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.questionTitle}>10 câu hỏi</Text>
          <Text style={styles.questionSubtitle}>Khởi động nhẹ nhàng dễ dàng</Text>
        </View>
       </TouchableOpacity>

       <TouchableOpacity 
        style={styles.questionBox}
        onPress={() => router.push('/auth/screens/MediumGameIntro')}
       >
       <View style={styles.imageContainer}>
          <Image
            source={require('../../../../assets/images/medium.jpg')}
            style={styles.thumbnail}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.questionTitle}>20 câu hỏi</Text>
          <Text style={styles.questionSubtitle}>Không dành cho người thiếu kiên nhẫn</Text>
        </View>
        </TouchableOpacity>
       
        <TouchableOpacity 
          style={styles.questionBox}
          onPress={() => router.push('/auth/screens/HardGameIntro')}
        >
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../../assets/images/hard.jpg')}
            style={styles.thumbnail}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.questionTitle}>30 câu hỏi</Text>
          <Text style={styles.questionSubtitle}>Vượt khó, chứng minh bản lĩnh trí tuệ</Text>
        </View>
       </TouchableOpacity>
       </ScrollView>
       </View>

    </ScrollView>
      <TabBar />
    </View>
  )
}
const styles = StyleSheet.create({
  containerWithTabs: {
    flex: 1,
  },
  container:{
    // padding: 25,
    // paddingTop: 40,
    height: '100%',
    backgroundColor: Colors.WHITE,
    flex: 1,
    width,
    paddingTop: 40,
  },
  image: {
    width,
    height: 250,
    resizeMode: "cover",
    borderRadius: 20,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 5,
  },
  questionBox: {
    width: 250,
    height: 250,
    backgroundColor: Colors.GRAY,
    marginTop: 10,
    flexShrink: 0,
    borderWidth: 1,
    marginRight: 10,  
    borderRadius: 20,
    flexDirection: 'column',
    overflow: 'hidden',
  }, 
  imageContainer: {
    height: '75%',
  },
  thumbnail: { 
          
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textContainer: {
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  fontFamily: 'outfit-bold',
  color: 'black',
  textAlign: 'center',
  },

questionSubtitle: {
  fontSize: 14,
  color: 'black',
  textAlign: 'center',
  marginTop: 4,
},
});