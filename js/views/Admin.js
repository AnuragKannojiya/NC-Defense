// Admin Panel
import { getAllUsers, getAllIncidents } from '../services/db.js';

export const Admin = {
    render: async (profile) => {
        const users = await getAllUsers();
        const incidents = await getAllIncidents();
        const openIncidents = incidents.filter(i => i.status === 'open').length;
        return `
        <div class="page-header fade-in-up"><h1>Admin Panel</h1><p>Organization-wide training compliance and user management.</p></div>
        <div class="stats-grid">
            <div class="card stat-card fade-in-up"><div class="stat-card-label">Total Users</div><div class="stat-card-value text-gradient">${users.length || 1}</div></div>
            <div class="card stat-card fade-in-up"><div class="stat-card-label">Open Incidents</div><div class="stat-card-value" style="color:var(--danger)">${openIncidents}</div></div>
            <div class="card stat-card fade-in-up"><div class="stat-card-label">Total Incidents</div><div class="stat-card-value" style="color:var(--warning)">${incidents.length}</div></div>
            <div class="card stat-card fade-in-up"><div class="stat-card-label">Avg Compliance</div><div class="stat-card-value" style="color:var(--success)">72%</div></div>
        </div>
        <div class="card fade-in-up"><h3 class="mb-16">Registered Users</h3>
            <div style="overflow-x:auto"><table class="leaderboard-table"><thead><tr><th>User</th><th>Email</th><th>Department</th><th>Role</th><th>Points</th><th>Last Active</th></tr></thead><tbody>
            ${users.map(u => `<tr><td style="font-weight:600">${u.displayName||u.name||'Unknown'}</td><td class="text-mono" style="font-size:0.8rem;color:var(--text-secondary)">${u.email||'—'}</td><td style="font-size:0.85rem;color:var(--text-secondary)">${u.department||'—'}</td><td><span class="badge badge-info">${u.role||'employee'}</span></td><td class="text-mono" style="color:var(--warning)">${(u.totalPoints||0).toLocaleString()}</td><td style="font-size:0.75rem;color:var(--text-muted)">${u.lastActive?new Date(u.lastActive).toLocaleDateString():''}</td></tr>`).join('')}
            ${users.length===0?'<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:40px">No users registered yet</td></tr>':''}
            </tbody></table></div>
        </div>
        ${incidents.length > 0 ? `<div class="card fade-in-up mt-24"><h3 class="mb-16">All Incidents (${incidents.length})</h3><div style="display:flex;flex-direction:column;gap:8px">${incidents.map(i=>`<div style="padding:12px 16px;background:var(--bg-secondary);border-radius:var(--border-radius-xs);border-left:3px solid ${i.severity==='critical'?'var(--danger)':i.severity==='high'?'var(--warning)':'var(--info)'}"><div class="flex-between"><span style="font-weight:600;font-size:0.85rem">${i.title}</span><div style="display:flex;gap:8px"><span class="badge badge-${i.severity==='critical'?'danger':i.severity==='high'?'warning':'info'}">${i.severity}</span><span class="badge badge-neutral">${i.status}</span></div></div><div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px">${new Date(i.date).toLocaleString()} — by ${i.reportedByName||'Unknown'}</div></div>`).join('')}</div></div>` : ''}`;
    }
};
