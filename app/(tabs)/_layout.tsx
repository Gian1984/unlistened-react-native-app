// app/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { createStackNavigator } from '@react-navigation/stack';
import EpisodesScreen from "@/app/screens/episodes";
import AboutScreen from "@/app/screens/about";
import { RootStackParamList } from '@/types';



type IconName =
    | 'home'
    | 'home-outline'
    | 'mic'
    | 'mic-outline'
    | 'search'
    | 'search-outline'
    | 'star'
    | 'star-outline'
    | 'bookmark'
    | 'bookmark-outline';

const iconNames: Record<string, { focused: IconName; unfocused: IconName }> = {
    index: { focused: 'home', unfocused: 'home-outline' },
    podcasts: { focused: 'mic', unfocused: 'mic-outline' },
    search: { focused: 'search', unfocused: 'search-outline' },
    favourites: { focused: 'star', unfocused: 'star-outline' },
    bookmarks: { focused: 'bookmark', unfocused: 'bookmark-outline' },
};


const Stack = createStackNavigator<RootStackParamList>();

function MainTabs() {
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
                name="index"
                options={{ title: 'Home' }}
            />
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
        </Tabs>
    );
}

export default function App() {
    return (

            <Stack.Navigator>
                <Stack.Screen
                    name="MainTabs"
                    component={MainTabs}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Episodes"
                    component={EpisodesScreen}
                />
                <Stack.Screen
                    name="About"
                    component={AboutScreen}
                />
            </Stack.Navigator>

    );
}






