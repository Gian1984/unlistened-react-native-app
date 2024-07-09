// src/app/(tabs)/BookmarksScreen.tsx
import React, {useEffect, useState} from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
    StyleSheet,
    Image,
    Platform,
    Alert,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    SafeAreaView, ScrollView, View
} from 'react-native';
import Header from '@/components/Header';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types';
import Logo from "@/components/Logo";
import {fetchBookmarks, fetchFavorites} from "@/services/api";
import {ArrowRightIcon, TrashIcon} from "react-native-heroicons/outline";

type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const BookmarksScreen: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const navigation = useNavigation<NavigationProp>();
    const [bookmarks, setBookmarks] = useState<{ id: number, title: string, feed_id: number }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoggedIn) {
            navigation.navigate('Login', { message: 'You need to be logged in to access this functionality.' });
        } else {
            const loadBookmarks = async () => {
                try {
                    const bookmarksData = await fetchBookmarks();
                    setBookmarks(bookmarksData);
                } catch (err) {
                    setError('Error fetching favorites');
                } finally {
                    setLoading(false);
                }
            };
            loadBookmarks();
        }
    }, [isLoggedIn, navigation]);

    if (!isLoggedIn) {
        return (

                <ThemedView className="flex-1 items-center justify-center bg-white p-4 py-4">
                    <ThemedView className="py-6">
                        <Logo />
                    </ThemedView>
                    <Text className="mt-4 text-3xl font-bold text-gray-900">Sorry !</Text>
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

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text className="mt-2 text-4xl font-bold tracking-tight text-gray-900">Your Favorite Feeds</Text>
                </View>
                {bookmarks.length === 0 ? (
                    <Text style={styles.noEpisodesText}>No downloaded episodes.</Text>
                ) : (
                    bookmarks.map((bookmark) => (
                        <ThemedView key={bookmark.id} className="py-6 border-b border-gray-300">
                            <View>
                                <Text style={styles.episodeTitle}>{bookmark.title}</Text>
                                <View className="flex-row justify-between pt-4">
                                    <TouchableOpacity
                                        className="bg-indigo-700 py-2 px-3 rounded-full flex items-center justify-end mr-2 w-3/4"
                                    >
                                        <ArrowRightIcon className="h-5 w-5" color="white" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
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
    episodeDate: {
        marginBottom: 10,
        fontSize: 14,
        color: 'gray',
    },
    playButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ec4899',
        padding: 10,
        borderRadius: 5,
    },
    playButtonText: {
        marginLeft: 5,
        color: 'white',
        fontSize: 14,
    },
});

export default BookmarksScreen;

