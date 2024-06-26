import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { fetchEpisodes, fetchFeedInfo, addFavourite, addBookmark, downloadPodcast } from '@/api';
import { RootStackParamList, Episode, FeedInfo } from '@/types';
import { CheckCircleIcon, XMarkIcon, PlayIcon, BookmarkIcon, ArrowDownTrayIcon } from 'react-native-heroicons/outline';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDownload } from '@/context/DownloadContext';

type EpisodesScreenRouteProp = RouteProp<RootStackParamList, 'Episodes'>;
type PlayerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Player'>;

const EpisodesScreen: React.FC = () => {
    const route = useRoute<EpisodesScreenRouteProp>();
    const navigation = useNavigation<PlayerScreenNavigationProp>();
    const { id } = route.params;
    const { addDownloadedEpisode } = useDownload();
    const [feedInfo, setFeedInfo] = useState<FeedInfo | null>(null);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState<number>(10);
    const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
    const [downloadingEpisodes, setDownloadingEpisodes] = useState<number[]>([]);
    const [downloadedEpisodes, setDownloadedEpisodes] = useState<number[]>([]);

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
        navigation.navigate('Player', { episode });
    };

    const handleDownloadEpisode = async (episode: Episode) => {
        setDownloadingEpisodes((prev) => [...prev, episode.id]);
        try {
            const fileUri = await downloadPodcast(episode.title, episode.enclosureUrl, episode.id);
            console.log('File downloaded successfully:', fileUri);
            addDownloadedEpisode(episode);
            setDownloadedEpisodes((prev) => [...prev, episode.id]);
        } catch (error) {
            console.error('Error downloading episode:', error);
        } finally {
            setDownloadingEpisodes((prev) => prev.filter((id) => id !== episode.id));
        }
    };

    if (loading) {
        return (
            <ThemedView className="bg-white h-full">
                <ThemedView className="flex-1 items-center justify-center bg-white p-4 py-4">
                    <ActivityIndicator size="large" color="#ec4899" />
                    <Text className="mt-4 text-3xl font-bold text-gray-900">Hang tight!</Text>
                    <Text className="mt-6 text-base text-center text-gray-900">We're getting the latest updates to bring you the freshest episodes.</Text>
                </ThemedView>
            </ThemedView>
        );
    }

    if (error) {
        return (
            <ThemedView className="bg-white h-full">
                <ThemedView className="flex-1 justify-center items-center mb-32">
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'red' }}>{error}</Text>
                    </View>
                </ThemedView>
            </ThemedView>
        );
    }

    return (
        <ScrollView className="bg-white">
            <ThemedView className="flex-1 justify-center items-center">
                <View className="mx-auto px-6 lg:px-8">
                    {feedInfo && !error && (
                        <View className="bg-white pb-24 pt-6">
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
                                    <TouchableOpacity className="bg-indigo-700 py-3 mt-5 rounded-full flex">
                                        <Text className="text-white text-center font-bold">Add to favourite</Text>
                                    </TouchableOpacity>
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
                                                        <TouchableOpacity onPress={() => handleDownloadEpisode(episode)}
                                                                          className="bg-pink-500 text-white font-bold py-2 px-4 mx-1 rounded-full">
                                                            {downloadingEpisodes.includes(episode.id) ? (
                                                                <ActivityIndicator size="small" color="white" />
                                                            ) : downloadedEpisodes.includes(episode.id) ? (
                                                                <CheckCircleIcon className="h-5 w-5" color="white" />
                                                            ) : (
                                                                <ArrowDownTrayIcon className="h-5 w-5" color="white" />
                                                            )}
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                    {visibleCount < episodes.length && (
                                        <TouchableOpacity
                                            className="bg-indigo-700 py-3 rounded-full flex mt-10 mb-10"
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
    );
};

const stripHtmlTags = (str: string): string => {
    if (!str) return '';
    return str.replace(/<[^>]*>/g, ''); // Regular expression to remove HTML tags
};

const styles = StyleSheet.create({

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


