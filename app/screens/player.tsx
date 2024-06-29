// src/app/screens/player.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { RootStackParamList } from '@/types';
import { PlayIcon, PauseIcon } from 'react-native-heroicons/outline';
import { ThemedView } from '@/components/ThemedView';
import { useAudio } from '@/context/AudioContext';

type PlayerScreenRouteProp = RouteProp<RootStackParamList, 'Player'>;

const PlayerScreen: React.FC = () => {
    const route = useRoute<PlayerScreenRouteProp>();
    const { episode } = route.params;
    const { isPlaying, togglePlayPause, setEpisode } = useAudio();
    const [duration, setDuration] = useState<number>(0);
    const [position, setPosition] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadEpisode = async () => {
            await setEpisode(episode);
            setLoading(false);
        };

        loadEpisode();
    }, [episode]);

    const getReadableTime = (millis: number) => {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds.length === 1 ? '0' : ''}${seconds}`;
    };

    const onSliderValueChange = async (value: number) => {
        // Implement slider value change functionality
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ThemedView className="flex-1 items-center justify-center bg-white p-4 py-4">
                    <ActivityIndicator size="large" color="#ec4899" />
                    <Text>Loading...</Text>
                </ThemedView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ThemedView className="flex-1 items-center justify-center bg-white p-4 py-4">
                <Text className="text-3xl font-bold text-gray-900" numberOfLines={3}>{episode.title}</Text>
                <ThemedView className="aspect-square w-full my-6">
                    <Image
                        source={{ uri: episode.feedImage }}
                        className="aspect-square w-full rounded-2xl bg-gray-50"
                        onLoad={() => setLoading(false)}
                    />
                </ThemedView>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration}
                    value={position}
                    onValueChange={onSliderValueChange}
                    minimumTrackTintColor="#ec4899"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor="#4f46e5"
                />
                <View style={styles.timeContainer}>
                    <Text>{getReadableTime(position)}</Text>
                    <Text>{getReadableTime(duration)}</Text>
                </View>
                <TouchableOpacity
                    onPress={togglePlayPause}
                    className="bg-pink-500 font-bold py-2 px-4 rounded-full"
                >
                    {isPlaying ? (
                        <PauseIcon className="h-5 w-5" color="white" />
                    ) : (
                        <PlayIcon className="h-5 w-5" color="white" />
                    )}
                </TouchableOpacity>
            </ThemedView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff', // Ensure the status bar area has a white background
    },
    slider: {
        width: '100%',
        height: 40,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
    },
});

export default PlayerScreen;














