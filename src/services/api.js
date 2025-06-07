import axios from 'axios';
import store from '../store';
import { logout, refreshToken } from '../store/authSlice';
import { API_BASE_URL } from '../config';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 second timeout
    headers: {
        'Content-Type': 'application/json',
    },
    // Add retry configuration
    retry: 2,
    retryDelay: 1000
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Request interceptor - adds the current token to requests and handles request timeout
api.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handles token refresh ONLY on 401 errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle network errors gracefully
        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
            console.error('Network error detected:', error.message);
            // You can dispatch a global notification here if needed
            return Promise.reject({
                ...error,
                code: error.code, // Ensure error code is preserved
                customMessage: 'Network connection issue detected. Please check your internet connection and try again.'
            });
        }

        // Handle resource errors
        if (error.code === 'ERR_INSUFFICIENT_RESOURCES') {
            console.error('Resource error detected:', error.message);
            return Promise.reject({
                ...error,
                code: error.code, // Ensure error code is preserved
                customMessage: 'The server is experiencing high load. Please try again later.'
            });
        }

        // Skip token refresh for login and token endpoints
        const skipRefreshUrls = ['/token/', '/token/refresh/', '/token/blacklist/'];
        const shouldSkipRefresh = skipRefreshUrls.some(url => originalRequest.url.includes(url));

        // Only attempt to refresh the token if we get a 401 response and it's not a token-related endpoint
        if (error.response?.status === 401 && !originalRequest._retry && !shouldSkipRefresh) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return api(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshTokenValue = store.getState().auth.refreshToken;

                if (!refreshTokenValue) {
                    console.log('No refresh token available');
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
                    refresh: refreshTokenValue
                });

                const { access } = response.data;
                store.dispatch(refreshToken(access));

                processQueue(null, access);
                originalRequest.headers['Authorization'] = 'Bearer ' + access;
                return api(originalRequest);
            } catch (err) {
                console.log('Token refresh failed:', err);
                processQueue(err, null);

                // Only logout if the refresh token is invalid or expired
                if (err.response?.status === 401) {
                    console.log('Logging out due to invalid refresh token');
                    store.dispatch(logout());
                }

                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api; 