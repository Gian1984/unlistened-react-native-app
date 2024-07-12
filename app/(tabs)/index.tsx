import React, { useState, useEffect } from 'react';
import { Image, Text, TouchableOpacity, FlatList, StyleSheet, View, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchPodcasts, searchPodcasts, fetchPodcastsByCategory, addFavourite } from '@/services/api';
import { Podcast, RootStackParamList } from '@/types';
import { useAuth } from '@/context/AuthContext';

import SearchField from "@/components/SearchField";
import Loading from '@/components/Loading';
import Header from '@/components/Header';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ArrowRightIcon } from "react-native-heroicons/solid";
import { StarIcon } from "react-native-heroicons/outline";

type NavigationProp = StackNavigationProp<RootStackParamList, 'Episodes'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'index'>;

const PodcastsScreen: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [favorites, setFavorites] = useState<{ id: number; title: string; feed_id: number }[]>([]);
    const [visibleCount, setVisibleCount] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchPerformed, setSearchPerformed] = useState(false);

    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<HomeScreenRouteProp>();
    const categoryId = route.params?.categoryId;

    const fetchData = async () => {
        setLoading(true);
        const data = categoryId ? await fetchPodcastsByCategory(categoryId) : await fetchPodcasts();
        setPodcasts(data);
        setError(null);
        setLoading(false);
        setSearchPerformed(false);
    };

    useEffect(() => {
        fetchData();
    }, [categoryId]);


    const loadMore = () => setVisibleCount(prev => Math.min(prev + 5, podcasts.length));

    const stripHtmlTags = (str: string): string => str.replace(/<[^>]*>/g, '');

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

    const handleSearch = async (query: string) => {
        setLoading(true);
        setSearchPerformed(true);
        try {
            const data = await searchPodcasts(query);
            setPodcasts(data);
            setError(null);
        } catch (error) {
            console.error('Error searching podcasts:', error);
            setError('Failed to search podcasts. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddFavourite = async (feedId: number, feedTitle: string) => {
        if (!isLoggedIn) {
            Alert.alert('Login Required', 'You need to be logged in to add favorites.');
            return;
        }

        try {
            const updatedFavorites = await addFavourite(feedId, feedTitle);
            setFavorites(updatedFavorites);
            Alert.alert('Success', 'Podcast added to favorites');
        } catch (error) {
            console.error('Error adding favorite:', error);
            Alert.alert('Error', 'Failed to add podcast to favorites');
        }
    };

    const navigateToEpisodes = (id: number) => {
        navigation.navigate('Episodes', { id });
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Header />
                <Text><Loading message="We're getting the latest updates to bring you the freshest episodes." />;</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header />
            <FlatList
                className="bg-white pb-12"
                data={podcasts.slice(0, visibleCount)}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.flatListContent}
                ListHeaderComponent={() => (
                    <View>
                        <ThemedView className="pt-3 pb-1">
                            {searchPerformed ? (
                                <ThemedText className="mt-2 text-4xl font-bold tracking-tight text-gray-900">Result :</ThemedText>
                            ) : (
                                <ThemedText className="mt-2 text-4xl font-bold tracking-tight text-gray-900">Dive into the podcast world!</ThemedText>
                            )}
                        </ThemedView>
                        <ThemedView className="pt-3 pb-12">
                            <SearchField onSearch={handleSearch} />
                            {searchPerformed ? (
                                <TouchableOpacity className="bg-indigo-700 py-3 mt-2 rounded-full flex" onPress={fetchData}>
                                    <Text className="text-white text-center font-bold">Back to All Podcasts</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity className="bg-indigo-700 py-3 mt-2 rounded-full flex" onPress={fetchData}>
                                    <Text className="text-white text-center font-bold">Refresh list</Text>
                                </TouchableOpacity>
                            )}
                        </ThemedView>
                    </View>
                )}
                renderItem={({ item }) => (
                    <ThemedView className="pb-6">
                        <ThemedView className="aspect-square w-full mb-4">
                            <Image
                                source={{ uri: item.image }}
                                className="aspect-square w-full rounded-2xl bg-gray-50"
                            />
                        </ThemedView>
                        <ThemedView className="flex">
                            <Text className="text-xs text-gray-500">
                                {getReadableDate(item.newestItemPublishTime)}
                            </Text>
                            <Text className="mt-3 text-lg font-bold text-gray-900">
                                {item.title}
                            </Text>
                            <Text className="mt-5 text-sm text-gray-600">
                                {stripHtmlTags(item.description)}
                            </Text>
                            <Text className="mt-5 font-semibold text-gray-900">
                                Categories:
                            </Text>
                            <View>
                                {item.categories && Object.keys(item.categories).length > 0 ? (
                                    Object.entries(item.categories).map(([key, value]) => (
                                        <Text key={key} className="text-gray-600">
                                            {value}
                                        </Text>
                                    ))
                                ) : (
                                    <Text className="text-gray-600">No categories available</Text>
                                )}
                            </View>
                            <ThemedView className="flex border-b">
                                <ThemedView className="flex-row py-6">
                                    <TouchableOpacity
                                        className={`font-bold py-2 px-4 mx-1 rounded-full ${isLoggedIn ? 'bg-pink-500 hover:bg-indigo-700 text-white' : 'bg-gray-100 text-gray-400'}`}
                                        onPress={() => {
                                            if (isLoggedIn) {
                                                handleAddFavourite(item.id, item.title);
                                            } else {
                                                Alert.alert('Login Required', 'You need to be logged in to add favorites.');
                                            }
                                        }}
                                    >
                                        <StarIcon className="h-5 w-5" color={isLoggedIn ? 'white' : 'gray'} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className="bg-pink-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 mx-1 rounded-full"
                                        onPress={() => navigateToEpisodes(item.id)}
                                    >
                                        <ArrowRightIcon className="h-5 w-5" color="white" />
                                    </TouchableOpacity>
                                </ThemedView>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
                )}
                ListFooterComponent={() =>
                    visibleCount < podcasts.length ? (
                        <TouchableOpacity
                            className="bg-indigo-700 py-3 mt-2 rounded-full flex"
                            onPress={loadMore}
                        >
                            <Text className="text-white text-center font-bold">Load More...</Text>
                        </TouchableOpacity>
                    ) : null
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    flatListContent: {
        paddingVertical: 8,
        paddingHorizontal: 30,
    },
});

export default PodcastsScreen;




