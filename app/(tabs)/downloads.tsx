import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Header from '@/components/Header';
import { ThemedView } from '@/components/ThemedView';
import { useDownload } from '@/context/DownloadContext';
import { useAudio } from '@/context/AudioContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Episode } from '@/types';
import { TrashIcon } from 'react-native-heroicons/outline'; // Import the TrashIcon
import { deleteDownloadedPodcast } from '@/services/api'; // Import the delete function
import { useNavigation } from '@react-navigation/native';

const Downloads: React.FC = () => {
    const { downloadedEpisodes, downloadEpisode, removeDownloadedEpisode } = useDownload();
    const { setEpisode, togglePlayPause, isPlaying, setMiniPlayerVisible } = useAudio();
    const navigation = useNavigation();

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

    const handleDeleteEpisode = async (episode: Episode) => {
        if (episode.downloadedUri) {
            await deleteDownloadedPodcast(episode.downloadedUri);
            removeDownloadedEpisode(episode.id); // Update the state to reflect the deletion
        }
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
                                <View style={styles.buttonContainer}>
                                    {episode.downloadedUri ? (
                                        <>
                                            <TouchableOpacity
                                                className="bg-indigo-700 py-3 mt-1 rounded-full flex"
                                                onPress={() => handlePlayEpisode(episode)}
                                            >
                                                <Text className="w-60 text-white text-center font-bold">Play</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                className="bg-red-600 py-2.5 px-4 rounded-full flex items-center justify-center ml-2"
                                                onPress={() => handleDeleteEpisode(episode)}
                                            >
                                                <TrashIcon className="h-5 w-5" color="white" />
                                            </TouchableOpacity>
                                        </>
                                    ) : (
                                        <TouchableOpacity
                                            className="bg-gray-700 py-3 mt-2 rounded-full flex"
                                            onPress={() => handleDownloadEpisode(episode)}
                                        >
                                            <Text className="text-white text-center font-bold">Download</Text>
                                        </TouchableOpacity>
                                    )}
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
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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









