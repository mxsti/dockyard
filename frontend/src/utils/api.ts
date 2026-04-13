const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3333';

export const fetchBackend = async (path: string, options?: RequestInit) => {
    const res = await fetch(`${BACKEND_URL}${path}`, options);
    if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || `Request failed with status ${res.status}`);
    }
    return res;
};
