import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {RootStackParamList} from "@/types";
import { StackNavigationProp } from '@react-navigation/stack';
type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

import { ThemedView } from '@/components/ThemedView';

const LoginScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const handleLogin = () => {
        // Add your login logic here
        if (username === 'user' && password === 'password') {
            navigation.navigate('Home');
        } else {
            Alert.alert('Invalid credentials', 'Please check your username and password');
        }
    };


    return (
        <ThemedView className="bg-white h-full">
            <ThemedView className="flex-1 items-center justify-center bg-white p-4 py-4">
                <View className="flex-1 justify-center items-center">
                    <Image source={require('@/assets/images/unlistened_transparen_logo_176.png')} style={styles.logo} />
                    <Text className="text-3xl font-bold mb-6">Login</Text>
                    <TextInput
                        className="w-80 h-12 border border-gray-300 rounded px-4 mb-4"
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                    />
                    <TextInput
                        className="w-80 h-12 border border-gray-300 rounded px-4 mb-6"
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity className="bg-indigo-700 py-3 mt-2 rounded-full w-80" onPress={handleLogin}>
                        <Text className="text-white text-center font-bold">Login</Text>
                    </TouchableOpacity>
                </View>
            </ThemedView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    logo:{
        width:176,
        marginBottom: 10,
    }
});

export default LoginScreen;