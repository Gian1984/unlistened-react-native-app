import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList, Episode } from '@/types';
import { ThemedView } from '@/components/ThemedView';
import { fetchEpisode } from '@/services/api';
import { useAudio } from '@/context/AudioContext';
import Logo from '@/components/Logo';

type PlayerScreenRouteProp = RouteProp<RootStackParamList, 'Player'>;

const PlayerScreen: React.FC = () => {
    const route = useRoute<PlayerScreenRouteProp>();
    const { episode_id } = route.params;

    const { setEpisode, episode: currentEpisode } = useAudio();
    const [loading, setLoading] = useState<boolean>(true);
    const [feedInfo, setFeedInfo] = useState<Episode | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadEpisode = async () => {
            try {
                const episodeData = await fetchEpisode(episode_id);
                await setEpisode(episodeData);
                setFeedInfo(episodeData); // Set feed info based on episode data
            } catch (error) {
                console.error('Error fetching episode:', error);
                setError('Error fetching episode');
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
                    <Text className="my-4 text-base text-center text-gray-900">Loading...</Text>
                </ThemedView>
            </ThemedView>
        );
    }

    if (error) {
        return (
            <ThemedView className="flex-1 items-center justify-center bg-white p-4 py-4">
                <ThemedView className="py-6">
                    <Logo />
                </ThemedView>
                <Text className="mt-4 text-3xl font-bold text-gray-900">It looks like you’re currently offline.</Text>
                <Text className="my-4 text-base text-center text-gray-900">Don't worry, you can still enjoy your favorite podcasts! Head over to your Downloads section to access your saved episodes and continue listening to your selection. Happy listening!</Text>
            </ThemedView>
        );
    }

    return (
        <ThemedView className="bg-white h-full">
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <ThemedView className="flex-1 items-center justify-center bg-white p-4 py-4">
                    {currentEpisode ? (
                        <>
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
                        </>
                    ) : (
                        feedInfo && (
                            <>
                                <Text className="text-3xl font-bold text-gray-900" numberOfLines={3}>{feedInfo.title}</Text>
                                <ThemedView className="aspect-square w-full my-6">
                                    <Image
                                        source={{ uri: feedInfo.feedImage }}
                                        className="aspect-square w-full rounded-2xl bg-gray-50"
                                        onLoad={() => setLoading(false)}
                                    />
                                </ThemedView>
                                <View style={styles.descriptionContainer}>
                                    <Text className="text-sm leading-6 text-gray-600">{stripHtmlTags(feedInfo.description)}</Text>
                                </View>
                            </>
                        )
                    )}
                </ThemedView>
            </ScrollView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    descriptionContainer: {
        marginTop: 20,
        marginBottom: 100,
    },
});

export default PlayerScreen;























