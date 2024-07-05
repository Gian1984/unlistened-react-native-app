import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import * as Localization from 'expo-localization';
import { Podcast, Episode, FeedInfo } from './types';

const baseUrl = 'http://localhost';

const apiClient = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

apiClient.interceptors.request.use(async (config) => {
    try {
        const csrfToken = await SecureStore.getItemAsync('csrfToken');
        const sessionToken = await SecureStore.getItemAsync('sessionToken');
        console.log('Retrieved CSRF Token for request:', csrfToken);
        console.log('Retrieved Session Token for request:', sessionToken);
        if (csrfToken) {
            config.headers['X-XSRF-TOKEN'] = csrfToken;
        }
        if (sessionToken) {
            config.headers['Authorization'] = `Bearer ${sessionToken}`;
        }
    } catch (error) {
        console.error('Error getting tokens:', error);
    }
    return config;
});

const ensureCsrfToken = async () => {
    try {
        const response = await apiClient.get('/sanctum/csrf-cookie');
        console.log('CSRF cookie response headers:', response.headers);
        const csrfToken = response.headers['x-xsrf-token'] || response.headers['x-csrf-token'];
        console.log('Ensured CSRF Token:', csrfToken);

        if (csrfToken) {
            await SecureStore.setItemAsync('csrfToken', csrfToken);
            console.log('Stored CSRF Token:', csrfToken);
        } else {
            const cookies = response.headers['set-cookie'] || [];
            const xsrfCookie = cookies.find((cookie: string) => cookie.startsWith('XSRF-TOKEN='));
            if (xsrfCookie) {
                const token = xsrfCookie.split(';')[0].split('=')[1];
                await SecureStore.setItemAsync('csrfToken', token);
                console.log('Stored CSRF Token from cookie:', token);
            } else {
                console.log('No CSRF token found in headers or cookies.');
            }
        }
    } catch (error) {
        console.error('Error ensuring CSRF token:', error);
    }
};

export const login = async (email: string, password: string) => {
    try {
        await ensureCsrfToken();

        const response = await apiClient.post('/api/login', { email, password });

        console.log('Login response:', response.data);

        if (response.status === 200) {
            const sessionToken = response.data.token.token;
            console.log('Session Token from login response:', sessionToken);

            if (sessionToken) {
                await SecureStore.setItemAsync('sessionToken', sessionToken);
                console.log('Stored Session Token after login:', sessionToken);
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

const getPreferredLanguage = () => Localization.locale;

export const detectDeviceLanguage = async (): Promise<void> => {
    try {
        const language = getPreferredLanguage();
        await ensureCsrfToken();
        await apiClient.post('/api/detect-language', { language });
    } catch (error) {
        console.error('Error updating device language:', error);
        throw error;
    }
};

export const logout = async (): Promise<void> => {
    try {
        await ensureCsrfToken();
        await apiClient.post('/api/logout');
        await SecureStore.deleteItemAsync('csrfToken');
        await SecureStore.deleteItemAsync('sessionToken');
        console.log('Deleted tokens after logout');
    } catch (error) {
        console.error('Error during logout:', error);
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
        await ensureCsrfToken();
        const response = await apiClient.get(`/api/feed_info/${feedId}`);
        return response.data.feed;
    } catch (error) {
        console.error('Error fetching episodes:', error);
        throw error;
    }
};

export const fetchEpisodes = async (feedId: number): Promise<Episode[]> => {
    try {
        await ensureCsrfToken();
        const response = await apiClient.get(`/api/search_feed/${feedId}`);
        return response.data.items;
    } catch (error) {
        console.error('Error fetching episodes:', error);
        throw error;
    }
};

export const addFavourite = async (feedId: number, feedTitle: string): Promise<void> => {
    try {
        await ensureCsrfToken();
        await apiClient.post('api/add-favorite', { feed_id: feedId, title: feedTitle });
    } catch (error) {
        console.error('Error adding favorite:', error);
        throw error;
    }
};

export const addBookmark = async (episodeId: number, episodeTitle: string): Promise<void> => {
    try {
        await ensureCsrfToken();
        await apiClient.post('api/add-bookmark', { episode_id: episodeId, title: episodeTitle });
    } catch (error) {
        console.error('Error adding bookmark:', error);
        throw error;
    }
};

export const fetchFavorites = async (): Promise<{ id: number, title: string }[]> => {
    try {
        await ensureCsrfToken(); // Ensure CSRF token is available

        const csrfToken = await SecureStore.getItemAsync('csrfToken');
        const sessionToken = await SecureStore.getItemAsync('sessionToken');
        console.log('CSRF Token before fetching favorites:', csrfToken);
        console.log('Session Token before fetching favorites:', sessionToken);

        const response = await apiClient.get('/api/user-favorites');
        console.log('Favorites response headers:', response.headers);
        console.log('Favorites response data:', response.data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching favorites:', error.response?.data, error.response?.status, error.response?.headers);
        } else {
            console.error('Unexpected error fetching favorites:', error);
        }
        throw error;
    }
};


export const removeFavorite = async (id: number): Promise<void> => {
    try {
        await ensureCsrfToken();
        await apiClient.post('/api/delete-favorite', { feed_id: id });
    } catch (error) {
        console.error('Error removing favorite:', error);
        throw error;
    }
};

export const downloadPodcast = async (title: string, url: string, id: number): Promise<string> => {
    try {
        const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const downloadDir = `${FileSystem.cacheDirectory}downloads/`;

        const dirInfo = await FileSystem.getInfoAsync(downloadDir);
        if (!dirInfo.exists) {
            console.log(`Creating download directory at: ${downloadDir}`);
            await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });
        }

        const fileUri = `${downloadDir}${sanitizedTitle}.mp3`;
        console.log(`File will be saved to: ${fileUri}`);

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
        await ensureCsrfToken();
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









