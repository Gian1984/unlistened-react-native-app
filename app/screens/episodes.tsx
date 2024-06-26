// EpisodesScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { RootStackParamList, Episode } from '@/types';

type EpisodesScreenRouteProp = RouteProp<RootStackParamList, 'Episodes'>;

const baseUrl = 'http://localhost';

const EpisodesScreen: React.FC = () => {
    const route = useRoute<EpisodesScreenRouteProp>();
    const { id } = route.params;
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEpisodes = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/search_feed/${id}`);
                setEpisodes(response.data.items);
            } catch (error) {
                console.error('Error fetching episodes:', error);
                setError('Error fetching episodes');
            } finally {
                setLoading(false);
            }
        };

        (async () => {
            await fetchEpisodes();
        })();
    }, [id]);

    if (loading) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'red' }}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text>Episodes Screen</Text>
            <FlatList
                data={episodes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ padding: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.title}</Text>
                        <Text>{item.description}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default EpisodesScreen;

