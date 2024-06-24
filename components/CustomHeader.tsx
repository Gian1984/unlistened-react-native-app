import React from 'react';
import { View, StyleSheet } from 'react-native';
import SearchField from '@/components/SearchField';
import UserStatus from '@/components/UserStatus';

type CustomHeaderProps = {
    onSearch: (query: string) => void;
    isLoggedIn: boolean;
    onLogin: () => void;
    onLogout: () => void;
    onRegister: () => void;
};

const CustomHeader: React.FC<CustomHeaderProps> = ({ onSearch, isLoggedIn, onLogin, onLogout, onRegister }) => {
    return (
        <View style={styles.header}>
            <SearchField onSearch={onSearch} />
            <UserStatus
                isLoggedIn={isLoggedIn}
                onLogin={onLogin}
                onLogout={onLogout}
                onRegister={onRegister}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: 'white', // or your preferred background color
    },
});

export default CustomHeader;