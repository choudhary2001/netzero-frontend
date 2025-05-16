// API Configuration
export const API_BASE_URL = 'https://netzero-backend-ne4a.onrender.com/api';
export const API_MEDIA_BASE_URL = 'https://netzero-backend-ne4a.onrender.com';

// Other configuration constants can be added here
export const APP_NAME = 'NetZero';
export const APP_VERSION = '1.0.0';

// Function to get full media URL
export const getMediaUrl = (path) => {
    if (!path) return '';
    // If path is already a full URL, return it as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    // Otherwise, combine with API media base URL
    return `${API_MEDIA_BASE_URL}/${path.replace(/^\/+/, '')}`;
}; 