// app/episodes.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type EpisodesScreenRouteProp = RouteProp<RootStackParamList, 'Episodes'>;

export default function EpisodesScreen() {
    const route = useRoute<EpisodesScreenRouteProp>();
    const { podcastId } = route.params;

    // Fetch and display episodes using the podcastId

    return (
        <View>
            <Text>Episodes for Podcast ID: {podcastId}</Text>
            {/* Render the episodes here */}
        </View>
    );
}