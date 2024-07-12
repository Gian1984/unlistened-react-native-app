import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import EpisodesScreen from "@/app/screens/episodes";
import CategoriesScreen from "@/app/screens/categories";
import AboutScreen from "@/app/screens/about";
import TermsScreen from "@/app/screens/terms";
import PlayerScreen from "@/app/screens/player";
import LoginScreen from "@/app/screens/login";
import ResetPasswordScreen from "@/app/screens/reset";
import RegisterScreen from "@/app/screens/register";
import SignScreen from "@/app/screens/signup";
import DownloadsScreen from "@/app/(tabs)/downloads";
import { RootStackParamList } from '@/types';
import { ComponentProps } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SettingsScreen from "@/app/(tabs)/settings";
import ProfileScreen from "@/app/screens/profile"; // Add this import
import { Provider } from 'react-redux';
import store from '@/store/store';
import MiniPlayer from '@/components/MiniPlayer';
import { AudioProvider, useAudio } from '@/context/AudioContext';
import { DownloadProvider } from '@/context/DownloadContext';
import { AuthProvider } from '@/context/AuthContext';
import { detectDeviceLanguage } from '@/services/api';

const iconNames: Record<string, { focused: ComponentProps<typeof MaterialCommunityIcons>['name']; unfocused: ComponentProps<typeof MaterialCommunityIcons>['name'] }> = {
    downloads: { focused: 'download', unfocused: 'download-outline' },
    favourites: { focused: 'star', unfocused: 'star-outline' },
    bookmarks: { focused: 'bookmark', unfocused: 'bookmark-outline' },
    settings: { focused: 'cog', unfocused: 'cog-outline' },
    index: { focused: 'microphone', unfocused: 'microphone-outline' },
};

const Stack = createStackNavigator<RootStackParamList>();

function Back() {
    const colorScheme = useColorScheme();
    const { isMiniPlayerVisible, setIsTab } = useAudio();

    useFocusEffect(
        React.useCallback(() => {
            setIsTab(true);
            return () => setIsTab(false);
        }, [setIsTab])
    );

    useEffect(() => {
        detectDeviceLanguage(); // Detect device language on app mount
    }, []);

    return (
        <Tabs
            initialRouteName="index"
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
                        height: 100,
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                };
            }}
        >
            <Tabs.Screen
                name="index"
                options={{ title: 'Podcasts' }}
            />
            <Tabs.Screen
                name="downloads"
                options={{ title: 'Downloads' }}
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

function Episodes() {
    const { setIsTab } = useAudio();

    useFocusEffect(
        React.useCallback(() => {
            setIsTab(false);
        }, [setIsTab])
    );

    return <EpisodesScreen />;
}

function Categories() {
    const { setIsTab } = useAudio();

    useFocusEffect(
        React.useCallback(() => {
            setIsTab(false);
        }, [setIsTab])
    );

    return <CategoriesScreen />;
}

function Player() {
    const { setIsTab } = useAudio();

    useFocusEffect(
        React.useCallback(() => {
            setIsTab(false);
        }, [setIsTab])
    );

    return <PlayerScreen />;
}

function Downloads() {
    const { setIsTab } = useAudio();

    useFocusEffect(
        React.useCallback(() => {
            setIsTab(false);
        }, [setIsTab])
    );

    return <DownloadsScreen />;
}

function Settings() {
    const { setIsTab } = useAudio();

    useFocusEffect(
        React.useCallback(() => {
            setIsTab(false);
        }, [setIsTab])
    );

    return <SettingsScreen />;
}

function About() {
    const { setIsTab } = useAudio();

    useFocusEffect(
        React.useCallback(() => {
            setIsTab(false);
        }, [setIsTab])
    );

    return <AboutScreen />;
}

function Terms() {
    const { setIsTab } = useAudio();

    useFocusEffect(
        React.useCallback(() => {
            setIsTab(false);
        }, [setIsTab])
    );

    return <TermsScreen />;
}

function Login() {
    const { setIsTab } = useAudio();

    useFocusEffect(
        React.useCallback(() => {
            setIsTab(false);
        }, [setIsTab])
    );

    return <LoginScreen />;
}

function Sign() {
    const { setIsTab } = useAudio();

    useFocusEffect(
        React.useCallback(() => {
            setIsTab(false);
        }, [setIsTab])
    );

    return <SignScreen />;
}

function ResetPassword() {
    const { setIsTab } = useAudio();

    useFocusEffect(
        React.useCallback(() => {
            setIsTab(false);
        }, [setIsTab])
    );

    return <ResetPasswordScreen />;
}


function Register() {
    const { setIsTab } = useAudio();

    useFocusEffect(
        React.useCallback(() => {
            setIsTab(false);
        }, [setIsTab])
    );

    return <RegisterScreen />;
}

function Profile() { // Add the Profile function
    const { setIsTab } = useAudio();

    useFocusEffect(
        React.useCallback(() => {
            setIsTab(false);
        }, [setIsTab])
    );

    return <ProfileScreen />;
}

export default function App() {
    return (
        <Provider store={store}>
            <AuthProvider>
                <AudioProvider>
                    <DownloadProvider>
                        <View style={{ flex: 1 }}>
                            <Stack.Navigator>
                                <Stack.Screen
                                    name="Back"
                                    component={Back}
                                    options={{ headerShown: false }}
                                />
                                <Stack.Screen
                                    name="Downloads"
                                    component={Downloads}
                                    options={{ headerShown: false }}
                                />
                                <Stack.Screen
                                    name="Episodes"
                                    component={Episodes}
                                />
                                <Stack.Screen
                                    name="Player"
                                    component={Player}
                                />
                                <Stack.Screen
                                    name="Categories"
                                    component={Categories}
                                />
                                <Stack.Screen
                                    name="Settings"
                                    component={Settings}
                                    options={{ headerShown: false }}
                                />
                                <Stack.Screen
                                    name="About"
                                    component={About}
                                />
                                <Stack.Screen
                                    name="Terms"
                                    component={Terms}
                                />
                                <Stack.Screen
                                    name="Sign"
                                    component={Sign}
                                />
                                <Stack.Screen
                                    name="Login"
                                    component={Login}
                                />
                                <Stack.Screen
                                    name="ResetPassword"
                                    component={ResetPassword}
                                />
                                <Stack.Screen
                                    name="Register"
                                    component={Register}
                                    options={{ headerShown: true }}
                                />
                                <Stack.Screen // Add this new Stack.Screen for Profile
                                    name="Profile"
                                    component={Profile}
                                    options={{ headerShown: true, title: 'Profile' }}
                                />
                            </Stack.Navigator>
                            <MiniPlayer />
                        </View>
                    </DownloadProvider>
                </AudioProvider>
            </AuthProvider>
        </Provider>
    );
}













