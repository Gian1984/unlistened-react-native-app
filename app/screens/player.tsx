// src/app/(screens)/PlayerScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList, Episode } from '@/types';
import { ThemedView } from '@/components/ThemedView';
import { fetchEpisode } from '@/services/api';
import { useAudio } from '@/context/AudioContext';

type PlayerScreenRouteProp = RouteProp<RootStackParamList, 'Player'>;

const PlayerScreen: React.FC = () => {
    const route = useRoute<PlayerScreenRouteProp>();
    const { episode_id } = route.params;

    const { setEpisode, episode: currentEpisode } = useAudio();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadEpisode = async () => {
            try {
                const episodeData = await fetchEpisode(episode_id);
                await setEpisode(episodeData);
            } catch (error) {
                console.error('Error fetching episode:', error);
            } finally {
                setLoading(false);
            }
        };

        if (episode_id !== undefined) {
            loadEpisode();
        } else {
            console.error('Error: episode_id is undefined');
            setLoading(false);
        }
    }, [episode_id]);

    const stripHtmlTags = (str: string): string => {
        return str.replace(/<\/?[^>]+(>|$)/g, "");
    };

    if (loading) {
        return (
            <ThemedView className="bg-white h-full">
                <ThemedView className="flex-1 items-center justify-center bg-white p-4 py-4">
                    <ActivityIndicator size="large" color="#ec4899" />
                    <Text>Loading...</Text>
                </ThemedView>
            </ThemedView>
        );
    }

    if (!currentEpisode) {
        return (
            <ThemedView className="bg-white h-full">
                <ThemedView className="flex-1 items-center justify-center bg-white p-4 py-4">
                    <Text>Error loading episode.</Text>
                </ThemedView>
            </ThemedView>
        );
    }

    return (
        <ThemedView className="bg-white h-full">
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <ThemedView className="flex-1 items-center justify-center bg-white p-4 py-4">
                    <Text className="text-3xl font-bold text-gray-900" numberOfLines={3}>{currentEpisode.title}</Text>
                    <ThemedView className="aspect-square w-full my-6">
                        <Image
                            source={{ uri: currentEpisode.feedImage }}
                            className="aspect-square w-full rounded-2xl bg-gray-50"
                            onLoad={() => setLoading(false)}
                        />
                    </ThemedView>
                    <View style={styles.descriptionContainer}>
                        <Text className="text-sm leading-6 text-gray-600">{stripHtmlTags(currentEpisode.description)}</Text>
                    </View>
                </ThemedView>
            </ScrollView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    descriptionContainer: {
        marginTop: 20,
        marginBottom:100,
    },
});

export default PlayerScreen;


















