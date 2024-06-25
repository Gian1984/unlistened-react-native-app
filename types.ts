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