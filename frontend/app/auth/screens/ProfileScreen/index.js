import { View, Text, ScrollView, StyleSheet, Image, Dimensions, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRouter } from 'expo-router';
import TabBar from '../TabBar';
import { Colors } from '../../../../constants/Colors';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_URL } from '../../../../config';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const router = useRouter();
    const alertLogout = () => {
      Alert.alert(
          "Đăng xuất",
          "Bạn có chắc chắn muốn đăng xuất?",
          [
              {
                  text: "Không",
                  style: "cancel"
              },
              {
                  text: "Có",
                  onPress: async () => {
                      await SecureStore.deleteItemAsync('accessToken');
                      router.push('/auth/signin-signout');
                      
                  }
              }
          ]
      );
  };

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
        
        const getUserInfo = async () => {
            const token = await SecureStore.getItemAsync('accessToken');
            if (token) {
                try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const decoded = JSON.parse(atob(base64));
                    
                    const email = decoded.email;
                    const nameBeforeAt = email.split('@')[0];
                    setUsername(nameBeforeAt);
                    
                    const userId = decoded.userId; 
                    const response = await axios.get(`${API_URL}/User/getUserById/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    
                    if (response.data && response.data.imageUrl) {
                        setImageUrl(response.data.imageUrl);
                    }
                } catch (error) {
                    console.error('Error fetching user info:', error);
                }
            }
        };
        
        getUserInfo();
    }, []);

    // Player data with user info
    const player = {
        name: username || "Your Name",
        position: "ST", // Changed to STAR for user profile
        rating: 101,
        nationality: "Viet Nam",
        club: "Manchester United",
        imageUrl: imageUrl || "https://via.placeholder.com/300",
        stats: {
            pace: 101,
            shooting: 101,
            passing: 101,
            dribbling: 101,
            defending: 101,
            physical: 101
        }
    };

    return (
        <View style={styles.containerWithTabs}>
            <ScrollView 
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Player Card Container */}
                <View style={styles.cardContainer}>
                    {/* Blue Background */}
                    <View style={styles.blueBackground} />
                    
                    {/* Player Image with circular mask */}
                    <View style={styles.playerImageContainer}>
                        <Image 
                            source={{ uri: player.imageUrl }} 
                            style={styles.playerImage}
                            resizeMode="cover"
                        />
                    </View>
                    
                    {/* Player Info */}
                    <View style={styles.playerInfoContainer}>
                        <View style={styles.ratingContainer}>
                            <Text style={styles.playerRating}>{player.rating}</Text>
                        </View>
                        
                        <View style={styles.namePositionContainer}>
                            <Text style={styles.playerName}>{player.name}</Text>
                            <Text style={styles.playerPosition}>{player.position}</Text>
                        </View>
                        
                        <View style={styles.clubNationalityContainer}>
                            <Text style={styles.playerClub}>{player.club}</Text>
                            <Text style={styles.playerNationality}>{player.nationality}</Text>
                        </View>
                    </View>
                    
                    {/* Stats Section */}
                    <View style={styles.statsContainer}>
                        {/* Row 1 */}
                        <View style={styles.statRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{player.stats.pace}</Text>
                                <Text style={styles.statLabel}>PAC</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{player.stats.shooting}</Text>
                                <Text style={styles.statLabel}>SHO</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{player.stats.passing}</Text>
                                <Text style={styles.statLabel}>PAS</Text>
                            </View>
                        </View>
                        
                        {/* Row 2 */}
                        <View style={styles.statRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{player.stats.dribbling}</Text>
                                <Text style={styles.statLabel}>DRI</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{player.stats.defending}</Text>
                                <Text style={styles.statLabel}>DEF</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{player.stats.physical}</Text>
                                <Text style={styles.statLabel}>PHY</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={{ padding: 20, alignItems: 'center' }}>
      <TouchableOpacity onPress={alertLogout}>
        <Text
          style={{
            color: '#f5d742',
            fontSize: 18,
            fontWeight: 'bold',
            backgroundColor: '#1a3e8c',
            paddingHorizontal: 30,
            paddingVertical: 10,
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          Đăng xuất
        </Text>
      </TouchableOpacity>
    </View>

            <TabBar />
        </View>
    )
}

const styles = StyleSheet.create({
    containerWithTabs: {
        flex: 1,
        backgroundColor: '#0d2b6b',
    },
    container: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 80, // Space for tab bar
    },
    cardContainer: {
        width: '100%',
        height: height * 0.8, // Take 80% of screen height
        backgroundColor: '#1a3e8c',
        borderRadius: 20,
        overflow: 'hidden',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    blueBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '40%',
        backgroundColor: '#0d2b6b',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    playerImageContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 5,
        borderColor: '#f5d742',
        backgroundColor: 'transparent',
        alignSelf: 'center',
        marginTop: 40,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    },
    playerImage: {
        width: '100%',
        height: '100%',
    },
    playerInfoContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    ratingContainer: {
        backgroundColor: '#f5d742',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    playerRating: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0d2b6b',
    },
    namePositionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    playerName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginRight: 10,
    },
    playerPosition: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0d2b6b',
        backgroundColor: '#f5d742',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 10,
    },
    clubNationalityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 30,
    },
    playerClub: {
        fontSize: 16,
        color: '#aaaaaa',
    },
    playerNationality: {
        fontSize: 16,
        color: '#aaaaaa',
    },
    statsContainer: {
        backgroundColor: '#0d2b6b',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f5d742',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 16,
        color: 'white',
    },
});


