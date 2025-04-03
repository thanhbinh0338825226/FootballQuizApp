import { View, Text, TouchableOpacity, TextInput, StyleSheet, Switch } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useNavigation, useRouter } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign';
import {Colors} from '../../../constants/Colors'
import { CheckBox } from 'react-native-elements';
export default function SignIn() {
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();
    const navigation= useNavigation();
    useEffect(()=>{
        navigation.setOptions({
            headerShown: false,
        })
    },[])
  return (
    <View style={{
        padding: 25,
        paddingTop: 40,
        backgroundColor: Colors.WHITE,
        height: '100%',
    }}>
        <TouchableOpacity onPress={()=>router.back()}>
        <AntDesign name="caretleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{
            fontFamily: 'outfit-bold',
            fontSize: 30,
            textAlign: 'center',
            marginTop:10
        }}>Đăng nhập</Text>
        <Text style={{
            fontFamily: 'outfit-bold',
            fontSize: 28,
            marginTop: 30
        }}>Xin chào 👋</Text>
        <View style={{
            marginTop: 30,
            gap: 5,
            display: 'flex'
        }}>
        {/* Email */}
            <Text style={{
                fontFamily: 'outfit'
            }}>Email</Text>
            <TextInput style={styles.input}
            placeholder='Nhập Email'
            placeholderTextColor="black">
            </TextInput>
        
        {/* Password */}
        <Text style={{
                fontFamily: 'outfit'
            }}>Mật khẩu</Text>
        <TextInput style={styles.input}
            secureTextEntry= {true}
            placeholder='Nhập mật khẩu'
            placeholderTextColor="black">
        </TextInput>

        {/* <CheckBox
            title="Ghi nhớ tài khoản"
            checked={rememberMe}
            onPress={() => setRememberMe(!rememberMe)}
            containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
            checkedIcon="check-square"
            uncheckedIcon="square-o"
        /> */}
        <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}
            >
            <View
                style={{
                width: 24,
                height: 24,
                borderWidth: 2,
                borderColor: Colors.GRAY,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10
                }}
            >
                {rememberMe && <AntDesign name="check" size={18} color={Colors.PRIMARY} />}
            </View>
            <Text style={{ fontFamily: 'outfit' }}>Ghi nhớ tài khoản</Text>
        </TouchableOpacity>

        </View>
        
        {/* Đăng nhập */}
        <TouchableOpacity
        onPress={()=>router.push('auth/sign-out')}
        style={{
        padding: 20,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 15,
        marginTop: 50
      }}>
        <Text style={{
            color: Colors.WHITE,
            textAlign: 'center'
        }}>Đăng nhập</Text>
      </TouchableOpacity>

        {/* Đăng kí */}
      <TouchableOpacity
      onPress={()=>router.push('auth/sign-out')}
        style={{
        padding: 20,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 15,
        marginTop: 50
      }}>
        <Text style={{
            color: Colors.WHITE,
            textAlign: 'center'
        }}>Đăng kí</Text>
      </TouchableOpacity>

    </View>
    
  )
}
const styles = StyleSheet.create({
    input: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: Colors.GRAY,
        fontFamily: 'outfit',
        marginTop: 5
    }
})