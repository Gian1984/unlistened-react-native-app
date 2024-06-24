import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, FlatList, ActivityIndicator, Button, StyleSheet, View } from 'react-native';
import { ArrowRightIcon } from "react-native-heroicons/solid";
import { StarIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '@/components/Logo';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const fakePodcasts = [
    {
        id: 1,
        image: 'https://via.placeholder.com/150',
        title: 'Sample Podcast Episode 1',
        description: 'This is a description for the first sample podcast episode.',
        categories: ['Technology', 'Education'],
        author: 'John Doe',
        newestItemPublishTime: 1627889180,
        artwork: 'https://via.placeholder.com/50'
    },
    {
        id: 2,
        image: 'https://via.placeholder.com/150',
        title: 'Sample Podcast Episode 2',
        description: 'This is a description for the second sample podcast episode.',
        categories: ['Business', 'Entrepreneurship'],
        author: 'Jane Doe',
        newestItemPublishTime: 1627889180,
        artwork: 'https://via.placeholder.com/50'
    },
    {
        id: 3,
        image: 'https://via.placeholder.com/150',
        title: 'Sample Podcast Episode 2',
        description: 'This is a description for the second sample podcast episode.',
        categories: ['Business', 'Entrepreneurship'],
        author: 'Jane Doe',
        newestItemPublishTime: 1627889180,
        artwork: 'https://via.placeholder.com/50'
    },
    {
        id: 4,
        image: 'https://via.placeholder.com/150',
        title: 'Sample Podcast Episode 2',
        description: 'This is a description for the second sample podcast episode.',
        categories: ['Business', 'Entrepreneurship'],
        author: 'Jane Doe',
        newestItemPublishTime: 1627889180,
        artwork: 'https://via.placeholder.com/50'
    },
    {
        id: 5,
        image: 'https://via.placeholder.com/150',
        title: 'Sample Podcast Episode 2',
        description: 'This is a description for the second sample podcast episode.',
        categories: ['Business', 'Entrepreneurship'],
        author: 'Jane Doe',
        newestItemPublishTime: 1627889180,
        artwork: 'https://via.placeholder.com/50'
    },
    {
        id: 6,
        image: 'https://via.placeholder.com/150',
        title: 'Sample Podcast Episode 2',
        description: 'This is a description for the second sample podcast episode.',
        categories: ['Business', 'Entrepreneurship'],
        author: 'Jane Doe',
        newestItemPublishTime: 1627889180,
        artwork: 'https://via.placeholder.com/50'
    }
];

export default function PodcastsScreen() {
    const [visibleCount, setVisibleCount] = useState(5);
    const [loading, setLoading] = useState(false);

    const loadMore = () => {
        const increment = 5;
        setVisibleCount(Math.min(visibleCount + increment, fakePodcasts.length));
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



    return (
        <SafeAreaView style={styles.safeArea}>
            {loading ? (
                <ThemedView className="flex-1 justify-center items-center">
                    <Logo />
                    <ThemedText className="mt-4 text-3xl font-bold text-gray-900">Hang tight!</ThemedText>
                    <ThemedText className="mt-2 text-base text-gray-900">
                        We're getting the latest updates to bring you the freshest podcast
                    </ThemedText>
                </ThemedView>
            ) : (
                <FlatList
                    data={fakePodcasts.slice(0, visibleCount)}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.flatListContent}
                    ListHeaderComponent={() => (
                        <View>
                            <ThemedView className="py-12">
                                <Logo />
                                <ThemedText className="mt-3 text-base font-semibold text-indigo-600">Welcome!</ThemedText>
                                <ThemedText className="mt-2 text-4xl font-bold tracking-tight text-gray-900">Dive into the podcast world!</ThemedText>
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
                                {item.categories.map((category, index) => (
                                    <Text key={index} className="text-gray-600">
                                        {category}
                                    </Text>
                                ))}
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
                        visibleCount < fakePodcasts.length ? (
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


