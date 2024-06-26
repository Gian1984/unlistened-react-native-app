import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useDownload } from '@/context/DownloadContext';
import { useAudio } from '@/context/AudioContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Episode } from '@/types';
import { PlayIcon } from 'react-native-heroicons/outline';

const Downloads: React.FC = () => {
    const { downloadedEpisodes } = useDownload();
    const { setEpisode, togglePlayPause, isPlaying, isMiniPlayerVisible, setMiniPlayerVisible } = useAudio();

    const handlePlayEpisode = (episode: Episode) => {
        setEpisode(episode);
        if (!isPlaying) {
            togglePlayPause();
        }
        setMiniPlayerVisible(true);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text className="mt-2 text-4xl font-bold tracking-tight text-gray-900">Downloaded Episodes</Text>
                </View>
                {downloadedEpisodes.length === 0 ? (
                    <Text style={styles.noEpisodesText}>No downloaded episodes.</Text>
                ) : (
                    downloadedEpisodes.map((episode) => (
                        <View key={episode.id} style={styles.episodeContainer}>
                            <Text style={styles.episodeTitle}>{episode.title}</Text>
                            <Text style={styles.episodeDate}>{episode.datePublishedPretty}</Text>
                            <TouchableOpacity
                                style={styles.playButton}
                                onPress={() => handlePlayEpisode(episode)}
                            >
                                <PlayIcon className="h-5 w-5" color="white" />
                                <Text style={styles.playButtonText}>Play</Text>
                            </TouchableOpacity>
                        </View>
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
    episodeContainer: {
        marginBottom: 20,
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

export default Downloads;






