import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ThemedView } from '@/components/ThemedView';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { fetchFavorites, removeFavorite } from '@/api';
import { RootStackParamList } from '@/types';
import { ArrowRightIcon, TrashIcon } from 'react-native-heroicons/outline';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const FavouritesScreen: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const navigation = useNavigation<NavigationProp>();
    const [favorites, setFavorites] = useState<{ id: number, title: string }[]>([]);
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

    const handleRemoveFavorite = async (id: number) => {
        try {
            await removeFavorite(id);
            setFavorites((prev) => prev.filter((favorite) => favorite.id !== id));
        } catch (error) {
            Alert.alert('Error', 'There was an error removing the favorite. Please try again later.');
        }
    };

    const handleNavigateToEpisodes = (id: number) => {
        navigation.navigate('Episodes', { id });
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
        <ScrollView className="bg-white">
            <ThemedView className="flex-1 justify-center items-center">
                <View className="mx-auto px-6 lg:px-8">
                    <View className="bg-white pb-24 pt-6">
                        <View className="mx-auto">
                            <Text className="text-3xl font-bold tracking-tight text-gray-900">Your Favorite Feeds</Text>
                            {favorites.length === 0 ? (
                                <Text className="mt-6 text-lg text-center text-gray-900">
                                    It looks like you haven't added any favorites yet. Start exploring and add some!
                                </Text>
                            ) : (
                                favorites.map((favorite) => (
                                    <View key={favorite.id} className="py-4 flex-row justify-between items-center border-b border-gray-300">
                                        <Text className="text-lg font-semibold text-gray-900">{favorite.title}</Text>
                                        <View className="flex-row">
                                            <TouchableOpacity
                                                onPress={() => handleNavigateToEpisodes(favorite.id)}
                                                className="bg-indigo-700 py-2 px-3 rounded-full flex items-center justify-center mr-2"
                                            >
                                                <ArrowRightIcon className="h-5 w-5 text-white" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => handleRemoveFavorite(favorite.id)}
                                                className="bg-red-600 py-2 px-3 rounded-full flex items-center justify-center"
                                            >
                                                <TrashIcon className="h-5 w-5 text-white" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            )}
                        </View>
                    </View>
                </View>
            </ThemedView>
        </ScrollView>
    );
};

export default FavouritesScreen;



