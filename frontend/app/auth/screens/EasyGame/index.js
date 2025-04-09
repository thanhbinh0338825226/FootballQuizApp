import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation, useRouter } from 'expo-router'
export default function EasyGame() {
    const navigation = useNavigation();
        useEffect(()=>{
            navigation.setOptions({
                headerShown: false
            })
        },[])
  return (
    <View>
      <Text>EasyGame</Text>
    </View>
  )
}