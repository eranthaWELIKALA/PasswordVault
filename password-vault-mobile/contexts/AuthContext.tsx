import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api"; // Use the axios instance here

interface User {
    id: string;
    email: string;
    name?: string;
    lastLoginAt?: string;
    lastLoginIP?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    signIn: async () => {},
    signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Load token & user from storage on app start
        (async () => {
            try {
                const storedToken = await AsyncStorage.getItem("token");
                const storedUser = await AsyncStorage.getItem("user");
                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                    // Also set token to axios default headers for persistence on reload
                    api.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${storedToken}`;
                }
            } catch (error) {
                console.error("Failed to load auth data from storage:", error);
            }
        })();
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
          console.log("=====")
            const response = await api.post("/auth/login", { email, password });
          console.log("=====")

            const { token: receivedToken, user: receivedUser } = response.data;

            setToken(receivedToken);
            setUser(receivedUser);

            api.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${receivedToken}`;

            await AsyncStorage.setItem("token", receivedToken);
            await AsyncStorage.setItem("user", JSON.stringify(receivedUser));
        } catch (error: any) {
            // You can enhance error handling here (e.g. parse error.response)
            throw new Error(
                error.response?.data?.message ||
                    "Failed to sign in. Please try again."
            );
        }
    };

    const signOut = async () => {
        setUser(null);
        setToken(null);
        api.defaults.headers.common["Authorization"] = "";
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, token, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
