// Navbar Component
const pageNames = {
    '/': 'Dashboard', '/analytics': 'Analytics', '/training': 'Training Modules',
    '/simulation': 'Simulations', '/quiz': 'Knowledge Quiz', '/leaderboard': 'Leaderboard',
    '/reports': 'Reports & Incidents', '/certificate': 'Certificates', '/admin': 'Admin Panel', '/settings': 'Settings'
};

export const Navbar = {
    render: (user) => {
        const name = user?.displayName || user?.name || 'Agent';
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        return `
        <div class="nav-left">
            <button class="btn-icon mobile-menu-btn" id="mobile-menu-toggle" title="Menu">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div class="nav-breadcrumb">
                <span style="color:var(--accent-cyan)">NCD</span>
                <span class="breadcrumb-sep">/</span>
                <span class="breadcrumb-current" id="nav-page-title">Dashboard</span>
            </div>
        </div>
        <div class="nav-right">
            <div class="nav-live-indicator"><span class="live-dot"></span><span style="font-size:0.75rem;color:var(--text-muted)">LIVE</span></div>
            <button class="nav-notification-btn" id="notif-btn" title="Notifications">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                <div class="notification-dot"></div>
            </button>
            <div class="nav-user" id="nav-user-btn">
                <div class="avatar">${initials}</div>
                <div class="user-info">
                    <span class="user-name">${name}</span>
                    <span class="user-role">${user?.email || ''}</span>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text-muted)"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
        </div>`;
    },
    update: (path) => {
        const el = document.getElementById('nav-page-title');
        if (el) {
            if (path.startsWith('/training/')) {
                el.textContent = 'Training Module';
            } else {
                el.textContent = pageNames[path] || 'Dashboard';
            }
        }
    }
};
