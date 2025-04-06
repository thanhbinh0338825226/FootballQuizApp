import { View, Text, TouchableOpacity , TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image} from 'react-native'
import React , {useEffect, useState}from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation, useRouter } from 'expo-router';
import {Colors} from '../../../constants/Colors'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment-timezone';
import axios from 'axios';
import * as ImagePicker from "expo-image-picker";
import { API_URL } from '../../../config';
import FormData from 'form-data';
export default function SignOut() {
    const [Name, setName] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');
    const [ImageUrl, setImageUrl] = useState(null);
    const [birthDate, setBirthDate] = useState("Nhập ngày tháng năm sinh");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

     // Hiển thị DateTimePicker
     const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    // Ẩn DateTimePicker
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    // Xử lý khi chọn ngày
    const handleConfirm = (date) => {
        const formattedDate = moment(date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');
        setBirthDate(formattedDate);
        hideDatePicker();
    };

    const navigation= useNavigation();
    const router= useRouter();
    useEffect(()=>{
        navigation.setOptions({
            headerShown: false,
        })
    },[])

      
    
     const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Bạn cần cấp quyền để chọn ảnh!');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });
        if (!result.canceled) {
            setImageUrl(result.assets[0].uri);
        }
    };

    
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
     // Gửi dữ liệu đăng ký lên backend
    const handleRegister = async () => {

        const trimmedEmail = Email.trim();
        if (!validateEmail(trimmedEmail)) {
            alert("📧 Email không hợp lệ! Vui lòng nhập đúng định dạng.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('Name', Name);
            formData.append('DayOfBirth', birthDate);
            formData.append('PhoneNumber', PhoneNumber);
            formData.append('Email', Email.trim());
            formData.append('Password', Password);
            formData.append('ConfirmPassword', ConfirmPassword);
            
            if (ImageUrl) {
                formData.append('ImageUrl', {
                    uri: ImageUrl,
                    name: 'profile.jpg',
                    type: 'image/jpeg'
                });
            }        
    
            const response = await axios.post(`${API_URL}/User/register`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data) {
                // Nếu server trả về thành công
                if (response.status === 201) {
                    alert("Vui lòng xác thực để hoàn tất việc đăng ký thành công!");
                    const userId = response.data.user?.UserId; // Giả sử API trả về userId
                    
                    // Chuyển sang màn hình xác thực reCAPTCHA và truyền userId
                    router.push({ pathname: "auth/verify-otp", params: { userId } });
                   
                } else {
                    alert(response.data.error || "Có lỗi xảy ra!");
                }
            } else {
                alert("Không có dữ liệu từ server");
            }
        } catch (error) {
            if (error.response) {
                console.log("⚠️ Lỗi từ backend:", error.response.data);
            } else {
                console.error("❌ Lỗi không xác định:", error.message);
            }
        }
    };
  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
    >
    <ScrollView style={{
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
            marginTop: 10
        }}
        >Tạo tài khoản</Text>
        <View style={{
                marginTop: 30,
                gap: 5,
                display: 'flex'
        }}>
        {/* Email */}
            <Text style={{
                fontFamily: 'outfit'
            }}>Họ và tên</Text>
            <TextInput style={styles.input}
                placeholder='Nhập họ và tên'
                placeholderTextColor="black"
                value={Name}
                onChangeText={(text) => setName(text)}>
            </TextInput>

            {/* Ngày tháng năm sinh */}
            {/* <Text style={{
                fontFamily: 'outfit'
            }}>Ngày tháng năm sinh</Text>
            <TextInput style={styles.input}
                placeholder='Nhập ngày tháng năm sinh'
                placeholderTextColor="black">
            </TextInput> */}

            <Text style={{ fontFamily: 'outfit' }}>Ngày tháng năm sinh</Text>
                    <TouchableOpacity style={styles.input} onPress={showDatePicker}>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                       <Text style={{
                            fontFamily: 'outfit',
                            flex: 1,
                            color: birthDate === "Nhập ngày tháng năm sinh" ? 'outfit' : 'black' // Màu chữ xám nếu chưa chọn
                        }}>
                            {birthDate}
                        </Text>
                        <AntDesign name="calendar" size={24} color="black" />
                    </View>
                    </TouchableOpacity>

                    {/* DateTimePicker */}
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        locale="vi"
                    />

                    {/* DateTimePicker */}
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        locale="vi"
                    />

            

            {/* Số điện thoại */}
            <Text style={{
                fontFamily: 'outfit'
            }}>Số điện thoại</Text>
            <TextInput style={styles.input}
                keyboardType="numeric"
                placeholder='Nhập số điện thoại'
                placeholderTextColor="black"
                value={PhoneNumber}
                onChangeText={(text) => setPhoneNumber(text)}
                >
            </TextInput>

            {/* Email */}
            <Text style={{
                fontFamily: 'outfit'
            }}>Email</Text>
            <TextInput style={styles.input}
                placeholder='Nhập Email'
                placeholderTextColor="black"
                value={Email}
                onChangeText={(text) => setEmail(text)}
                >
            </TextInput>

            {/* Mật khẩu */}
            <Text style={{
                fontFamily: 'outfit'
            }}>Mật khẩu</Text>
            <TextInput style={styles.input}
                secureTextEntry= {true}
                placeholder='Nhập mật khẩu'
                placeholderTextColor="black"
                value={Password}
                onChangeText={(text) => setPassword(text)}
                >
            </TextInput>

            {/* Nhập lại mật khẩu */}
            <Text style={{
                fontFamily: 'outfit'
            }}>Xác nhận mật khẩu</Text>
            <TextInput style={styles.input}
                secureTextEntry= {true}
                placeholder='Xác nhận mật khẩu'
                placeholderTextColor="black"
                value={ConfirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
                >
            </TextInput>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                <Text>Chọn ảnh đại diện</Text>
            </TouchableOpacity>
            {ImageUrl && <Image source={{ uri: ImageUrl }} style={styles.image} />}
        </View>
        <TouchableOpacity
            onPress={() => {
                handleRegister();
            }}
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
    </ScrollView>
    </KeyboardAvoidingView>
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
    },
    imagePicker: { 
    padding: 15, 
    borderWidth: 1, 
    borderRadius: 15, 
    borderColor: Colors.GRAY, 
    alignItems: 'center', 
    marginTop: 10 
},
    image: { 
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 10 
},
    
})