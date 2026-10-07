import axios from "axios";
import { API } from "../config/apiConfig";

const apiClient = axios.create({
    baseURL: API.BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    (config) => {
        // Login/Register ko JWT nahi chahiye
        const isAuthRequest =
            config.url === "/auth/login" ||
            config.url === "/auth/register";

        if (!isAuthRequest) {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Auto-handle 401 Unauthorized across all microservices
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const currentPath = window.location.pathname;
            // Only redirect if not already on login or register
            if (currentPath !== "/login" && currentPath !== "/register" && currentPath !== "/") {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                localStorage.removeItem("role");
                localStorage.removeItem("userId");
                window.location.href = "/login?expired=true";
            }
        }
        return Promise.reject(error);
    }
);

console.log("API Base URL :", API.BASE_URL);

export default apiClient;