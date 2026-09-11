// Settings View
import { signOut } from '../services/auth.js';
import { resetAllData } from '../services/db.js';
import { showToast } from '../components/Toast.js';

export const Settings = {
    render: (profile) => {
        const p = profile || {};
        const completed = Object.values(p.progress||{}).filter(v=>v.completed).length;
        const simsDone = Object.values(p.simulations||{}).filter(s=>s.completed).length;
        return `
        <div class="page-header fade-in-up"><h1>Settings</h1><p>Manage your profile, preferences, and training data.</p></div>
        <div class="dashboard-row-equal">
            <div class="card fade-in-up">
                <h3 class="mb-24">Profile Information</h3>
                <div style="display:flex;align-items:center;gap:20px;margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid var(--glass-border)">
                    <div class="avatar" style="width:64px;height:64px;font-size:1.5rem">${(p.displayName||p.name||'A').split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}</div>
                    <div><h3 style="font-size:1.1rem">${p.displayName||p.name||'Agent'}</h3><p style="color:var(--text-secondary);font-size:0.85rem">${p.role||'Employee'}</p><span class="badge badge-info mt-8">${p.clearance||'Level 2'}</span></div>
                </div>
                <div style="display:flex;flex-direction:column;gap:16px">
                    <div class="flex-between"><span style="color:var(--text-muted);font-size:0.85rem">Email</span><span class="text-mono" style="font-size:0.85rem">${p.email||'—'}</span></div>
                    <div class="flex-between"><span style="color:var(--text-muted);font-size:0.85rem">Department</span><span style="font-size:0.85rem">${p.department||'Unassigned'}</span></div>
                    <div class="flex-between"><span style="color:var(--text-muted);font-size:0.85rem">Member Since</span><span class="text-mono" style="font-size:0.85rem">${p.createdAt?new Date(p.createdAt).toLocaleDateString('en-IN',{year:'numeric',month:'long'}):new Date().toLocaleDateString('en-IN',{year:'numeric',month:'long'})}</span></div>
                </div>
            </div>
            <div class="card fade-in-up">
                <h3 class="mb-24">Training Statistics</h3>
                <div style="display:flex;flex-direction:column;gap:12px">
                    ${[['Modules Completed',`${completed}/13`,'var(--accent-cyan)'],['Simulations Passed',`${simsDone}/5`,'var(--accent-cyan)'],['Quizzes Taken',`${(p.quizScores||[]).length}`,'var(--accent-cyan)'],['Total Points',`${(p.totalPoints||0).toLocaleString()}`,'var(--warning)'],['Incidents Reported',`${(p.incidents||[]).length||0}`,'var(--accent-cyan)']].map(([label,val,color])=>`<div class="flex-between" style="padding:12px 16px;background:var(--bg-secondary);border-radius:var(--border-radius-xs)"><span style="color:var(--text-secondary);font-size:0.85rem">${label}</span><span class="text-mono" style="color:${color}">${val}</span></div>`).join('')}
                </div>
            </div>
        </div>
        <div class="card fade-in-up mt-24">
            <h3 class="mb-16">Cloud Backend & OAuth Configuration</h3>
            <div style="font-size:0.85rem;color:var(--text-secondary);line-height:1.6;margin-bottom:16px;">
                Connected Project: <strong style="color:var(--accent-cyan);font-family:var(--font-mono)">anup-bfc5f-cbd76</strong> • 
                Realtime Firestore: <span class="badge badge-info">Active</span> • 
                Google OAuth: <span class="badge badge-success">Enabled</span>
            </div>
            <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:12px;">
                To enable Google OAuth and Firestore on your Firebase project, ensure Email/Password and Google providers are enabled in Firebase Console and your domain is in Authorized Domains.
            </div>
            <a href="https://console.firebase.google.com/project/anup-bfc5f-cbd76/authentication/providers" target="_blank" class="btn btn-secondary btn-sm" style="display:inline-flex;align-items:center;gap:6px">
                Open Firebase Authentication Console ↗
            </a>
        </div>
        <div class="card fade-in-up mt-24"><h3 class="mb-16">Account Actions</h3><div style="display:flex;gap:12px;flex-wrap:wrap"><button class="btn btn-secondary" id="signout-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> Sign Out</button><button class="btn btn-danger" id="reset-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg> Reset All Data</button></div></div>`;
    },
    afterRender: () => {
        document.getElementById('signout-btn')?.addEventListener('click', async () => {
            await signOut();
            showToast('Signed out of National Cyber Defense platform', 'info');
        });
        document.getElementById('reset-btn')?.addEventListener('click', () => {
            if (confirm('⚠️ Delete ALL data? This cannot be undone.')) {
                resetAllData();
                showToast('All data reset', 'danger');
                setTimeout(() => { window.location.hash = '#/'; window.location.reload(); }, 1000);
            }
        });
    }
};
