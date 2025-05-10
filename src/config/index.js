/**
 * Configuration file for the application
 * This centralizes environment-specific settings
 */

// Base API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Base URL for media files
const MEDIA_BASE_URL = process.env.REACT_APP_MEDIA_URL || 'http://localhost:8000';

export {
    API_BASE_URL,
    MEDIA_BASE_URL
};

/**
 * Utility function to get the full media URL
 * @param {string} path - The relative path to the media file
 * @returns {string} The full URL to the media file
 */
export const getMediaUrl = (path) => {
    if (!path) return '';

    // If the path already includes http/https, return it as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // Remove any leading slashes to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;

    return `${MEDIA_BASE_URL}/${cleanPath}`;
}; 