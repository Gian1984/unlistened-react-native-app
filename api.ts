// api.ts
import axios from 'axios';
import { Podcast } from './types';

const api = axios.create({
    baseURL: 'http://localhost/', // Replace with your API base URL
    timeout: 10000,
});

export const fetchPodcasts = async (): Promise<Podcast[]> => {
    try {
        const response = await api.get<{ feeds: Podcast[] }>('api/index'); // Adjust the response type
        return response.data.feeds; // Adjust to match the response structure
    } catch (error) {
        console.error('Error fetching podcasts:', error);
        throw error;
    }
};


export const searchPodcasts = async (title: string): Promise<Podcast[]> => {
    try {
        const response = await api.get<{ feeds: Podcast[] }>(`api/search-feed-by-title/${title}`);
        return response.data.feeds;
    } catch (error) {
        console.error('Error searching podcasts:', error);
        throw error;
    }
};

