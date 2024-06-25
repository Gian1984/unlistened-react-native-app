// api.ts
import axios from 'axios';
import { Podcast, Episode, FeedInfo } from './types';

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

export const fetchFeedInfo = async (podcastId: number): Promise<FeedInfo> => {
    const response = await api.get<FeedInfo>(`api/feed_info/${podcastId}`); // Replace with your feed info endpoint
    return response.data;
};

export const fetchEpisodes = async (podcastId: number): Promise<Episode[]> => {
    const response = await api.get<Episode[]>(`api/search_feed/${podcastId}`); // Replace with your episodes endpoint
    return response.data;
};

export const addFavourite = async (feedId: number, feedTitle: string): Promise<void> => {
    await api.post('api/add-favorite', { feed_id: feedId, title: feedTitle });
};

export const addBookmark = async (episodeId: number, episodeTitle: string): Promise<void> => {
    await api.post('api/add-bookmark', { episode_id: episodeId, title: episodeTitle });
};

export const downloadPodcast = async (title: string, url: string, id: number): Promise<void> => {
    // Your download logic here
    // You may need to use different logic to handle file downloads in React Native
};

