// api.ts
import axios from 'axios';
import { Podcast, Episode, FeedInfo, FeedInfoResponse, EpisodesResponse } from './types';

axios.defaults.withCredentials = true;

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

export const fetchFeedInfo = async (feedId: number): Promise<FeedInfo> => {
    try {
        const response = await axios.get<FeedInfoResponse>(`api/feed_info/${feedId}`);
        return response.data.feed;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching episodes:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
};


export const fetchEpisodes = async (feedId: number): Promise<Episode[]> => {
    try {
        const response = await axios.get<EpisodesResponse>(`api/search_feed/${feedId}`);
        return response.data.items;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching episodes:', error.response?.data || error.message);
            throw new Error(error.response?.data.message || error.message);
        } else {
            console.error('Unexpected error:', error);
            throw new Error('Unexpected error occurred');
        }
    }
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

export const playEpisode = (episode: any) => {
    // Your play logic here
};

