// =====================================================================
// Login View — Real Google OAuth & Email/Password Authentication
// =====================================================================
import { signInWithEmail, signInWithGoogle, signInDemo } from '../services/auth.js';
import { showToast } from '../components/Toast.js';

export const Login = {
    render: () => `
    <div class="auth-page">
        <div class="auth-card">
            <div class="auth-logo">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M12 22S2 16 2 8V5L12 2L22 5V8C22 16 12 22 12 22Z" stroke="url(#aG)" stroke-width="1.5"/><path d="M9 12l2 2 4-4" stroke="url(#aG)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="aG" x1="2" y1="2" x2="22" y2="22"><stop stop-color="#00F0FF"/><stop offset="1" stop-color="#7C3AED"/></linearGradient></defs></svg>
            </div>
            <h1 class="auth-title">National Cyber Defense</h1>
            <p class="auth-subtitle">Sign in to your security operations account</p>

            <form id="login-form" class="auth-form">
                <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <input type="email" class="form-input" id="login-email" placeholder="agent@ncd.gov.in" required autocomplete="email">
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-input" id="login-password" placeholder="••••••••" required autocomplete="current-password">
                </div>
                <button type="submit" class="btn btn-primary btn-lg auth-submit" id="submit-login-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    Sign In with Email
                </button>
            </form>

            <div class="auth-divider"><span>or continue with</span></div>

            <!-- Real Google OAuth 2.0 Button -->
            <button class="btn btn-secondary btn-lg auth-google" id="google-signin-btn" style="width:100%;justify-content:center;gap:12px">
                <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Sign In with Google
            </button>

            <div style="display:flex;align-items:center;gap:12px;margin-top:14px">
                <div style="flex:1;height:1px;background:var(--glass-border)"></div>
                <span style="font-size:0.75rem;color:var(--text-muted)">Evaluation Mode</span>
                <div style="flex:1;height:1px;background:var(--glass-border)"></div>
            </div>

            <button class="btn btn-lg" id="demo-login-btn" style="width:100%;justify-content:center;background:rgba(0,240,255,0.06);border:1px solid rgba(0,240,255,0.2);color:var(--accent-cyan);margin-top:8px;">
                ⚡ Launch Demo Mode
            </button>

            <p class="auth-switch">Don't have an account? <a href="#/register" class="auth-link">Create Account</a></p>
        </div>
        <div class="auth-footer">🛡️ National Cyber Defense Platform • Powered by Realtime Cloud Infrastructure</div>

        <!-- Cloud Setup Advisory Modal (Shown if Firebase services require activation) -->
        <div id="cloud-setup-modal" class="modal-overlay">
            <div class="modal" style="max-width:480px;background:#181926;padding:32px;border:1px solid rgba(255,255,255,0.15);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span style="font-size:1.8rem">☁️</span>
                        <h3 style="font-size:1.15rem;font-weight:700;">Cloud Provider Activation</h3>
                    </div>
                    <button id="cloud-modal-close" class="modal-close">✕</button>
                </div>
                <p id="cloud-setup-msg" style="color:var(--text-secondary);font-size:0.85rem;line-height:1.6;margin-bottom:20px;"></p>
                <div style="display:flex;flex-direction:column;gap:10px;">
                    <a id="cloud-console-link" href="https://console.firebase.google.com/project/anup-bfc5f-cbd76/authentication/providers" target="_blank" class="btn btn-primary" style="justify-content:center;">
                        Open Firebase Providers Console ↗
                    </a>
                    <button id="cloud-modal-demo-btn" class="btn btn-secondary" style="justify-content:center;">
                        Continue in Demo Mode
                    </button>
                </div>
            </div>
        </div>
    </div>`,

    afterRender: (onLogin) => {
        const setupModal = document.getElementById('cloud-setup-modal');
        const setupMsg = document.getElementById('cloud-setup-msg');
        const setupClose = document.getElementById('cloud-modal-close');
        const setupDemoBtn = document.getElementById('cloud-modal-demo-btn');

        const showCloudHelp = (message) => {
            if (setupMsg) setupMsg.textContent = message;
            setupModal?.classList.add('active');
        };

        setupClose?.addEventListener('click', () => setupModal?.classList.remove('active'));
        setupDemoBtn?.addEventListener('click', async () => {
            setupModal?.classList.remove('active');
            await signInDemo();
            showToast('⚡ Switched to Demo Mode', 'info');
            setTimeout(() => { window.location.hash = '#/'; window.location.reload(); }, 300);
        });

        // Real Google OAuth 2.0
        document.getElementById('google-signin-btn')?.addEventListener('click', async () => {
            try {
                showToast('Connecting to Google OAuth 2.0...', 'info');
                const user = await signInWithGoogle();
                showToast(`Signed in as ${user.displayName || user.email}!`, 'success');
                if (onLogin) onLogin();
                else {
                    window.location.hash = '#/';
                    window.location.reload();
                }
            } catch (err) {
                console.error(err);
                if (err.message.includes('Firebase Auth is not enabled') || err.message.includes('not authorized for OAuth')) {
                    showCloudHelp(err.message);
                } else {
                    showToast(err.message, 'danger');
                }
            }
        });

        // Email & Password Sign In
        document.getElementById('login-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            try {
                const user = await signInWithEmail(email, password);
                showToast(`Welcome back, ${user.displayName || user.email}!`, 'success');
                if (onLogin) onLogin();
                else {
                    window.location.hash = '#/';
                    window.location.reload();
                }
            } catch (err) {
                console.error(err);
                if (err.message.includes('Firebase Auth is not enabled')) {
                    showCloudHelp(err.message);
                } else {
                    showToast(err.message, 'danger');
                }
            }
        });

        // Demo Login
        document.getElementById('demo-login-btn')?.addEventListener('click', async () => {
            await signInDemo();
            showToast('⚡ Entered Demo Mode', 'success');
            setTimeout(() => {
                window.location.hash = '#/';
                window.location.reload();
            }, 300);
        });
    }
};
