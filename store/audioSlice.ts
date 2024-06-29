import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Episode } from '@/types';

interface AudioState {
    isPlaying: boolean;
    duration: number;
    position: number;
    episode: Episode | null;
}

const initialState: AudioState = {
    isPlaying: false,
    duration: 0,
    position: 0,
    episode: null,
};

const audioSlice = createSlice({
    name: 'audio',
    initialState,
    reducers: {
        setPlaying: (state, action: PayloadAction<boolean>) => {
            state.isPlaying = action.payload;
        },
        setDuration: (state, action: PayloadAction<number>) => {
            state.duration = action.payload;
        },
        setPosition: (state, action: PayloadAction<number>) => {
            state.position = action.payload;
        },
        setEpisode: (state, action: PayloadAction<Episode | null>) => {
            state.episode = action.payload;
        },
    },
});

export const { setPlaying, setDuration, setPosition, setEpisode } = audioSlice.actions;
export default audioSlice.reducer;





