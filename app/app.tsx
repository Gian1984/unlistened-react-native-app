import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabLayout from '../app/(tabs)/_layout';
import EpisodesScreen from '../app/episodes';
import { RootStackParamList } from '@/types';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Root" component={TabLayout} />
                <Stack.Screen name="Episodes" component={EpisodesScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}


