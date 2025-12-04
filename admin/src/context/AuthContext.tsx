import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import api from '@/config/api';

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    role: 'admin' | 'user'
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    error: string | null;
    isAdmin: boolean;
    verifyOtp: (email: string, otp: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    getCurrentUser: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    // const [initializing, setInitializing] = useState(true); // ADD THIS
    useEffect(() => {

        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                const userData: User = JSON.parse(storedUser);
                setUser(userData);
            } catch (error) {
                console.error('Error parsing stored user data', error);
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            }
        }

        setLoading(false);
    }, []);


    const verifyOtp = async (email: string, otp: string) => {
        setLoading(true);
        setError(null);

        try {
            if (otp.length !== 6) {
                throw new Error("El código debe tener 6 dígitos");
            }

            await api.post("/auth/verify-otp", { email, code: otp });
            return;
        } catch (err) {
            const errorMsg = axios.isAxiosError(err)
                ? err.response?.data?.message || "Código OTP inválido"
                : "Error de conexión";
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };


    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            const { data } = await api.post("/auth/login", {
                email,
                password,
            });
            console.log(data.access_token)
            if (data.access_token) {
                localStorage.setItem("authToken", data.access_token);

                setToken(data.access_token);
            }
            if (data.user) {
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
                console.log(data.user)
            } else {
                await getCurrentUser();
            }

            return;
        } catch (err) {
            const errorMsg = axios.isAxiosError(err)
                ? err.response?.data?.message || "Credenciales inválidas"
                : "Error de conexión";
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getCurrentUser = async () => {
        try {
            const { data } = await api.get("/auth/me");
            setUser(data.user || data);
        } catch (err) {
            console.error("Error getting current user:", err);
            localStorage.removeItem("authToken");
            setToken(null);
            setUser(null);
        }
    };

    const logout = async () => {
        setLoading(true);
        setError(null);

        try {
            await api.post("/auth/logout");
        } catch (err) {
            console.error("Error during logout:", err);
        } finally {
            localStorage.removeItem("authToken");
            setToken(null);
            setUser(null);
            setLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    const value: AuthContextType = {
        user,
        token,
        loading: loading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
        error,
        verifyOtp,
        login,
        logout,
        getCurrentUser,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return context;
};