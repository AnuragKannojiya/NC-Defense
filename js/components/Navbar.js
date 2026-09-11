// =====================================================================
// Navbar Component — Interactive Dropdowns & Breadcrumbs
// =====================================================================
import { signOut } from '../services/auth.js';
import { showToast } from './Toast.js';

const pageNames = {
    '/': 'Security Command Center',
    '/analytics': 'Analytics & Insights',
    '/training': 'Training Modules',
    '/simulation': 'Threat Simulations',
    '/quiz': 'Knowledge Assessment',
    '/leaderboard': 'National Leaderboard',
    '/reports': 'Reports & Incident Mgmt',
    '/certificate': 'Certificates',
    '/admin': 'Admin Panel',
    '/settings': 'Settings'
};

export const Navbar = {
    render: (user) => {
        const name = user?.displayName || user?.name || 'Agent';
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const email = user?.email || 'Authenticated Agent';
        const clearance = user?.clearance || 'Level 2 (Secret)';

        return `
        <div class="nav-left">
            <button class="btn-icon mobile-menu-btn" id="mobile-menu-toggle" title="Menu">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div class="nav-breadcrumb">
                <span style="color:var(--accent-cyan);font-weight:700;">NCD</span>
                <span class="breadcrumb-sep">/</span>
                <span class="breadcrumb-current" id="nav-page-title">Command Center</span>
            </div>
        </div>
        <div class="nav-right" style="position:relative;">
            <div class="nav-live-indicator"><span class="live-dot"></span><span style="font-size:0.75rem;color:var(--text-muted)">LIVE FEED</span></div>

            <!-- Notifications Button & Dropdown -->
            <div style="position:relative;">
                <button class="nav-notification-btn" id="notif-btn" title="Live Threat Notifications">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                    <div class="notification-dot"></div>
                </button>
                <div id="notif-dropdown" class="card" style="display:none;position:absolute;top:44px;right:0;width:320px;z-index:100;padding:16px;box-shadow:0 12px 32px rgba(0,0,0,0.6);border:1px solid var(--glass-border);">
                    <div class="flex-between mb-12">
                        <strong style="font-size:0.85rem">Security Advisories</strong>
                        <span class="badge badge-danger">3 Critical</span>
                    </div>
                    <div style="display:flex;flex-direction:column;gap:10px;font-size:0.8rem">
                        <div style="padding:8px 10px;background:var(--danger-muted);border-radius:6px;border-left:3px solid var(--danger);">
                            <strong>CERT-In Alert CI-2026-004</strong><br>
                            <span style="color:var(--text-muted);font-size:0.75rem">Spear-phishing targeting energy grid infrastructure.</span>
                        </div>
                        <div style="padding:8px 10px;background:var(--warning-muted);border-radius:6px;border-left:3px solid var(--warning);">
                            <strong>Zero-Day RCE in Edge Gateways</strong><br>
                            <span style="color:var(--text-muted);font-size:0.75rem">Critical patch released. Deploy within 12h.</span>
                        </div>
                        <div style="padding:8px 10px;background:var(--info-muted);border-radius:6px;border-left:3px solid var(--info);">
                            <strong>Simulation Module Ready</strong><br>
                            <span style="color:var(--text-muted);font-size:0.75rem">5 new interactive labs now active in Simulation Center.</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- User Menu Button & Dropdown -->
            <div style="position:relative;">
                <div class="nav-user" id="nav-user-btn" style="cursor:pointer;">
                    <div class="avatar">${initials}</div>
                    <div class="user-info">
                        <span class="user-name">${name}</span>
                        <span class="user-role">${clearance}</span>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text-muted)"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div id="user-dropdown" class="card" style="display:none;position:absolute;top:44px;right:0;width:240px;z-index:100;padding:12px;box-shadow:0 12px 32px rgba(0,0,0,0.6);border:1px solid var(--glass-border);">
                    <div style="padding:8px;border-bottom:1px solid var(--glass-border);margin-bottom:8px">
                        <div style="font-weight:700;font-size:0.9rem">${name}</div>
                        <div style="font-size:0.75rem;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis">${email}</div>
                        <span class="badge badge-info mt-8">${clearance}</span>
                    </div>
                    <a href="#/settings" class="btn btn-secondary btn-sm mb-8" style="width:100%;justify-content:flex-start">⚙️ Settings & Profile</a>
                    <a href="#/certificate" class="btn btn-secondary btn-sm mb-8" style="width:100%;justify-content:flex-start">🎓 View Certificate</a>
                    <button id="nav-signout-btn" class="btn btn-danger btn-sm" style="width:100%;justify-content:flex-start">🚪 Sign Out</button>
                </div>
            </div>
        </div>`;
    },

    afterRender: () => {
        const notifBtn = document.getElementById('notif-btn');
        const notifDropdown = document.getElementById('notif-dropdown');
        const userBtn = document.getElementById('nav-user-btn');
        const userDropdown = document.getElementById('user-dropdown');

        notifBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (notifDropdown) {
                const isOpen = notifDropdown.style.display === 'block';
                notifDropdown.style.display = isOpen ? 'none' : 'block';
                if (userDropdown) userDropdown.style.display = 'none';
            }
        });

        userBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (userDropdown) {
                const isOpen = userDropdown.style.display === 'block';
                userDropdown.style.display = isOpen ? 'none' : 'block';
                if (notifDropdown) notifDropdown.style.display = 'none';
            }
        });

        document.getElementById('nav-signout-btn')?.addEventListener('click', async () => {
            await signOut();
            showToast('Signed out of National Cyber Defense platform', 'info');
            window.location.hash = '#/login';
        });

        // Close dropdowns on outside click
        document.addEventListener('click', () => {
            if (notifDropdown) notifDropdown.style.display = 'none';
            if (userDropdown) userDropdown.style.display = 'none';
        });
    },

    update: (path) => {
        const el = document.getElementById('nav-page-title');
        if (el) {
            if (path.startsWith('/training/')) {
                el.textContent = 'Training Module';
            } else {
                el.textContent = pageNames[path] || 'Command Center';
            }
        }
    }
};
