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

export type RootStackParamList = {
    Root: undefined;
    Episodes: { podcastId: number };
};