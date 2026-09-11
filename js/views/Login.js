// =====================================================================
// Login View — Email, Password & Google Sign-In System
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
                    <input type="email" class="form-input" id="login-email" placeholder="anuragkannaujiya6@gmail.com" required autocomplete="email">
                </div>
                <div class="form-group">
                    <div class="flex-between" style="margin-bottom:6px">
                        <label class="form-label" style="margin-bottom:0">Password</label>
                        <span style="font-size:0.75rem;color:var(--text-muted)">Min 6 chars</span>
                    </div>
                    <input type="password" class="form-input" id="login-password" placeholder="••••••••" required autocomplete="current-password">
                </div>
                <button type="submit" class="btn btn-primary btn-lg auth-submit" id="submit-login-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    Sign In with Email
                </button>
            </form>

            <div class="auth-divider"><span>or continue with</span></div>

            <button class="btn btn-secondary btn-lg auth-google" id="google-signin-btn" style="width:100%;justify-content:center;gap:12px">
                <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Sign In with Google
            </button>

            <div style="display:flex;align-items:center;gap:12px;margin-top:14px">
                <div style="flex:1;height:1px;background:var(--glass-border)"></div>
                <span style="font-size:0.75rem;color:var(--text-muted)">Instant Access</span>
                <div style="flex:1;height:1px;background:var(--glass-border)"></div>
            </div>

            <button class="btn btn-lg" id="demo-login-btn" style="width:100%;justify-content:center;background:rgba(0,240,255,0.06);border:1px solid rgba(0,240,255,0.2);color:var(--accent-cyan);margin-top:8px;">
                ⚡ Launch Demo Mode
            </button>

            <p class="auth-switch">Don't have an account? <a href="#/register" class="auth-link">Create Account</a></p>
        </div>
        <div class="auth-footer">🛡️ National Cyber Defense Platform • Secure Government Portal</div>

        <!-- Google OAuth Account Picker Modal -->
        <div id="google-auth-modal" class="modal-overlay">
            <div class="modal" style="max-width:440px;background:#1E1F2E;border:1px solid rgba(255,255,255,0.1);padding:32px 28px;text-align:center;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <svg width="24" height="24" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        <span style="font-size:0.9rem;font-weight:600;color:var(--text-primary);">Google Accounts</span>
                    </div>
                    <button id="google-modal-close" class="modal-close">✕</button>
                </div>

                <h3 style="font-size:1.25rem;margin-bottom:6px;font-family:var(--font-display);">Sign in with Google</h3>
                <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:24px;">Choose an account to continue to <strong>National Cyber Defense</strong></p>

                <!-- Primary Account Option (Anurag Kannojiya) -->
                <div id="google-account-anurag" style="display:flex;align-items:center;gap:14px;padding:14px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;cursor:pointer;margin-bottom:12px;text-align:left;transition:all 0.2s;" onmouseover="this.style.borderColor='var(--accent-cyan)';this.style.background='rgba(0,240,255,0.06)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.1)';this.style.background='rgba(255,255,255,0.04)'">
                    <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#4285F4,#34A853);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;flex-shrink:0;">AK</div>
                    <div style="flex:1;overflow:hidden;">
                        <div style="font-weight:600;font-size:0.9rem;color:var(--text-primary);">Anurag Kannojiya</div>
                        <div style="font-size:0.78rem;color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;">anuragkannaujiya6@gmail.com</div>
                    </div>
                    <span class="badge badge-success" style="font-size:0.65rem;">Primary</span>
                </div>

                <!-- Custom Google Account Option -->
                <div id="google-account-custom-trigger" style="display:flex;align-items:center;gap:14px;padding:12px 16px;border:1px dashed rgba(255,255,255,0.15);border-radius:12px;cursor:pointer;text-align:left;transition:all 0.2s;" onmouseover="this.style.borderColor='var(--text-secondary)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.15)'">
                    <div style="width:40px;height:40px;border-radius:50%;background:var(--bg-tertiary);display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:1.2rem;">+</div>
                    <div style="font-size:0.85rem;color:var(--text-secondary);">Use another Google account</div>
                </div>

                <!-- Custom Google Email Input Area -->
                <div id="google-custom-box" style="display:none;margin-top:16px;text-align:left;padding-top:14px;border-top:1px solid rgba(255,255,255,0.08);">
                    <label class="form-label" style="font-size:0.75rem">Google Email / Account</label>
                    <input type="email" id="google-custom-email" class="form-input" placeholder="username@gmail.com" style="margin-bottom:10px;padding:10px 14px;font-size:0.85rem;">
                    <label class="form-label" style="font-size:0.75rem">Full Name</label>
                    <input type="text" id="google-custom-name" class="form-input" placeholder="Your Name" style="margin-bottom:14px;padding:10px 14px;font-size:0.85rem;">
                    <button id="google-custom-submit" class="btn btn-primary btn-sm" style="width:100%;justify-content:center;">Continue</button>
                </div>

                <div style="margin-top:24px;font-size:0.72rem;color:var(--text-muted);line-height:1.5;">
                    To continue, Google will share your name, email address, and profile picture with National Cyber Defense.
                </div>
            </div>
        </div>
    </div>`,

    afterRender: (onLogin) => {
        // Email & Password Sign In
        const form = document.getElementById('login-form');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            try {
                const user = await signInWithEmail(email, password);
                showToast(`Welcome back, ${user.displayName || 'Agent'}!`, 'success');
                if (onLogin) onLogin();
                else {
                    window.location.hash = '#/';
                    window.location.reload();
                }
            } catch (err) {
                showToast(err.message || 'Sign-in failed', 'danger');
            }
        });

        // Google Modal triggers
        const googleModal = document.getElementById('google-auth-modal');
        const googleBtn = document.getElementById('google-signin-btn');
        const googleClose = document.getElementById('google-modal-close');

        googleBtn?.addEventListener('click', () => {
            googleModal?.classList.add('active');
        });

        googleClose?.addEventListener('click', () => {
            googleModal?.classList.remove('active');
        });

        googleModal?.addEventListener('click', (e) => {
            if (e.target === googleModal) googleModal.classList.remove('active');
        });

        // 1-Click Google Sign In as Anurag Kannojiya
        document.getElementById('google-account-anurag')?.addEventListener('click', async () => {
            try {
                googleModal?.classList.remove('active');
                const user = await signInWithGoogle({
                    name: 'Anurag Kannojiya',
                    email: 'anuragkannaujiya6@gmail.com',
                    photoURL: 'https://avatars.githubusercontent.com/u/144708033?v=4',
                    department: 'National Cyber Command',
                    role: 'Security Director'
                });
                showToast(`Signed in with Google as ${user.displayName}`, 'success');
                if (onLogin) onLogin();
                else {
                    window.location.hash = '#/';
                    window.location.reload();
                }
            } catch (err) {
                showToast(err.message || 'Google sign-in failed', 'danger');
            }
        });

        // Custom Google Account trigger
        const customTrigger = document.getElementById('google-account-custom-trigger');
        const customBox = document.getElementById('google-custom-box');
        customTrigger?.addEventListener('click', () => {
            if (customBox) {
                customBox.style.display = customBox.style.display === 'none' ? 'block' : 'none';
            }
        });

        document.getElementById('google-custom-submit')?.addEventListener('click', async () => {
            const email = document.getElementById('google-custom-email').value;
            const name = document.getElementById('google-custom-name').value;
            if (!email || !email.includes('@')) {
                showToast('Please enter a valid Google email address', 'warning');
                return;
            }
            try {
                googleModal?.classList.remove('active');
                const user = await signInWithGoogle({
                    name: name || email.split('@')[0],
                    email: email,
                    department: 'Cyber Operations',
                    role: 'employee'
                });
                showToast(`Signed in as ${user.displayName}`, 'success');
                if (onLogin) onLogin();
                else {
                    window.location.hash = '#/';
                    window.location.reload();
                }
            } catch (err) {
                showToast(err.message || 'Sign in failed', 'danger');
            }
        });

        // Demo Login
        document.getElementById('demo-login-btn')?.addEventListener('click', async () => {
            await signInDemo();
            showToast('⚡ Entered Demo Mode — full platform access!', 'success');
            setTimeout(() => {
                window.location.hash = '#/';
                window.location.reload();
            }, 500);
        });
    }
};
