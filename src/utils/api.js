import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api",
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is related to token expiration and it hasn't been retried yet
        if (
            error.response?.status === 401 &&
            error.response.data?.code === "TOKEN_INVALID" &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true; // Mark the request as retried

            try {
                const refreshToken = localStorage.getItem("refresh");
                if (!refreshToken)
                    throw new Error("No refresh token available");

                // Request a new access token
                const { data } = await axios.post(
                    `${
                        process.env.REACT_APP_API_BASE_URL ||
                        "http://localhost:8000/api"
                    }/auth/token/refresh/`,
                    { refresh: refreshToken }
                );

                // Save the new token
                localStorage.setItem("access", data.access);

                // Update the authorization header with the new token
                originalRequest.headers[
                    "Authorization"
                ] = `Bearer ${data.access}`;

                // Retry the original request with the new token
                return api(originalRequest);
            } catch (refreshError) {
                // Handle refresh token failure (e.g., force logout)
                console.error("Refresh token failed:", refreshError);
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                window.location.href = "/login"; // Redirect to login page
            }
        }

        return Promise.reject(error);
    }
);

export default api;
