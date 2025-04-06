import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { API_URL } from '../../../config';
import { useNavigation, useRouter } from "expo-router";
// Cập nhật tên biến môi trường
// const API_URL = process.env.API_BASE_URL;

const OtpVerification = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
   const navigation= useNavigation();
  // const handleOtpSubmit = async () => {
  //   setLoading(true);

  //   // console.log("Email:", email);
  //   // console.log("OTP:", otp);
  //   const emailLowerCase = email.toLowerCase();
  //   try {
  //     // Gửi OTP đến backend để xác thực
  //     console.log("Sending data to backend:", { email, otp });
  //     const response = await axios.post(`${API_URL}/Auth/verify-otp`, {
  //       email: emailLowerCase,
  //       otp,
  //     });
     
  //     // Hiển thị thông báo thành công
  //   //   Alert.alert("Thông báo", response.data.message, [
  //   //     { text: "OK", onPress: () => navigation.navigate("Home") },
  //   //   ]);
  //   Alert.alert("Thông báo",response.data.message, [
  //     { text: "OK", onPress: () => router.push("/sign-in") },
  //   ]);
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //     const errorMessage = error.response ? error.response.data.message : "Đã có lỗi xảy ra";
  //     Alert.alert("Lỗi", errorMessage);
  //   }
  // };
 useEffect(()=>{
         navigation.setOptions({
             headerShown: false,
         })
     },[])
  const handleOtpSubmit = async () => {
    setLoading(true);
    try {
      // Gửi OTP đến backend với `Email` giữ nguyên định dạng
      // const response = await axios.post(`${API_URL}/Auth/verify-otp`, {
      //   Email: email, // ✅ Giữ nguyên chữ hoa/chữ thường như database
      //   otp,
      // });
      const response = await axios.post(`${API_URL}/Auth/verify-otp`, 
        { Email: email, otp },  
        // { headers: { "Content-Type": "application/json" } }
      );
      // Hiển thị thông báo và chuyển trang
      // console.log("Response from backend:", response);
      Alert.alert("Thông báo", response.data.message, [
        { text: "OK", onPress: () => router.push("auth/sign-in") },
      ]);
  
      setLoading(false);
    } 
    catch (error) {
      setLoading(false);
      const errorMessage = error.response ? error.response.data.message : "Đã có lỗi xảy ra";
      Alert.alert("Lỗi", errorMessage);
    }
  };
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Xác thực OTP</Text>

      <View style={styles.formGroup}>
        <Text>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Nhập email của bạn"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.formGroup}>
        <Text>Mã OTP:</Text>
        <TextInput
          style={styles.input}
          value={otp}
          onChangeText={setOtp}
          placeholder="Nhập mã OTP"
          keyboardType="numeric"
        />
      </View>

      <Button
        title={loading ? "Đang xác thực..." : "Xác thực OTP"}
        onPress={handleOtpSubmit}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 5,
  },
});

export default OtpVerification;
