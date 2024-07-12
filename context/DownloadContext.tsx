import React, { createContext, useContext, useState } from 'react';
import { Episode } from '@/types';
import { downloadPodcast, deleteDownloadedPodcast } from '@/services/api';

interface DownloadContextProps {
    downloadedEpisodes: Episode[];
    downloadEpisode: (episode: Episode) => Promise<void>;
    removeDownloadedEpisode: (episodeId: number) => void; // Add this line
}

const DownloadContext = createContext<DownloadContextProps | undefined>(undefined);

export const DownloadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [downloadedEpisodes, setDownloadedEpisodes] = useState<Episode[]>([]);

    const downloadEpisode = async (episode: Episode) => {
        try {
            const uri = await downloadPodcast(episode.title, episode.enclosureUrl, episode.id);
            const updatedEpisode = { ...episode, downloadedUri: uri };
            setDownloadedEpisodes((prev) => [...prev, updatedEpisode]);
        } catch (error) {
            console.error('Error downloading episode:', error);
        }
    };

    const removeDownloadedEpisode = (episodeId: number) => {
        setDownloadedEpisodes((prev) => prev.filter((episode) => episode.id !== episodeId));
    };

    return (
        <DownloadContext.Provider value={{ downloadedEpisodes, downloadEpisode, removeDownloadedEpisode }}>
            {children}
        </DownloadContext.Provider>
    );
};

export const useDownload = () => {
    const context = useContext(DownloadContext);
    if (context === undefined) {
        throw new Error('useDownload must be used within a DownloadProvider');
    }
    return context;
};








