// =====================================================================
// Firebase Cloud Configuration — Realtime Firestore & OAuth
// =====================================================================
const defaultFirebaseConfig = {
    apiKey: "AIzaSyCJIHHWcITb5HveR7GS1N6hAx9m6HfSwEI",
    authDomain: "anup-bfc5f-cbd76.firebaseapp.com",
    projectId: "anup-bfc5f-cbd76",
    storageBucket: "anup-bfc5f-cbd76.firebasestorage.app",
    messagingSenderId: "774424076056",
    appId: "1:774424076056:web:f598512c85e6c57363c86d",
};

// Check for custom config saved by user in local storage
function loadConfig() {
    try {
        const saved = localStorage.getItem('ncd_custom_firebase_config');
        if (saved) return JSON.parse(saved);
    } catch {}
    return defaultFirebaseConfig;
}

export const firebaseConfig = loadConfig();
export const FIREBASE_CONFIGURED = true;

export function updateCustomFirebaseConfig(newConfig) {
    localStorage.setItem('ncd_custom_firebase_config', JSON.stringify(newConfig));
    window.location.reload();
}
