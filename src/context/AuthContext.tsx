import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'client' | 'therapist' | 'caregiver';

interface User {
    id: string;
    name: string;
    role: UserRole;
    isFirstTime: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, role: UserRole) => void;
    logout: () => void;
    completeOnboarding: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check for existing session
        const savedUser = localStorage.getItem('manosanchay_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (email: string, role: UserRole) => {
        // Check if user has logged in before
        const existingUsers = JSON.parse(localStorage.getItem('manosanchay_users') || '{}');
        const isFirstTime = !existingUsers[email];

        const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: email.split('@')[0] || 'User',
            role,
            isFirstTime,
        };

        setUser(newUser);
        localStorage.setItem('manosanchay_user', JSON.stringify(newUser));

        // Track this user
        existingUsers[email] = true;
        localStorage.setItem('manosanchay_users', JSON.stringify(existingUsers));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('manosanchay_user');
    };

    const completeOnboarding = () => {
        if (user) {
            const updatedUser = { ...user, isFirstTime: false };
            setUser(updatedUser);
            localStorage.setItem('manosanchay_user', JSON.stringify(updatedUser));
        }
    };

    const value: AuthContextType = {
        user,
        login,
        logout,
        completeOnboarding,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
