import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from 'expo-router';
import TabBar from '../TabBar';
import { Colors } from '../../../../constants/Colors';
export default function FriendScreen() {
    const navigation = useNavigation();
    useEffect(()=>{
        navigation.setOptions({
            headerShown: false
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
          <Text>FriendScreen</Text>
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
      width: '100%',
      paddingTop: 40,
    },
});