import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type UserStatusProps = {
    isLoggedIn: boolean;
    onLogin: () => void;
    onLogout: () => void;
    onRegister: () => void;
};

const UserStatus: React.FC<UserStatusProps> = ({ isLoggedIn, onLogin, onLogout, onRegister }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    return (
        <View style={styles.userStatusContainer}>
            <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
                <Ionicons name="person" size={24} color="gray" />
            </TouchableOpacity>
            {dropdownVisible && (
                <View style={styles.dropdown}>
                    {isLoggedIn ? (
                        <>
                            <TouchableOpacity onPress={onLogout}>
                                <Text style={styles.dropdownItem}>Logout</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity onPress={onLogin}>
                                <Text style={styles.dropdownItem}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onRegister}>
                                <Text style={styles.dropdownItem}>Register</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    userStatusContainer: {
        position: 'relative',
        marginHorizontal: 10,
        marginVertical: 5,
    },
    dropdown: {
        position: 'absolute',
        top: 30,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        zIndex: 1,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default UserStatus;