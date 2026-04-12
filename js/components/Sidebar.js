// Sidebar Component — 20+ routes
export const Sidebar = {
    render: (userProfile) => {
        const completion = userProfile ? Math.round((Object.values(userProfile.progress || {}).filter(p => p.completed).length / 13) * 100) : 0;
        const points = userProfile?.totalPoints || 0;
        return `
        <div class="sidebar-header">
            <div class="sidebar-brand">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 22S2 16 2 8V5L12 2L22 5V8C22 16 12 22 12 22Z" stroke="url(#sbG)" stroke-width="1.5"/><path d="M9 12l2 2 4-4" stroke="url(#sbG)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="sbG" x1="2" y1="2" x2="22" y2="22"><stop stop-color="#00F0FF"/><stop offset="1" stop-color="#7C3AED"/></linearGradient></defs></svg>
                <span class="brand-text">NCD PLATFORM</span>
            </div>
        </div>

        <div class="sidebar-section-label">Overview</div>
        <nav class="sidebar-nav">
            <a href="#/" class="nav-item" data-path="/"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>Dashboard</a>
            <a href="#/analytics" class="nav-item" data-path="/analytics"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>Analytics</a>
        </nav>

        <div class="sidebar-section-label">Training</div>
        <nav class="sidebar-nav">
            <a href="#/training" class="nav-item" data-path="/training"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>All Modules <span class="nav-badge">${Object.values(userProfile?.progress || {}).filter(p=>p.completed).length}/13</span></a>
            <a href="#/simulation" class="nav-item" data-path="/simulation"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>Simulations</a>
            <a href="#/quiz" class="nav-item" data-path="/quiz"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>Knowledge Quiz</a>
        </nav>

        <div class="sidebar-section-label">Community</div>
        <nav class="sidebar-nav">
            <a href="#/leaderboard" class="nav-item" data-path="/leaderboard"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>Leaderboard</a>
            <a href="#/reports" class="nav-item" data-path="/reports"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>Reports & Incidents</a>
            <a href="#/certificate" class="nav-item" data-path="/certificate"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>Certificates</a>
        </nav>

        <div class="sidebar-section-label">System</div>
        <nav class="sidebar-nav">
            <a href="#/admin" class="nav-item" data-path="/admin"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>Admin Panel</a>
            <a href="#/settings" class="nav-item" data-path="/settings"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09c-.658.003-1.25.396-1.51 1z"/></svg>Settings</a>
        </nav>

        <div class="sidebar-footer">
            <div class="sidebar-stats">
                <div class="sidebar-stat"><span class="sidebar-stat-label">Completion</span><span class="sidebar-stat-value">${completion}%</span></div>
                <div class="progress-track" style="margin-top:4px;"><div class="progress-fill gradient" style="width:${completion}%"></div></div>
                <div class="sidebar-stat" style="margin-top:8px;"><span class="sidebar-stat-label">Points</span><span class="sidebar-stat-value">${points.toLocaleString()}</span></div>
            </div>
        </div>`;
    },
    updateActive: (path) => {
        document.querySelectorAll('.nav-item').forEach(el => {
            el.classList.remove('active');
            const p = el.getAttribute('data-path');
            if (p === path || (path.startsWith('/training/') && p === '/training')) el.classList.add('active');
        });
    }
};
