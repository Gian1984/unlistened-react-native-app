// src/components/MiniPlayer.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { useAudio } from '@/context/AudioContext';
import { PlayIcon, PauseIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types';

const MiniPlayer: React.FC = () => {
    const { isPlaying, episode, togglePlayPause, stop, position, duration, seekTo, isTab } = useAudio();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    if (!episode) {
        return null;
    }

    const openPlayer = () => {
        navigation.navigate('Player', { episode });
    };

    const getReadableTime = (millis: number) => {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds.length === 1 ? '0' : ''}${seconds}`;
    };

    return (
        <View style={[styles.container, isTab ? styles.tabContainer : styles.nonTabContainer]}>
            <TouchableOpacity style={styles.content} onPress={openPlayer}>
                <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={1}>
                        {episode.title}
                    </Text>
                    <Text style={styles.sourceText}>
                        {episode.downloadedUri ? 'Playing from downloads' : 'Streaming live'}
                    </Text>
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>{getReadableTime(position)}</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={duration}
                            value={position}
                            onValueChange={() => {}}
                            onSlidingComplete={seekTo}
                            minimumTrackTintColor="#ec4899"
                            maximumTrackTintColor="#d3d3d3"
                            thumbTintColor="#4f46e5"
                        />
                        <Text style={styles.timeText}>{getReadableTime(duration - position)}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={togglePlayPause} style={styles.button}>
                    {isPlaying ? (
                        <PauseIcon className="h-3 w-3" color="white" />
                    ) : (
                        <PlayIcon className="h-3 w-3" color="white" />
                    )}
                </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity onPress={stop} style={styles.closeButton}>
                <XMarkIcon className="h-3 w-3" color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
    },
    tabContainer: {
        bottom: 100,
    },
    nonTabContainer: {
        bottom: 0,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    textContainer: {
        flex: 1,
        paddingRight: 20,
    },
    title: {
        fontSize: 14,
        marginBottom: 5,
        color: '#4f46e5',
    },
    sourceText: {
        fontSize: 12,
        color: 'gray',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 12,
        color: '#4f46e5',
    },
    slider: {
        flex: 1,
        marginHorizontal: 5,
    },
    button: {
        backgroundColor: '#ec4899',
        borderRadius: 50,
        padding: 5,
    },
    closeButton: {
        marginLeft: 10,
        backgroundColor: '#ec4899',
        borderRadius: 50,
        padding: 5,
    },
});

export default MiniPlayer;









