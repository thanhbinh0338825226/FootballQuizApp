import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, {useEffect} from 'react'
import { useNavigation, useRouter } from 'expo-router';
import { Colors } from '../../../../constants/Colors';
import TabBar from '../TabBar';
export default function LibraryScreen() {
    const router = useRouter();
    const navigation = useNavigation();
        useEffect(()=>{
            navigation.setOptions({
                headerShown: false
            })
        },[])
  return (
    <View style={styles.containerWithTabs}>
        <ScrollView style={styles.container}>
        <Text style={{fontFamily: 'bold', fontSize: 30, color: Colors.PRIMARY, paddingLeft: 10, marginBottom: 0}}>⚽ Đấu Trường Câu Hỏi</Text>
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
                      <Text style={styles.questionTitle}>10 câu hỏi</Text>
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
                        <Text style={styles.questionTitle}>10 câu hỏi</Text>
                        <Text style={styles.questionSubtitle}>Vượt khó, chứng minh bản lĩnh trí tuệ</Text>
                      </View>
            </TouchableOpacity>
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
        width: '100%',
        paddingTop: 40,
  },
  questionBox: {
    width: '100%',
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

