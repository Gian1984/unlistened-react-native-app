import { Image, StyleSheet, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';


interface Post {
    id: number;
    title: string;
    body: string;
}

export default function HomeScreen() {

    const [data, setData] = useState<Post[]>([]);

    useEffect(() => {
        // Fetch data from fake API
        axios.get('https://jsonplaceholder.typicode.com/posts')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);


  return (
      <SafeAreaView style={styles.safeArea}>
            <ParallaxScrollView
              headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
              headerImage={
                <Image
                  source={require('@/assets/images/unlistenedhead.jpeg')}
                  className="absolute w-full left-0 bottom-0 object-cover"
                />
              }>
                <ThemedView className="flex-row items-center gap-4">
                    <Image
                        source={require('@/assets/images/unlistened_transparen_logo_176.png')}
                        className="w-20 object-cover aspect-square"
                    />
                    <ThemedView>
                        <ThemedText className="text-base font-semibold leading-7 text-indigo-600">Introducing</ThemedText>
                        <ThemedText className="mt-2 text-4xl font-bold tracking-tight text-gray-900">Unlistened.me</ThemedText>
                    </ThemedView>
                </ThemedView>
              <ThemedView style={styles.stepContainer}>
                  <ThemedText className="mt-6 text-xl leading-6 text-gray-900">
                      Welcome to Unlistened.me, the simplest way to enjoy your favorite podcasts for free! I am committed to providing a user-friendly experience without tracking cookies or profiling our users. Enjoy unrestricted access to a world of stories, insights, and entertainment with complete privacy and zero cost.
                  </ThemedText>
                  <ThemedText className="mt-6 text-xl leading-6 text-gray-900">
                      Podcasts offer a unique avenue to culture, education, and enlightenment—accessible anywhere, anytime. Motivated by the power of podcasts to educate and inspire, I created this app to make these incredible resources freely available to everyone, with a strong commitment to privacy and simplicity.
                  </ThemedText>
              </ThemedView>
              <ThemedView style={styles.stepContainer}>
                  <ThemedView className="flex-row items-center gap-2 ">
                      <Ionicons name="checkmark-circle" size={24} style={{ color: '#4f46e5' }} />
                      <ThemedText className="font-semibold text-md text-gray-900">Completely Free.</ThemedText>
                  </ThemedView>
                <ThemedText>
                    Access a wide range of podcasts without any subscription fees or hidden costs. Our platform is designed to be open and accessible to all, fostering a community of learning and sharing.
                </ThemedText>
              </ThemedView>
                <ThemedView style={styles.stepContainer}>
                    <ThemedView className="flex-row items-center gap-2 ">
                        <Ionicons name="checkmark-circle" size={24} style={{ color: '#4f46e5' }} />
                        <ThemedText className="font-semibold text-md text-gray-900">No Cookies.</ThemedText>
                    </ThemedView>
                    <ThemedText>
                        I respect your privacy. My app operates without cookies, meaning your listening habits and personal data are never tracked or stored.
                    </ThemedText>
                </ThemedView>
                <ThemedView style={styles.stepContainer}>
                    <ThemedView className="flex-row items-center gap-2 ">
                        <Ionicons name="checkmark-circle" size={24} style={{ color: '#4f46e5' }} />
                        <ThemedText className="font-semibold text-md text-gray-900">No Profiling.</ThemedText>
                    </ThemedView>
                    <ThemedText>
                        Enjoy podcasts without the concern of being profiled. We believe in the pure joy of discovery and learning, free from algorithms or targeted advertising.</ThemedText>
                </ThemedView>
                <ThemedView style={styles.stepContainer}>
                    <ThemedView className="flex-row items-center gap-2 ">
                        <Ionicons name="checkmark-circle" size={24} style={{ color: '#4f46e5' }} />
                        <ThemedText className="font-semibold text-md text-gray-900">Privacy-Centric.</ThemedText>
                    </ThemedView>
                    <ThemedText>
                        Your privacy is paramount. With Unlistened.me, listen to your favorite podcasts with the assurance that your personal information stays private.</ThemedText>
                </ThemedView>
                <ThemedView style={styles.stepContainer}>
                    <ThemedView className="flex-row items-center gap-2 ">
                        <Ionicons name="checkmark-circle" size={24} style={{ color: '#4f46e5' }} />
                        <ThemedText className="font-semibold text-md text-gray-900">Sign Up / Log In.</ThemedText>
                    </ThemedView>
                    <ThemedText>
                        Required only to enable you to save your favorite episodes and manage your bookmarks seamlessly across devices.
                    </ThemedText>
                </ThemedView>
                <ThemedView style={styles.stepContainer}>
                    <ThemedText className="my-6 text-xl leading-6 text-gray-900">
                        Join me at Unlistened.me to explore, learn, and grow through the vast world of podcasts, completely free and with total privacy.
                    </ThemedText>
                </ThemedView>
                <ThemedView style={styles.stepContainer}>
                    <ThemedText className="text-xl font-bold text-indigo-600 mb-4">Fetched Data:</ThemedText>
                    {data.map(item => (
                        <ThemedView key={item.id} className="mb-4">
                            <ThemedText className="text-lg font-semibold text-gray-900">{item.title}</ThemedText>
                            <ThemedText className="text-base text-gray-700">{item.body}</ThemedText>
                        </ThemedView>
                    ))}
                </ThemedView>
            </ParallaxScrollView>
      </SafeAreaView>

  );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff', // Ensure the status bar area has a white background
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
});
