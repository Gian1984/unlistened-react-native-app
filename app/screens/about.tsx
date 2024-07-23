import React from 'react';
import { Image, ScrollView, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const AboutScreen: React.FC = () => {
    const aboutContent = [
        {
            title: 'Completely Free.',
            description: 'Access a wide range of podcasts without any subscription fees or hidden costs. Our platform is designed to be open and accessible to all, fostering a community of learning and sharing.',
        },
        {
            title: 'No Cookies.',
            description: 'I respect your privacy. My app operates without cookies, meaning your listening habits and personal data are never tracked or stored.',
        },
        {
            title: 'No Profiling.',
            description: 'Enjoy podcasts without the concern of being profiled. We believe in the pure joy of discovery and learning, free from algorithms or targeted advertising.',
        },
        {
            title: 'Privacy-Centric.',
            description: 'Your privacy is paramount. With Unlistened.me, listen to your favorite podcasts with the assurance that your personal information stays private.',
        },
        {
            title: 'Sign Up / Log In.',
            description: 'Required only to enable you to save your favorite episodes and manage your bookmarks seamlessly across devices.',
        },
    ];

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <ThemedView className="flex-1 bg-white p-5">
                <Image
                    source={require('@/assets/images/unlistened_transparen_logo_176.png')}
                    className="w-20 object-cover aspect-square mx-auto"
                />
                <ThemedView className="flex-row items-center gap-4">
                    <ThemedView>
                        <ThemedText className="text-base font-semibold leading-7 text-indigo-600 text-center">Introducing</ThemedText>
                        <ThemedText className="mt-2 text-4xl font-bold tracking-tight text-gray-900 text-center">Unlistened.me</ThemedText>
                        <Text className="mt-12 font-semibold text-gray-900 text-center">
                            Welcome to Unlistened.me, the simplest way to enjoy your favorite podcasts for free! I am committed to providing a user-friendly experience without tracking cookies or profiling our users. Enjoy unrestricted access to a world of stories, insights, and entertainment with complete privacy and zero cost.
                        </Text>
                        <Text className="mt-2 font-semibold text-gray-900 text-center">
                            Podcasts offer a unique avenue to culture, education, and enlightenment—accessible anywhere, anytime. Motivated by the power of podcasts to educate and inspire, I created this app to make these incredible resources freely available to everyone, with a strong commitment to privacy and simplicity.
                        </Text>
                    </ThemedView>
                </ThemedView>
                <ThemedView className="mt-12">
                    {aboutContent.map((item) => (
                        <ThemedView key={item.title} style={styles.termContainer}>
                            <ThemedView className="flex-row items-center gap-2">
                                <Ionicons name="checkmark-circle" size={24} style={{ color: '#4f46e5' }} />
                                <ThemedText className="font-semibold text-md text-gray-900">{item.title}</ThemedText>
                            </ThemedView>
                            <ThemedText className="mt-2 text-base text-gray-900">{item.description}</ThemedText>
                        </ThemedView>
                    ))}
                </ThemedView>
                <ThemedText className="my-6 text-xl leading-6 text-gray-900 text-center">
                    Join me at Unlistened.me to explore, learn, and grow through the vast world of podcasts, completely free and with total privacy.
                </ThemedText>
            </ThemedView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    termContainer: {
        marginBottom: 16,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
    },
});

export default AboutScreen;
