// src/components/MiniPlayer.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAudio } from '@/context/AudioContext';
import { PlayIcon, PauseIcon, XMarkIcon } from 'react-native-heroicons/outline'; // Import XIcon
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types'; // Import the type

const MiniPlayer: React.FC = () => {
    const { isPlaying, episode, togglePlayPause, stop } = useAudio();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Ensure correct typing

    if (!episode) {
        return null;
    }

    const openPlayer = () => {
        navigation.navigate('Player', { episode });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.content} onPress={openPlayer}>
                <Text style={styles.title}>{episode.title}</Text>
                <TouchableOpacity onPress={togglePlayPause} style={styles.button}>
                    {isPlaying ? (
                        <PauseIcon className="h-2 w-2" color="white" />
                    ) : (
                        <PlayIcon className="h-2 w-2" color="white" />
                    )}
                </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity onPress={stop} style={styles.closeButton}>
                <XMarkIcon className="h-2 w-2" color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        paddingTop:50,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },
    title: {
        fontSize: 16,
        color: '#4f46e5',
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





