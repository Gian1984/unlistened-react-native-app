// src/context/AudioContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Audio } from 'expo-av';
import { Episode } from '@/types';

interface AudioContextProps {
    isPlaying: boolean;
    episode: Episode | null;
    position: number;
    duration: number;
    togglePlayPause: () => void;
    setEpisode: (episode: Episode) => void;
    stop: () => void;
    isMiniPlayerVisible: boolean;
    setMiniPlayerVisible: (visible: boolean) => void;
    seekTo: (position: number) => void;
    isTab: boolean;
    setIsTab: (isTab: boolean) => void;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [episode, setEpisodeState] = useState<Episode | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [position, setPosition] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [isMiniPlayerVisible, setMiniPlayerVisible] = useState<boolean>(false);
    const [isTab, setIsTab] = useState<boolean>(false);

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

        newSound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded) {
                setDuration(status.durationMillis || 0);
                setPosition(status.positionMillis || 0);
            }
        });

        setSound(newSound);
        setEpisodeState(newEpisode);
        setIsPlaying(false);
        setMiniPlayerVisible(true); // Show MiniPlayer when episode is set
    };

    const stop = async () => {
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
            setSound(null);
            setEpisodeState(null);
            setIsPlaying(false);
            setMiniPlayerVisible(false); // Hide MiniPlayer when stopped
        }
    };

    const seekTo = async (position: number) => {
        if (sound) {
            await sound.setPositionAsync(position);
        }
    };

    return (
        <AudioContext.Provider value={{ isPlaying, episode, position, duration, togglePlayPause, setEpisode, stop, isMiniPlayerVisible, setMiniPlayerVisible, seekTo, isTab, setIsTab }}>
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






