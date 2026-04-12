// Simulation Center — 5 Interactive Simulations
import { saveSimulation } from '../services/db.js';
import { showToast } from '../components/Toast.js';

export const Simulation = {
    render: (profile) => {
        const sims = profile?.simulations || {};
        return `
        <div class="page-header fade-in-up">
            <div class="page-header-row"><div><h1>Simulation Center</h1><p>Test your threat detection skills with 5 realistic attack scenarios.</p></div>
                <div style="text-align:right"><div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Detection Score</div><div id="sim-score" style="font-size:2rem;font-family:var(--font-display);font-weight:800;color:var(--text-primary)">0 / 7</div></div>
            </div>
        </div>
        <div class="tabs fade-in-up" id="sim-tabs">
            <button class="tab active" data-sim="email">📧 Phishing Email</button>
            <button class="tab" data-sim="sms">📱 Smishing SMS</button>
            <button class="tab" data-sim="website">🌐 Fake Website</button>
            <button class="tab" data-sim="vishing">📞 Vishing Call</button>
            <button class="tab" data-sim="usb">💾 USB Drop</button>
        </div>

        <!-- Email Sim -->
        <div id="sim-email" class="sim-panel fade-in-up">
            <div style="margin-bottom:16px;padding:14px;background:var(--info-muted);border:1px solid rgba(59,130,246,0.2);border-radius:var(--border-radius-sm);font-size:0.85rem;color:var(--text-secondary)"><strong style="color:var(--info)">Instructions:</strong> Find <strong style="color:var(--text-primary)">7 phishing indicators</strong> by clicking on suspicious elements.</div>
            <div class="sim-email-wrapper">
                <div class="sim-email-toolbar"><div class="sim-dot sim-dot-r"></div><div class="sim-dot sim-dot-y"></div><div class="sim-dot sim-dot-g"></div><span style="margin-left:16px;font-size:0.8rem;color:var(--text-muted)">NCD SecureMail v4.1</span></div>
                <div class="sim-email-client">
                    <div class="sim-email-header">
                        <div class="sim-email-field"><span class="sim-email-field-label">From:</span><span class="red-flag" data-flag="sender">Ministry of Finance — IT Division &lt;urgent-verify@min-finance-gov.tk&gt;</span></div>
                        <div class="sim-email-field"><span class="sim-email-field-label">To:</span><span>${profile?.email || 'agent@ncd.gov.in'}</span></div>
                        <div class="sim-email-field"><span class="sim-email-field-label">Subject:</span><span class="red-flag" data-flag="subject">⚠️ CRITICAL: Immediate credential verification required — Account suspension in 6 hours</span></div>
                        <div class="sim-email-field"><span class="sim-email-field-label">Date:</span><span style="color:#666">April 9, 2026, 02:47 AM</span> <span class="red-flag" data-flag="time" style="font-size:0.8em;color:#999">(sent at unusual hour)</span></div>
                    </div>
                    <div class="sim-email-body">
                        <p><span class="red-flag" data-flag="greeting">Dear Valued Government Employee,</span></p><br>
                        <p>Our advanced AI-powered threat detection system has identified <strong>multiple unauthorized access attempts</strong> from IP <span class="red-flag" data-flag="fear">175.45.176.0 (Pyongyang, DPRK)</span>.</p><br>
                        <p>As a <strong style="color:#cc0000">MANDATORY security measure</strong>, your credentials will be <strong>permanently revoked</strong> unless verified within 6 hours.</p><br>
                        <div style="text-align:center;margin:32px 0">
                            <a href="#" class="red-flag" data-flag="link" style="display:inline-block;background:#0066CC;color:white;padding:14px 32px;text-decoration:none;border-radius:6px;font-weight:bold;font-size:15px">🔒 Verify My Credentials Now</a>
                            <p style="font-size:11px;color:#999;margin-top:8px">Secure Link: https://gov-verify.min-finance-gov.tk/auth</p>
                        </div>
                        <p>Failure to comply will result in permanent account suspension and mandatory disciplinary review.</p><br>
                        <p style="color:#888;font-size:0.85em"><span class="red-flag" data-flag="impersonation">Dr. Rajesh Patel, CISO<br>Ministry of Finance — Government of India<br>Digital Infrastructure Security Cell</span></p>
                    </div>
                </div>
            </div>
            <div style="text-align:center;margin-top:32px"><button id="submit-sim" class="btn btn-primary btn-lg" style="display:none">✓ Submit Simulation Results</button></div>
        </div>

        <!-- SMS Sim -->
        <div id="sim-sms" class="sim-panel" style="display:none">
            <div class="card" style="max-width:420px;margin:40px auto;background:var(--bg-secondary)">
                <div style="text-align:center;padding:16px;border-bottom:1px solid var(--glass-border)"><div style="font-size:0.8rem;color:var(--text-muted)">SMS Message</div><div style="font-size:0.9rem;color:var(--text-primary);margin-top:4px">+91-XXXXXX4892</div></div>
                <div style="padding:24px">
                    <div style="background:var(--bg-tertiary);padding:16px;border-radius:12px 12px 12px 4px;font-size:0.9rem;color:var(--text-secondary);line-height:1.6">🏦 [SBI ALERT] Your A/c XX4521 debited ₹48,999. If not you, click to block: https://sbi-secure.tk/block?ref=93721. Reply STOP to opt out.</div>
                    <div style="font-size:0.7rem;color:var(--text-muted);margin-top:8px">Received: Today, 2:47 AM</div>
                </div>
                <div style="padding:16px;border-top:1px solid var(--glass-border);text-align:center"><span class="badge badge-danger">⚠️ Smishing Detected</span><p style="font-size:0.8rem;color:var(--text-secondary);margin-top:12px">Red Flags: Suspicious .tk domain, urgency, unsolicited, generic greeting, unusual timing</p></div>
            </div>
        </div>

        <!-- Website Sim -->
        <div id="sim-website" class="sim-panel" style="display:none">
            <div class="card" style="max-width:600px;margin:40px auto;padding:0;overflow:hidden">
                <div style="background:#2D2D3D;padding:8px 16px;display:flex;align-items:center;gap:12px"><div style="display:flex;gap:6px"><div class="sim-dot sim-dot-r" style="width:10px;height:10px"></div><div class="sim-dot sim-dot-y" style="width:10px;height:10px"></div><div class="sim-dot sim-dot-g" style="width:10px;height:10px"></div></div><div style="flex:1;background:#1E1E2E;padding:6px 14px;border-radius:6px;font-size:0.75rem;font-family:var(--font-mono);color:var(--danger)">⚠️ http://income-tax-gov-in.netlify.app/e-filing/login</div></div>
                <div style="background:#f5f5f5;padding:40px;text-align:center"><div style="font-size:2rem;margin-bottom:8px">🇮🇳</div><h3 style="color:#333;margin-bottom:4px">Income Tax e-Filing Portal</h3><p style="color:#666;font-size:0.8rem;margin-bottom:24px">Login to file your returns</p><div style="max-width:300px;margin:0 auto"><input type="text" placeholder="PAN Number" style="width:100%;padding:10px 14px;border:1px solid #ddd;border-radius:6px;margin-bottom:12px;font-size:14px" disabled><input type="password" placeholder="Password" style="width:100%;padding:10px 14px;border:1px solid #ddd;border-radius:6px;margin-bottom:16px;font-size:14px" disabled><button style="width:100%;padding:12px;background:#FF6700;color:white;border:none;border-radius:6px;font-weight:600;cursor:not-allowed;opacity:0.7">Login</button></div></div>
                <div style="padding:16px;background:var(--bg-secondary);border-top:1px solid var(--glass-border);text-align:center"><span class="badge badge-danger">⚠️ Fake Login Page</span><p style="font-size:0.8rem;color:var(--text-secondary);margin-top:12px">Red Flags: Non-.gov.in domain, HTTP not HTTPS, hosted on Netlify, impersonating govt portal</p></div>
            </div>
        </div>

        <!-- Vishing Sim -->
        <div id="sim-vishing" class="sim-panel" style="display:none">
            <div class="card" style="max-width:600px;margin:40px auto;text-align:center;padding:48px">
                <div style="font-size:4rem;margin-bottom:16px">📞</div><h2 class="mb-16">Vishing Call Scenario</h2>
                <div class="card" style="text-align:left;background:var(--bg-secondary);margin-bottom:24px">
                    <p style="font-style:italic;color:var(--text-secondary);line-height:1.8">"Hello, this is Vikram from the IT Security Department. We've detected suspicious activity on your workstation. I need you to install a remote access tool so I can investigate. Please go to anydesk.com and download the application. I'll guide you through the installation. This is urgent — your workstation may be compromised."</p>
                </div>
                <span class="badge badge-danger" style="font-size:0.9rem;padding:8px 20px">⚠️ Social Engineering Vishing Attack</span>
                <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:16px;text-align:left"><strong>Red Flags:</strong> Unsolicited call, pressure to install software, urgency, requesting remote access, not using official IT ticket system, no callback verification offered</p>
                <p style="font-size:0.85rem;color:var(--success);margin-top:16px"><strong>Correct Response:</strong> Hang up. Call IT Security via the official number. Report the incident.</p>
            </div>
        </div>

        <!-- USB Sim -->
        <div id="sim-usb" class="sim-panel" style="display:none">
            <div class="card" style="max-width:600px;margin:40px auto;text-align:center;padding:48px">
                <div style="font-size:4rem;margin-bottom:16px">💾</div><h2 class="mb-16">USB Drop Test Scenario</h2>
                <div class="card" style="text-align:left;background:var(--bg-secondary);margin-bottom:24px">
                    <p style="color:var(--text-secondary);line-height:1.8">You find a USB drive in the office parking lot. It's labeled: <strong style="color:var(--warning)">"CONFIDENTIAL — Q2 2026 Salary Data & Bonus Structure"</strong></p>
                    <p style="color:var(--text-secondary);margin-top:12px">What do you do?</p>
                </div>
                <div style="display:flex;flex-direction:column;gap:12px;text-align:left">
                    <div class="quiz-option" style="border-color:var(--danger);cursor:default">❌ Plug it in to check contents</div>
                    <div class="quiz-option" style="border-color:var(--danger);cursor:default">❌ Give it to a colleague to check</div>
                    <div class="quiz-option correct" style="cursor:default">✅ Turn it in to Security without plugging it in</div>
                    <div class="quiz-option" style="border-color:var(--danger);cursor:default">❌ Plug it into a non-work computer</div>
                </div>
                <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:24px"><strong>Baiting Attack:</strong> Malicious USB drives exploit curiosity. They can install malware, create backdoors, or exfiltrate data the instant they're connected. Always submit to security for safe analysis.</p>
            </div>
        </div>`;
    },

    afterRender: (profile, _, uid) => {
        let found = 0;
        const total = 7;
        const scoreDisplay = document.getElementById('sim-score');
        const submitBtn = document.getElementById('submit-sim');

        document.querySelectorAll('#sim-tabs .tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('#sim-tabs .tab').forEach(t=>t.classList.remove('active'));
                tab.classList.add('active');
                document.querySelectorAll('.sim-panel').forEach(p=>p.style.display='none');
                document.getElementById('sim-'+tab.dataset.sim).style.display='block';
            });
        });

        document.querySelectorAll('.red-flag').forEach(flag => {
            flag.addEventListener('click', (e) => {
                e.preventDefault();
                if (!flag.classList.contains('found')) {
                    flag.classList.add('found');
                    found++;
                    scoreDisplay.textContent = `${found} / ${total}`;
                    showToast(`Found: ${flag.dataset.flag.replace(/_/g,' ')}`, 'success');
                    if (found >= total) {
                        scoreDisplay.style.color = 'var(--success)';
                        submitBtn.style.display = 'inline-flex';
                        submitBtn.classList.add('fade-in-up');
                    }
                }
            });
        });

        submitBtn?.addEventListener('click', async () => {
            const score = Math.round((found / total) * 100);
            await saveSimulation(uid, 'phishing_email', score);
            showToast(`Simulation: ${score}% — +${Math.round(score*5)} pts 🎉`, 'success');
            setTimeout(() => { window.location.hash = '#/'; }, 1500);
        });
    }
};
