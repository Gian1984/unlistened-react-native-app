import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { ThemedView } from '@/components/ThemedView';
import { login } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Back' | 'ResetPassword'>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { login: authLogin } = useAuth();
    const route = useRoute<LoginScreenRouteProp>();
    const message = route.params?.message;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!validateEmail(email)) {
            Alert.alert('Invalid email', 'Please enter a valid email address');
            return;
        }

        try {
            const deviceName = 'ReactNativeApp'; // You can dynamically get this value if needed
            const { user } = await login(email, password, deviceName);
            authLogin();
            navigation.navigate('Back'); // Navigate to the Back screen which contains the Tabs navigator
        } catch (error) {
            Alert.alert('Invalid credentials', 'Please check your email and password');
        }
    };

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleResetPassword = () => {
        navigation.navigate('ResetPassword'); // Navigate to the ResetPassword screen
    };

    return (
        <ThemedView className="bg-white h-full">
            <ThemedView className="flex-1 items-center justify-center bg-white p-4 py-4">
                <View className="flex-1 justify-center items-center">
                    <Image source={require('@/assets/images/unlistened_transparen_logo_176.png')} style={styles.logo} />
                    <Text className="text-3xl font-bold mb-6">Login</Text>
                    {message && <Text className="text-gray-900 mb-4">{message}</Text>}
                    <TextInput
                        className="w-80 h-12 border border-gray-300 rounded px-4 mb-4"
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
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
                    <TouchableOpacity className="mt-4" onPress={handleResetPassword}>
                        <Text className="text-indigo-700 text-center font-bold">Reset Password</Text>
                    </TouchableOpacity>
                </View>
            </ThemedView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    logo: {
        width: 176,
        marginBottom: 10,
    },
});

export default LoginScreen;







