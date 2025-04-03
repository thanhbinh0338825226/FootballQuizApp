import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React , {useEffect}from 'react'
import { useNavigation, useRouter} from 'expo-router'
import {Colors} from '../../../constants/Colors'

export default function SignInSignOut() {
    const navigation = useNavigation();
    const router = useRouter();
    useEffect(()=> {
        navigation.setOptions({
            headerShown: false,
        })
    },[])
    return (
      <View>
        <Image source ={require('./../../../assets/images/logreg.jpg')}
          style={{
              width: '100%',
              height: 500
          }}
        />
        <View style={styles.container}>
          <Text style={{
              fontFamily: 'outfit-bold',
              fontSize: 30,
              textAlign: 'center',
              color: Colors.PRIMARY,
              marginTop: 20
          }}>Thử thách trí tuệ {'\n'} Làm chủ sân cỏ</Text>
          <TouchableOpacity style={styles.button}   
          onPress={()=>router.push('auth/sign-in')}>
              <Text style={{
                  color: Colors.WHITE,
                  textAlign: 'center',
                  fontFamily: 'outfit',
                  fontSize: 17
              }}>Đăng nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}   
          onPress={()=>router.push('auth/sign-out')}>
              <Text style={{
                  color: Colors.WHITE,
                  textAlign: 'center',
                  fontFamily: 'outfit',
                  fontSize: 17
              }}>Đăng kí</Text>
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
          marginTop: '10%'
      }
  })