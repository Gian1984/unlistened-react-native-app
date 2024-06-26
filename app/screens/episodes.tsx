import React from 'react';
import { View, Text } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/types';

type EpisodesScreenRouteProp = RouteProp<RootStackParamList, 'Episodes'>;

const EpisodesScreen: React.FC = () => {

    const route = useRoute<EpisodesScreenRouteProp>();
    const { id } = route.params;

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Episodes Screen</Text>
            <Text>Episode ID: {id}</Text>
        </View>
    );
};

export default EpisodesScreen;