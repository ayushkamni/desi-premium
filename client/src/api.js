import axios from 'axios';

// Backend API URL Configuration
// For local development: uses localhost
// For production: uses Render backend URL or relative path if same domain
const getApiUrl = () => {
    // Check if we're on localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    }
    
    // For production: Use Render backend URL
    // If frontend and backend are on same domain, use '/api'
    // If separate services, use full backend URL
    const BACKEND_URL = 'https://desi-premium-5.onrender.com';
    return `${BACKEND_URL}/api`;
};

const API_URL = getApiUrl();

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
