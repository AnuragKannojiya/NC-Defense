// =====================================================================
// NCD Platform — Core Application (Router, Auth, Particles)
// =====================================================================
import { initFirebaseAuth, getCurrentUser, signOut } from './services/auth.js?v=13';
import { getUserProfile, createUserProfile, updateUserProfile } from './services/db.js?v=13';
import { Sidebar } from './components/Sidebar.js?v=13';
import { Navbar } from './components/Navbar.js?v=13';
import { showToast } from './components/Toast.js?v=13';

// Views
import { Login } from './views/Login.js?v=13';
import { Register } from './views/Register.js?v=13';
import { Dashboard } from './views/Dashboard.js?v=13';
import { TrainingHub } from './views/TrainingHub.js?v=13';
import { TrainingModule } from './views/TrainingModule.js?v=13';
import { Simulation } from './views/Simulation.js?v=13';
import { Quiz } from './views/Quiz.js?v=13';
import { Leaderboard } from './views/Leaderboard.js?v=13';
import { Analytics } from './views/Analytics.js?v=13';
import { Reports } from './views/Reports.js?v=13';
import { Certificate } from './views/Certificate.js?v=13';
import { Admin } from './views/Admin.js?v=13';
import { Settings } from './views/Settings.js?v=13';

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
// FIRST-TIME GOOGLE ONBOARDING UI
// =====================================================================
function renderGoogleOnboarding(container, user, onComplete) {
    const isAdmin = user.email === 'anuragkannaujiyak@gmail.com';
    container.innerHTML = `
    <div class="auth-page">
        <div class="auth-card fade-in-up" style="max-width:500px;">
            <div class="auth-logo">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22S2 16 2 8V5L12 2L22 5V8C22 16 12 22 12 22Z" stroke="url(#gOnb)" stroke-width="1.5"/>
                    <path d="M9 12l2 2 4-4" stroke="url(#gOnb)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <defs><linearGradient id="gOnb" x1="2" y1="2" x2="22" y2="22"><stop stop-color="#00F0FF"/><stop offset="1" stop-color="#7C3AED"/></linearGradient></defs>
                </svg>
            </div>
            <h1 class="auth-title">Agent Onboarding</h1>
            <p class="auth-subtitle">Configure your tactical unit and clearance credentials</p>

            <form id="onboarding-form" class="auth-form" style="margin-top:20px;">
                <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <input type="text" class="form-input" id="onb-name" value="${user.displayName || user.email?.split('@')[0] || ''}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Verified Google Email</label>
                    <input type="email" class="form-input" value="${user.email || ''}" disabled style="opacity:0.75;background:rgba(255,255,255,0.03);">
                </div>
                <div class="form-group">
                    <label class="form-label">Designated Department / Unit</label>
                    <select class="form-select" id="onb-dept" required>
                        <option value="Cyber Operations" selected>Cyber Operations Division</option>
                        <option value="Threat Intelligence">Threat Intelligence Unit</option>
                        <option value="SOC Division">Security Operations Center (SOC)</option>
                        <option value="Network Defense">Network Defense & Perimeter</option>
                        <option value="Forensics Lab">Digital Forensics Lab</option>
                        <option value="Policy & Compliance">National Policy & Compliance</option>
                        <option value="Finance Infra">Critical Financial Infrastructure</option>
                        <option value="Administration">Strategic Administration</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Operational Role & Clearance Level</label>
                    <select class="form-select" id="onb-role" required>
                        <option value="employee" ${isAdmin ? '' : 'selected'}>Special Agent — Level 2 (Secret)</option>
                        <option value="manager">Operations Supervisor — Level 2 (Secret)</option>
                        <option value="admin" ${isAdmin ? 'selected' : ''}>Lead Commander / Admin — Level 3 (Top Secret)</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary btn-lg auth-submit" style="margin-top:10px;">
                    🛡️ Confirm Security Clearance & Enter Platform
                </button>
            </form>
        </div>
        <div class="auth-footer">🛡️ National Cyber Defense • Google OAuth Authenticated Session</div>
    </div>
    `;

    document.getElementById('onboarding-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Activating Security Clearance...';
        }
        const name = document.getElementById('onb-name')?.value.trim();
        const department = document.getElementById('onb-dept')?.value;
        const role = document.getElementById('onb-role')?.value;
        const clearance = role === 'admin' ? 'Level 3 (Top Secret)' : 'Level 2 (Secret)';

        await onComplete({
            displayName: name || user.displayName || 'Special Agent',
            name: name || user.displayName || 'Special Agent',
            email: user.email || '',
            department,
            role,
            photoURL: user.photoURL || null,
            clearance
        });
    });
}

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

        // Auth guard: If user is not logged in, immediately show login/register view
        if (!currentUser) {
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
                            clearance: regData.role === 'admin' ? 'Level 3 (Top Secret)' : 'Level 2 (Secret)'
                        });
                        window.location.hash = '#/';
                    }
                });
            } else {
                if (window.location.hash !== '#/login') {
                    window.location.hash = '#/login';
                }
                authContainer.innerHTML = Login.render();
                Login.afterRender(async () => {
                    const user = getCurrentUser();
                    if (user) {
                        currentUser = user;
                        userProfile = await getUserProfile(user.uid);
                        if (!userProfile) {
                            // First time login: Prompt for role and department!
                            renderGoogleOnboarding(authContainer, user, async (profileData) => {
                                userProfile = await createUserProfile(user.uid, profileData);
                                showToast(`Welcome to National Cyber Defense, ${profileData.displayName}!`, 'success');
                                window.location.hash = '#/';
                                await navigate();
                            });
                            return;
                        }
                        window.location.hash = '#/';
                    }
                });
            }
            hideLoadingScreen();
            isNavigating = false;
            return;
        }

        // If user is logged in but hasn't completed onboarding yet
        if (currentUser && !userProfile) {
            userProfile = await getUserProfile(currentUser.uid);
            if (!userProfile) {
                document.getElementById('app').style.display = 'none';
                const authContainer = document.getElementById('auth-container');
                authContainer.style.display = 'flex';
                renderGoogleOnboarding(authContainer, currentUser, async (profileData) => {
                    userProfile = await createUserProfile(currentUser.uid, profileData);
                    showToast(`Welcome to National Cyber Defense, ${profileData.displayName}!`, 'success');
                    window.location.hash = '#/';
                    await navigate();
                });
                hideLoadingScreen();
                isNavigating = false;
                return;
            }
        }

        // If user is logged in but navigating to auth route, send to dashboard
        if (currentUser && isAuthRoute) {
            window.location.hash = '#/';
            isNavigating = false;
            return;
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
// BOOT SEQUENCE & GLOBAL LISTENERS
// =====================================================================
async function boot() {
    initParticles();

    // Universal Sign Out Delegated Click Handler
    document.addEventListener('click', async (e) => {
        const signoutBtn = e.target.closest('.signout-trigger, #sidebar-signout-btn, #nav-signout-btn, #nav-direct-signout, #signout-btn');
        if (signoutBtn) {
            e.preventDefault();
            e.stopPropagation();
            currentUser = null;
            userProfile = null;
            try {
                await signOut();
            } catch (err) {
                console.warn('Sign out warning:', err);
            }
            showToast('Signed out of National Cyber Defense platform', 'info');
            window.location.hash = '#/login';
            await navigate();
        }
    });

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
                const curPath = getPath();
                if (!userProfile) {
                    // Requires first-time onboarding!
                    document.getElementById('app').style.display = 'none';
                    const authContainer = document.getElementById('auth-container');
                    authContainer.style.display = 'flex';
                    renderGoogleOnboarding(authContainer, user, async (profileData) => {
                        userProfile = await createUserProfile(user.uid, profileData);
                        showToast(`Welcome to National Cyber Defense, ${profileData.displayName}!`, 'success');
                        window.location.hash = '#/';
                        await navigate();
                    });
                    hideLoadingScreen();
                    return;
                }
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
