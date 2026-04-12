// Analytics View — Chart.js Visualizations
import { createBarChart, createDoughnutChart, createLineChart, createRadarChart } from '../components/Charts.js';
import { MODULES } from '../data/modules.js';

export const Analytics = {
    render: (profile) => {
        const p = profile || {};
        const progress = p.progress || {};
        const completed = Object.values(progress).filter(v=>v.completed).length;
        return `
        <div class="page-header fade-in-up"><h1>Analytics & Insights</h1><p>Comprehensive training performance analytics and organizational readiness metrics.</p></div>
        <div class="stats-grid">
            <div class="card stat-card fade-in-up"><div class="stat-card-label">Completion Rate</div><div class="stat-card-value text-gradient">${Math.round((completed/13)*100)}%</div></div>
            <div class="card stat-card fade-in-up"><div class="stat-card-label">Modules Done</div><div class="stat-card-value" style="color:var(--info)">${completed}/13</div></div>
            <div class="card stat-card fade-in-up"><div class="stat-card-label">Quiz Best Score</div><div class="stat-card-value" style="color:var(--success)">${p.quizScores?.length ? Math.max(...p.quizScores.map(q=>q.percentage))+'%' : 'N/A'}</div></div>
            <div class="card stat-card fade-in-up"><div class="stat-card-label">Total Points</div><div class="stat-card-value" style="color:var(--warning)">${(p.totalPoints||0).toLocaleString()}</div></div>
        </div>
        <div class="dashboard-row">
            <div class="card fade-in-up"><h3 class="mb-16">Module Completion by Category</h3><div style="height:300px"><canvas id="a-bar"></canvas></div></div>
            <div class="card fade-in-up"><h3 class="mb-16">Skill Distribution</h3><div style="height:300px"><canvas id="a-radar"></canvas></div></div>
        </div>
        <div class="dashboard-row-equal">
            <div class="card fade-in-up"><h3 class="mb-16">National Threat Trends (Mock)</h3><div style="height:250px"><canvas id="a-line"></canvas></div></div>
            <div class="card fade-in-up"><h3 class="mb-16">Organization Compliance</h3><div style="height:250px"><canvas id="a-bar2"></canvas></div></div>
        </div>`;
    },
    afterRender: (profile) => {
        const progress = profile?.progress || {};
        const labels = MODULES.map(m => m.title.split(' ').slice(0,2).join(' '));
        const data = MODULES.map(m => progress[m.key]?.completed ? 100 : 0);
        createBarChart('a-bar', labels, [{ label: 'Score %', data, backgroundColor: MODULES.map(m=>m.color+'88'), borderColor: MODULES.map(m=>m.color), borderWidth: 1 }]);
        createRadarChart('a-radar', labels, data);
        createLineChart('a-line', ['Jan','Feb','Mar','Apr','May','Jun'], [
            { label: 'Phishing', data: [420,380,350,410,480,520], borderColor: '#EF4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true },
            { label: 'Malware', data: [180,200,160,220,190,210], borderColor: '#F59E0B', backgroundColor: 'rgba(245,158,11,0.1)', fill: true },
            { label: 'Social Eng', data: [80,90,70,100,110,95], borderColor: '#8B5CF6', backgroundColor: 'rgba(139,92,246,0.1)', fill: true }
        ]);
        createBarChart('a-bar2', ['IT Dept','Finance','HR','Legal','Operations','Admin'], [{
            label: 'Compliance %', data: [92,78,65,88,72,58],
            backgroundColor: ['#10B98188','#F59E0B88','#EF444488','#3B82F688','#8B5CF688','#EC489988'],
            borderColor: ['#10B981','#F59E0B','#EF4444','#3B82F6','#8B5CF6','#EC4899'], borderWidth: 1
        }]);
    }
};
