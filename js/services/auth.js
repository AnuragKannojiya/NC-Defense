// =====================================================================
// Auth Service — Real Firebase OAuth & Email Authentication
// =====================================================================
import { FIREBASE_CONFIGURED, firebaseConfig } from '../config-firebase.js';

let _fbApp = null;
let _fbAuth = null;
let _GoogleProvider = null;
let _demoUser = null;
let _onAuthChangeCb = null;

// ---- Bootstrap Firebase SDK dynamically from Google CDN ----
async function ensureFirebase() {
    if (_fbAuth) return _fbAuth;
    try {
        const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
        const { getAuth, GoogleAuthProvider } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
        
        _fbApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
        _fbAuth = getAuth(_fbApp);
        _GoogleProvider = new GoogleAuthProvider();
        _GoogleProvider.setCustomParameters({ prompt: 'select_account' });
        return _fbAuth;
    } catch (err) {
        console.error('Failed to initialize Firebase Auth SDK:', err);
        throw new Error('Could not load Firebase Authentication library. Please check your internet connection.');
    }
}

// Friendly error message translator for Firebase codes
export function translateFirebaseError(err) {
    const code = err.code || '';
    if (code === 'auth/configuration-not-found') {
        return `Firebase Auth provider is not enabled in your Google Cloud / Firebase console for project "${firebaseConfig.projectId}". Please enable Email/Password & Google in Firebase Console > Authentication > Sign-in method.`;
    }
    if (code === 'auth/unauthorized-domain') {
        return `This domain (${window.location.hostname}) is not authorized for OAuth in Firebase Console. Add "${window.location.hostname}" in Firebase Console > Authentication > Settings > Authorized Domains.`;
    }
    if (code === 'auth/popup-closed-by-user') {
        return 'Google sign-in popup was closed before completing.';
    }
    if (code === 'auth/popup-blocked') {
        return 'The Google sign-in popup was blocked by your browser. Please allow popups for this site.';
    }
    if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        return 'Invalid email or password. Please verify your credentials.';
    }
    if (code === 'auth/user-not-found') {
        return 'No account found with this email. Please register first.';
    }
    if (code === 'auth/email-already-in-use') {
        return 'An account with this email already exists. Please sign in instead.';
    }
    if (code === 'auth/weak-password') {
        return 'Password must be at least 6 characters long.';
    }
    return err.message || 'Authentication failed. Please try again.';
}

// ---- Exported Authentication API ----

export async function initFirebaseAuth(callback) {
    _onAuthChangeCb = callback;

    // Check for active demo session first
    const demoSaved = localStorage.getItem('ncd_demo_user');
    if (demoSaved) {
        try {
            _demoUser = JSON.parse(demoSaved);
            callback(_demoUser);
            return;
        } catch {
            localStorage.removeItem('ncd_demo_user');
        }
    }

    if (!FIREBASE_CONFIGURED) {
        callback(null);
        return;
    }

    try {
        await ensureFirebase();
        const { onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
        onAuthStateChanged(_fbAuth, (user) => {
            if (user) {
                _demoUser = null;
                localStorage.removeItem('ncd_demo_user');
                callback(user);
            } else if (_demoUser) {
                callback(_demoUser);
            } else {
                callback(null);
            }
        });
    } catch (err) {
        console.warn('Realtime Firebase Auth listener error:', err);
        callback(_demoUser || null);
    }
}

// Real Google OAuth 2.0 via Firebase popup
export async function signInWithGoogle() {
    try {
        await ensureFirebase();
        const { signInWithPopup } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
        const cred = await signInWithPopup(_fbAuth, _GoogleProvider);
        localStorage.removeItem('ncd_demo_user');
        _demoUser = null;
        // Firebase onAuthStateChanged handles routing update
        return cred.user;
    } catch (err) {
        console.error('Google OAuth error:', err);
        throw new Error(translateFirebaseError(err));
    }
}

// Real Email & Password Sign In
export async function signInWithEmail(email, password) {
    const cleanEmail = (email || '').trim();
    if (!cleanEmail) throw new Error('Please enter a valid email address.');
    if (!password) throw new Error('Please enter your password.');

    try {
        await ensureFirebase();
        const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
        const cred = await signInWithEmailAndPassword(_fbAuth, cleanEmail, password);
        localStorage.removeItem('ncd_demo_user');
        _demoUser = null;
        // Firebase onAuthStateChanged handles routing update
        return cred.user;
    } catch (err) {
        console.error('Email sign in error:', err);
        throw new Error(translateFirebaseError(err));
    }
}

// Real Email & Password Registration
export async function signUpWithEmail(email, password, displayName, department = 'Cyber Operations', role = 'employee') {
    const cleanEmail = (email || '').trim();
    if (!cleanEmail) throw new Error('Please enter a valid email address.');
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters.');

    try {
        await ensureFirebase();
        const { createUserWithEmailAndPassword, updateProfile } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
        const cred = await createUserWithEmailAndPassword(_fbAuth, cleanEmail, password);
        if (displayName) {
            await updateProfile(cred.user, { displayName });
        }
        localStorage.removeItem('ncd_demo_user');
        _demoUser = null;
        // Firebase onAuthStateChanged handles routing update
        return cred.user;
    } catch (err) {
        console.error('Email registration error:', err);
        throw new Error(translateFirebaseError(err));
    }
}

// Fast Demo Access
export async function signInDemo() {
    _demoUser = {
        uid: 'demo_agent_' + Date.now(),
        email: 'agent.demo@ncd.gov.in',
        displayName: 'Commander Aryan Sharma',
        department: 'Cyber Operations Division',
        role: 'Chief Security Officer',
        photoURL: null,
        clearance: 'Level 3 (Top Secret)'
    };
    localStorage.setItem('ncd_demo_user', JSON.stringify(_demoUser));
    if (_onAuthChangeCb) {
        _onAuthChangeCb(_demoUser);
    }
    return _demoUser;
}

// Sign Out
export async function signOut() {
    _demoUser = null;
    localStorage.removeItem('ncd_demo_user');
    try {
        sessionStorage.clear();
    } catch (e) {
        console.warn('Session clear warning:', e);
    }

    try {
        await ensureFirebase();
        if (_fbAuth) {
            const { signOut: fbSignOut } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
            await fbSignOut(_fbAuth);
        }
    } catch (e) {
        console.warn('Firebase sign out warning:', e);
    }

    if (_onAuthChangeCb) {
        _onAuthChangeCb(null);
    }
}

export function getCurrentUser() {
    if (_demoUser) return _demoUser;
    return _fbAuth?.currentUser || null;
}
