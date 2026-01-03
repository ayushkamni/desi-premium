import axios from 'axios';

// Get the API URL from environment variables, or fallback to localhost
// For Vite, use import.meta.env.VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL || 'https://desi-premium.onrender.com';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token in headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
export { API_URL };
