// Register View
import { signUpWithEmail } from '../services/auth.js';
import { showToast } from '../components/Toast.js';

export const Register = {
    render: () => `
    <div class="auth-page">
        <div class="auth-card">
            <div class="auth-logo">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M12 22S2 16 2 8V5L12 2L22 5V8C22 16 12 22 12 22Z" stroke="url(#rG)" stroke-width="1.5"/><path d="M9 12l2 2 4-4" stroke="url(#rG)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="rG" x1="2" y1="2" x2="22" y2="22"><stop stop-color="#00F0FF"/><stop offset="1" stop-color="#7C3AED"/></linearGradient></defs></svg>
            </div>
            <h1 class="auth-title">Create Account</h1>
            <p class="auth-subtitle">Join the National Cyber Defense Training Platform</p>

            <form id="register-form" class="auth-form">
                <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <input type="text" class="form-input" id="reg-name" placeholder="Agent Smith" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <input type="email" class="form-input" id="reg-email" placeholder="agent@ncd.gov.in" required>
                </div>
                <div class="form-row">
                    <div class="form-group"><label class="form-label">Department</label>
                        <select class="form-select" id="reg-dept"><option value="Cyber Operations">Cyber Operations</option><option value="Threat Intelligence">Threat Intelligence</option><option value="SOC Division">SOC Division</option><option value="Network Defense">Network Defense</option><option value="Policy & Compliance">Policy & Compliance</option><option value="Forensics">Forensics</option><option value="HR">HR</option><option value="Finance">Finance</option><option value="Administration">Administration</option><option value="Legal">Legal</option><option value="Other">Other</option></select>
                    </div>
                    <div class="form-group"><label class="form-label">Role</label>
                        <select class="form-select" id="reg-role"><option value="employee">Employee</option><option value="manager">Manager</option><option value="admin">Administrator</option></select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-input" id="reg-password" placeholder="Min 8 characters" required minlength="8">
                </div>
                <button type="submit" class="btn btn-primary btn-lg auth-submit">Create Secure Account</button>
            </form>

            <p class="auth-switch">Already have an account? <a href="#/login" class="auth-link">Sign In</a></p>
        </div>
        <div class="auth-footer">🛡️ National Cyber Defense | Secure Training Platform</div>
    </div>`,

    afterRender: (onRegister) => {
        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const department = document.getElementById('reg-dept').value;
            const role = document.getElementById('reg-role').value;
            try {
                await signUpWithEmail(email, password, name, department, role);
                showToast(`Account created for ${name}!`, 'success');
                if (onRegister) onRegister({ name, email, department, role });
                else {
                    window.location.hash = '#/';
                    window.location.reload();
                }
            } catch (err) {
                showToast(err.message || 'Registration failed', 'danger');
            }
        });
    }
};
