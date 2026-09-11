// =====================================================================
// Settings View — Profile Management & Security Clearance
// =====================================================================
import { signOut } from '../services/auth.js';
import { resetAllData, updateUserProfile } from '../services/db.js';
import { showToast } from '../components/Toast.js';

export const Settings = {
    render: (profile) => {
        const p = profile || {};
        const completed = Object.values(p.progress || {}).filter(v => v.completed).length;
        const simsDone = Object.values(p.simulations || {}).filter(s => s.completed).length;
        const role = p.role || 'employee';
        const dept = p.department || 'Cyber Operations';

        return `
        <div class="page-header fade-in-up">
            <h1>Settings & Security Profile</h1>
            <p>Manage your identity, operational unit, clearance credentials, and training data.</p>
        </div>

        <div class="dashboard-row-equal">
            <!-- Profile Card -->
            <div class="card fade-in-up">
                <h3 class="mb-20">Security Profile</h3>
                <div style="display:flex;align-items:center;gap:18px;margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid var(--glass-border)">
                    <div class="avatar" style="width:60px;height:60px;font-size:1.4rem">
                        ${(p.displayName || p.name || 'A').split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
                    </div>
                    <div>
                        <h3 style="font-size:1.15rem;margin-bottom:2px">${p.displayName || p.name || 'Special Agent'}</h3>
                        <p style="color:var(--text-secondary);font-size:0.85rem">${p.email || '—'}</p>
                        <span class="badge ${p.clearance?.includes('Level 3') ? 'badge-danger' : 'badge-info'} mt-8">${p.clearance || 'Level 2 (Secret)'}</span>
                    </div>
                </div>

                <!-- Profile Edit Form -->
                <form id="profile-edit-form">
                    <div class="form-group">
                        <label class="form-label">Full Display Name</label>
                        <input type="text" class="form-input" id="set-name" value="${p.displayName || p.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tactical Department</label>
                        <select class="form-select" id="set-dept">
                            <option value="Cyber Operations" ${dept==='Cyber Operations'?'selected':''}>Cyber Operations Division</option>
                            <option value="Threat Intelligence" ${dept==='Threat Intelligence'?'selected':''}>Threat Intelligence Unit</option>
                            <option value="SOC Division" ${dept==='SOC Division'?'selected':''}>Security Operations Center (SOC)</option>
                            <option value="Network Defense" ${dept==='Network Defense'?'selected':''}>Network Defense & Perimeter</option>
                            <option value="Forensics Lab" ${dept==='Forensics Lab'?'selected':''}>Digital Forensics Lab</option>
                            <option value="Policy & Compliance" ${dept==='Policy & Compliance'?'selected':''}>Policy & Compliance Cell</option>
                            <option value="Finance Infra" ${dept==='Finance Infra'?'selected':''}>Critical Financial Infrastructure</option>
                            <option value="Administration" ${dept==='Administration'?'selected':''}>Strategic Administration</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Operational Role & Clearance</label>
                        <select class="form-select" id="set-role">
                            <option value="employee" ${role==='employee'?'selected':''}>Special Agent — Level 2 (Secret)</option>
                            <option value="manager" ${role==='manager'?'selected':''}>Operations Supervisor — Level 2 (Secret)</option>
                            <option value="admin" ${role==='admin'?'selected':''}>Lead Commander / Admin — Level 3 (Top Secret)</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary btn-sm" id="save-profile-btn" style="margin-top:6px;">
                        ✓ Update Profile & Clearance
                    </button>
                </form>
            </div>

            <!-- Training Stats -->
            <div class="card fade-in-up">
                <h3 class="mb-20">Operational Telemetry</h3>
                <div style="display:flex;flex-direction:column;gap:12px">
                    ${[
                        ['Modules Completed', `${completed}/13`, 'var(--accent-cyan)'],
                        ['Simulations Mastered', `${simsDone}/5`, 'var(--accent-cyan)'],
                        ['Assessments Taken', `${(p.quizScores || []).length}`, 'var(--accent-cyan)'],
                        ['Total Experience Points', `${(p.totalPoints || 0).toLocaleString()}`, 'var(--warning)'],
                        ['Incidents Logged', `${(p.incidents || []).length || 0}`, 'var(--accent-cyan)']
                    ].map(([label, val, color]) => `
                        <div class="flex-between" style="padding:12px 16px;background:var(--bg-secondary);border-radius:var(--border-radius-xs)">
                            <span style="color:var(--text-secondary);font-size:0.85rem">${label}</span>
                            <span class="text-mono" style="color:${color};font-weight:700;">${val}</span>
                        </div>
                    `).join('')}
                </div>

                <div style="margin-top:24px;padding:14px;background:var(--bg-secondary);border-radius:var(--border-radius-xs);border-left:3px solid var(--accent-cyan);font-size:0.8rem;color:var(--text-muted)">
                    <span>Registered since: <strong>${p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN', {year:'numeric',month:'short',day:'numeric'}) : 'Active Session'}</strong></span>
                </div>
            </div>
        </div>

        <!-- Account Actions -->
        <div class="card fade-in-up mt-24">
            <h3 class="mb-16">Session & Data Management</h3>
            <div style="display:flex;gap:12px;flex-wrap:wrap">
                <button class="btn btn-secondary signout-trigger" id="signout-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign Out of Session
                </button>
                <button class="btn btn-danger" id="reset-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    Reset Local Telemetry Data
                </button>
            </div>
        </div>`;
    },

    afterRender: () => {
        // Profile update
        document.getElementById('profile-edit-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('save-profile-btn');
            const name = document.getElementById('set-name')?.value.trim();
            const department = document.getElementById('set-dept')?.value;
            const role = document.getElementById('set-role')?.value;
            const clearance = role === 'admin' ? 'Level 3 (Top Secret)' : 'Level 2 (Secret)';

            if (btn) {
                btn.disabled = true;
                btn.textContent = 'Saving...';
            }

            const current = JSON.parse(localStorage.getItem('ncd_demo_user') || '{}');
            const uid = current.uid || (await import('../services/auth.js')).getCurrentUser()?.uid;

            if (uid) {
                await updateUserProfile(uid, {
                    displayName: name,
                    name: name,
                    department,
                    role,
                    clearance
                });
                showToast('Security profile and clearance level updated! 🎉', 'success');
                setTimeout(() => { window.location.hash = '#/'; }, 600);
            }
        });

        // Reset data
        document.getElementById('reset-btn')?.addEventListener('click', () => {
            if (confirm('⚠️ Delete ALL training data? This resets modules, quizzes, and simulations.')) {
                resetAllData();
                showToast('Telemetry data reset', 'danger');
                setTimeout(() => { window.location.hash = '#/'; window.location.reload(); }, 600);
            }
        });
    }
};
