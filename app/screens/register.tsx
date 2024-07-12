import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { ThemedView } from '@/components/ThemedView';
import { register } from '@/services/api';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Login' | 'Terms'>;

const RegisterScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [sending, setSending] = useState(false);
    const [errorsRegister, setErrorsRegister] = useState<string | null>(null);

    const handleRegister = async () => {
        setSending(true);
        setErrorsRegister(null);

        try {
            await register(username, email, password);
            setSending(false);
            navigation.navigate('Login', { message: 'Welcome!' });
        } catch (error: any) {
            setSending(false);
            setErrorsRegister(error.message);
            setTimeout(() => {
                setErrorsRegister(null);
                setEmail('');
                setPassword('');
            }, 10000);
        }
    };

    const handleNavigateToTerms = () => {
        navigation.navigate('Terms');
    };

    return (
        <ThemedView className="bg-white h-full">
            <ThemedView className="flex-1 items-center justify-center bg-white p-4 py-4">
                <View className="flex-1 justify-center items-center">
                    <Image source={require('@/assets/images/unlistened_transparen_logo_176.png')} style={styles.logo} />
                    <Text className="text-3xl font-bold mb-6">Register</Text>
                    <TextInput
                        className="w-80 h-12 border border-gray-300 rounded px-4 mb-4"
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
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
                    <Text className="text-gray-700 text-center">
                        By registering, you accept our Terms & Conditions.
                    </Text>
                    <TouchableOpacity className="mb-2 mt-2" onPress={handleNavigateToTerms}>
                        <Text className="text-indigo-700 text-center font-bold">Terms & Conditions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-indigo-700 py-3 mt-2 rounded-full w-80"
                        onPress={handleRegister}
                        disabled={sending}
                    >
                        <Text className="text-white text-center font-bold">
                            {sending ? 'Registering...' : 'Register'}
                        </Text>
                    </TouchableOpacity>
                    {errorsRegister && <Text className="text-red-500 mt-4">{errorsRegister}</Text>}
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

export default RegisterScreen;







