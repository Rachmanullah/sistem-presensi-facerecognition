// context/AuthContext.js
'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { decodeJwt } from 'jose';
import { createSession } from '../lib/sessionService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({ username: 'Guest', role: 'Unknown' });

    useEffect(() => {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('user_session='))
            ?.split('=')[1];

        if (token) {
            try {
                const decoded = decodeJwt(token);
                setUser({
                    username: decoded.username || 'Guest',
                    role: decoded.role || 'Unknown',
                });
            } catch (error) {
                console.error('Failed to decode token:', error.message);
            }
        }
    }, []);

    const login = async (userData) => {
        await createSession(userData);
        setUser({
            username: userData.username,
            role: userData.role,
        });
    };

    return (
        <AuthContext.Provider value={{ user, login }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
