// src/context/AudioContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Audio } from 'expo-av';
import { Episode } from '@/types';

interface AudioContextProps {
    isPlaying: boolean;
    episode: Episode | null;
    togglePlayPause: () => void;
    setEpisode: (episode: Episode) => void;
    stop: () => void;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [episode, setEpisodeState] = useState<Episode | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    const togglePlayPause = async () => {
        if (sound) {
            if (isPlaying) {
                await sound.pauseAsync();
            } else {
                await sound.playAsync();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const setEpisode = async (newEpisode: Episode) => {
        if (sound) {
            await sound.unloadAsync();
        }

        const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: newEpisode.enclosureUrl },
            { shouldPlay: false }
        );

        setSound(newSound);
        setEpisodeState(newEpisode);
        setIsPlaying(false);
    };

    const stop = async () => {
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
            setSound(null);
            setEpisodeState(null);
            setIsPlaying(false);
        }
    };

    return (
        <AudioContext.Provider value={{ isPlaying, episode, togglePlayPause, setEpisode, stop }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};


