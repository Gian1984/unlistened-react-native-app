import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ThemedView } from '@/components/ThemedView';
import { fetchUserInfo, updateUser, sendMessage, deleteAccount } from '@/services/api';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { User } from '@/types';

const languages = {
    'af': 'Afrikaans',
    'sq': 'Albanian',
    'eu': 'Basque',
    'be': 'Belarusian',
    'bg': 'Bulgarian',
    'ca': 'Catalan',
    'zh-cn': 'Chinese (Simplified)',
    'zh-tw': 'Chinese (Traditional)',
    'hr': 'Croatian',
    'cs': 'Czech',
    'da': 'Danish',
    'nl': 'Dutch',
    'nl-be': 'Dutch (Belgium)',
    'nl-nl': 'Dutch (Netherlands)',
    'en': 'English',
    'en-au': 'English (Australia)',
    'en-bz': 'English (Belize)',
    'en-ca': 'English (Canada)',
    'en-ie': 'English (Ireland)',
    'en-jm': 'English (Jamaica)',
    'en-nz': 'English (New Zealand)',
    'en-ph': 'English (Philippines)',
    'en-za': 'English (South Africa)',
    'en-tt': 'English (Trinidad)',
    'en-gb': 'English (United Kingdom)',
    'en-us': 'English (United States)',
    'en-zw': 'English (Zimbabwe)',
    'et': 'Estonian',
    'fo': 'Faeroese',
    'fi': 'Finnish',
    'fr': 'French',
    'fr-be': 'French (Belgium)',
    'fr-ca': 'French (Canada)',
    'fr-fr': 'French (France)',
    'fr-lu': 'French (Luxembourg)',
    'fr-mc': 'French (Monaco)',
    'fr-ch': 'French (Switzerland)',
    'gl': 'Galician',
    'gd': 'Gaelic',
    'de': 'German',
    'de-at': 'German (Austria)',
    'de-de': 'German (Germany)',
    'de-li': 'German (Liechtenstein)',
    'de-lu': 'German (Luxembourg)',
    'de-ch': 'German (Switzerland)',
    'el': 'Greek',
    'haw': 'Hawaiian',
    'hu': 'Hungarian',
    'is': 'Icelandic',
    'in': 'Indonesian',
    'ga': 'Irish',
    'it': 'Italian',
    'it-it': 'Italian (Italy)',
    'it-ch': 'Italian (Switzerland)',
    'ja': 'Japanese',
    'ko': 'Korean',
    'mk': 'Macedonian',
    'no': 'Norwegian',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'pt-br': 'Portuguese (Brazil)',
    'pt-pt': 'Portuguese (Portugal)',
    'ro': 'Romanian',
    'ro-mo': 'Romanian (Moldova)',
    'ro-ro': 'Romanian (Romania)',
    'ru': 'Russian',
    'ru-mo': 'Russian (Moldova)',
    'ru-ru': 'Russian (Russia)',
    'sr': 'Serbian',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'es': 'Spanish',
    'es-ar': 'Spanish (Argentina)',
    'es-bo': 'Spanish (Bolivia)',
    'es-cl': 'Spanish (Chile)',
    'es-co': 'Spanish (Colombia)',
    'es-cr': 'Spanish (Costa Rica)',
    'es-do': 'Spanish (Dominican Republic)',
    'es-ec': 'Spanish (Ecuador)',
    'es-sv': 'Spanish (El Salvador)',
    'es-gt': 'Spanish (Guatemala)',
    'es-hn': 'Spanish (Honduras)',
    'es-mx': 'Spanish (Mexico)',
    'es-ni': 'Spanish (Nicaragua)',
    'es-pa': 'Spanish (Panama)',
    'es-py': 'Spanish (Paraguay)',
    'es-pe': 'Spanish (Peru)',
    'es-pr': 'Spanish (Puerto Rico)',
    'es-es': 'Spanish (Spain)',
    'es-uy': 'Spanish (Uruguay)',
    'es-ve': 'Spanish (Venezuela)',
    'sv': 'Swedish',
    'sv-fi': 'Swedish (Finland)',
    'sv-se': 'Swedish (Sweden)',
    'tr': 'Turkish',
    'uk': 'Ukrainian',
};

const ProfileScreen: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [preferredLanguage, setPreferredLanguage] = useState('');
    const [object, setObject] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userInfo = await fetchUserInfo();
                setUser(userInfo);
                setUsername(userInfo.name);
                setEmail(userInfo.email);
                setPreferredLanguage(userInfo.preferred_language);
            } catch (error) {
                setMessage('Error fetching user information');
                setNotificationType('error');
                setTimeout(() => setMessage(null), 5000);
            }
        };

        fetchUserData();
    }, []);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await updateUser(username, email, preferredLanguage);
            setNotificationType('success');
            setMessage('Profile updated successfully');
        } catch (error) {
            setNotificationType('error');
            setMessage('Failed to update profile. Please try again later.');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    const handleSendMessage = async () => {
        setLoading(true);
        try {
            await sendMessage(object, description);
            setNotificationType('success');
            setMessage('Message sent successfully');
            setObject('');
            setDescription('');
        } catch (error) {
            setNotificationType('error');
            setMessage('Failed to send message. Please try again later.');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        if (user) {
                            setLoading(true);
                            try {
                                await deleteAccount(user.id);
                                // Navigate to SignIn screen or any other appropriate screen
                            } catch (error) {
                                setNotificationType('error');
                                setMessage('Failed to delete account. Please try again later.');
                            } finally {
                                setLoading(false);
                                setTimeout(() => setMessage(null), 5000);
                            }
                        }
                    },
                },
            ]
        );
    };

    return (
        <ThemedView className="flex-1 bg-white">
            {message && (
                <View style={[styles.notification, notificationType === 'success' ? styles.success : styles.error]}>
                    <Text style={styles.notificationText}>{message}</Text>
                    <TouchableOpacity onPress={() => setMessage(null)} style={styles.closeButton}>
                        <XMarkIcon className="h-5 w-5" color="black" />
                    </TouchableOpacity>
                </View>
            )}
            <ScrollView contentContainerStyle={styles.container}>
                <ThemedView>
                    <Text className="text-3xl font-bold text-gray-900 mb-6">Settings</Text>
                    <Text className="mt-3 text-lg font-bold text-gray-900">Personal Information</Text>
                    <Text className="font-semibold text-gray-900 mt-3">
                        Here you can update your personal information.
                    </Text>
                    <ThemedView className="py-4">
                        <View>
                            <Text className="text-xs text-gray-500 mb-1">Username</Text>
                            <TextInput
                                className="h-12 border border-gray-300 rounded px-4 mb-6"
                                placeholder="Username"
                                value={username}
                                onChangeText={setUsername}
                            />
                        </View>
                        <View>
                            <Text className="text-xs text-gray-500 mb-1">Email Address</Text>
                            <TextInput
                                className="h-12 border border-gray-300 rounded px-4 mb-6"
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Language</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={preferredLanguage}
                                    onValueChange={(itemValue) => setPreferredLanguage(itemValue)}
                                    style={styles.picker}
                                >
                                    {Object.entries(languages).map(([code, name]) => (
                                        <Picker.Item key={code} label={name} value={code} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    </ThemedView>
                    <TouchableOpacity
                        className="py-3 mb-10 rounded-full bg-indigo-700 text-white"
                        onPress={handleUpdate} disabled={loading}>
                        <Text className="text-center font-bold text-white">{loading ? 'Updating...' : 'Update'}</Text>
                    </TouchableOpacity>
                </ThemedView>
                <ThemedView>
                    <Text className="mt-3 text-lg font-bold text-gray-900">Contact Us</Text>
                    <Text className="font-semibold text-gray-900 mt-3">If you have any questions, please fill out the form below.</Text>
                    <ThemedView className="py-4">
                        <View>
                            <Text className="text-xs text-gray-500 mb-1">Object</Text>
                            <TextInput
                                className="h-12 border border-gray-300 rounded px-4 mb-6"
                                placeholder="Object"
                                value={object}
                                onChangeText={setObject}
                            />
                        </View>
                        <View>
                            <Text className="text-xs text-gray-500 mb-1">Description</Text>
                            <TextInput
                                className="h-44 border border-gray-300 rounded p-4 mb-6"
                                placeholder="Enter your message"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                            />
                        </View>
                    </ThemedView>
                    <TouchableOpacity
                        className="py-3 mb-10 rounded-full bg-indigo-700 text-white"
                        onPress={handleSendMessage}
                        disabled={loading}
                    >
                        <Text className="text-center font-bold text-white">{loading ? 'Sending...' : 'Send'}</Text>
                    </TouchableOpacity>
                </ThemedView>
                <ThemedView>
                    <Text className="mt-3 text-lg font-bold text-gray-900">Delete Account</Text>
                    <Text className="font-semibold text-gray-900 mt-3">
                        We're sorry to see you go. Deleting your account will remove all your data.
                    </Text>
                    <TouchableOpacity
                        className="py-3 mt-5 rounded-full bg-red-600 text-white"
                        onPress={handleDeleteAccount}
                        disabled={loading}
                    >
                        <Text className="text-center font-bold text-white">{loading ? 'Deleting...' : 'Delete Account'}</Text>
                    </TouchableOpacity>
                </ThemedView>
            </ScrollView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop:20,
        paddingBottom:100,
    },
    notification: {
        position: 'absolute',
        bottom: 30,
        left: 15,
        right: 15,
        padding: 20,
        zIndex: 1000,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
    },
    success: {
        backgroundColor: '#d1fae5',
    },
    error: {
        backgroundColor: '#fee2e2',
    },
    notificationText: {
        color: 'black',
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: 'transparent',
    },
    closeButtonText: {
        color: 'black',
        fontSize: 18,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 5,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        height:200,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
    },
});

export default ProfileScreen;


