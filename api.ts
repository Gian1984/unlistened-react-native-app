// api.ts
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Localization from 'expo-localization';
import { Podcast, Episode, FeedInfo } from './types';

const baseUrl = 'http://localhost';

const apiClient = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

const getPreferredLanguage = () => {
    return Localization.locale;
};

export const detectDeviceLanguage = async (): Promise<void> => {
    try {
        const language = getPreferredLanguage();
        await apiClient.get('/sanctum/csrf-cookie');
        await apiClient.post('/api/detect-language', {
            language: language,
        });
    } catch (error) {
        console.error('Error updating device language:', error);
        throw error;
    }
};

export const login = async (email: string, password: string) => {
    try {
        // Request CSRF cookie
        await apiClient.get('/sanctum/csrf-cookie');

        // Send login request
        const response = await apiClient.post('/api/login', { email, password });

        // If successful, return user data
        if (response.status === 200) {
            return response.data.user;
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const fetchPodcasts = async (): Promise<Podcast[]> => {
    try {
        const response = await apiClient.get<{ feeds: Podcast[] }>('/api/index'); // Adjust the response type
        return response.data.feeds; // Adjust to match the response structure
    } catch (error) {
        console.error('Error fetching podcasts:', error);
        throw error;
    }
};

export const searchPodcasts = async (title: string): Promise<Podcast[]> => {
    try {
        const response = await apiClient.get<{ feeds: Podcast[] }>(`/api/search-feed-by-title/${title}`);
        return response.data.feeds;
    } catch (error) {
        console.error('Error searching podcasts:', error);
        throw error;
    }
};

export const fetchFeedInfo = async (feedId: number): Promise<FeedInfo> =>  {
    try {
        await apiClient.get('/sanctum/csrf-cookie');
        const response = await apiClient.get(`/api/feed_info/${feedId}`);
        return response.data.feed;
    } catch (error) {
        console.error('Error fetching episodes:', error);
        throw error;
    }
};


export const fetchEpisodes = async (feedId: number): Promise<Episode[]> => {
    try {
        await apiClient.get('/sanctum/csrf-cookie');
        const response = await apiClient.get(`/api/search_feed/${feedId}`);
        return response.data.items;
    } catch (error) {
        console.error('Error fetching episodes:', error);
        throw error;
    }
};


export const addFavourite = async (feedId: number, feedTitle: string): Promise<void> => {
    await apiClient.post('api/add-favorite', { feed_id: feedId, title: feedTitle });
};

export const addBookmark = async (episodeId: number, episodeTitle: string): Promise<void> => {
    await apiClient.post('api/add-bookmark', { episode_id: episodeId, title: episodeTitle });
};


export const downloadPodcast = async (title: string, url: string, id: number): Promise<string> => {
    try {
        const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const downloadDir = `${FileSystem.cacheDirectory}downloads/`;

        // Check if the download directory exists, if not, create it
        const dirInfo = await FileSystem.getInfoAsync(downloadDir);
        if (!dirInfo.exists) {
            console.log(`Creating download directory at: ${downloadDir}`);
            await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });
        }

        const fileUri = `${downloadDir}${sanitizedTitle}.mp3`;
        console.log(`File will be saved to: ${fileUri}`);

        // Download the file
        const { uri } = await FileSystem.downloadAsync(url, fileUri);

        console.log('File downloaded successfully:', uri);
        return uri;
    } catch (error) {
        console.error('Error downloading episode:', error);
        throw error;
    }
};

const sendDownloadData = async (id: number, title: string): Promise<void> => {
    try {
        await apiClient.get('/sanctum/csrf-cookie');
        await apiClient.post('/api/add_download_click', {
            episode_id: id,
            episode_title: title,
        });
        console.log('Download data sent');
    } catch (error) {
        console.error('Error sending download data:', error);
        throw error;
    }
};

export const fetchCategories = async (): Promise<{ id: number, name: string }[]> => {
    try {
        const response = await apiClient.get<{ feeds: { id: number, name: string }[] }>('/api/feed-cat');
        return response.data.feeds;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const fetchPodcastsByCategory = async (categoryId: number): Promise<Podcast[]> => {
    try {
        const response = await apiClient.get<{ feeds: Podcast[] }>(`/api/search-feeds-by-cat/${categoryId}`);
        return response.data.feeds;
    } catch (error) {
        console.error('Error fetching podcasts by category:', error);
        throw error;
    }
};

export const playEpisode = (episode: any) => {
    // Your play logic here
};

export default apiClient;