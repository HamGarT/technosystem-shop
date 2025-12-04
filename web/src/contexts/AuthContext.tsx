import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import api from '../config/api';

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    error: string | null;
    emailExists: boolean | null; // Nuevo
    
    // Métodos
    loginWithEmail: (email: string) => Promise<boolean>; // Devuelve si existe
    verifyOtp: (email: string, otp: string) => Promise<void>;
    register: (firstName: string, lastName: string, email: string, password: string, passwordConfirmation: string, otp: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    getCurrentUser: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [emailExists, setEmailExists] = useState<boolean | null>(null);

    // Cargar token del localStorage al montar
    useEffect(() => {
        const savedToken = localStorage.getItem("authToken");
        if (savedToken) {
            setToken(savedToken);
            getCurrentUser();
        }
    }, []);

    const loginWithEmail = async (email: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        setEmailExists(null);

        try {
            const { data } = await api.post("/auth/verify-email", { email });
            const exists = data.email_exists || false;
            setEmailExists(exists);
            return exists;
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 400) {
                setEmailExists(true);
                return true;
            }
            
            const errorMsg = axios.isAxiosError(err) 
                ? err.response?.data?.message || "Error al verificar email"
                : "Error de conexión";
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

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

    const register = async (
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        passwordConfirmation: string,
        otp: string
    ) => {
        setLoading(true);
        setError(null);

        if (!firstName.trim()) {
            throw new Error("El nombre es requerido");
        }

        if (!lastName.trim()) {
            throw new Error("El apellido es requerido");
        }

        if (password.length < 8) {
            throw new Error("La contraseña debe tener al menos 8 caracteres");
        }

        if (password !== passwordConfirmation) {
            throw new Error("Las contraseñas no coinciden");
        }

        try {
            const fullName = `${firstName.trim()} ${lastName.trim()}`;

            const { data } = await api.post("/auth/register", {
                name: fullName,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            // Guardar token y usuario
            if (data.token) {
                localStorage.setItem("authToken", data.token);
                setToken(data.token);
            }

            if (data.user) {
                setUser(data.user);
            }

            return;
        } catch (err) {
            const errorMsg = axios.isAxiosError(err) 
                ? err.response?.data?.message || "Error al registrar usuario"
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
            console.log(data)

            // Guardar token y usuario
            if (data.access_token) {
                localStorage.setItem("authToken", data.access_token);
                setToken(data.access_token);
            }

            if (data.user) {
                
                setUser(data.user);
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
            // Limpiar estado sin importar si la request falló
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
        loading,
        isAuthenticated: !!token && !!user,
        error,
        emailExists,
        loginWithEmail,
        verifyOtp,
        register,
        login,
        logout,
        getCurrentUser,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return context;
};