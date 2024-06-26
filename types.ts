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
}

export interface FeedInfo {
    id: number;
    title: string;
    description: string;
    image: string;
    datePublishedPretty: string;
}

export type FeedInfoResponse = {
    feed: FeedInfo;
};

export type EpisodesResponse = {
    items: Episode[];
};

export type RootStackParamList = {
    Home: undefined;
    Podcasts: undefined;
    Search: undefined;
    Favourites: undefined;
    Bookmarks: undefined;
    Episodes: { id: number };
    About: undefined;
    MainTabs: undefined;
};