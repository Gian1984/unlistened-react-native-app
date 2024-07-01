// app/(tabs)/podcasts.tsx
import React, { useState, useEffect } from 'react';
import {Image, Text, TouchableOpacity, FlatList, StyleSheet, View, ActivityIndicator} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchPodcasts, searchPodcasts } from '@/api';
import { Podcast, RootStackParamList } from '@/types';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Episodes'>;

import SearchField from "@/components/SearchField";
import Logo from "@/components/Logo";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';


import { ArrowRightIcon } from "react-native-heroicons/solid";
import { StarIcon } from "react-native-heroicons/outline";



export default function PodcastsScreen() {
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [visibleCount, setVisibleCount] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const navigation = useNavigation<NavigationProp>();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setLoading(true);
        fetchPodcasts()
            .then(data => {
                setPodcasts(data);
                setError(null);
            })
            .catch(error => {
                console.error('Error fetching podcasts:', error);
                setError('Failed to load podcasts. Please try again later.');
            })
            .finally(() => {
                setLoading(false);
                setSearchPerformed(false);
            });
    };

    const loadMore = () => {
        const increment = 5;
        setVisibleCount(Math.min(visibleCount + increment, podcasts.length));
    };

    const stripHtmlTags = (str: string): string => {
        if (!str) return '';
        return str.replace(/<[^>]*>/g, '');
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

    const handleSearch = (query: string) => {
        setLoading(true);
        setSearchPerformed(true);
        searchPodcasts(query)
            .then(data => {
                setPodcasts(data);
                setError(null);
            })
            .catch(error => {
                console.error('Error searching podcasts:', error);
                setError('Failed to search podcasts. Please try again later.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleBackToAll = () => {
        fetchData();
    };

    const navigateToEpisodes = (id: number) => {
        navigation.navigate('Episodes', { id });
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ThemedView className="flex-1 items-center justify-center bg-white p-4 py-4">
                    <ThemedView className="py-6">
                        <Logo />
                    </ThemedView>
                    <Text className="mt-4 text-3xl font-bold text-gray-900">Welcome !</Text>
                    <Text className="my-4 text-base text-center text-gray-900">We're getting the latest updates to bring you the freshest episodes.</Text>
                    <ActivityIndicator size="large" color="#ec4899"/>
                </ThemedView>
            </SafeAreaView>
        );

    }

    return (
        <SafeAreaView style={styles.safeArea}>
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
                                <TouchableOpacity className="bg-indigo-700 py-3 mt-2 rounded-full flex" onPress={handleBackToAll}>
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
                                {item.categories && typeof item.categories === 'object' && Object.keys(item.categories).length > 0 ? (
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
                                        className="bg-pink-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 mx-1 rounded-full"
                                    >
                                        <StarIcon className="h-5 w-5" color="white" />
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
    )
}

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
