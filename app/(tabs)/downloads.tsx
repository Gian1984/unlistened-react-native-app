// src/app/(tabs)/downloads.tsx
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Episode } from '@/types';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Episodes'>;

const downloadedEpisodes: Episode[] = [
    // Mock data, replace this with your actual downloaded episodes data
];

const DownloadsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    const handleBackToEpisodes = () => {
        navigation.navigate('Episodes', { id: 1 }); // Adjust this to navigate to the correct Episodes screen
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Downloaded Episodes</Text>
                <FlatList
                    data={downloadedEpisodes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.episodeContainer}>
                            <Text style={styles.episodeTitle}>{item.title}</Text>
                            <Text style={styles.episodeDescription}>{item.description}</Text>
                        </View>
                    )}
                />
                <TouchableOpacity style={styles.backButton} onPress={handleBackToEpisodes}>
                    <Text style={styles.backButtonText}>Back to Episodes</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    episodeContainer: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    episodeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    episodeDescription: {
        fontSize: 14,
        marginTop: 8,
    },
    backButton: {
        backgroundColor: '#4f46e5',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    backButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DownloadsScreen;
