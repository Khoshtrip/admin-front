import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";
import { AuthenticationApi } from "../apis/AuthenticationApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (token) {
            fetchUser()
                .then(() => {
                    api.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${token}`;
                })
                .catch(() => {
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");
                });
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const response = await AuthenticationApi.fetchUser();
            setUser({
                email: response.data.email,
                phoneNumber: response.data.phone_number,
                firstName: response.data.first_name,
                lastName: response.data.last_name,
                nationalId: response.data.national_id,
                dateJoined: response.data.date_joined,
                role: response.data.role,
                businessName: response.data.business_name,
                businessAddress: response.data.business_address,
                businessPhone: response.data.business_phone,
                businessWebsite: response.data.website_url,
            });
            setIsAuthenticated(true);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await AuthenticationApi.login(username, password);
            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);
            api.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${response.data.access}`;
            await fetchUser();
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            const response = await AuthenticationApi.signup(userData);
        } catch (error) {
            console.error("Signup error:", error);
            throw error;
        }
    };

    const logout = async () => {
        const refreshToken = localStorage.getItem("refresh");
        const response = await AuthenticationApi.logout(refreshToken).catch(
            () => {}
        );
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        delete api.defaults.headers.common["Authorization"];
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                login,
                signup,
                logout,
                loading,
                fetchUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
