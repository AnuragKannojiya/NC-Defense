// =====================================================================
// NCD Platform — Core Application (Router, Auth, Particles)
// =====================================================================
import { initFirebaseAuth, getCurrentUser } from './services/auth.js?v=11';
import { getUserProfile, createUserProfile, updateUserProfile } from './services/db.js?v=11';
import { Sidebar } from './components/Sidebar.js?v=11';
import { Navbar } from './components/Navbar.js?v=11';
import { showToast } from './components/Toast.js?v=11';

// Views
import { Login } from './views/Login.js?v=11';
import { Register } from './views/Register.js?v=11';
import { Dashboard } from './views/Dashboard.js?v=11';
import { TrainingHub } from './views/TrainingHub.js?v=11';
import { TrainingModule } from './views/TrainingModule.js?v=11';
import { Simulation } from './views/Simulation.js?v=11';
import { Quiz } from './views/Quiz.js?v=11';
import { Leaderboard } from './views/Leaderboard.js?v=11';
import { Analytics } from './views/Analytics.js?v=11';
import { Reports } from './views/Reports.js?v=11';
import { Certificate } from './views/Certificate.js?v=11';
import { Admin } from './views/Admin.js?v=11';
import { Settings } from './views/Settings.js?v=11';

// Global error handlers
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global Error:', message, error);
    const vr = document.getElementById('view-root');
    if (vr) {
        document.getElementById('app').style.display = 'flex';
        document.getElementById('auth-container').style.display = 'none';
        vr.innerHTML = `
            <div class="card fade-in-up" style="max-width:600px;margin:40px auto;padding:32px;text-align:center;border-left:4px solid var(--danger);">
                <div style="font-size:3rem;margin-bottom:12px">⚠️</div>
                <h2 style="color:var(--danger);margin-bottom:8px">System Telemetry Notice</h2>
                <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:20px">${message || 'An unexpected operational error occurred.'}</p>
                <a href="#/" class="btn btn-primary" onclick="window.location.hash='#/';">← Return to Dashboard</a>
            </div>
        `;
    }
    hideLoadingScreen();
};

window.addEventListener('unhandledrejection', function(event) {
    console.warn('Unhandled Rejection Caught:', event.reason);
    hideLoadingScreen();
});

function hideLoadingScreen() {
    const ls = document.getElementById('loading-screen');
    if (ls && ls.style.display !== 'none') {
        ls.style.opacity = '0';
        ls.style.transition = 'opacity 0.25s ease';
        setTimeout(() => { ls.style.display = 'none'; }, 250);
    }
}

let currentUser = null;
let userProfile = null;
let isNavigating = false;

// =====================================================================
// ROUTER
// =====================================================================
function getPath() {
    const hash = window.location.hash || '';
    if (!hash || hash === '#' || hash === '#/') return '/';
    return hash.slice(1);
}

async function navigate() {
    if (isNavigating) return;
    isNavigating = true;

    try {
        const path = getPath();
        const isAuthRoute = ['/login', '/register'].includes(path);

        // Ensure logged-in users don't see login page again
        if (currentUser && isAuthRoute) {
            window.location.hash = '#/';
            isNavigating = false;
            return;
        }

        const authRequired = !isAuthRoute;

        // Auth guard
        if (authRequired && !currentUser) {
            window.location.hash = '#/login';
            isNavigating = false;
            return;
        }

        if (!authRequired) {
            // Show auth container
            document.getElementById('app').style.display = 'none';
            const authContainer = document.getElementById('auth-container');
            authContainer.style.display = 'flex';

            if (path === '/register') {
                authContainer.innerHTML = Register.render();
                Register.afterRender(async (regData) => {
                    const user = getCurrentUser();
                    if (user) {
                        currentUser = user;
                        userProfile = await createUserProfile(user.uid, {
                            displayName: regData.name,
                            name: regData.name,
                            email: regData.email,
                            department: regData.department,
                            role: regData.role,
                            photoURL: null,
                            clearance: 'Level 2 (Secret)'
                        });
                        window.location.hash = '#/';
                    }
                });
            } else {
                authContainer.innerHTML = Login.render();
                Login.afterRender(async () => {
                    const user = getCurrentUser();
                    if (user) {
                        currentUser = user;
                        userProfile = await getUserProfile(user.uid);
                        if (!userProfile) {
                            userProfile = await createUserProfile(user.uid, {
                                displayName: user.displayName || user.email?.split('@')[0] || 'Special Agent',
                                name: user.displayName || user.email?.split('@')[0] || 'Special Agent',
                                email: user.email || '',
                                department: user.department || 'Cyber Operations',
                                role: user.role || 'employee',
                                photoURL: user.photoURL || null,
                                clearance: 'Level 2 (Secret)'
                            });
                        }
                        window.location.hash = '#/';
                    }
                });
            }
            hideLoadingScreen();
            isNavigating = false;
            return;
        }

        // Active Session: Refresh profile in background
        if (currentUser && (!userProfile || !userProfile.uid)) {
            userProfile = await getUserProfile(currentUser.uid);
            if (!userProfile) {
                userProfile = await createUserProfile(currentUser.uid, {
                    displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Special Agent',
                    name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Special Agent',
                    email: currentUser.email || '',
                    department: 'Cyber Operations',
                    role: 'Special Agent',
                    photoURL: currentUser.photoURL || null,
                    clearance: 'Level 2 (Secret)'
                });
            }
        }

        // Show app shell
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('app').style.display = 'flex';

        // Update sidebar and navbar
        const profile = { ...currentUser, ...userProfile, uid: currentUser?.uid };
        document.getElementById('sidebar-root').innerHTML = Sidebar.render(profile);
        document.getElementById('navbar-root').innerHTML = Navbar.render(profile);
        Sidebar.updateActive(path);
        Navbar.update(path);
        Navbar.afterRender();

        // Auto-close mobile sidebar upon navigation
        document.getElementById('sidebar-root')?.classList.remove('sidebar-mobile-open');

        // Mobile menu toggle
        document.getElementById('mobile-menu-toggle')?.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('sidebar-root')?.classList.toggle('sidebar-mobile-open');
        });

        // Close mobile sidebar on clicking outside
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar-root');
            const toggle = document.getElementById('mobile-menu-toggle');
            if (sidebar && sidebar.classList.contains('sidebar-mobile-open')) {
                if (!sidebar.contains(e.target) && !toggle?.contains(e.target)) {
                    sidebar.classList.remove('sidebar-mobile-open');
                }
            }
        });

        // Render view
        const viewRoot = document.getElementById('view-root');
        const uid = currentUser?.uid;

        let html = '';
        let afterFn = null;

        if (path === '/' || path === '') {
            html = Dashboard.render(profile);
            afterFn = () => Dashboard.afterRender(profile);
        } else if (path === '/training') {
            html = TrainingHub.render(profile);
            afterFn = () => TrainingHub.afterRender();
        } else if (path.startsWith('/training/')) {
            const moduleKey = path.replace('/training/', '');
            html = TrainingModule.render(profile, moduleKey);
            afterFn = () => TrainingModule.afterRender(profile, moduleKey, uid);
        } else if (path === '/simulation') {
            html = Simulation.render(profile);
            afterFn = () => Simulation.afterRender(profile, null, uid);
        } else if (path === '/quiz') {
            html = Quiz.render();
            afterFn = () => Quiz.afterRender(profile, null, uid);
        } else if (path === '/leaderboard') {
            html = await Leaderboard.render(profile);
        } else if (path === '/analytics') {
            html = Analytics.render(profile);
            afterFn = () => Analytics.afterRender(profile);
        } else if (path === '/reports') {
            html = await Reports.render(profile, null, uid);
            afterFn = () => Reports.afterRender(profile, null, uid);
        } else if (path === '/certificate') {
            html = Certificate.render(profile);
        } else if (path === '/admin') {
            html = await Admin.render(profile);
        } else if (path === '/settings') {
            html = Settings.render(profile);
            afterFn = () => Settings.afterRender();
        } else {
            html = `
                <div class="page-header fade-in-up">
                    <h1>404 — Tactical Vector Not Found</h1>
                    <p>The operational module you requested does not exist or has been relocated.</p>
                    <a href="#/" class="btn btn-primary mt-16">← Command Center</a>
                </div>
            `;
        }

        viewRoot.innerHTML = html;
        viewRoot.scrollTop = 0;
        if (afterFn) {
            try { afterFn(); } catch (err) { console.warn('View afterRender warning:', err); }
        }

        hideLoadingScreen();
    } catch (err) {
        console.error('Navigation error:', err);
        hideLoadingScreen();
        const vr = document.getElementById('view-root');
        if (vr) {
            vr.innerHTML = `
                <div class="card fade-in-up" style="max-width:600px;margin:40px auto;padding:32px;text-align:center;">
                    <h3 style="color:var(--danger);margin-bottom:8px">Navigation Error</h3>
                    <p style="color:var(--text-secondary);font-size:0.88rem;margin-bottom:20px">${err.message}</p>
                    <a href="#/" class="btn btn-primary" onclick="window.location.hash='#/';">← Dashboard</a>
                </div>
            `;
        }
        document.getElementById('app').style.display = 'flex';
        document.getElementById('auth-container').style.display = 'none';
    } finally {
        isNavigating = false;
    }
}

// =====================================================================
// PARTICLE BACKGROUND
// =====================================================================
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const count = Math.min(Math.floor((w * h) / 20000), 70);
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 1.5 + 0.5
        });
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.35)';
        for (const p of particles) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        }
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 140) {
                    ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
}

// =====================================================================
// BOOT SEQUENCE
// =====================================================================
async function boot() {
    initParticles();

    // Listen for hash changes
    window.addEventListener('hashchange', () => {
        navigate();
    });

    // Check auth state once
    initFirebaseAuth(async (user) => {
        try {
            currentUser = user;
            if (user) {
                userProfile = await getUserProfile(user.uid);
                if (!userProfile) {
                    userProfile = await createUserProfile(user.uid, {
                        displayName: user.displayName || user.email?.split('@')[0] || 'Special Agent',
                        name: user.displayName || user.email?.split('@')[0] || 'Special Agent',
                        email: user.email || '',
                        department: 'Cyber Operations',
                        role: 'Special Agent',
                        photoURL: user.photoURL || null,
                        clearance: 'Level 2 (Secret)'
                    });
                }
                const curPath = getPath();
                if (curPath === '/login' || curPath === '/register' || curPath === '') {
                    window.location.hash = '#/';
                } else {
                    await navigate();
                }
            } else {
                userProfile = null;
                const curPath = getPath();
                if (curPath !== '/register') {
                    window.location.hash = '#/login';
                }
                await navigate();
            }
        } catch (err) {
            console.error('Auth state change error:', err);
            hideLoadingScreen();
            await navigate();
        }
    });
}

boot().catch(err => {
    console.error('Boot error:', err);
    hideLoadingScreen();
    window.location.hash = '#/login';
    navigate();
});
