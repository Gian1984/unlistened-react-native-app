import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Episode } from '@/types';

type DownloadContextType = {
    downloadedEpisodes: Episode[];
    addDownloadedEpisode: (episode: Episode) => void;
};

const DownloadContext = createContext<DownloadContextType | undefined>(undefined);

export const DownloadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [downloadedEpisodes, setDownloadedEpisodes] = useState<Episode[]>([]);

    const addDownloadedEpisode = (episode: Episode) => {
        setDownloadedEpisodes((prevEpisodes) => [...prevEpisodes, episode]);
    };

    return (
        <DownloadContext.Provider value={{ downloadedEpisodes, addDownloadedEpisode }}>
            {children}
        </DownloadContext.Provider>
    );
};

export const useDownload = (): DownloadContextType => {
    const context = useContext(DownloadContext);
    if (!context) {
        throw new Error('useDownload must be used within a DownloadProvider');
    }
    return context;
};


