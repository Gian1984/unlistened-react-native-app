import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '@/types';
import { ThemedView } from '@/components/ThemedView';
import { useAudio } from '@/context/AudioContext';

type PlayerScreenRouteProp = RouteProp<RootStackParamList, 'Player'>;

const PlayerScreen: React.FC = () => {
    const route = useRoute<PlayerScreenRouteProp>();
    const { episode } = route.params;
    const { setEpisode } = useAudio();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadEpisode = async () => {
            await setEpisode(episode);
            setLoading(false);
        };

        loadEpisode();
    }, [episode]);

    const stripHtmlTags = (str: string): string => {
        return str.replace(/<\/?[^>]+(>|$)/g, "");
    };

    if (loading) {
        return (
            <ThemedView className="bg-white min-h-screen">
                <ThemedView className="flex-1 items-center justify-center bg-white p-4 py-4">
                    <ActivityIndicator size="large" color="#ec4899" />
                    <Text>Loading...</Text>
                </ThemedView>
            </ThemedView>
        );
    }

    return (
        <ThemedView className="bg-white min-h-screen">
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <ThemedView className="flex-1 items-center justify-center bg-white p-4 py-4">
                    <Text className="text-3xl font-bold text-gray-900" numberOfLines={3}>{episode.title}</Text>
                    <ThemedView className="aspect-square w-full my-6">
                        <Image
                            source={{ uri: episode.feedImage }}
                            className="aspect-square w-full rounded-2xl bg-gray-50"
                            onLoad={() => setLoading(false)}
                        />
                    </ThemedView>
                    <View style={styles.descriptionContainer}>
                        <Text className="text-sm leading-6 text-gray-600">{stripHtmlTags(episode.description)}</Text>
                    </View>
                </ThemedView>
            </ScrollView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    descriptionContainer: {
        marginTop: 20,
        marginBottom:100,
    },
});

export default PlayerScreen;
















