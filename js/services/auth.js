// =====================================================================
// Auth Service — Firebase Authentication (Real + Demo fallback)
// =====================================================================
import { FIREBASE_CONFIGURED, firebaseConfig } from '../config-firebase.js';

// --- Firebase state ---
let _fbApp = null;
let _fbAuth = null;
let _GoogleProvider = null;

// --- Demo mode state ---
let _demoUser = null;
let _onAuthChangeCb = null;

// ---- Bootstrap Firebase if configured ----
async function ensureFirebase() {
    if (!FIREBASE_CONFIGURED || _fbAuth) return;
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
    const { getAuth, GoogleAuthProvider } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
    _fbApp = initializeApp(firebaseConfig);
    _fbAuth = getAuth(_fbApp);
    _GoogleProvider = new GoogleAuthProvider();
}

// ---- Exported API ----

export async function initFirebaseAuth(callback) {
    // Always check for demo mode override first (works even when Firebase is configured)
    const demoSaved = localStorage.getItem('ncd_demo_user');
    if (demoSaved) {
        _demoUser = JSON.parse(demoSaved);
        _onAuthChangeCb = callback;
        callback(_demoUser);
        return;
    }

    if (!FIREBASE_CONFIGURED) {
        _onAuthChangeCb = callback;
        callback(null);
        return;
    }
    await ensureFirebase();
    const { onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
    onAuthStateChanged(_fbAuth, (user) => {
        callback(user);
    });
}

export async function signInWithEmail(email, password) {
    if (!FIREBASE_CONFIGURED) {
        _demoUser = {
            uid: 'demo_' + btoa(email).replace(/[^a-z0-9]/gi,'').slice(0,12),
            email,
            displayName: email.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g, c=>c.toUpperCase()),
            photoURL: null
        };
        localStorage.setItem('ncd_demo_user', JSON.stringify(_demoUser));
        if (_onAuthChangeCb) _onAuthChangeCb(_demoUser);
        return _demoUser;
    }
    await ensureFirebase();
    const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
    const cred = await signInWithEmailAndPassword(_fbAuth, email, password);
    return cred.user;
}

export async function signUpWithEmail(email, password, displayName) {
    if (!FIREBASE_CONFIGURED) {
        _demoUser = {
            uid: 'demo_' + Date.now(),
            email,
            displayName: displayName || email.split('@')[0],
            photoURL: null
        };
        localStorage.setItem('ncd_demo_user', JSON.stringify(_demoUser));
        if (_onAuthChangeCb) _onAuthChangeCb(_demoUser);
        return _demoUser;
    }
    await ensureFirebase();
    const { createUserWithEmailAndPassword, updateProfile } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
    const cred = await createUserWithEmailAndPassword(_fbAuth, email, password);
    if (displayName) await updateProfile(cred.user, { displayName });
    return cred.user;
}

export async function signInWithGoogle() {
    if (!FIREBASE_CONFIGURED) {
        _demoUser = {
            uid: 'demo_google_' + Date.now(),
            email: 'agent@ncd.gov.in',
            displayName: 'Agent Smith',
            photoURL: null
        };
        localStorage.setItem('ncd_demo_user', JSON.stringify(_demoUser));
        if (_onAuthChangeCb) _onAuthChangeCb(_demoUser);
        return _demoUser;
    }
    await ensureFirebase();
    const { signInWithPopup } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
    const cred = await signInWithPopup(_fbAuth, _GoogleProvider);
    return cred.user;
}

export async function signOut() {
    // Always clear demo mode session
    _demoUser = null;
    localStorage.removeItem('ncd_demo_user');
    if (_onAuthChangeCb) _onAuthChangeCb(null);

    if (!FIREBASE_CONFIGURED) return;
    try {
        await ensureFirebase();
        const { signOut: fbSignOut } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
        await fbSignOut(_fbAuth);
    } catch(e) { /* ignore */ }
}

export function getCurrentUser() {
    if (!FIREBASE_CONFIGURED) return _demoUser;
    return _fbAuth?.currentUser || null;
}

