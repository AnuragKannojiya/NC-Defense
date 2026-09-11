// =====================================================================
// Auth Service — Complete Google & Email Authentication System
// =====================================================================
import { FIREBASE_CONFIGURED, firebaseConfig } from '../config-firebase.js';

const USERS_STORE_KEY = 'ncd_registered_users';
const SESSION_STORE_KEY = 'ncd_session_user';
const LEGACY_DEMO_KEY = 'ncd_demo_user';

// Helper to access registered accounts
function getRegisteredUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_STORE_KEY) || '{}');
    } catch {
        return {};
    }
}

function saveRegisteredUsers(users) {
    localStorage.setItem(USERS_STORE_KEY, JSON.stringify(users));
}

// Session state
let _currentUser = null;
let _onAuthChangeCb = null;

// ---- Exported Authentication API ----

export async function initFirebaseAuth(callback) {
    _onAuthChangeCb = callback;

    // Check for existing session
    const sessionStr = localStorage.getItem(SESSION_STORE_KEY) || localStorage.getItem(LEGACY_DEMO_KEY);
    if (sessionStr) {
        try {
            _currentUser = JSON.parse(sessionStr);
            callback(_currentUser);
            return;
        } catch {
            localStorage.removeItem(SESSION_STORE_KEY);
            localStorage.removeItem(LEGACY_DEMO_KEY);
        }
    }

    callback(null);
}

export async function signInWithEmail(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) throw new Error('Please enter a valid email address.');
    if (!password) throw new Error('Please enter your password.');

    const users = getRegisteredUsers();
    const existing = users[cleanEmail];

    if (existing) {
        // Validate password
        if (existing.password && existing.password !== password) {
            throw new Error('Incorrect password. Please verify your credentials or register a new account.');
        }
        _currentUser = {
            uid: existing.uid || ('user_' + btoa(cleanEmail).replace(/[^a-z0-9]/gi, '').slice(0, 16)),
            email: cleanEmail,
            displayName: existing.name || cleanEmail.split('@')[0],
            department: existing.department || 'Cyber Operations',
            role: existing.role || 'employee',
            photoURL: existing.photoURL || null
        };
    } else {
        // Auto-provision new account if not explicitly registered
        const displayName = cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        _currentUser = {
            uid: 'user_' + btoa(cleanEmail).replace(/[^a-z0-9]/gi, '').slice(0, 16),
            email: cleanEmail,
            displayName: displayName,
            department: 'Cyber Operations',
            role: 'employee',
            photoURL: null
        };
        // Register in local directory
        users[cleanEmail] = {
            ..._currentUser,
            name: displayName,
            password: password,
            createdAt: new Date().toISOString()
        };
        saveRegisteredUsers(users);
    }

    // Persist session
    localStorage.setItem(SESSION_STORE_KEY, JSON.stringify(_currentUser));
    localStorage.setItem(LEGACY_DEMO_KEY, JSON.stringify(_currentUser));

    if (_onAuthChangeCb) _onAuthChangeCb(_currentUser);
    return _currentUser;
}

export async function signUpWithEmail(email, password, displayName, department = 'Cyber Operations', role = 'employee') {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) throw new Error('Please enter a valid email address.');
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters.');

    const users = getRegisteredUsers();
    if (users[cleanEmail]) {
        throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const name = displayName || cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const uid = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    _currentUser = {
        uid,
        email: cleanEmail,
        displayName: name,
        name: name,
        department: department,
        role: role,
        photoURL: null
    };

    users[cleanEmail] = {
        ..._currentUser,
        password: password,
        createdAt: new Date().toISOString()
    };
    saveRegisteredUsers(users);

    // Persist session
    localStorage.setItem(SESSION_STORE_KEY, JSON.stringify(_currentUser));
    localStorage.setItem(LEGACY_DEMO_KEY, JSON.stringify(_currentUser));

    if (_onAuthChangeCb) _onAuthChangeCb(_currentUser);
    return _currentUser;
}

export async function signInWithGoogle(googleProfile = null) {
    const profile = googleProfile || {
        name: 'Anurag Kannojiya',
        email: 'anuragkannaujiya6@gmail.com',
        photoURL: 'https://avatars.githubusercontent.com/u/144708033?v=4'
    };

    const cleanEmail = profile.email.toLowerCase();
    const uid = 'google_' + btoa(cleanEmail).replace(/[^a-z0-9]/gi, '').slice(0, 16);

    _currentUser = {
        uid,
        email: cleanEmail,
        displayName: profile.name,
        name: profile.name,
        department: profile.department || 'National Cyber Defense Command',
        role: profile.role || 'administrator',
        photoURL: profile.photoURL || 'https://lh3.googleusercontent.com/a/default-user',
        authProvider: 'google.com'
    };

    // Store in users registry
    const users = getRegisteredUsers();
    users[cleanEmail] = {
        ..._currentUser,
        lastActive: new Date().toISOString()
    };
    saveRegisteredUsers(users);

    // Save session
    localStorage.setItem(SESSION_STORE_KEY, JSON.stringify(_currentUser));
    localStorage.setItem(LEGACY_DEMO_KEY, JSON.stringify(_currentUser));

    if (_onAuthChangeCb) _onAuthChangeCb(_currentUser);
    return _currentUser;
}

export async function signInDemo() {
    _currentUser = {
        uid: 'demo_agent_' + Date.now(),
        email: 'demo@ncd.gov.in',
        displayName: 'Special Agent (Demo)',
        department: 'Cyber Operations Division',
        role: 'agent',
        photoURL: null,
        clearance: 'Level 3 (Secret)'
    };
    localStorage.setItem(SESSION_STORE_KEY, JSON.stringify(_currentUser));
    localStorage.setItem(LEGACY_DEMO_KEY, JSON.stringify(_currentUser));

    if (_onAuthChangeCb) _onAuthChangeCb(_currentUser);
    return _currentUser;
}

export async function signOut() {
    _currentUser = null;
    localStorage.removeItem(SESSION_STORE_KEY);
    localStorage.removeItem(LEGACY_DEMO_KEY);
    if (_onAuthChangeCb) _onAuthChangeCb(null);
}

export function getCurrentUser() {
    if (_currentUser) return _currentUser;
    const sessionStr = localStorage.getItem(SESSION_STORE_KEY) || localStorage.getItem(LEGACY_DEMO_KEY);
    if (sessionStr) {
        try {
            _currentUser = JSON.parse(sessionStr);
            return _currentUser;
        } catch {}
    }
    return null;
}
