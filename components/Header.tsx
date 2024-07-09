import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { UserIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { RootStackParamList } from '@/types';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { logout as apiLogout } from '@/services/api';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Login' | 'Categories'>;

const Header: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation<NavigationProp>();
    const { isLoggedIn, logout } = useAuth();

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const handleLogin = () => {
        navigation.navigate('Login' ,{ message: 'Welcome!' });
        setModalVisible(false);
    };

    const handleSignup = () => {
        navigation.navigate('Sign');
        setModalVisible(false);
    };

    const handleLogout = async () => {
        try {
            await apiLogout();
            logout(); // Update the context state
            Alert.alert('Success', 'Successfully logged out');
        } catch (error) {
            console.error('Error during logout:', error);
            Alert.alert('Error', 'Failed to log out');
        } finally {
            setModalVisible(false);
        }
    };

    const handleSearch = () => {
        navigation.navigate('Categories');
    };

    return (
        <View style={styles.container}>
            <Image source={require('@/assets/images/unlistened_transparen_logo_176.png')} style={styles.logo} />
            <View style={styles.iconsContainer}>
                <TouchableOpacity onPress={handleSearch} style={styles.iconContainer}>
                    <MagnifyingGlassIcon color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleModal} style={styles.iconContainer}>
                    <UserIcon color="black" />
                </TouchableOpacity>
            </View>

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={toggleModal}
            >
                <TouchableOpacity style={styles.modalOverlay} onPress={toggleModal}>
                    <View style={styles.modalContent}>
                        <View className="py-3">
                            <Logo />
                        </View>
                        {!isLoggedIn ? (
                            <>
                                <TouchableOpacity onPress={handleLogin} className="bg-indigo-700 py-3 mt-6 rounded-full w-full">
                                    <Text className="text-white text-center font-bold">Login</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleSignup} className="bg-indigo-700 py-3 mt-2 rounded-full w-full">
                                    <Text className="text-white text-center font-bold">Signup</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity onPress={handleLogout} className="bg-indigo-700 py-3 mt-2 rounded-full w-full">
                                <Text className="text-white text-center font-bold">Logout</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
    },
    logo: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    iconsContainer: {
        flexDirection: 'row',
    },
    iconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginLeft: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
    },
    authButton: {
        backgroundColor: '#4f46e5',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 5,
    },
    authButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default Header;


