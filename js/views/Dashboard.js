// Dashboard View — Command Center
import { createDoughnutChart, createRadarChart, createLineChart } from '../components/Charts.js';
import { MODULES } from '../data/modules.js';

export const Dashboard = {
    render: (profile) => {
        const p = profile || {};
        const progress = p.progress || {};
        const totalModules = MODULES.length;
        const completedModules = Object.values(progress).filter(v => v.completed).length;
        const completionPct = Math.round((completedModules / totalModules) * 100);
        const sims = p.simulations || {};
        const simsDone = Object.values(sims).filter(s => s.completed).length;
        const simsAvg = simsDone > 0 ? Math.round(Object.values(sims).filter(s=>s.completed).reduce((a,s)=>a+s.score,0)/simsDone) : 0;
        const quizzes = p.quizScores || [];
        const bestQuiz = quizzes.length ? Math.max(...quizzes.map(q=>q.percentage)) : 0;
        const points = p.totalPoints || 0;

        const threatDots = [{t:'18%',l:'12%'},{t:'35%',l:'48%'},{t:'55%',l:'25%'},{t:'25%',l:'72%'},{t:'65%',l:'60%'},{t:'12%',l:'38%'},{t:'48%',l:'82%'},{t:'72%',l:'15%'},{t:'38%',l:'90%'},{t:'82%',l:'45%'}];

        return `
        <div class="page-header fade-in-up"><h1>Security Command Center</h1><p>Welcome back, <strong>${p.displayName || p.name || 'Agent'}</strong>. Real-time security posture and training progress.</p></div>

        <!-- Stats Row -->
        <div class="stats-grid">
            <div class="card stat-card fade-in-up stagger-1">
                <div class="stat-card-icon" style="background:var(--info-muted)"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--info)" stroke-width="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg></div>
                <div class="stat-card-label">Training Progress</div>
                <div class="stat-card-value text-gradient">${completedModules}/${totalModules}</div>
                <div class="stat-card-change stat-up">↑ ${completionPct}% complete</div>
            </div>
            <div class="card stat-card fade-in-up stagger-2">
                <div class="stat-card-icon" style="background:var(--success-muted)"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></div>
                <div class="stat-card-label">Simulation Score</div>
                <div class="stat-card-value" style="color:${simsAvg>=80?'var(--success)':simsAvg>=50?'var(--warning)':'var(--text-primary)'}">${simsAvg>0?simsAvg+'%':'N/A'}</div>
                <div class="stat-card-change">${simsDone}/5 completed</div>
            </div>
            <div class="card stat-card fade-in-up stagger-3">
                <div class="stat-card-icon" style="background:var(--warning-muted)"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
                <div class="stat-card-label">Total Points</div>
                <div class="stat-card-value" style="color:var(--warning)">${points.toLocaleString()}</div>
                <div class="stat-card-change stat-up">↑ Rank up!</div>
            </div>
            <div class="card stat-card fade-in-up stagger-4">
                <div class="stat-card-icon" style="background:var(--danger-muted)"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
                <div class="stat-card-label">National Threats (24h)</div>
                <div class="stat-card-value" style="color:var(--danger)">24,182</div>
                <div class="stat-card-change stat-down">↑ 18% from yesterday</div>
            </div>
        </div>

        <!-- Charts Row -->
        <div class="dashboard-row">
            <div class="card fade-in-up">
                <h3 class="mb-16">Skills Radar</h3>
                <div style="height:300px;position:relative;"><canvas id="radar-chart"></canvas></div>
            </div>
            <div class="card fade-in-up" style="padding:0;overflow:hidden">
                <div style="padding:20px 24px;border-bottom:1px solid var(--glass-border)"><div class="flex-between"><h3>Live Threat Map</h3><span class="badge badge-danger">● LIVE</span></div></div>
                <div class="threat-map-container" style="border:none;border-radius:0;height:280px;">
                    <div class="threat-map-overlay"></div>
                    ${threatDots.map(d=>`<div class="threat-dot" style="top:${d.t};left:${d.l}"></div>`).join('')}
                    <div style="position:absolute;bottom:12px;left:16px;font-size:0.65rem;color:var(--text-muted);z-index:2">NCD Threat Intelligence • Auto-refreshing</div>
                </div>
            </div>
        </div>

        <!-- Activity Row -->
        <div class="dashboard-row-equal">
            <div class="card fade-in-up">
                <h3 class="mb-16">Training Trend (7 Days)</h3>
                <div style="height:250px;position:relative;"><canvas id="line-chart"></canvas></div>
            </div>
            <div class="card fade-in-up">
                <h3 class="mb-16">Quick Actions</h3>
                <div style="display:flex;flex-direction:column;gap:10px;">
                    <a href="#/training" class="btn btn-primary btn-lg" style="justify-content:center">📚 Continue Training</a>
                    <a href="#/simulation" class="btn btn-secondary btn-lg" style="justify-content:center">🔒 Launch Simulation</a>
                    <a href="#/quiz" class="btn btn-secondary btn-lg" style="justify-content:center">❓ Take Knowledge Quiz</a>
                    <a href="#/reports" class="btn btn-secondary btn-lg" style="justify-content:center">🚨 Report Incident</a>
                    <a href="#/leaderboard" class="btn btn-secondary btn-lg" style="justify-content:center">🏆 View Leaderboard</a>
                </div>
            </div>
        </div>`;
    },

    afterRender: (profile) => {
        const progress = profile?.progress || {};
        const radarLabels = ['Phishing','Passwords','Social Eng','Incident Resp','Data Prot','Network','Mobile','Cloud','Insider','Physical','SDLC','Email Sec','Compliance'];
        const radarData = MODULES.map(m => progress[m.key]?.completed ? progress[m.key].score : 0);
        createRadarChart('radar-chart', radarLabels, radarData);
        createLineChart('line-chart', ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], [{
            label: 'Modules Completed', data: [0,1,1,2,3,3,Object.values(progress).filter(p=>p.completed).length],
            borderColor: '#00F0FF', backgroundColor: 'rgba(0,240,255,0.1)', fill: true
        },{
            label: 'Points Earned', data: [0,250,500,750,1200,1500,profile?.totalPoints||0].map(v=>Math.min(v,5000)),
            borderColor: '#7C3AED', backgroundColor: 'rgba(124,58,237,0.1)', fill: true
        }]);
    }
};
