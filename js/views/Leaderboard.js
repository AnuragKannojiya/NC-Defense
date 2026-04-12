// Real-time Leaderboard
import { getLeaderboard } from '../services/db.js';

export const Leaderboard = {
    render: async (profile) => {
        const users = await getLeaderboard();
        const uid = profile?.uid;
        return `
        <div class="page-header fade-in-up"><div class="page-header-row"><div><h1>National Leaderboard</h1><p>Real-time rankings across all agents. Complete modules and simulations to climb.</p></div><span class="badge badge-info">${users.length} Active Agents</span></div></div>

        <!-- Top 3 Podium -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-bottom:32px" class="fade-in-up">
            ${users.slice(0,3).map((u,i) => `
            <div class="card" style="text-align:center;padding:32px 20px;${u.uid===uid?'border-color:var(--accent-cyan);box-shadow:var(--shadow-neon);':''}">
                <div style="font-size:2.5rem;margin-bottom:8px">${['🥇','🥈','🥉'][i]}</div>
                <div class="avatar" style="width:56px;height:56px;font-size:1.2rem;margin:0 auto 12px;${i===0?'background:linear-gradient(135deg,#FFD700,#FFA500);':''}">${u.name.split(' ').map(n=>n[0]).join('')}</div>
                <h3 style="font-size:1rem;margin-bottom:4px">${u.name}${u.uid===uid?' (You)':''}</h3>
                <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:12px">${u.department}</p>
                <div style="font-size:1.5rem;font-weight:800;font-family:var(--font-display);color:var(--warning)">${u.totalPoints.toLocaleString()}</div>
                <div style="font-size:0.7rem;color:var(--text-muted)">points</div>
            </div>`).join('')}
        </div>

        <!-- Table -->
        <div class="card-flat fade-in-up" style="overflow-x:auto">
            <table class="leaderboard-table"><thead><tr><th>Rank</th><th>Agent</th><th>Department</th><th>Modules</th><th>Readiness</th><th>Points</th></tr></thead><tbody>
            ${users.map((u,i) => {
                const readiness = Math.round((u.modulesCompleted/13)*100);
                return `<tr style="${u.uid===uid?'outline:1px solid var(--accent-cyan);outline-offset:-1px;':''}"><td><span class="rank-badge ${i<3?'rank-'+(i+1):'rank-default'}">${i+1}</span></td><td><div style="display:flex;align-items:center;gap:12px"><div class="avatar" style="width:32px;height:32px;font-size:0.7rem">${u.name.split(' ').map(n=>n[0]).join('')}</div><div><div style="font-weight:600;font-size:0.85rem">${u.name} ${u.uid===uid?'<span style="color:var(--accent-cyan);font-size:0.7rem">(You)</span>':''}</div></div></div></td><td style="color:var(--text-secondary);font-size:0.85rem">${u.department}</td><td class="text-mono" style="font-size:0.85rem">${u.modulesCompleted}/13</td><td><div style="display:flex;align-items:center;gap:8px"><div class="progress-track" style="width:80px"><div class="progress-fill ${readiness>=80?'green':readiness>=50?'gradient':'warning'}" style="width:${readiness}%"></div></div><span class="text-mono" style="font-size:0.8rem;color:${readiness>=80?'var(--success)':readiness>=50?'var(--text-secondary)':'var(--danger)'}">${readiness}%</span></div></td><td><span style="font-weight:700;font-family:var(--font-mono);color:var(--warning)">${u.totalPoints.toLocaleString()}</span></td></tr>`;
            }).join('')}
            </tbody></table>
        </div>`;
    }
};
