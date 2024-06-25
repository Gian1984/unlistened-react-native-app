import React, { useState, useEffect } from 'react';
import { Image, Text, TouchableOpacity, FlatList, ActivityIndicator, Button, StyleSheet, View } from 'react-native';
import { ArrowRightIcon } from "react-native-heroicons/solid";
import { StarIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '@/components/Logo';
import SearchField from "@/components/SearchField";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { fetchPodcasts, searchPodcasts } from '@/api';
import { Podcast } from '@/types';


export default function PodcastsScreen() {

    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [visibleCount, setVisibleCount] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);



    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetchPodcasts()
            .then(data => setPodcasts(data))
            .catch(error => {
                console.error('Error fetching podcasts:', error);
                setError('Failed to load podcasts. Please try again later.');
            })
            .finally(() => setLoading(false));
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

    const handleSearch = async (query: string) => {
        setLoading(true);
        try {
            const data = await searchPodcasts(query);
            setPodcasts(data);
        } catch (error) {
            console.error('Error searching podcasts:', error);
            setError('Failed to search podcasts. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {loading ? (
                <ThemedView className="flex-1 justify-center items-center">
                    <Logo />
                    <ThemedText className="mt-4 text-3xl font-bold text-gray-900">Hang tight!</ThemedText>
                    <ThemedText className="mt-2 text-base text-gray-900 text-center">
                        We're getting the latest updates to bring you the freshest podcast
                    </ThemedText>
                </ThemedView>
            ) : (
                <FlatList
                    data={podcasts.slice(0, visibleCount)}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.flatListContent}
                    ListHeaderComponent={() => (
                        <View>
                            <ThemedView className="pt-12 pb-6">
                                <Logo />
                                <ThemedText className="mt-3 text-base font-semibold text-indigo-600">Welcome!</ThemedText>
                                <ThemedText className="mt-2 text-4xl font-bold tracking-tight text-gray-900">Dive into the podcast world!</ThemedText>
                            </ThemedView>
                            <ThemedView className="pt-6 pb-12">
                                <SearchField onSearch={handleSearch} />
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
                                <ThemedView className="flex border-b py-6">
                                    <ThemedView className="flex-row items-center gap-4">
                                        <Image
                                            source={{ uri: item.artwork }}
                                            className="h-10 w-10 rounded-full bg-gray-50"
                                        />
                                        <ThemedView className="text-sm">
                                            <ThemedText className="text-gray-600">Author:</ThemedText>
                                            <Text className="font-semibold text-gray-900">
                                                {item.author}
                                            </Text>
                                        </ThemedView>
                                        <ThemedView className="flex-row">
                                            <TouchableOpacity
                                                className="bg-pink-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 mx-1 rounded-full"
                                            >
                                                <StarIcon className="h-5 w-5" color="white" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                className="bg-pink-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 mx-1 rounded-full"
                                            >
                                                <ArrowRightIcon className="h-5 w-5" color="white" />
                                            </TouchableOpacity>
                                        </ThemedView>
                                    </ThemedView>
                                </ThemedView>
                            </ThemedView>
                        </ThemedView>
                    )}
                    ListFooterComponent={() =>
                        visibleCount < podcasts.length ? (
                            <TouchableOpacity
                                className="bg-indigo-700 py-4 px-4 mx-1 rounded-full flex"
                                onPress={loadMore}
                            >
                                <Text className="text-white text-center font-bold">Load More...</Text>
                            </TouchableOpacity>
                        ) : null
                    }
                />
            )}
        </SafeAreaView>
    );
}

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


