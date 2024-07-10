import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as Localization from 'expo-localization';
import { getInfoAsync, makeDirectoryAsync, downloadAsync, cacheDirectory } from 'expo-file-system';
import { Podcast, Episode, FeedInfo } from '@/types';

const baseUrl = 'http://localhost';

const apiClient = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

apiClient.interceptors.request.use(async (config) => {
    try {
        const csrfToken = await SecureStore.getItemAsync('csrfToken');
        const sessionToken = await SecureStore.getItemAsync('sessionToken');

        if (csrfToken) {
            config.headers['X-XSRF-TOKEN'] = csrfToken;
        }
        if (sessionToken) {
            config.headers['Authorization'] = `Bearer ${sessionToken}`;
        }

    } catch (error) {
        console.error('Error in request interceptor:', error);
    }
    return config;
});


export const login = async (email: string, password: string, deviceName: string) => {
    try {
        const response = await apiClient.post('/api/login-mobile', { email, password, device_name: deviceName });

        if (response.status === 200) {
            const sessionToken = response.data.token;

            if (sessionToken) {
                await SecureStore.setItemAsync('sessionToken', sessionToken);
            }
            return response.data.user;
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};


export const logout = async (): Promise<void> => {
    try {

        await apiClient.post('/api/logout');
        await SecureStore.deleteItemAsync('csrfToken');
        await SecureStore.deleteItemAsync('sessionToken');
    } catch (error) {
        console.error('Error during logout:', error);
        throw error;
    }
};

const getPreferredLanguage = () => Localization.locale;

export const detectDeviceLanguage = async (): Promise<void> => {
    try {
        const language = getPreferredLanguage();
        await apiClient.post('/api/detect-language', { language });
    } catch (error) {
        console.error('Error updating device language:', error);
        throw error;
    }
};

export const fetchPodcasts = async (): Promise<Podcast[]> => {
    try {
        const response = await apiClient.get<{ feeds: Podcast[] }>('/api/index');
        return response.data.feeds;
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

export const fetchFeedInfo = async (feedId: number): Promise<FeedInfo> => {
    try {
        const response = await apiClient.get(`/api/feed_info/${feedId}`);
        return response.data.feed;
    } catch (error) {
        console.error('Error fetching feed info:', error);
        throw error;
    }
};

export const fetchEpisodes = async (feedId: number): Promise<Episode[]> => {
    try {
        const response = await apiClient.get(`/api/search_feed/${feedId}`);
        return response.data.items;
    } catch (error) {
        console.error('Error fetching episodes:', error);
        throw error;
    }
};


export const addFavourite = async (feedId: number, feedTitle: string): Promise<{ id: number; title: string; feed_id: number }[]> => {
    try {
        await apiClient.post('api/add-favorite', { feed_id: feedId, title: feedTitle });
        return await fetchFavorites();
    } catch (error) {
        console.error('Error adding favorite:', error);
        throw error;
    }
};

export const addBookmark = async (episodeId: number, episodeTitle: string): Promise<void> => {
    try {
        await apiClient.post('api/add-bookmark', { episode_id: episodeId, title: episodeTitle });
    } catch (error) {
        console.error('Error adding bookmark:', error);
        throw error;
    }
};

export const fetchFavorites = async (): Promise<{ id: number; title: string; feed_id:number }[]> => {
    try {
        const response = await apiClient.get('/api/user-favorites');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching favorites:');
        } else {
            console.error('Unexpected error fetching favorites:', error);
        }
        throw error;
    }
};

// Function to fetch bookmarks
export const fetchBookmarks = async (): Promise<{ id: number; title: string; episode_id: number }[]> => {
    try {
        const response = await apiClient.get('/api/user-bookmarks');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching bookmarks');
        } else {
            console.error('Unexpected error fetching bookmarks:', error);
        }
        throw error;
    }
};


export const removeFavorite = async (id: number): Promise<void> => {
    try {
        await apiClient.post('/api/delete-favorite', { feed_id: id });
    } catch (error) {
        console.error('Error removing favorite:', error);
        throw error;
    }
};

export const removeBookmark = async (id: number): Promise<void> => {
    try {
        await apiClient.post('/api/delete-bookmark', { episode_id: id });
    } catch (error) {
        console.error('Error removing favorite:', error);
        throw error;
    }
};

export const downloadPodcast = async (title: string, url: string, id: number): Promise<string> => {
    try {
        const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const downloadDir = `${cacheDirectory}downloads/`;

        const dirInfo = await getInfoAsync(downloadDir);
        if (!dirInfo.exists) {
            await makeDirectoryAsync(downloadDir, { intermediates: true });
        }

        const fileUri = `${downloadDir}${sanitizedTitle}.mp3`;
        const { uri } = await downloadAsync(url, fileUri);

        return uri;
    } catch (error) {
        console.error('Error downloading episode:', error);
        throw error;
    }
};

const sendDownloadData = async (id: number, title: string): Promise<void> => {
    try {
        await apiClient.post('/api/add_download_click', {
            episode_id: id,
            episode_title: title,
        });
    } catch (error) {
        console.error('Error sending download data:', error);
        throw error;
    }
};

export const fetchEpisode = async (episodeId: number): Promise<Episode> => {
    try {
        const response = await apiClient.get(`/api/search_episode/${episodeId}`);
        return response.data.episode;
    } catch (error) {
        console.error('Error fetching episode:', error);
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
















