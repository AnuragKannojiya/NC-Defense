// =====================================================================
// Database Service — Realtime Cloud Firestore & Resilient Local Storage
// =====================================================================
import { FIREBASE_CONFIGURED, firebaseConfig } from '../config-firebase.js';

// ---- Firestore bootstrap ----
let _db = null;

async function ensureDb() {
    if (!FIREBASE_CONFIGURED || _db) return _db;
    try {
        const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
        const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
        _db = getFirestore(app);
        return _db;
    } catch (err) {
        console.warn('Firestore initialization fallback to local storage:', err);
        return null;
    }
}

// ---- Local storage fallback store ----
const STORE_KEY = 'ncd_db_v4';
function getStore() {
    try {
        return JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    } catch {
        return {};
    }
}
function setStore(data) {
    try {
        localStorage.setItem(STORE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn('Local storage write warning:', e);
    }
}

// =====================================================================
// User Profile
// =====================================================================
export async function getUserProfile(uid) {
    if (!uid) return null;

    let cloudProfile = null;
    if (FIREBASE_CONFIGURED) {
        try {
            await ensureDb();
            if (_db) {
                const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
                const snap = await getDoc(doc(_db, 'users', uid));
                if (snap.exists()) {
                    cloudProfile = { uid, ...snap.data() };
                }
            }
        } catch (e) {
            console.warn('Firestore getUserProfile fallback:', e);
        }
    }

    const store = getStore();
    const localProfile = store.users?.[uid] ? { uid, ...store.users[uid] } : null;

    if (cloudProfile && localProfile) {
        const merged = { ...localProfile, ...cloudProfile };
        if (!store.users) store.users = {};
        store.users[uid] = merged;
        setStore(store);
        return merged;
    }

    return cloudProfile || localProfile;
}

export async function createUserProfile(uid, data) {
    if (!uid) return null;

    const profile = {
        displayName: data.displayName || data.name || 'Agent',
        name: data.displayName || data.name || 'Agent',
        email: data.email || '',
        department: data.department || 'Cyber Operations',
        role: data.role || 'employee',
        photoURL: data.photoURL || null,
        clearance: data.clearance || 'Level 2',
        totalPoints: data.totalPoints || 0,
        progress: data.progress || {},
        simulations: data.simulations || {},
        quizScores: data.quizScores || [],
        badges: data.badges || [],
        incidents: data.incidents || [],
        createdAt: data.createdAt || new Date().toISOString(),
        lastActive: new Date().toISOString()
    };

    // Cache immediately in local store
    const store = getStore();
    if (!store.users) store.users = {};
    store.users[uid] = { ...(store.users[uid] || {}), ...profile };
    setStore(store);

    // Sync to Cloud Firestore in background
    if (FIREBASE_CONFIGURED) {
        try {
            await ensureDb();
            if (_db) {
                const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
                await setDoc(doc(_db, 'users', uid), profile, { merge: true });
            }
        } catch (e) {
            console.warn('Firestore createUserProfile sync warning:', e);
        }
    }

    _notifyListeners('users');
    return { uid, ...profile };
}

export async function updateUserProfile(uid, updates) {
    if (!uid) return;

    // Cache locally
    const store = getStore();
    if (!store.users) store.users = {};
    if (!store.users[uid]) store.users[uid] = {};
    store.users[uid] = { ...store.users[uid], ...updates, lastActive: new Date().toISOString() };
    setStore(store);

    // Sync to Firestore
    if (FIREBASE_CONFIGURED) {
        try {
            await ensureDb();
            if (_db) {
                const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
                await updateDoc(doc(_db, 'users', uid), { ...updates, lastActive: new Date().toISOString() });
            }
        } catch (e) {
            console.warn('Firestore updateUserProfile sync warning:', e);
        }
    }
}

// =====================================================================
// Module Progress
// =====================================================================
export async function completeModule(uid, moduleKey, score = 100) {
    if (!uid) return null;

    // Update locally
    const store = getStore();
    if (!store.users) store.users = {};
    if (!store.users[uid]) {
        store.users[uid] = { totalPoints: 0, progress: {}, simulations: {}, quizScores: [], badges: [], incidents: [], createdAt: new Date().toISOString() };
    }
    if (!store.users[uid].progress) store.users[uid].progress = {};
    
    // Check if already completed to avoid duplicate points
    const alreadyDone = store.users[uid].progress[moduleKey]?.completed;
    const pointsAwarded = alreadyDone ? 0 : 250;

    store.users[uid].progress[moduleKey] = { completed: true, score, completedAt: new Date().toISOString() };
    store.users[uid].totalPoints = (store.users[uid].totalPoints || 0) + pointsAwarded;
    store.users[uid].lastActive = new Date().toISOString();
    setStore(store);
    _notifyListeners('users');

    // Sync to Firestore
    if (FIREBASE_CONFIGURED) {
        try {
            await ensureDb();
            if (_db) {
                const { doc, updateDoc, increment } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
                const updatePayload = {
                    [`progress.${moduleKey}`]: { completed: true, score, completedAt: new Date().toISOString() },
                    lastActive: new Date().toISOString()
                };
                if (pointsAwarded > 0) {
                    updatePayload.totalPoints = increment(pointsAwarded);
                }
                await updateDoc(doc(_db, 'users', uid), updatePayload);
            }
        } catch (e) {
            console.warn('Firestore completeModule sync warning:', e);
        }
    }

    return { uid, ...store.users[uid] };
}

// =====================================================================
// Simulations
// =====================================================================
export async function saveSimulation(uid, simKey, score) {
    if (!uid) return null;

    // Update locally
    const store = getStore();
    if (!store.users) store.users = {};
    if (!store.users[uid]) {
        store.users[uid] = { totalPoints: 0, progress: {}, simulations: {}, quizScores: [], badges: [], incidents: [], createdAt: new Date().toISOString() };
    }
    if (!store.users[uid].simulations) store.users[uid].simulations = {};
    
    const prev = store.users[uid].simulations[simKey] || {};
    const attempts = (prev.attempts || 0) + 1;
    const pointsToAdd = Math.round(score * 5);

    store.users[uid].simulations[simKey] = { completed: true, score, attempts, lastAttempt: new Date().toISOString() };
    store.users[uid].totalPoints = (store.users[uid].totalPoints || 0) + pointsToAdd;
    store.users[uid].lastActive = new Date().toISOString();
    setStore(store);
    _notifyListeners('users');

    // Sync to Firestore
    if (FIREBASE_CONFIGURED) {
        try {
            await ensureDb();
            if (_db) {
                const { doc, updateDoc, increment } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
                await updateDoc(doc(_db, 'users', uid), {
                    [`simulations.${simKey}`]: { completed: true, score, attempts, lastAttempt: new Date().toISOString() },
                    totalPoints: increment(pointsToAdd),
                    lastActive: new Date().toISOString()
                });
            }
        } catch (e) {
            console.warn('Firestore saveSimulation sync warning:', e);
        }
    }

    return { uid, ...store.users[uid] };
}

// =====================================================================
// Quiz Scores
// =====================================================================
export async function saveQuizScore(uid, quizName, score, total) {
    if (!uid) return null;

    const percentage = Math.round((score / total) * 100);
    const entry = { name: quizName, score, total, percentage, date: new Date().toISOString() };
    const points = score * 50;

    // Local update
    const store = getStore();
    if (!store.users) store.users = {};
    if (!store.users[uid]) {
        store.users[uid] = { totalPoints: 0, progress: {}, simulations: {}, quizScores: [], badges: [], incidents: [], createdAt: new Date().toISOString() };
    }
    if (!store.users[uid].quizScores) store.users[uid].quizScores = [];
    store.users[uid].quizScores.push(entry);
    store.users[uid].totalPoints = (store.users[uid].totalPoints || 0) + points;
    store.users[uid].lastActive = new Date().toISOString();
    setStore(store);
    _notifyListeners('users');

    // Firestore sync
    if (FIREBASE_CONFIGURED) {
        try {
            await ensureDb();
            if (_db) {
                const { doc, updateDoc, arrayUnion, increment } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
                await updateDoc(doc(_db, 'users', uid), {
                    quizScores: arrayUnion(entry),
                    totalPoints: increment(points),
                    lastActive: new Date().toISOString()
                });
            }
        } catch (e) {
            console.warn('Firestore saveQuizScore sync warning:', e);
        }
    }

    return { uid, ...store.users[uid] };
}

// =====================================================================
// Incidents
// =====================================================================
export async function createIncident(uid, incident) {
    const newInc = {
        ...incident,
        id: 'inc_' + Date.now(),
        reportedBy: uid,
        date: new Date().toISOString(),
        status: 'open'
    };

    // Save locally
    const store = getStore();
    if (!store.incidents) store.incidents = [];
    store.incidents.unshift(newInc);
    setStore(store);
    _notifyListeners('incidents');

    // Sync to Firestore
    if (FIREBASE_CONFIGURED) {
        try {
            await ensureDb();
            if (_db) {
                const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
                const ref = await addDoc(collection(_db, 'incidents'), newInc);
                newInc.id = ref.id;
            }
        } catch (e) {
            console.warn('Firestore createIncident fallback:', e);
        }
    }

    return newInc;
}

export async function getIncidents(uid) {
    if (FIREBASE_CONFIGURED) {
        try {
            await ensureDb();
            if (_db) {
                const { collection, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
                const q = query(collection(_db, 'incidents'), where('reportedBy', '==', uid));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
                }
            }
        } catch (e) {
            console.warn('Firestore getIncidents fallback:', e);
        }
    }
    const store = getStore();
    return (store.incidents || []).filter(i => !uid || i.reportedBy === uid);
}

export async function getAllIncidents() {
    if (FIREBASE_CONFIGURED) {
        try {
            await ensureDb();
            if (_db) {
                const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
                const snap = await getDocs(collection(_db, 'incidents'));
                if (!snap.empty) {
                    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
                }
            }
        } catch (e) {
            console.warn('Firestore getAllIncidents fallback:', e);
        }
    }
    const store = getStore();
    return store.incidents || [
        { id: 'inc_1', title: 'Suspicious BEC Email from spoofed CISO domain', type: 'Phishing', severity: 'critical', status: 'open', date: new Date(Date.now() - 3600000).toISOString(), reportedByName: 'Special Agent Vikram' },
        { id: 'inc_2', title: 'Malicious BadUSB device discovered in Parking B', type: 'Physical Security', severity: 'high', status: 'investigating', date: new Date(Date.now() - 86400000).toISOString(), reportedByName: 'Security Team' }
    ];
}

// Real-time Firestore Listeners
export async function subscribeIncidents(callback) {
    if (FIREBASE_CONFIGURED) {
        try {
            await ensureDb();
            if (_db) {
                const { collection, onSnapshot } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
                return onSnapshot(collection(_db, 'incidents'), (snapshot) => {
                    const incidents = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                    callback(incidents);
                });
            }
        } catch (e) {
            console.warn('Realtime incident listener fallback:', e);
        }
    }
    onDataChange('incidents', () => {
        callback(getStore().incidents || []);
    });
}

// =====================================================================
// Leaderboard & Users
// =====================================================================
const MOCK_USERS = [
    { uid: 'm1', name: 'Dr. Priya Sharma', department: 'Cyber Operations', totalPoints: 5200, modulesCompleted: 13 },
    { uid: 'm2', name: 'Commander Rajesh Kumar', department: 'Threat Intelligence', totalPoints: 4750, modulesCompleted: 12 },
    { uid: 'm3', name: 'Ananya Patel', department: 'SOC Division', totalPoints: 4100, modulesCompleted: 11 },
    { uid: 'm4', name: 'Vikram Singh', department: 'Network Defense', totalPoints: 3600, modulesCompleted: 10 },
    { uid: 'm5', name: 'Meera Nair', department: 'Policy Division', totalPoints: 3100, modulesCompleted: 9 },
    { uid: 'm6', name: 'Arjun Mehta', department: 'Forensics Lab', totalPoints: 2800, modulesCompleted: 8 },
    { uid: 'm7', name: 'Kavita Desai', department: 'Security Audit', totalPoints: 2450, modulesCompleted: 7 },
    { uid: 'm8', name: 'Sunil Gupta', department: 'Finance Infra', totalPoints: 2100, modulesCompleted: 6 },
    { uid: 'm9', name: 'Divya Reddy', department: 'Public Key Infra', totalPoints: 1850, modulesCompleted: 5 },
    { uid: 'm10', name: 'Manish Tiwari', department: 'Field Operations', totalPoints: 1500, modulesCompleted: 4 },
];

export async function getLeaderboard() {
    let realUsers = [];
    if (FIREBASE_CONFIGURED) {
        try {
            await ensureDb();
            if (_db) {
                const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
                const snap = await getDocs(collection(_db, 'users'));
                realUsers = snap.docs.map(d => {
                    const u = d.data();
                    return {
                        uid: d.id,
                        name: u.displayName || u.name || 'Agent',
                        department: u.department || 'Cyber Operations',
                        totalPoints: u.totalPoints || 0,
                        modulesCompleted: Object.values(u.progress || {}).filter(p => p.completed).length
                    };
                });
            }
        } catch (e) {
            console.warn('Firestore getLeaderboard fallback:', e);
        }
    }
    
    // Merge with local store users
    const store = getStore();
    const localUsers = Object.entries(store.users || {}).map(([uid, u]) => ({
        uid,
        name: u.displayName || u.name || 'Agent',
        department: u.department || 'Cyber Operations',
        totalPoints: u.totalPoints || 0,
        modulesCompleted: Object.values(u.progress || {}).filter(p => p.completed).length
    }));

    // Deduplicate users
    const userMap = new Map();
    realUsers.forEach(u => userMap.set(u.uid, u));
    localUsers.forEach(u => {
        if (!userMap.has(u.uid) || (u.totalPoints > (userMap.get(u.uid).totalPoints || 0))) {
            userMap.set(u.uid, u);
        }
    });

    // Add mock roster for rich leaderboard
    MOCK_USERS.forEach(m => {
        if (!userMap.has(m.uid)) userMap.set(m.uid, m);
    });

    const all = Array.from(userMap.values());
    all.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
    return all;
}

export async function getAllUsers() {
    let users = [];
    if (FIREBASE_CONFIGURED) {
        try {
            await ensureDb();
            if (_db) {
                const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
                const snap = await getDocs(collection(_db, 'users'));
                users = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
            }
        } catch (e) {
            console.warn('Firestore getAllUsers fallback:', e);
        }
    }

    const store = getStore();
    const localUsers = Object.entries(store.users || {}).map(([uid, u]) => ({ uid, ...u }));
    
    const userMap = new Map();
    users.forEach(u => userMap.set(u.uid, u));
    localUsers.forEach(u => {
        if (!userMap.has(u.uid)) userMap.set(u.uid, u);
    });

    if (userMap.size === 0) {
        MOCK_USERS.slice(0, 5).forEach(m => {
            userMap.set(m.uid, {
                ...m,
                displayName: m.name,
                email: `${m.name.toLowerCase().replace(/[^a-z]/g, '')}@ncd.gov.in`,
                role: 'Special Agent',
                lastActive: new Date().toISOString()
            });
        });
    }

    return Array.from(userMap.values());
}

// =====================================================================
// Real-time Event System
// =====================================================================
const _listeners = {};
export function onDataChange(collection, callback) {
    if (!_listeners[collection]) _listeners[collection] = [];
    _listeners[collection].push(callback);
}
function _notifyListeners(collection) {
    (_listeners[collection] || []).forEach(cb => {
        try { cb(); } catch (e) { console.warn('Listener notification error:', e); }
    });
}

export function resetAllData() {
    localStorage.removeItem(STORE_KEY);
    localStorage.removeItem('ncd_demo_user');
}
