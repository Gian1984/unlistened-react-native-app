// src/context/DownloadContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { Episode } from '@/types';
import { downloadPodcast } from '@/services/api';

interface DownloadContextProps {
    downloadedEpisodes: Episode[];
    downloadEpisode: (episode: Episode) => Promise<void>;
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

    return (
        <DownloadContext.Provider value={{ downloadedEpisodes, downloadEpisode }}>
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







