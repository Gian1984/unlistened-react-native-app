import React, { useCallback, useState } from 'react';
import {
    StyleSheet,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    View,
    Alert
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types';
import { fetchBookmarks, removeBookmark } from '@/services/api';
import { ArrowRightIcon, TrashIcon } from 'react-native-heroicons/outline';
import { useAuth } from '@/context/AuthContext';
import { ThemedView } from '@/components/ThemedView';
import Logo from '@/components/Logo';
import Header from '@/components/Header';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'| 'index'>;

const BookmarksScreen: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const navigation = useNavigation<NavigationProp>();
    const [bookmarks, setBookmarks] = useState<{ id: number; title: string; episode_id: number }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadBookmarks = async () => {
        try {
            const bookmarksData = await fetchBookmarks();
            setBookmarks(bookmarksData);
        } catch (err) {
            setError('Error fetching bookmarks');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (isLoggedIn) {
                setLoading(true);
                loadBookmarks();
            } else {
                Alert.alert(
                    'Login Required',
                    'You need to be logged in to access this functionality.',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => navigation.navigate('index', { categoryId: undefined }),
                            style: 'cancel'
                        },
                        {
                            text: 'Login',
                            onPress: () => navigation.navigate('Login', { message: 'You need to be logged in to access this functionality.' })
                        }
                    ]
                );
            }
        }, [isLoggedIn, navigation])
    );

    const handleRemoveBookmark = async (episode_id: number) => {
        try {
            await removeBookmark(episode_id);
            setBookmarks((prev) => prev.filter((bookmark) => bookmark.episode_id !== episode_id));
        } catch (error) {
            Alert.alert('Error', 'There was an error removing the bookmark. Please try again later.');
        }
    };

    const handleNavigateToEpisode = (episode_id: number) => {
        const numericFeedId = Number(episode_id); // Convert the feed_id to a number
        if (isNaN(numericFeedId)) {
            return;
        }
        navigation.navigate('Player', { episode_id: numericFeedId });
    };

    if (!isLoggedIn) {
        return (
            <ThemedView className="flex-1 items-center justify-center bg-white p-4 py-4">
                <ThemedView className="py-6">
                    <Logo />
                </ThemedView>
                <Text className="mt-4 text-3xl font-bold text-gray-900">Sorry!</Text>
                <Text className="my-4 text-base text-center text-gray-900">You need to be logged in to access this functionality</Text>
                <TouchableOpacity
                    className="bg-indigo-700 py-3 mt-2 rounded-full flex w-80"
                    onPress={() => navigation.navigate('Login', { message: 'You need to be logged in to access this functionality.' })}
                >
                    <Text className="text-white text-center font-bold">Login</Text>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    if (loading) {
        return (
            <ThemedView className="flex-1 items-center justify-center bg-white p-4 py-4">
                <ActivityIndicator size="large" color="#ec4899" />
                <Text className="mt-4 text-3xl font-bold text-gray-900">Loading bookmarks...</Text>
            </ThemedView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Header />
                <ThemedView className="flex-1 items-center justify-center bg-white p-4 py-4">
                    <ThemedView className="py-6">
                        <Logo />
                    </ThemedView>
                    <Text className="mt-4 text-3xl font-bold text-gray-900">It looks like you’re currently offline.</Text>
                    <Text className="my-4 text-base text-center text-gray-900">Don't worry, you can still enjoy your favorite podcasts! Head over to your Downloads section to access your saved episodes and continue listening to your selection. Happy listening!</Text>
                </ThemedView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text className="mt-2 text-4xl font-bold tracking-tight text-gray-900">Your Bookmarks</Text>
                </View>
                {bookmarks.length === 0 ? (
                    <Text style={styles.noEpisodesText}>No bookmarks found.</Text>
                ) : (
                    bookmarks.map((bookmark) => (
                        <ThemedView key={bookmark.id} className="py-6 border-b border-gray-300">
                            <View>
                                <Text style={styles.episodeTitle}>{bookmark.title}</Text>
                                <View className="flex-row justify-between pt-4">
                                    <TouchableOpacity
                                        onPress={() => handleNavigateToEpisode(bookmark.episode_id)}
                                        className="bg-indigo-700 py-2 px-3 rounded-full flex items-center justify-end mr-2 w-3/4"
                                    >
                                        <ArrowRightIcon className="h-5 w-5" color="white" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleRemoveBookmark(bookmark.episode_id)}
                                        className="bg-red-600 py-2 px-3 rounded-full flex items-center justify-center"
                                    >
                                        <TrashIcon className="h-5 w-5" color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ThemedView>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff', // Ensure the status bar area has a white background
    },
    container: {
        padding: 20,
    },
    header: {
        marginBottom: 20,
    },
    noEpisodesText: {
        fontSize: 16,
    },
    episodeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
});

export default BookmarksScreen;





