import React, { createContext, useContext, useState, useEffect } from 'react';
import { Admin } from '../types';
import { authApi } from '../services/api.ts';

interface AuthContextType {
    admin: Admin | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const checkAuth = async () => {
            try {
                const response = await authApi.login({
                    email: process.env.ADMIN_EMAIL || '',
                    password: process.env.ADMIN_PASSWORD || ''
                });
                setAdmin(response.admin);
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await authApi.login({ email, password });
            setAdmin(response.admin);
        } catch (error) {
            throw new Error('Login failed');
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
            setAdmin(null);
        } catch (error) {
            throw new Error('Logout failed');
        }
    };

    return (
        <AuthContext.Provider value={{ admin, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 