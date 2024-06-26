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
    feedImage: string;
    datePublished: number;
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

export type RootStackParamList = {
    Home: undefined;
    Podcasts: undefined;
    Search: undefined;
    Favourites: undefined;
    Bookmarks: undefined;
    Episodes: { id: number };
    Player: { episode: Episode };
    About: undefined;
    Feed: undefined;
};