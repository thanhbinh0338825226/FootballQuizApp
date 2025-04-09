// import { View, Text, TouchableOpacity, TextInput, StyleSheet, Switch } from 'react-native'
// import React, {useEffect, useState} from 'react'
// import { useNavigation, useRouter } from 'expo-router'
// import AntDesign from '@expo/vector-icons/AntDesign';
// import {Colors} from '../../../constants/Colors'
// import { CheckBox } from 'react-native-elements';
// export default function SignIn() {
//     const [rememberMe, setRememberMe] = useState(false);
//     const router = useRouter();
//     const navigation= useNavigation();
//     useEffect(()=>{
//         navigation.setOptions({
//             headerShown: false,
//         })
//     },[])
//   return (
//     <View style={{
//         padding: 25,
//         paddingTop: 40,
//         backgroundColor: Colors.WHITE,
//         height: '100%',
//     }}>
//         <TouchableOpacity onPress={()=>router.back()}>
//         <AntDesign name="caretleft" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={{
//             fontFamily: 'outfit-bold',
//             fontSize: 30,
//             textAlign: 'center',
//             marginTop:10
//         }}>Đăng nhập</Text>
//         <Text style={{
//             fontFamily: 'outfit-bold',
//             fontSize: 28,
//             marginTop: 30
//         }}>Xin chào 👋</Text>
//         <View style={{
//             marginTop: 30,
//             gap: 5,
//             display: 'flex'
//         }}>
//         {/* Email */}
//             <Text style={{
//                 fontFamily: 'outfit'
//             }}>Email</Text>
//             <TextInput style={styles.input}
//             placeholder='Nhập Email'
//             placeholderTextColor="black">
//             </TextInput>
        
//         {/* Password */}
//         <Text style={{
//                 fontFamily: 'outfit'
//             }}>Mật khẩu</Text>
//         <TextInput style={styles.input}
//             secureTextEntry= {true}
//             placeholder='Nhập mật khẩu'
//             placeholderTextColor="black">
//         </TextInput>

//         {/* <CheckBox
//             title="Ghi nhớ tài khoản"
//             checked={rememberMe}
//             onPress={() => setRememberMe(!rememberMe)}
//             containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
//             checkedIcon="check-square"
//             uncheckedIcon="square-o"
//         /> */}
//         <TouchableOpacity
//             onPress={() => setRememberMe(!rememberMe)}
//             style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}
//             >
//             <View
//                 style={{
//                 width: 24,
//                 height: 24,
//                 borderWidth: 2,
//                 borderColor: Colors.GRAY,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 marginRight: 10
//                 }}
//             >
//                 {rememberMe && <AntDesign name="check" size={18} color={Colors.PRIMARY} />}
//             </View>
//             <Text style={{ fontFamily: 'outfit' }}>Ghi nhớ tài khoản</Text>
//         </TouchableOpacity>

//         </View>
        
//         {/* Đăng nhập */}
//         <TouchableOpacity
//         onPress={()=>router.push('auth/sign-out')}
//         style={{
//         padding: 20,
//         backgroundColor: Colors.PRIMARY,
//         borderRadius: 15,
//         marginTop: 50
//       }}>
//         <Text style={{
//             color: Colors.WHITE,
//             textAlign: 'center'
//         }}>Đăng nhập</Text>
//       </TouchableOpacity>

//         {/* Đăng kí */}
//       <TouchableOpacity
//       onPress={()=>router.push('auth/sign-out')}
//         style={{
//         padding: 20,
//         backgroundColor: Colors.PRIMARY,
//         borderRadius: 15,
//         marginTop: 50
//       }}>
//         <Text style={{
//             color: Colors.WHITE,
//             textAlign: 'center'
//         }}>Đăng kí</Text>
//       </TouchableOpacity>

//     </View>
    
//   )
// }
// const styles = StyleSheet.create({
//     input: {
//         padding: 15,
//         borderWidth: 1,
//         borderRadius: 15,
//         borderColor: Colors.GRAY,
//         fontFamily: 'outfit',
//         marginTop: 5
//     }
// })

import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import React, { useState,useEffect } from 'react';
import { useRouter, useNavigation } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Colors } from '../../../constants/Colors';
import { API_URL } from '../../../config';
import { Ionicons } from '@expo/vector-icons';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const navigation= useNavigation();

  // Handle login request
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/User/login`, {
        Email: email,
        Password: password
      });

      const { accessToken, refreshToken, message } = response.data;
      
      // Lưu token vào SecureStore
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      
      Alert.alert('Đăng nhập thành công!', message);

      // Điều hướng đến trang chính
      router.push('/auth/screens/HomeScreen'); 
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Đã có lỗi xảy ra!';
      Alert.alert('Lỗi', errMsg);
    }
  };

  // Hide header on the page
 useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View style={{ padding: 25, paddingTop: 40, backgroundColor: Colors.WHITE, height: '100%' }}>
      <TouchableOpacity onPress={() => router.back()}>
        <AntDesign name="caretleft" size={24} color="black" />
      </TouchableOpacity>
      <Text style={{ fontFamily: 'outfit-bold', fontSize: 30, textAlign: 'center', marginTop: 10 }}>
        Đăng nhập
      </Text>
      <Text style={{ fontFamily: 'outfit-bold', fontSize: 28, marginTop: 30 }}>
        Xin chào 👋
      </Text>

      <View style={{ marginTop: 30, gap: 5 }}>
        {/* Email */}
        <Text style={{ fontFamily: 'outfit' }}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập Email"
          placeholderTextColor="black"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password */}
        <Text style={{ fontFamily: 'outfit' }}>Mật khẩu</Text>
        <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}  
          secureTextEntry={!isPasswordVisible}
          placeholder="Nhập mật khẩu"
          placeholderTextColor="black"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Ionicons
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={22}
            color="gray"
          />
        </TouchableOpacity>
        </View>

        {/* Ghi nhớ tài khoản */}
        <TouchableOpacity onPress={() => setRememberMe(!rememberMe)} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <View
            style={{
              width: 24,
              height: 24,
              borderWidth: 2,
              borderColor: Colors.GRAY,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 10,
            }}
          >
            {rememberMe && <AntDesign name="check" size={18} color={Colors.PRIMARY} />}
          </View>
          <Text style={{ fontFamily: 'outfit' }}>Ghi nhớ tài khoản</Text>
        </TouchableOpacity>
      </View>

      {/* Đăng nhập */}
      <TouchableOpacity
        onPress={handleLogin}
        style={{
          padding: 20,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 15,
          marginTop: 50,
        }}
      >
        <Text style={{ color: Colors.WHITE, textAlign: 'center' }}>Đăng nhập</Text>
      </TouchableOpacity>

      {/* Đăng kí */}
      <TouchableOpacity
        onPress={() => router.push('auth/sign-out')}
        style={{
          padding: 20,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 15,
          marginTop: 20,
        }}
      >
        <Text style={{ color: Colors.WHITE, textAlign: 'center' }}>Đăng kí</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.GRAY,
    fontFamily: 'outfit',
    marginTop: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.GRAY,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  passwordInput: {
  flex: 1,
  height: 50,
  fontFamily: 'outfit',
},
});
