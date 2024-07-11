// src/components/Loading.tsx
import React from 'react';
import { Text, ActivityIndicator } from 'react-native';
import Logo from './Logo';
import { ThemedView } from './ThemedView';

interface LoadingProps {
    message: string;
}

const Loading: React.FC<LoadingProps> = ({ message }) => {
    return (
        <ThemedView>
            <ThemedView className="flex-1 items-center justify-center bg-white p-4 py-4">
                <ThemedView className="py-6">
                    <Logo />
                </ThemedView>
                <Text className="mt-4 text-3xl font-bold text-gray-900">Welcome!</Text>
                <Text className="my-4 text-base text-center text-gray-900">{message}</Text>
                <ActivityIndicator size="large" color="#ec4899" />
            </ThemedView>
        </ThemedView>
    );
};


export default Loading;
