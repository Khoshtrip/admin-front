import api from "../utils/api"; 

export const AuthenticationApi = {
    sendVerificationCode: async (contactValue) => {
        try {
            const response = await api.post("/auth/send-verification-code/", {
                phone_number: contactValue,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    verifyCode: async (contactValue, code) => {
        try {
            const response = await api.post("/auth/verify-code/", {
                phone_number: contactValue,
                code: code,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    login: async (contactValue, password) => {
        try {
            const response = await api.post("/auth/login/", {
                phone_number: contactValue,
                password,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    fetchUser: async () => {
        try {
            const response = await api.get("auth/me");
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    logout: async (refreshToken) => {
        try {
            const response = await api.post("/auth/logout/", {
                refresh: refreshToken,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    refreshToken: async (refreshToken) => {
        try {
            const response = await api.post("/auth/token/refresh/", {
                refresh: refreshToken,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    signup: async (formData) => {
        try {
            const response = await api.post("/auth/register/provider/", {
                first_name: formData.firstName,
                last_name: formData.lastName,
                phone_number: formData.phone_number,
                email: formData.email,
                national_id: formData.nationalCode,
                password: formData.password,
                business_name: formData.businessName,
                business_address: formData.businessAddress,
                business_contact: formData.businessPhone,
                website_url: formData.businessWebsite,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};
