import React, { createContext, useState, useContext, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

interface AuthContextProps {
    isLoggedIn: boolean;
    userId: string | null;
    csrfToken: string | null;
    login: (userId: string, csrfToken: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [csrfToken, setCsrfToken] = useState<string | null>(null);

    const login = async (userId: string, csrfToken: string) => {
        setIsLoggedIn(true);
        setUserId(userId);
        setCsrfToken(csrfToken);
        await SecureStore.setItemAsync('userId', userId);
        await SecureStore.setItemAsync('csrfToken', csrfToken);
    };

    const logout = async () => {
        setIsLoggedIn(false);
        setUserId(null);
        setCsrfToken(null);
        await SecureStore.deleteItemAsync('userId');
        await SecureStore.deleteItemAsync('csrfToken');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userId, csrfToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

