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
    Home: undefined;
    Downloads: undefined;
    Favourites: undefined;
    Bookmarks: undefined;
    Episodes: { id: number };
    Player: { episode: Episode };
    About: undefined;
    Terms: undefined;
    Settings: undefined;
    Back: undefined;
    Sign: undefined;
    Login: undefined;
};