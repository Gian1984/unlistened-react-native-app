import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Header from '@/components/Header';
import { ThemedView } from '@/components/ThemedView';
import { useDownload } from '@/context/DownloadContext';
import { useAudio } from '@/context/AudioContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Episode } from '@/types';

const Downloads: React.FC = () => {
    const { downloadedEpisodes, downloadEpisode } = useDownload();
    const { setEpisode, togglePlayPause, isPlaying, setMiniPlayerVisible } = useAudio();

    const handlePlayEpisode = (episode: Episode) => {
        setEpisode(episode);
        if (!isPlaying) {
            togglePlayPause();
        }
        setMiniPlayerVisible(true);
    };

    const handleDownloadEpisode = async (episode: Episode) => {
        await downloadEpisode(episode);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text className="mt-2 text-4xl font-bold tracking-tight text-gray-900">Downloaded Episodes</Text>
                </View>
                {downloadedEpisodes.length === 0 ? (
                    <Text style={styles.noEpisodesText}>No downloaded episodes.</Text>
                ) : (
                    downloadedEpisodes.map((episode) => (
                        <ThemedView key={episode.id} className="py-6 border-b border-gray-300">
                            <View>
                                <Text style={styles.episodeTitle}>{episode.title}</Text>
                                <Text style={styles.episodeDate}>{episode.datePublishedPretty}</Text>
                                {episode.downloadedUri ? (
                                    <TouchableOpacity
                                        className="bg-indigo-700 py-3 mt-2 rounded-full flex"
                                        onPress={() => handlePlayEpisode(episode)}
                                    >
                                        <Text className="text-white text-center font-bold">Play</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        className="bg-gray-700 py-3 mt-2 rounded-full flex"
                                        onPress={() => handleDownloadEpisode(episode)}
                                    >
                                        <Text className="text-white text-center font-bold">Download</Text>
                                    </TouchableOpacity>
                                )}
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

export default Downloads;








