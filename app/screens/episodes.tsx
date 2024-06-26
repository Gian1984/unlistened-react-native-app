import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { RouteProp, useRoute } from '@react-navigation/native';
import { fetchEpisodes, fetchFeedInfo, addFavourite, addBookmark, downloadPodcast } from '@/api'; // Ensure these functions are defined in your API
import { RootStackParamList, Episode, FeedInfo } from '@/types';
import { CheckCircleIcon, XMarkIcon, PlayIcon, BookmarkIcon, ArrowDownTrayIcon, StarIcon } from 'react-native-heroicons/outline';
import {ThemedText} from "@/components/ThemedText";

type EpisodesScreenRouteProp = RouteProp<RootStackParamList, 'Episodes'>;

const EpisodesScreen: React.FC = () => {
    const route = useRoute<EpisodesScreenRouteProp>();
    const { id } = route.params;
    const [feedInfo, setFeedInfo] = useState<FeedInfo | null>(null);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState<number>(10);
    const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
    const [showNotification, setShowNotification] = useState<boolean>(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const feedInfoData = await fetchFeedInfo(id);
                setFeedInfo(feedInfoData);
                const episodesData = await fetchEpisodes(id);
                setEpisodes(episodesData);
                setLoading(false);
            } catch (err) {
                setError('Error fetching data');
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const loadMore = () => {
        setVisibleCount(Math.min(visibleCount + 5, episodes.length));
    };

    const getReadableDate = (unixTimestamp: number): string => {
        const date = new Date(unixTimestamp * 1000);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handlePlayEpisode = (episode: Episode) => {
        setSelectedEpisode(episode);
        // Implement playEpisode logic
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ThemedView className="flex-1 justify-center items-center">
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="#4F46E5" />
                        <Text className="mt-4 text-3xl font-bold text-gray-900">Hang tight!</Text>
                        <Text className="mt-6 text-base text-gray-900">We're getting the latest updates to bring you the freshest podcast.</Text>
                    </View>
                </ThemedView>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ThemedView className="flex-1 justify-center items-center">
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'red' }}>{error}</Text>
                    </View>
                </ThemedView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView className="bg-white">
                <ThemedView className="flex-1 justify-center items-center">
                    <View className="mx-auto px-6 lg:px-8">
                        {showNotification && (
                            <View className="fixed z-10 inset-0 flex items-end px-4 py-6 pointer-events-none">
                                <View className="flex w-full flex-col items-center space-y-4 sm:items-end">
                                    <View className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 border-2 border-green-500">
                                        <View className="p-4">
                                            <View className="flex items-start">
                                                <CheckCircleIcon className="h-6 w-6 text-green-400" />
                                                <View className="ml-3 w-0 flex-1 pt-0.5">
                                                    <Text className="text-sm font-medium text-gray-900">Successfully added!</Text>
                                                </View>
                                                <TouchableOpacity onPress={() => setShowNotification(false)} className="ml-4 flex flex-shrink-0">
                                                    <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

                        {feedInfo && !error && (
                            <View className="bg-white pb-24">
                                <View className="mx-auto">
                                    <ThemedView className="pb-6 border-b">
                                        <Text className="mb-5 text-3xl font-bold text-gray-900">
                                            {feedInfo.title}
                                        </Text>
                                        <ThemedView className="aspect-square w-full mb-4">
                                            <Image
                                                source={{ uri: feedInfo.image }}
                                                className="aspect-square w-full rounded-2xl bg-gray-50"
                                            />
                                        </ThemedView>
                                        <ThemedView className="flex-row items-center w-full">
                                            <TouchableOpacity className="bg-indigo-600 py-3 px-6 mx-1 rounded-full flex">
                                                <Text className="text-white text-center font-bold">Add to favourite</Text>
                                            </TouchableOpacity>
                                        </ThemedView>
                                    </ThemedView>

                                    <View>
                                        <Text className="mt-8 text-3xl font-bold text-gray-900">Episodes</Text>
                                        {episodes.slice(0, visibleCount).map((episode) => (
                                            <View key={episode.id} className="py-6 border-b border-gray-900/5">
                                                <View>
                                                    <View>
                                                        <Text className="mt-3 text-gray-900 text-lg font-bold leading-6">{episode.title}</Text>
                                                        <Text className="mt-1 text-gray-500">{episode.datePublishedPretty}</Text>
                                                        <Text className="mt-5 text-sm leading-6 text-gray-600">{stripHtmlTags(episode.description)}</Text>
                                                    </View>
                                                    <View className="pt-6">
                                                        <View className="relative flex-row items-center gap-x-4">
                                                            <TouchableOpacity onPress={() => handlePlayEpisode(episode)}
                                                                              className="bg-pink-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 mx-1 rounded-full flex">
                                                                <PlayIcon className="h-5 w-5" color="white"/>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => addBookmark(episode.id, episode.title)}
                                                                              className="bg-pink-500 text-white font-bold py-2 px-4 mx-1 rounded-full">
                                                                <BookmarkIcon className="h-5 w-5" color="white"/>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => downloadPodcast(episode.title, episode.enclosureUrl, episode.id)}
                                                                              className="bg-pink-500 text-white font-bold py-2 px-4 mx-1 rounded-full">
                                                                <ArrowDownTrayIcon className="h-5 w-5" color="white" />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                        {visibleCount < episodes.length && (
                                            <TouchableOpacity
                                                className="bg-indigo-700 py-4 px-4 mx-1 rounded-full flex mt-10"
                                                onPress={loadMore}
                                            >
                                                <Text className="text-white text-center font-bold">Load More...</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                </ThemedView>
            </ScrollView>
        </SafeAreaView>
    );
};

const stripHtmlTags = (str: string): string => {
    if (!str) return '';
    return str.replace(/<[^>]*>/g, ''); // Regular expression to remove HTML tags
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff', // Ensure the status bar area has a white background
    },
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    flatListContent: {
        paddingVertical: 8,
        paddingHorizontal: 30,
    },
    itemContainer: {
        gap: 20,
        marginBottom: 8,
    },

    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});

export default EpisodesScreen;

