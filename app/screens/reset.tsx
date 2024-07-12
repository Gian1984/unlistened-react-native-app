import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { resetPassword } from '@/services/api';

const ResetPasswordScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleResetPassword = async () => {
        if (!validateEmail(email)) {
            Alert.alert('Invalid email', 'Please enter a valid email address');
            return;
        }

        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const responseMessage = await resetPassword(email);
            setMessage(responseMessage);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView className="bg-white h-full">
            <ThemedView className="flex-1 items-center justify-center bg-white p-4 py-4">
                <View className="flex-1 justify-center items-center">
                    <Image source={require('@/assets/images/unlistened_transparen_logo_176.png')} style={styles.logo} />
                    <Text className="text-3xl font-bold mb-6">Reset Password</Text>
                    <TextInput
                        className="w-80 h-12 border border-gray-300 rounded px-4 mb-4"
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TouchableOpacity
                        className="bg-indigo-700 py-3 mt-2 rounded-full w-80"
                        onPress={handleResetPassword}
                        disabled={loading}
                    >
                        <Text className="text-white text-center font-bold">
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Text>
                    </TouchableOpacity>
                    {message && <Text className="text-green-500 mt-4">{message}</Text>}
                    {error && <Text className="text-red-500 mt-4">{error}</Text>}
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

export default ResetPasswordScreen;


