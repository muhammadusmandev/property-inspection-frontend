const STORAGE_URL = import.meta.env.VITE_SERVER_STORAGE_URL;

export default function storageURL(path = '') {
    if (!path) {
        return '';
    }

    return `${STORAGE_URL}${path}`;
}