import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { fetchCategories } from '@/services/api';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { ThemedView } from "@/components/ThemedView";
import Logo from "@/components/Logo";
import {Ionicons} from "@expo/vector-icons";

type CategoriesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Back'>;

const CategoriesScreen: React.FC = () => {
    const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<{ id: number, name: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const navigation = useNavigation<CategoriesScreenNavigationProp>();

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const categoriesData = await fetchCategories();
                setCategories(categoriesData);
                setFilteredCategories(categoriesData); // Initialize filteredCategories with all categories
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

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const filtered = categories.filter(category =>
            category.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCategories(filtered);
    };

    if (loading) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ThemedView style={styles.logoContainer}>
                    <Logo />
                </ThemedView>
                <Text style={styles.welcomeText}>Welcome!</Text>
                <Text style={styles.loadingText}>We're getting the latest updates to bring you the freshest categories.</Text>
                <ActivityIndicator size="large" color="#ec4899" />
            </ThemedView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Categories</Text>
                    <View style={styles.searchContainer}>
                        <TouchableOpacity onPress={() => handleSearch(searchQuery)}>
                            <Ionicons name="search" size={24} color="gray" />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            placeholder="Search categories"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={() => handleSearch(searchQuery)}
                        />
                    </View>
                </View>
                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
                {filteredCategories.length === 0 ? (
                    <Text style={styles.noCategoriesText}>No categories available.</Text>
                ) : (
                    filteredCategories.map((category) => (
                        <ThemedView key={category.id} style={styles.categoryContainer}>
                            <TouchableOpacity
                                style={styles.categoryButton}
                                onPress={() => handleCategoryPress(category.id)}
                            >
                                <Text style={styles.categoryButtonText}>{category.name}</Text>
                            </TouchableOpacity>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 4,
    },
    logoContainer: {
        paddingBottom: 24,
    },
    welcomeText: {
        marginTop: 16,
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 18,
        textAlign: 'center',
    },
    errorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
    },
    header: {
        marginBottom: 20,
    },
    headerText: {
        marginTop: 16,
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginVertical: 20,
    },
    input: {
        flex: 1,
        marginLeft: 10,
    },
    noCategoriesText: {
        marginTop: 16,
        fontSize: 18,
        textAlign: 'center',
    },
    categoryContainer: {
        paddingVertical: 8,
    },
    categoryButton: {
        backgroundColor: '#4f46e5',
        paddingVertical: 12,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
    },
    categoryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default CategoriesScreen;






