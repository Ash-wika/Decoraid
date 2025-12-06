import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
    baseURL,
});

export const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    // If we have a backend URL, prepend it
    if (baseURL) {
        const cleanBase = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${cleanBase}${cleanPath}`;
    }

    // Otherwise rely on relative path (proxy)
    return path.startsWith('/') ? path : `/${path}`;
};

export default api;
