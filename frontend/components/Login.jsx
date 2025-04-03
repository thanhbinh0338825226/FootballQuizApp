import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React , {useEffect}from 'react'
import { useNavigation, useRouter} from 'expo-router'
import {Colors} from '../constants/Colors'

export default function Login() {
    const navigation = useNavigation();
    const router = useRouter();
    useEffect(()=> {
        navigation.setOptions({
            headerShown: false,
        })
    },[])
    return (
      <View>
        <Image source ={require('./../assets/images/logo.jpg')}
          style={{
              width: '100%',
              height: 450
          }}
        />
        <View style={styles.container}>
          <Text style={{
              fontSize: 30,
              fontFamily: 'outfit-bold',
              textAlign: 'center',
              marginTop: 10
          }}>Football Quiz App</Text>
          <Text style={{
              fontFamily: 'outfit',
              fontSize: 16,
              textAlign: 'center',
              color: Colors.GRAY,
              marginTop: 20
          }}>Bạn có tự tin là một chuyên gia bóng đá? Thử thách ngay với Football Quiz App – nơi kiến thức bóng đá của bạn được tỏa sáng! Tham gia ngay và chứng minh đẳng cấp!</Text>
          <TouchableOpacity style={styles.button}   
          onPress={()=>router.push('auth/signin-signout')}>
              <Text style={{
                  color: Colors.WHITE,
                  textAlign: 'center',
                  fontFamily: 'outfit',
                  fontSize: 17
              }}>Bắt đầu</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  const styles = StyleSheet.create({
      container:{
          backgroundColor: Colors.WHITE,
          marginTop: -20,
          height: '100%',
          borderTopLeftRadius: 30,
          borderTopRightRadius:30,
          padding: 25
      },
      button:{
          padding: 15,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 99,
          marginTop: '20%'
      }
  })