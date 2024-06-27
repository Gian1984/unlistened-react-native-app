import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { createStackNavigator } from '@react-navigation/stack';
import EpisodesScreen from "@/app/screens/episodes";
import AboutScreen from "@/app/screens/about";
import PlayerScreen from "@/app/screens/player";
import { RootStackParamList } from '@/types';
import { ComponentProps } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SettingsScreen from "@/app/(tabs)/settings";

const iconNames: Record<string, { focused: ComponentProps<typeof MaterialCommunityIcons>['name']; unfocused: ComponentProps<typeof MaterialCommunityIcons>['name'] }> = {
    podcasts: { focused: 'microphone', unfocused: 'microphone-outline' },
    search: { focused: 'magnify', unfocused: 'magnify' },
    favourites: { focused: 'star-cog', unfocused: 'star-cog-outline' },
    bookmarks: { focused: 'bookmark', unfocused: 'bookmark-outline' },
    settings: { focused: 'cog', unfocused: 'cog-outline' },
};

const Stack = createStackNavigator<RootStackParamList>();

function Back() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={({ route }) => {
                const icons = iconNames[route.name] || { focused: 'home', unfocused: 'home-outline' };
                return {
                    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                    headerShown: false,
                    tabBarIcon: ({ focused }) => {
                        const iconName = focused ? icons.focused : icons.unfocused;
                        return (
                            <TabBarIcon
                                name={iconName}
                                className={focused ? 'text-indigo-600' : 'text-gray-900'}
                            />
                        );
                    },
                    tabBarLabel: ({ focused }) => (
                        <Text className={focused ? 'text-indigo-600' : 'text-gray-900'}>
                            {route.name.charAt(0).toUpperCase() + route.name.slice(1)}
                        </Text>
                    ),
                    tabBarStyle: {
                        borderTopWidth: 0,
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                };
            }}
        >
            <Tabs.Screen
                name="podcasts"
                options={{ title: 'Podcasts' }}
            />
            <Tabs.Screen
                name="search"
                options={{ title: 'Search' }}
            />
            <Tabs.Screen
                name="favourites"
                options={{ title: 'Favourites' }}
            />
            <Tabs.Screen
                name="bookmarks"
                options={{ title: 'Bookmarks' }}
            />
            <Tabs.Screen
                name="settings"
                options={{ title: 'Settings' }}
            />
        </Tabs>
    );
}

export default function App() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Back"
                component={Back}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Episodes"
                component={EpisodesScreen}
            />
            <Stack.Screen
                name="Player"
                component={PlayerScreen}
            />
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="About"
                component={AboutScreen}
            />
        </Stack.Navigator>
    );
}








