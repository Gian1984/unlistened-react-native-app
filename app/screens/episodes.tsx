import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import Loading from '@/components/Loading';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { fetchEpisodes, fetchFeedInfo, addBookmark, addFavourite, downloadPodcast, sendDownloadData } from '@/services/api'; // Ensure sendDownloadData is imported
import { RootStackParamList, Episode, FeedInfo } from '@/types';
import { CheckCircleIcon, PlayIcon, BookmarkIcon, ArrowDownTrayIcon, StarIcon } from 'react-native-heroicons/outline';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDownload } from '@/context/DownloadContext';
import { useAuth } from '@/context/AuthContext';
import Logo from "@/components/Logo";


type EpisodesScreenRouteProp = RouteProp<RootStackParamList, 'Episodes'>;
type PlayerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Player'>;

const EpisodesScreen: React.FC = () => {
    const route = useRoute<EpisodesScreenRouteProp>();
    const navigation = useNavigation<PlayerScreenNavigationProp>();
    const { id } = route.params;
    const { downloadedEpisodes, downloadEpisode } = useDownload();
    const { isLoggedIn } = useAuth();
    const [feedInfo, setFeedInfo] = useState<FeedInfo | null>(null);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState<number>(10);
    const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
    const [downloadingEpisodes, setDownloadingEpisodes] = useState<number[]>([]);

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
        navigation.navigate('Player', { episode_id: episode.id });
    };

    const handleDownloadEpisode = async (episode: Episode) => {
        setDownloadingEpisodes((prev) => [...prev, episode.id]);
        try {
            await downloadEpisode(episode);
            await sendDownloadData(episode.id, episode.title); // Call sendDownloadData after downloading the episode
            setDownloadingEpisodes((prev) => prev.filter((id) => id !== episode.id));
        } catch (error) {
            Alert.alert('Error', 'Error downloading episode. Please try later');
        }
    };

    const handleAddFavourite = async (feedId: number, feedTitle: string) => {
        try {
            await addFavourite(feedId, feedTitle);
            Alert.alert('Success', 'Favourite added to favorites');
        } catch (error) {
            Alert.alert('Error', 'Error adding to favorites. Please try later');
        }
    };

    const handleAddBookmark = async (episodeId: number, episodeTitle: string) => {
        try {
            await addBookmark(episodeId, episodeTitle);
            Alert.alert('Success', 'Bookmark added to bookmarks');
        } catch (error) {
            Alert.alert('Error', 'Error adding to bookmarks. Please try later');
        }
    };

    const handleGoDownload = () => {
        navigation.navigate('Downloads')
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Text><Loading message="We're getting the latest updates to bring you the freshest episodes." />;</Text>
            </SafeAreaView>
        )
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
                                    <TouchableOpacity
                                        className={`py-3 mt-5 rounded-full ${isLoggedIn ? 'bg-indigo-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                                        onPress={() => {
                                            if (isLoggedIn) {
                                                handleAddFavourite(id, feedInfo.title)
                                            } else {
                                                Alert.alert('Login Required', 'You need to be logged in to add favorites.');
                                            }
                                        }}
                                    >
                                        <Text className={`text-center font-bold ${isLoggedIn ? 'text-white' : 'text-gray-900'}`}>{isLoggedIn ? 'Add to favourite' : 'Login to add favourite'}</Text>
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
                                                        <TouchableOpacity
                                                            className={`font-bold py-2 px-4 mx-1 rounded-full ${isLoggedIn ? 'bg-pink-500 hover:bg-indigo-700 text-white' : 'bg-gray-100 text-gray-400'}`}
                                                            onPress={() => {
                                                                if (isLoggedIn) {
                                                                    handleAddBookmark(episode.id, episode.title)
                                                                } else {
                                                                    Alert.alert('Login Required', 'You need to be logged in to add favorites.');
                                                                }
                                                            }}
                                                        >
                                                            <BookmarkIcon className="h-5 w-5" color={isLoggedIn ? 'white' : 'gray'} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => handleDownloadEpisode(episode)}
                                                                          className="bg-pink-500 text-white font-bold py-2 px-4 mx-1 rounded-full">
                                                            {downloadingEpisodes.includes(episode.id) ? (
                                                                <ActivityIndicator size="small" color="white" />
                                                            ) : downloadedEpisodes.find(ep => ep.id === episode.id) ? (
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
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
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
