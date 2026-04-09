const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3333';

export const fetchBackend = (path: string, options?: RequestInit) => {
    return fetch(`${BACKEND_URL}${path}`, options);
};
