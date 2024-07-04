import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, SafeAreaView } from 'react-native';
import { fetchCategories } from '@/api';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { ThemedView } from "@/components/ThemedView";
import Logo from "@/components/Logo";

type CategoriesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Back'>;

const CategoriesScreen: React.FC = () => {
    const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation<CategoriesScreenNavigationProp>();

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const categoriesData = await fetchCategories();
                setCategories(categoriesData);
                setLoading(false);
            } catch (err) {
                setError('Error fetching categories');
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    const handleCategoryPress = (categoryId: number) => {
        navigation.navigate('index', { categoryId });
    };

    if (loading) {
        return (
            <ThemedView className="flex-1 items-center justify-center bg-white p-4 py-4">
                <ThemedView className="py-6">
                    <Logo />
                </ThemedView>
                <Text className="mt-4 text-3xl font-bold text-gray-900">Welcome !</Text>
                <Text className="my-4 text-base text-center text-gray-900">We're getting the latest updates to bring you the freshest categories.</Text>
                <ActivityIndicator size="large" color="#ec4899"/>
            </ThemedView>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text className="mt-2 text-4xl font-bold tracking-tight text-start ml-0 text-gray-900">Categories</Text>
                </View>
                {categories.length === 0 ? (
                    <Text className="mt-2 text-4xl font-bold tracking-tight text-gray-900">No categories available.</Text>
                ) : (
                    categories.map((category) => (
                        <ThemedView key={category.id} className="py-1">
                            <View>
                                <TouchableOpacity
                                    className="bg-indigo-700 py-3 mt-2 rounded-full w-100"
                                    onPress={() => handleCategoryPress(category.id)}
                                >
                                    <Text className="text-white text-center font-bold">{category.name}</Text>
                                </TouchableOpacity>
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
        backgroundColor: '#ffffff',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        padding: 16,
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    header: {
        marginBottom: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 18,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
    },
});

export default CategoriesScreen;




