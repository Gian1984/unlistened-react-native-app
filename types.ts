export interface Podcast {
    id: number;
    image: string;
    title: string;
    description: string;
    categories: string[];
    author: string;
    newestItemPublishTime: number;
    artwork: string;
}

export interface Episode {
    id: number;
    title: string;
    description: string;
    datePublishedPretty: string;
    enclosureUrl: string;
    downloadedUri?: string;
    feedImage: string;
    datePublished: number;
    feedId: number;
    feed_id:number;
}

export interface FeedInfo {
    id: number;
    title: string;
    description: string;
    image: string;
    datePublishedPretty: string;
    author:string;
    artwork:string;
    categories:string[];
    newestItemPublishTime:number;
}

export type IconName =
    | 'home'
    | 'home-outline'
    | 'mic'
    | 'mic-outline'
    | 'search'
    | 'search-outline'
    | 'star'
    | 'star-outline'
    | 'star-cog'
    | 'star-cog-outline'
    | 'bookmark'
    | 'bookmark-outline'
    | 'setting'
    | 'setting-outline'; // Add any other icons you are using



export type RootStackParamList = {
    index: { categoryId?: number };
    Home: undefined;
    Downloads: undefined;
    Favourites: undefined;
    Bookmarks: undefined;
    Episodes: { id: number };
    Player: { episode_id: number };
    About: undefined;
    Terms: undefined; // Ensure Terms is correctly defined
    Settings: undefined;
    Back: undefined;
    Sign: undefined;
    Login: { message?: string };
    Categories: undefined;
    ResetPassword: undefined;
    Register: undefined;
};
