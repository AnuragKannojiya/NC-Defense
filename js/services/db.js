// =====================================================================
// Database Service — Firestore (when configured) + localStorage fallback
// =====================================================================
import { FIREBASE_CONFIGURED, firebaseConfig } from '../config-firebase.js';

// ---- Firestore bootstrap ----
let _db = null;

async function ensureDb() {
    if (!FIREBASE_CONFIGURED || _db) return;
    const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
    const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    _db = getFirestore(app);
}

// ---- localStorage helpers ----
const STORE_KEY = 'ncd_db_v3';
function getStore() { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); }
function setStore(data) { localStorage.setItem(STORE_KEY, JSON.stringify(data)); }

// =====================================================================
// User Profile
// =====================================================================
export async function getUserProfile(uid) {
    if (FIREBASE_CONFIGURED) {
        await ensureDb();
        const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const snap = await getDoc(doc(_db, 'users', uid));
        return snap.exists() ? { uid, ...snap.data() } : null;
    }
    const store = getStore();
    return store.users?.[uid] ? { uid, ...store.users[uid] } : null;
}

export async function createUserProfile(uid, data) {
    const profile = {
        ...data,
        totalPoints: 0,
        progress: {},
        simulations: {},
        quizScores: [],
        badges: [],
        incidents: [],
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
    };
    if (FIREBASE_CONFIGURED) {
        await ensureDb();
        const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        await setDoc(doc(_db, 'users', uid), profile);
        return { uid, ...profile };
    }
    const store = getStore();
    if (!store.users) store.users = {};
    store.users[uid] = profile;
    setStore(store);
    return { uid, ...profile };
}

export async function updateUserProfile(uid, updates) {
    if (FIREBASE_CONFIGURED) {
        await ensureDb();
        const { doc, updateDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        await updateDoc(doc(_db, 'users', uid), { ...updates, lastActive: new Date().toISOString() });
        return;
    }
    const store = getStore();
    if (!store.users) store.users = {};
    if (!store.users[uid]) store.users[uid] = {};
    store.users[uid] = { ...store.users[uid], ...updates, lastActive: new Date().toISOString() };
    setStore(store);
}

// =====================================================================
// Module Progress
// =====================================================================
export async function completeModule(uid, moduleKey, score = 100) {
    const update = {
        [`progress.${moduleKey}`]: { completed: true, score, completedAt: new Date().toISOString() }
    };
    if (FIREBASE_CONFIGURED) {
        await ensureDb();
        const { doc, updateDoc, increment } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        await updateDoc(doc(_db, 'users', uid), { ...update, totalPoints: increment(250), lastActive: new Date().toISOString() });
        return await getUserProfile(uid);
    }
    const store = getStore();
    if (!store.users) store.users = {};
    if (!store.users[uid]) {
        store.users[uid] = { totalPoints: 0, progress: {}, simulations: {}, quizScores: [], badges: [], incidents: [], createdAt: new Date().toISOString() };
    }
    if (!store.users[uid].progress) store.users[uid].progress = {};
    store.users[uid].progress[moduleKey] = { completed: true, score, completedAt: new Date().toISOString() };
    store.users[uid].totalPoints = (store.users[uid].totalPoints || 0) + 250;
    store.users[uid].lastActive = new Date().toISOString();
    setStore(store);
    _notifyListeners('users');
    return { uid, ...store.users[uid] };
}

// =====================================================================
// Simulations
// =====================================================================
export async function saveSimulation(uid, simKey, score) {
    if (FIREBASE_CONFIGURED) {
        await ensureDb();
        const { doc, updateDoc, increment } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const profile = await getUserProfile(uid);
        const prev = profile?.simulations?.[simKey]?.attempts || 0;
        await updateDoc(doc(_db, 'users', uid), {
            [`simulations.${simKey}`]: { completed: true, score, attempts: prev + 1, lastAttempt: new Date().toISOString() },
            totalPoints: increment(Math.round(score * 5)),
            lastActive: new Date().toISOString()
        });
        return await getUserProfile(uid);
    }
    const store = getStore();
    if (!store.users) store.users = {};
    if (!store.users[uid]) {
        store.users[uid] = { totalPoints: 0, progress: {}, simulations: {}, quizScores: [], badges: [], incidents: [], createdAt: new Date().toISOString() };
    }
    if (!store.users[uid].simulations) store.users[uid].simulations = {};
    const prev = store.users[uid].simulations[simKey]?.attempts || 0;
    store.users[uid].simulations[simKey] = { completed: true, score, attempts: prev + 1, lastAttempt: new Date().toISOString() };
    store.users[uid].totalPoints = (store.users[uid].totalPoints || 0) + Math.round(score * 5);
    store.users[uid].lastActive = new Date().toISOString();
    setStore(store);
    _notifyListeners('users');
    return { uid, ...store.users[uid] };
}

// =====================================================================
// Quiz Scores
// =====================================================================
export async function saveQuizScore(uid, quizName, score, total) {
    const entry = { name: quizName, score, total, percentage: Math.round((score / total) * 100), date: new Date().toISOString() };
    if (FIREBASE_CONFIGURED) {
        await ensureDb();
        const { doc, updateDoc, arrayUnion, increment } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        await updateDoc(doc(_db, 'users', uid), {
            quizScores: arrayUnion(entry),
            totalPoints: increment(score * 50),
            lastActive: new Date().toISOString()
        });
        return await getUserProfile(uid);
    }
    const store = getStore();
    if (!store.users) store.users = {};
    if (!store.users[uid]) {
        store.users[uid] = { totalPoints: 0, progress: {}, simulations: {}, quizScores: [], badges: [], incidents: [], createdAt: new Date().toISOString() };
    }
    if (!store.users[uid].quizScores) store.users[uid].quizScores = [];
    store.users[uid].quizScores.push(entry);
    store.users[uid].totalPoints = (store.users[uid].totalPoints || 0) + (score * 50);
    store.users[uid].lastActive = new Date().toISOString();
    setStore(store);
    _notifyListeners('users');
    return { uid, ...store.users[uid] };
}

// =====================================================================
// Incidents
// =====================================================================
export async function createIncident(uid, incident) {
    const newInc = { ...incident, id: 'inc_' + Date.now(), reportedBy: uid, date: new Date().toISOString(), status: 'open' };
    if (FIREBASE_CONFIGURED) {
        await ensureDb();
        const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const ref = await addDoc(collection(_db, 'incidents'), newInc);
        return { ...newInc, id: ref.id };
    }
    const store = getStore();
    if (!store.incidents) store.incidents = [];
    store.incidents.push(newInc);
    setStore(store);
    _notifyListeners('incidents');
    return newInc;
}

export async function getIncidents(uid) {
    if (FIREBASE_CONFIGURED) {
        await ensureDb();
        const { collection, query, where, getDocs, orderBy } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const q = query(collection(_db, 'incidents'), where('reportedBy', '==', uid));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    const store = getStore();
    return (store.incidents || []).filter(i => i.reportedBy === uid);
}

export async function getAllIncidents() {
    if (FIREBASE_CONFIGURED) {
        await ensureDb();
        const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const snap = await getDocs(collection(_db, 'incidents'));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    const store = getStore();
    return store.incidents || [];
}

// =====================================================================
// Leaderboard
// =====================================================================
const MOCK_USERS = [
    { uid: 'm1', name: 'Priya Sharma', department: 'Cyber Operations', totalPoints: 4850, modulesCompleted: 13 },
    { uid: 'm2', name: 'Rajesh Kumar', department: 'Threat Intelligence', totalPoints: 4200, modulesCompleted: 12 },
    { uid: 'm3', name: 'Ananya Patel', department: 'SOC Division', totalPoints: 3800, modulesCompleted: 11 },
    { uid: 'm4', name: 'Vikram Singh', department: 'Network Defense', totalPoints: 3400, modulesCompleted: 10 },
    { uid: 'm5', name: 'Meera Nair', department: 'Policy Division', totalPoints: 2900, modulesCompleted: 9 },
    { uid: 'm6', name: 'Arjun Mehta', department: 'Forensics Lab', totalPoints: 2650, modulesCompleted: 8 },
    { uid: 'm7', name: 'Kavita Desai', department: 'HR Division', totalPoints: 2400, modulesCompleted: 7 },
    { uid: 'm8', name: 'Sunil Gupta', department: 'Finance', totalPoints: 2100, modulesCompleted: 6 },
    { uid: 'm9', name: 'Divya Reddy', department: 'Administration', totalPoints: 1800, modulesCompleted: 5 },
    { uid: 'm10', name: 'Manish Tiwari', department: 'Field Operations', totalPoints: 1500, modulesCompleted: 4 },
    { uid: 'm11', name: 'Neha Kapoor', department: 'Legal', totalPoints: 1200, modulesCompleted: 3 },
    { uid: 'm12', name: 'Rohan Joshi', department: 'Research', totalPoints: 900, modulesCompleted: 2 },
];

export async function getLeaderboard() {
    let realUsers = [];
    if (FIREBASE_CONFIGURED) {
        await ensureDb();
        const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const snap = await getDocs(collection(_db, 'users'));
        realUsers = snap.docs.map(d => {
            const u = d.data();
            return { uid: d.id, name: u.displayName || u.name || 'Agent', department: u.department || 'Unassigned', totalPoints: u.totalPoints || 0, modulesCompleted: Object.values(u.progress || {}).filter(p => p.completed).length };
        });
    } else {
        const store = getStore();
        realUsers = Object.entries(store.users || {}).map(([uid, u]) => ({
            uid, name: u.displayName || u.name || 'Agent', department: u.department || 'Unassigned', totalPoints: u.totalPoints || 0, modulesCompleted: Object.values(u.progress || {}).filter(p => p.completed).length
        }));
    }
    const all = [...realUsers, ...MOCK_USERS.filter(m => !realUsers.find(r => r.uid === m.uid))];
    all.sort((a, b) => b.totalPoints - a.totalPoints);
    return all;
}

// =====================================================================
// Admin
// =====================================================================
export async function getAllUsers() {
    if (FIREBASE_CONFIGURED) {
        await ensureDb();
        const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const snap = await getDocs(collection(_db, 'users'));
        return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
    }
    const store = getStore();
    return Object.entries(store.users || {}).map(([uid, u]) => ({ uid, ...u }));
}

// =====================================================================
// Real-time simulation (localStorage only)
// =====================================================================
const _listeners = {};
export function onDataChange(collection, callback) {
    if (!_listeners[collection]) _listeners[collection] = [];
    _listeners[collection].push(callback);
}
function _notifyListeners(collection) {
    (_listeners[collection] || []).forEach(cb => cb());
}

// =====================================================================
// Reset
// =====================================================================
export function resetAllData() { localStorage.removeItem(STORE_KEY); }
