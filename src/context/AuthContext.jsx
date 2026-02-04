import React, { createContext, useContext, useState, useEffect } from 'react';
import { puterAuth } from '@/lib/puterAuth';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const currentUser = await puterAuth.getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error("Auth Init Failed", error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const userData = await puterAuth.login(email, password);
            puterAuth.persistSession(userData.email);
            setUser(userData);
            toast.success(`Welcome back, ${userData.fullName}!`);
            return true;
        } catch (error) {
            toast.error(error.message || "Login failed");
            throw error;
        }
    };

    const signup = async (name, email, password) => {
        try {
            const userData = await puterAuth.signUp(email, password, name);
            puterAuth.persistSession(userData.email);
            setUser(userData);
            toast.success("Account created successfully!");
            return true;
        } catch (error) {
            toast.error(error.message || "Signup failed");
            throw error;
        }
    };

    const logout = async () => {
        await puterAuth.logout();
        setUser(null);
        toast.info("Logged out successfully");
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
