// =====================================================================
// NCD Platform — Core Application (Router, Auth, Particles)
// =====================================================================
import { initFirebaseAuth, getCurrentUser } from './services/auth.js?v=10';
import { getUserProfile, createUserProfile, updateUserProfile } from './services/db.js?v=10';
import { Sidebar } from './components/Sidebar.js?v=10';
import { Navbar } from './components/Navbar.js?v=10';
import { showToast } from './components/Toast.js?v=10';

// Views
import { Login } from './views/Login.js?v=10';
import { Register } from './views/Register.js?v=10';
import { Dashboard } from './views/Dashboard.js?v=10';
import { TrainingHub } from './views/TrainingHub.js?v=10';
import { TrainingModule } from './views/TrainingModule.js?v=10';
import { Simulation } from './views/Simulation.js?v=10';
import { Quiz } from './views/Quiz.js?v=10';
import { Leaderboard } from './views/Leaderboard.js?v=10';
import { Analytics } from './views/Analytics.js?v=10';
import { Reports } from './views/Reports.js?v=10';
import { Certificate } from './views/Certificate.js?v=10';
import { Admin } from './views/Admin.js?v=10';
import { Settings } from './views/Settings.js?v=10';

window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global Error:', message, error);
    const vr = document.getElementById('view-root');
    if (vr) {
        document.getElementById('app').style.display = 'flex';
        document.getElementById('auth-container').style.display = 'none';
        vr.innerHTML = `<div class="page-header"><h1>System Error</h1><p style="color:var(--danger)">An unexpected error occurred: ${message}</p></div>`;
    }
    const ls = document.getElementById('loading-screen');
    if (ls) ls.style.display = 'none';
};

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Rejection:', event.reason);
    const vr = document.getElementById('view-root');
    if (vr) {
        document.getElementById('app').style.display = 'flex';
        document.getElementById('auth-container').style.display = 'none';
        vr.innerHTML = `<div class="page-header"><h1>System Error</h1><p style="color:var(--danger)">An unexpected promise rejection occurred: ${event.reason?.message || event.reason}</p></div>`;
    }
    const ls = document.getElementById('loading-screen');
    if (ls) ls.style.display = 'none';
});

let currentUser = null;
let userProfile = null;

// =====================================================================
// ROUTER
// =====================================================================
async function getPath() {
    return window.location.hash.slice(1) || '/';
}

async function navigate() {
    try {
        const path = await getPath();
        const isAuthRoute = ['/login', '/register'].includes(path);
        
        // Ensure logged-in users don't see login page again
        if (currentUser && isAuthRoute) {
            window.location.hash = '#/';
            return;
        }

        const authRequired = !isAuthRoute;

        // Auth guard
        if (authRequired && !currentUser) {
            window.location.hash = '#/login';
            return;
        }

        if (!authRequired) {
            // Show auth container
            document.getElementById('app').style.display = 'none';
            document.getElementById('auth-container').style.display = 'flex';
            const authContainer = document.getElementById('auth-container');
            if (path === '/register') {
                authContainer.innerHTML = Register.render();
                Register.afterRender(async (regData) => {
                    // After register, create profile
                    const user = getCurrentUser();
                    if (user) {
                        await createUserProfile(user.uid, {
                            displayName: regData.name,
                            name: regData.name,
                            email: regData.email,
                            department: regData.department,
                            role: regData.role,
                            photoURL: null,
                            clearance: 'Level 2'
                        });
                        currentUser = user;
                        userProfile = await getUserProfile(user.uid);
                        if (window.location.hash === '#/' || window.location.hash === '') {
                            await navigate();
                        } else {
                            window.location.hash = '#/';
                        }
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
                            await createUserProfile(user.uid, {
                                displayName: user.displayName || user.email.split('@')[0],
                                name: user.displayName || user.email.split('@')[0],
                                email: user.email,
                                department: user.department || 'Cyber Operations',
                                role: user.role || 'employee',
                                photoURL: user.photoURL || null,
                                clearance: 'Level 2'
                            });
                            userProfile = await getUserProfile(user.uid);
                        }
                        if (window.location.hash === '#/' || window.location.hash === '') {
                            await navigate();
                        } else {
                            window.location.hash = '#/';
                        }
                    }
                });
            }
            return;
        }

        // Refresh profile
        if (currentUser) {
            userProfile = await getUserProfile(currentUser.uid);
            await updateUserProfile(currentUser.uid, { lastActive: new Date().toISOString() });
        }

        // Show app
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('app').style.display = 'flex';

        // Update sidebar and navbar
        document.getElementById('sidebar-root').innerHTML = Sidebar.render(userProfile);
        document.getElementById('navbar-root').innerHTML = Navbar.render({ ...currentUser, ...userProfile });
        Sidebar.updateActive(path);
        Navbar.update(path);

        // Auto-close mobile sidebar upon navigation
        document.getElementById('sidebar-root')?.classList.remove('sidebar-mobile-open');

        // Mobile menu toggle
        document.getElementById('mobile-menu-toggle')?.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('sidebar-root').classList.toggle('sidebar-mobile-open');
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

        // Navigate to settings from navbar user button
        document.getElementById('nav-user-btn')?.addEventListener('click', () => {
            window.location.hash = '#/settings';
        });

        // Render view
        const viewRoot = document.getElementById('view-root');
        const uid = currentUser?.uid;
        const profile = { ...currentUser, ...userProfile, uid };

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
            html = `<div class="page-header"><h1>404 — Not Found</h1><p>The page you're looking for doesn't exist.</p><a href="#/" class="btn btn-primary mt-16">← Dashboard</a></div>`;
        }

        viewRoot.innerHTML = html;
        viewRoot.scrollTop = 0;
        if (afterFn) afterFn();

    } catch (err) {
        console.error('Navigation error:', err);
        const vr = document.getElementById('view-root');
        if (vr) vr.innerHTML = `<div class="page-header"><h1>Error</h1><p style="color:var(--danger)">An error occurred while loading this view: ${err.message}</p></div>`;
        
        // Make sure loading screen is hidden in case of early crash
        const ls = document.getElementById('loading-screen');
        if (ls) ls.style.display = 'none';
        
        // Make sure app displays instead of being hidden
        document.getElementById('app').style.display = 'flex';
        document.getElementById('auth-container').style.display = 'none';
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

    const count = Math.min(Math.floor((w * h) / 18000), 80);
    for (let i = 0; i < count; i++) {
        particles.push({ x: Math.random()*w, y: Math.random()*h, vx: (Math.random()-0.5)*0.3, vy: (Math.random()-0.5)*0.3, r: Math.random()*1.5+0.5 });
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
        for (const p of particles) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
        }
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i+1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 150) {
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
    // Loading screen
    const loadingScreen = document.getElementById('loading-screen');

    // Init particles
    initParticles();

    // Simulate loading
    await new Promise(r => setTimeout(r, 1800));

    // Hide loading
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease';
        setTimeout(() => { loadingScreen.style.display = 'none'; }, 500);
    }

    // Check auth state
    initFirebaseAuth(async (user) => {
        try {
            if (user) {
                currentUser = user;
                userProfile = await getUserProfile(user.uid);
                if (!userProfile) {
                    await createUserProfile(user.uid, {
                        displayName: user.displayName || user.email?.split('@')[0] || 'Agent',
                        name: user.displayName || user.email?.split('@')[0] || 'Agent',
                        email: user.email || '',
                        department: 'Cyber Operations',
                        role: 'employee',
                        photoURL: user.photoURL || null,
                        clearance: 'Level 2'
                    });
                    userProfile = await getUserProfile(user.uid);
                }
                // Navigate to current hash or dashboard
                if (!window.location.hash || window.location.hash === '#/login' || window.location.hash === '#/register') {
                    window.location.hash = '#/';
                }
            } else {
                currentUser = null;
                userProfile = null;
                window.location.hash = '#/login';
            }
            await navigate();
        } catch (err) {
            console.error('Boot callback error:', err);
            window.dispatchEvent(new CustomEvent('unhandledrejection', { detail: { reason: err } }));
            // Make sure the login screen or error shows
            const ls = document.getElementById('loading-screen');
            if (ls) ls.style.display = 'none';
        }
    });

    // Listen for hash changes
    window.addEventListener('hashchange', navigate);
}

boot().catch(err => {
    console.error('Boot error:', err);
    // Ensure we never stay on a black screen
    const ls = document.getElementById('loading-screen');
    if (ls) ls.style.display = 'none';
    window.location.hash = '#/login';
    navigate();
});
