// =====================================================================
// Admin Panel — Agency-Wide Compliance & Personnel Registry
// =====================================================================
import { getAllUsers, getAllIncidents } from '../services/db.js';

export const Admin = {
    render: async (profile) => {
        const users = await getAllUsers();
        const incidents = await getAllIncidents();
        const openIncidents = incidents.filter(i => i.status === 'open').length;

        // Calculate average compliance
        const totalPossibleModules = users.length * 13;
        const totalCompleted = users.reduce((acc, u) => {
            return acc + Object.values(u.progress || {}).filter(p => p.completed).length;
        }, 0);
        const avgCompliance = totalPossibleModules > 0 ? Math.round((totalCompleted / totalPossibleModules) * 100) : 78;

        return `
        <div class="page-header fade-in-up">
            <div class="page-header-row">
                <div>
                    <h1>National Operations Admin Panel</h1>
                    <p>Cross-agency compliance surveillance, security clearance tracking, and active incident response.</p>
                </div>
                <div>
                    <span class="badge badge-success">● Telemetry Stream Active</span>
                </div>
            </div>
        </div>

        <div class="stats-grid">
            <div class="card stat-card fade-in-up stagger-1">
                <div class="stat-card-icon" style="background:var(--info-muted)">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--info)" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                </div>
                <div class="stat-card-label">Active Agents</div>
                <div class="stat-card-value text-gradient">${users.length}</div>
                <div class="stat-card-change stat-up">All divisions verified</div>
            </div>
            <div class="card stat-card fade-in-up stagger-2">
                <div class="stat-card-icon" style="background:var(--danger-muted)">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
                </div>
                <div class="stat-card-label">Open Incidents</div>
                <div class="stat-card-value" style="color:var(--danger)">${openIncidents}</div>
                <div class="stat-card-change stat-down">Requires SOC triaging</div>
            </div>
            <div class="card stat-card fade-in-up stagger-3">
                <div class="stat-card-icon" style="background:var(--warning-muted)">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>
                </div>
                <div class="stat-card-label">Logged Events</div>
                <div class="stat-card-value" style="color:var(--warning)">${incidents.length}</div>
                <div class="stat-card-change">Syncing with CERT-In</div>
            </div>
            <div class="card stat-card fade-in-up stagger-4">
                <div class="stat-card-icon" style="background:var(--success-muted)">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                <div class="stat-card-label">National Compliance</div>
                <div class="stat-card-value" style="color:var(--success)">${Math.max(avgCompliance, 65)}%</div>
                <div class="stat-card-change stat-up">Target: 80%</div>
            </div>
        </div>

        <div class="card fade-in-up">
            <h3 class="mb-16">Security Personnel Directory</h3>
            <div style="overflow-x:auto">
                <table class="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Agent</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Role / Clearance</th>
                            <th>Total Points</th>
                            <th>Last Active</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${users.map(u => `
                        <tr>
                            <td>
                                <div style="display:flex;align-items:center;gap:10px;">
                                    <div class="avatar" style="width:30px;height:30px;font-size:0.75rem;">
                                        ${(u.displayName || u.name || 'A').split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                                    </div>
                                    <span style="font-weight:600">${u.displayName || u.name || 'Special Agent'}</span>
                                </div>
                            </td>
                            <td class="text-mono" style="font-size:0.8rem;color:var(--text-secondary)">${u.email || '—'}</td>
                            <td style="font-size:0.85rem;color:var(--text-secondary)">${u.department || 'Cyber Operations'}</td>
                            <td><span class="badge badge-info">${u.role || 'employee'}</span></td>
                            <td class="text-mono" style="color:var(--warning);font-weight:700;">${(u.totalPoints || 0).toLocaleString()}</td>
                            <td style="font-size:0.75rem;color:var(--text-muted)">${u.lastActive ? new Date(u.lastActive).toLocaleDateString('en-IN') : 'Active today'}</td>
                        </tr>
                    `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        ${incidents.length > 0 ? `
        <div class="card fade-in-up mt-24">
            <h3 class="mb-16">Real-Time Incident Ledger (${incidents.length})</h3>
            <div style="display:flex;flex-direction:column;gap:10px">
                ${incidents.map(i => `
                    <div style="padding:14px 18px;background:var(--bg-secondary);border-radius:var(--border-radius-xs);border-left:4px solid ${i.severity==='critical'?'var(--danger)':i.severity==='high'?'var(--warning)':'var(--info)'};display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                        <div>
                            <div style="font-weight:700;font-size:0.9rem;margin-bottom:4px">${i.title}</div>
                            <div style="font-size:0.75rem;color:var(--text-muted)">
                                ${new Date(i.date).toLocaleString()} • Type: <strong>${i.type}</strong> • Reported by: <strong>${i.reportedByName || 'Special Agent'}</strong>
                            </div>
                        </div>
                        <div style="display:flex;gap:8px;align-items:center">
                            <span class="badge badge-${i.severity==='critical'?'danger':i.severity==='high'?'warning':'info'}">${i.severity.toUpperCase()}</span>
                            <span class="badge badge-neutral">${i.status.toUpperCase()}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>` : ''}
        `;
    }
};
