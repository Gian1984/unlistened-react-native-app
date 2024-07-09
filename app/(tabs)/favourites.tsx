import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    ScrollView,
    Alert,
    StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ThemedView } from '@/components/ThemedView';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { fetchFavorites, removeFavorite } from '@/services/api';
import { RootStackParamList } from '@/types';
import { ArrowRightIcon, TrashIcon } from 'react-native-heroicons/outline';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;


const FavouritesScreen: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const navigation = useNavigation<NavigationProp>();
    const [favorites, setFavorites] = useState<{ id: number, title: string, feed_id: number }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoggedIn) {
            navigation.navigate('Login', { message: 'You need to be logged in to access this functionality.' });
        } else {
            const loadFavorites = async () => {
                try {
                    const favoritesData = await fetchFavorites();
                    setFavorites(favoritesData);
                } catch (err) {
                    setError('Error fetching favorites');
                } finally {
                    setLoading(false);
                }
            };
            loadFavorites();
        }
    }, [isLoggedIn, navigation]);

    const handleRemoveFavorite = async (feed_id: number) => {
        try {
            await removeFavorite(feed_id);
            setFavorites((prev) => prev.filter((favorite) => favorite.feed_id !== feed_id));
        } catch (error) {
            Alert.alert('Error', 'There was an error removing the favorite. Please try again later.');
        }
    };


    const handleNavigateToEpisodes = (feed_id: number) => {
        const numericFeedId = Number(feed_id); // Convert the feed_id to a number
        if (isNaN(numericFeedId)) {
            return;
        }
        navigation.navigate('Episodes', { id: numericFeedId });
    };


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

    if (loading) {
        return (
            <ThemedView className="flex-1 items-center justify-center bg-white p-4 py-4">
                <ActivityIndicator size="large" color="#ec4899" />
                <Text className="mt-4 text-3xl font-bold text-gray-900">Loading favorites...</Text>
            </ThemedView>
        );
    }

    if (error) {
        return (
            <ThemedView className="flex-1 justify-center items-center bg-white p-4 py-4">
                <Text style={{ color: 'red' }}>{error}</Text>
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
                {favorites.length === 0 ? (
                    <Text style={styles.noEpisodesText}>No downloaded episodes.</Text>
                ) : (
                    favorites.map((favorite) => (
                        <ThemedView key={favorite.id} className="py-6 border-b border-gray-300">
                            <View>
                                <Text style={styles.episodeTitle}>{favorite.title}</Text>
                                <View className="flex-row justify-between pt-4">
                                    <TouchableOpacity
                                        onPress={() => handleNavigateToEpisodes(favorite.feed_id)}
                                        className="bg-indigo-700 py-2 px-3 rounded-full flex items-center justify-end mr-2 w-3/4"
                                    >
                                        <ArrowRightIcon className="h-5 w-5" color="white" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleRemoveFavorite(favorite.feed_id)}
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

export default FavouritesScreen;




