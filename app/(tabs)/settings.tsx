import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
type NavigationProp = StackNavigationProp<RootStackParamList, 'About'>;
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRightIcon, UserIcon, InformationCircleIcon, DocumentTextIcon } from 'react-native-heroicons/outline';
import { ThemedView } from '@/components/ThemedView';
import {RootStackParamList} from "@/types"; // Ensure the correct import path

const SettingsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <SafeAreaView style={styles.safeArea}>
            <ThemedView className="flex-1 bg-white p-4">
                <Text className="text-3xl font-bold text-gray-900 mb-6">Settings</Text>

                <TouchableOpacity
                    className="flex-row items-center bg-gray-100 p-4 mb-2 rounded-lg"
                    //onPress={() => navigation.navigate('Profile')}
                >
                    <UserIcon className="h-6 w-6" color="#4f46e5"/>
                    <Text className="flex-1 ml-4 text-indigo-600 text-lg">Profile</Text>
                    <ChevronRightIcon className="h-6 w-6" color="#4f46e5"/>
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-row items-center bg-gray-100 p-4 mb-2 rounded-lg"
                    onPress={() => navigation.navigate('About')}
                >
                    <InformationCircleIcon className="h-6 w-6" color="#4f46e5"/>
                    <Text className="flex-1 ml-4 text-indigo-600 text-lg">About</Text>
                    <ChevronRightIcon className="h-6 w-6" color="#4f46e5"/>
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-row items-center bg-gray-100 p-4 mb-2 rounded-lg"
                    //onPress={() => navigation.navigate('TermsAndConditions')}
                >
                    <DocumentTextIcon className="h-6 w-6" color="#4f46e5"/>
                    <Text className="flex-1 ml-4 text-indigo-600 text-lg">Terms and Conditions</Text>
                    <ChevronRightIcon className="h-6 w-6" color="#4f46e5"/>
                </TouchableOpacity>
            </ThemedView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff', // Ensure the status bar area has a white background
    },
    flatListContent: {
        paddingVertical: 8,
        paddingHorizontal: 30,
    },
});

export default SettingsScreen;
