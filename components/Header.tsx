import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
import { useNavigation } from '@react-navigation/native';
import { UserIcon } from 'react-native-heroicons/outline';
import {RootStackParamList} from "@/types";

const Header: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation<NavigationProp>();

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const handleLogin = () => {
        // Navigate to the login screen
        navigation.navigate('Login');
        setModalVisible(false);
    };

    const handleSignup = () => {
        // Navigate to the signup screen
        navigation.navigate('Sign');
        setModalVisible(false);
    };

    const handleLogout = () => {
        // Implement logout functionality
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Image source={require('@/assets/images/unlistened_transparen_logo_176.png')} style={styles.logo} />
            <TouchableOpacity onPress={toggleModal} style={styles.userIconContainer}>
                <UserIcon color="black" />
            </TouchableOpacity>

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={toggleModal}
            >
                <TouchableOpacity style={styles.modalOverlay} onPress={toggleModal}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={handleLogin} className="bg-indigo-700 py-3 mt-2 rounded-full w-full">
                            <Text className="text-white text-center font-bold">Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSignup} className="bg-indigo-700 py-3 mt-2 rounded-full w-full">
                            <Text className="text-white text-center font-bold">Signup</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogout} className="bg-indigo-700 py-3 mt-2 rounded-full w-full">
                            <Text className="text-white text-center font-bold">Logout</Text>
                        </TouchableOpacity>
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
    userIconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
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
    modalOption: {
        width: '100%',
    },
});

export default Header;
