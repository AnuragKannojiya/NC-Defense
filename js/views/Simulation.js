// =====================================================================
// Simulation Center — 5 Fully Interactive Cyber Threat Simulations
// =====================================================================
import { saveSimulation } from '../services/db.js';
import { showToast } from '../components/Toast.js';

export const Simulation = {
    render: (profile) => {
        const sims = profile?.simulations || {};
        const emailDone = sims['phishing_email']?.completed;
        const smsDone = sims['smishing_sms']?.completed;
        const webDone = sims['fake_website']?.completed;
        const vishDone = sims['vishing_call']?.completed;
        const usbDone = sims['usb_drop']?.completed;

        const totalCompleted = [emailDone, smsDone, webDone, vishDone, usbDone].filter(Boolean).length;

        return `
        <div class="page-header fade-in-up">
            <div class="page-header-row">
                <div>
                    <h1>Interactive Threat Simulation Center</h1>
                    <p>Test and hone your threat defense instincts across 5 realistic national-scale attack vectors.</p>
                </div>
                <div style="text-align:right">
                    <div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Completed Simulations</div>
                    <div id="sim-overall-score" style="font-size:1.8rem;font-family:var(--font-display);font-weight:800;color:${totalCompleted===5?'var(--success)':'var(--accent-cyan)'}">
                        ${totalCompleted} / 5
                    </div>
                </div>
            </div>
        </div>

        <div class="tabs fade-in-up" id="sim-tabs">
            <button class="tab active" data-sim="email">📧 Phishing Email ${emailDone?'<span style="color:var(--success);margin-left:4px">✓</span>':''}</button>
            <button class="tab" data-sim="sms">📱 Smishing SMS ${smsDone?'<span style="color:var(--success);margin-left:4px">✓</span>':''}</button>
            <button class="tab" data-sim="website">🌐 Fake Website ${webDone?'<span style="color:var(--success);margin-left:4px">✓</span>':''}</button>
            <button class="tab" data-sim="vishing">📞 Vishing Call ${vishDone?'<span style="color:var(--success);margin-left:4px">✓</span>':''}</button>
            <button class="tab" data-sim="usb">💾 USB Drop ${usbDone?'<span style="color:var(--success);margin-left:4px">✓</span>':''}</button>
        </div>

        <!-- 1. EMAIL SIMULATION -->
        <div id="sim-email" class="sim-panel fade-in-up">
            <div style="margin-bottom:16px;padding:14px;background:var(--info-muted);border:1px solid rgba(59,130,246,0.2);border-radius:var(--border-radius-sm);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                <div><strong style="color:var(--info)">Mission:</strong> Click all <strong style="color:var(--text-primary)">7 phishing indicators</strong> inside the email body & headers.</div>
                <div style="font-size:0.9rem;font-family:var(--font-mono);font-weight:700;" id="email-counter">Found: 0 / 7</div>
            </div>

            <div class="sim-email-wrapper">
                <div class="sim-email-toolbar">
                    <div class="sim-dot sim-dot-r"></div><div class="sim-dot sim-dot-y"></div><div class="sim-dot sim-dot-g"></div>
                    <span style="margin-left:16px;font-size:0.8rem;color:var(--text-muted)">NCD SecureMail Client v4.2</span>
                    ${emailDone ? '<span class="badge badge-success" style="margin-left:auto;">✓ Previously Completed</span>' : ''}
                </div>
                <div class="sim-email-client">
                    <div class="sim-email-header">
                        <div class="sim-email-field">
                            <span class="sim-email-field-label">From:</span>
                            <span class="red-flag" data-flag="Spoofed Sender Domain (.tk)">Ministry of Finance — IT Division &lt;urgent-verify@min-finance-gov.tk&gt;</span>
                        </div>
                        <div class="sim-email-field">
                            <span class="sim-email-field-label">To:</span>
                            <span>${profile?.email || 'agent@ncd.gov.in'}</span>
                        </div>
                        <div class="sim-email-field">
                            <span class="sim-email-field-label">Subject:</span>
                            <span class="red-flag" data-flag="Urgency & Panic Language">⚠️ CRITICAL: Immediate credential verification required — Account suspension in 6 hours</span>
                        </div>
                        <div class="sim-email-field">
                            <span class="sim-email-field-label">Date:</span>
                            <span style="color:#666">April 9, 2026, 02:47 AM</span>
                            <span class="red-flag" data-flag="Suspicious Transmission Time" style="font-size:0.8em;color:#888;margin-left:8px">(sent at 02:47 AM unusual hour)</span>
                        </div>
                    </div>
                    <div class="sim-email-body">
                        <p><span class="red-flag" data-flag="Generic Impersonal Greeting">Dear Valued Government Employee,</span></p><br>
                        <p>Our advanced AI-powered threat detection system has identified <strong>multiple unauthorized access attempts</strong> from IP <span class="red-flag" data-flag="Fabricated Geolocation Scare">175.45.176.0 (Pyongyang, DPRK)</span>.</p><br>
                        <p>As a <strong style="color:#cc0000">MANDATORY security measure</strong>, your credentials will be <strong>permanently revoked</strong> unless verified within 6 hours.</p><br>
                        <div style="text-align:center;margin:28px 0">
                            <span class="red-flag" data-flag="Malicious URL Button" style="display:inline-block;background:#0066CC;color:white;padding:14px 28px;text-decoration:none;border-radius:6px;font-weight:bold;font-size:15px;cursor:pointer;">🔒 Verify My Credentials Now</span>
                            <p style="font-size:11px;color:#888;margin-top:8px">Destination: https://gov-verify.min-finance-gov.tk/auth</p>
                        </div>
                        <p>Failure to comply will result in permanent account suspension and mandatory disciplinary review.</p><br>
                        <p style="color:#666;font-size:0.85em"><span class="red-flag" data-flag="CISO Impersonation Authority Bias">Dr. Rajesh Patel, CISO<br>Ministry of Finance — Government of India<br>Digital Infrastructure Security Cell</span></p>
                    </div>
                </div>
            </div>

            <div style="text-align:center;margin-top:28px">
                <button id="submit-email-sim" class="btn btn-primary btn-lg" style="display:none">
                    ✓ Submit Email Analysis (+500 pts)
                </button>
            </div>
        </div>

        <!-- 2. SMS SMISHING SIMULATION -->
        <div id="sim-sms" class="sim-panel" style="display:none">
            <div style="margin-bottom:16px;padding:14px;background:var(--info-muted);border:1px solid rgba(59,130,246,0.2);border-radius:var(--border-radius-sm);font-size:0.85rem;color:var(--text-secondary)">
                <strong style="color:var(--info)">Mission:</strong> Inspect the simulated SMS message on your mobile device. Click the <strong>suspicious elements</strong>, then choose the correct defensive action.
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:start;" class="sim-sms-grid">
                <!-- Phone View -->
                <div class="sim-phone">
                    <div class="phone-notch">
                        <span>09:41</span>
                        <span>📶 5G 🔋 98%</span>
                    </div>
                    <div class="phone-screen">
                        <div style="text-align:center;margin-bottom:20px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.06);">
                            <div style="font-size:0.75rem;color:var(--text-muted)">Encrypted SMS Channel</div>
                            <div style="font-size:0.95rem;font-weight:600;margin-top:4px;" class="red-flag-sms" data-flag="Unverified 10-Digit Mobile (Banks use 6-digit alpha header)">+91-9876544892</div>
                        </div>

                        <div class="phone-msg-bubble">
                            <div style="font-size:0.7rem;color:var(--accent-cyan);margin-bottom:4px">SBI INB ALERT</div>
                            <span class="red-flag-sms" data-flag="Urgent Financial Coercion">⚠️ [ALERT] Your SBI A/c XX4521 debited ₹48,999.00 at 02:47 AM.</span>
                            <br><br>
                            If this transaction was NOT initiated by you, immediately click link to block and reverse charge:
                            <br>
                            <span class="red-flag-sms" data-flag="Fraudulent Free-TLD Phishing Link (.tk)">👉 https://sbi-secure-card.tk/block?ref=93721</span>
                            <br><br>
                            <span class="red-flag-sms" data-flag="Fake Opt-Out Probe (Used to verify active numbers)">Reply STOP to opt out of alerts.</span>
                        </div>
                        <div style="font-size:0.7rem;color:var(--text-muted);text-align:right;margin-top:6px">Today, 2:47 AM • Received</div>
                    </div>
                </div>

                <!-- Decision & Feedback Column -->
                <div>
                    <div class="card" style="margin-bottom:20px;">
                        <h3 class="mb-12">Discovered Smishing Flags (<span id="sms-flags-count">0</span> / 4)</h3>
                        <div id="sms-flags-list" style="display:flex;flex-direction:column;gap:8px;font-size:0.82rem;color:var(--text-secondary);min-height:80px;">
                            <span style="color:var(--text-muted);font-style:italic">Click red flags on the phone to discover threats...</span>
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="mb-16">Choose Your Action</h3>
                        <div style="display:flex;flex-direction:column;gap:12px">
                            <button class="sim-choice-btn" data-choice="click">
                                <span>❌</span>
                                <div><strong>Click the link to cancel the debit</strong><div style="font-size:0.78rem;color:var(--text-muted)">Verify the transaction immediately before money leaves the bank.</div></div>
                            </button>
                            <button class="sim-choice-btn" data-choice="stop">
                                <span>❌</span>
                                <div><strong>Reply 'STOP' to unsubscribe</strong><div style="font-size:0.78rem;color:var(--text-muted)">Tell the sender to stop texting your number.</div></div>
                            </button>
                            <button class="sim-choice-btn" data-choice="report">
                                <span>🛡️</span>
                                <div><strong>Do Not Click • Report to 1930 / CERT-In & Block Sender</strong><div style="font-size:0.78rem;color:var(--text-muted)">Log incident on Cyber Crime portal and block number in telecommunications registry.</div></div>
                            </button>
                        </div>
                        <div id="sms-result-box" style="margin-top:20px;display:none;padding:16px;border-radius:var(--border-radius-sm);font-size:0.85rem;"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 3. FAKE WEBSITE SIMULATION -->
        <div id="sim-website" class="sim-panel" style="display:none">
            <div style="margin-bottom:16px;padding:14px;background:var(--info-muted);border:1px solid rgba(59,130,246,0.2);border-radius:var(--border-radius-sm);font-size:0.85rem;color:var(--text-secondary)">
                <strong style="color:var(--info)">Mission:</strong> You received a link claiming to be the Income Tax e-Filing Portal. Inspect the browser interface, identify all <strong>4 deceptive indicators</strong>, and submit a domain takedown.
            </div>

            <div class="sim-browser">
                <div class="browser-topbar">
                    <div style="display:flex;gap:6px">
                        <div class="sim-dot sim-dot-r" style="width:10px;height:10px"></div>
                        <div class="sim-dot sim-dot-y" style="width:10px;height:10px"></div>
                        <div class="sim-dot sim-dot-g" style="width:10px;height:10px"></div>
                    </div>
                    <div class="browser-url-bar">
                        <span class="red-flag-web" data-flag="Insecure HTTP Protocol (Not HTTPS)" style="color:var(--danger)">⚠️ Not Secure | http://</span>
                        <span class="red-flag-web" data-flag="Typosquatting Netlify Subdomain (Gov portals always use .gov.in)">income-tax-gov-in.netlify.app</span>
                        <span style="color:var(--text-muted)">/e-filing/login</span>
                    </div>
                </div>

                <div style="background:#ffffff;color:#222;padding:36px;text-align:center;">
                    <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:16px">
                        <span style="font-size:2.4rem">🇮🇳</span>
                        <div style="text-align:left">
                            <div style="font-weight:800;font-size:1.1rem;color:#0F2942">INCOME TAX DEPARTMENT</div>
                            <div style="font-size:0.75rem;color:#666">Government of India • Central Board of Direct Taxes</div>
                        </div>
                    </div>

                    <div style="max-width:380px;margin:24px auto;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:24px;text-align:left;">
                        <h4 style="color:#111;margin-bottom:12px;">e-Filing Login</h4>
                        <div style="margin-bottom:12px">
                            <label style="font-size:0.75rem;font-weight:600;color:#555;display:block;margin-bottom:4px">PAN / User ID</label>
                            <input type="text" id="fake-pan" placeholder="ABCDE1234F" style="width:100%;padding:10px;border:1px solid #ccc;border-radius:6px;font-family:monospace;">
                        </div>
                        <div style="margin-bottom:16px">
                            <label style="font-size:0.75rem;font-weight:600;color:#555;display:block;margin-bottom:4px">Password</label>
                            <input type="password" id="fake-pass" placeholder="••••••••••••" style="width:100%;padding:10px;border:1px solid #ccc;border-radius:6px;">
                        </div>
                        <div class="red-flag-web" data-flag="Credential Harvesting Form on Unverified Hosting" style="width:100%;padding:10px;background:#FF6700;color:white;text-align:center;font-weight:700;border-radius:6px;cursor:pointer;">
                            Secure Login & Proceed
                        </div>
                    </div>
                    <div class="red-flag-web" data-flag="Fake SSL Certification Badge Graphic" style="font-size:0.75rem;color:#666;cursor:pointer;">
                        🔒 256-Bit SSL Encrypted by FreeSSL (Click to verify)
                    </div>
                </div>
            </div>

            <div class="card mt-24" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
                <div>
                    <h4>Web Indicators Found: <span id="web-flags-count">0</span> / 4</h4>
                    <p style="color:var(--text-secondary);font-size:0.85rem">Click all 4 security anomalies on the browser window above.</p>
                </div>
                <button id="submit-web-sim" class="btn btn-primary btn-lg" style="display:none">
                    🚨 Submit CERT-In Domain Takedown (+500 pts)
                </button>
            </div>
        </div>

        <!-- 4. VISHING CALL SIMULATION -->
        <div id="sim-vishing" class="sim-panel" style="display:none">
            <div style="margin-bottom:16px;padding:14px;background:var(--info-muted);border:1px solid rgba(59,130,246,0.2);border-radius:var(--border-radius-sm);font-size:0.85rem;color:var(--text-secondary)">
                <strong style="color:var(--info)">Mission:</strong> Handle an incoming urgent phone call from an alleged internal IT staff member. Make the correct security choices to prevent remote exploitation.
            </div>

            <div class="card" style="max-width:760px;margin:0 auto;padding:32px;">
                <div style="text-align:center;margin-bottom:24px;">
                    <div style="font-size:3rem;margin-bottom:8px">📞</div>
                    <span class="badge badge-danger">● Call Connected (Encrypted Voice Channel)</span>
                    <h2 style="margin-top:12px;font-size:1.4rem;">Incoming Call: +91 (11) 2309-2000</h2>
                    <p style="color:var(--text-secondary);font-size:0.85rem">Caller ID: "Ministry IT Security Division — Emergency Ops"</p>
                </div>

                <div class="audio-visualizer">
                    <div class="audio-bar"></div><div class="audio-bar"></div><div class="audio-bar"></div>
                    <div class="audio-bar"></div><div class="audio-bar"></div><div class="audio-bar"></div><div class="audio-bar"></div>
                </div>

                <div id="vishing-step-1" class="vishing-stage">
                    <div style="background:var(--bg-secondary);padding:20px;border-radius:var(--border-radius-sm);border-left:4px solid var(--accent-cyan);margin-bottom:24px;">
                        <p style="font-style:italic;color:var(--text-primary);line-height:1.7;">
                            "Hello Agent, this is Vikram from Central IT Operations. We are tracking a live ransomware infection spreading across your local subnet. I need you to open your browser, visit <strong>anydesk.com</strong>, and give me your 9-digit remote desk code immediately so I can patch your system before it locks up."
                        </p>
                    </div>

                    <h4 class="mb-12">How do you respond?</h4>
                    <div style="display:flex;flex-direction:column;gap:12px">
                        <button class="sim-choice-btn" data-vish="fail1">
                            <span>❌</span>
                            <div><strong>Download AnyDesk & share remote control code</strong><div style="font-size:0.78rem;color:var(--text-muted)">The caller is from IT and says it is an emergency ransomware incident.</div></div>
                        </button>
                        <button class="sim-choice-btn" data-vish="pass1">
                            <span>🛡️</span>
                            <div><strong>Ask for Employee ID, Ticket Number & verify official SOC callback</strong><div style="font-size:0.78rem;color:var(--text-muted)">Refuse remote desktop access until verified through internal directory and ticket system.</div></div>
                        </button>
                    </div>
                </div>

                <div id="vishing-step-2" class="vishing-stage" style="display:none">
                    <div style="background:var(--bg-secondary);padding:20px;border-radius:var(--border-radius-sm);border-left:4px solid var(--warning);margin-bottom:24px;">
                        <p style="font-style:italic;color:var(--text-primary);line-height:1.7;">
                            <em>Caller gets hostile & raises voice:</em> "Agent, I don't have time for ticket bureaucracy! The CISO is on the bridge call right now. If your machine encrypts other servers because of your delay, you will face immediate suspension and disciplinary action! Install it now!"
                        </p>
                    </div>

                    <h4 class="mb-12">The caller is applying extreme authority and fear tactics. What is your action?</h4>
                    <div style="display:flex;flex-direction:column;gap:12px">
                        <button class="sim-choice-btn" data-vish="fail2">
                            <span>❌</span>
                            <div><strong>Yield to authority and install the remote tool</strong><div style="font-size:0.78rem;color:var(--text-muted)">You don't want to get suspended or blamed for server downtime.</div></div>
                        </button>
                        <button class="sim-choice-btn" data-vish="pass2">
                            <span>🛡️</span>
                            <div><strong>Disconnect the call immediately & dial SOC Emergency Hotline directly</strong><div style="font-size:0.78rem;color:var(--text-muted)">Hang up. Report the impersonation attempt to the internal SOC team.</div></div>
                        </button>
                    </div>
                </div>

                <div id="vishing-result" style="display:none;margin-top:20px;padding:24px;border-radius:var(--border-radius-sm);text-align:center;">
                </div>
            </div>
        </div>

        <!-- 5. USB DROP SIMULATION -->
        <div id="sim-usb" class="sim-panel" style="display:none">
            <div style="margin-bottom:16px;padding:14px;background:var(--info-muted);border:1px solid rgba(59,130,246,0.2);border-radius:var(--border-radius-sm);font-size:0.85rem;color:var(--text-secondary)">
                <strong style="color:var(--info)">Mission:</strong> You spot an unmarked metallic USB drive lying near the executive parking elevator. Handle the hardware threat according to national physical cybersecurity standards.
            </div>

            <div class="card" style="max-width:760px;margin:0 auto;padding:36px;text-align:center">
                <div style="font-size:4rem;margin-bottom:16px">💾</div>
                <h2 class="mb-12">Recovered Removable Media Device</h2>
                <div class="card" style="text-align:left;background:var(--bg-secondary);margin-bottom:24px;">
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
                        <span class="badge badge-warning">Physical Baiting Vector</span>
                        <span style="font-size:0.75rem;color:var(--text-muted)">Location: Building 3 Basement Parking</span>
                    </div>
                    <p style="color:var(--text-primary);line-height:1.7;">
                        A SanDisk 128GB flash drive with a handwritten label: <br>
                        <strong style="color:var(--warning);font-family:var(--font-mono);font-size:1.05rem;">"CONFIDENTIAL — Q2 2026 Executive Appraisals & Salary Matrix"</strong>
                    </p>
                </div>

                <h4 style="text-align:left;margin-bottom:16px">Select your tactical response:</h4>
                <div style="display:flex;flex-direction:column;gap:12px;text-align:left">
                    <button class="sim-choice-btn" data-usb="plug_work">
                        <span>❌</span>
                        <div><strong>Plug it into your workstation to inspect contents and find the owner</strong><div style="font-size:0.78rem;color:var(--text-muted)">Look for a resume or document metadata to return the drive to the right colleague.</div></div>
                    </button>
                    <button class="sim-choice-btn" data-usb="plug_home">
                        <span>❌</span>
                        <div><strong>Take it home and plug into personal laptop isolated from office Wi-Fi</strong><div style="font-size:0.78rem;color:var(--text-muted)">Check it outside work premises to protect office systems.</div></div>
                    </button>
                    <button class="sim-choice-btn" data-usb="give_peer">
                        <span>❌</span>
                        <div><strong>Hand it to an HR executive or front-desk receptionist</strong><div style="font-size:0.78rem;color:var(--text-muted)">Let non-technical staff plug it in to check the files.</div></div>
                    </button>
                    <button class="sim-choice-btn" data-usb="soc_kiosk">
                        <span>🛡️</span>
                        <div><strong>Turn in to Security Kiosk without connecting to ANY machine</strong><div style="font-size:0.78rem;color:var(--text-muted)">Treat all unknown media as hostile hardware. Submit for air-gapped forensic detonation.</div></div>
                    </button>
                </div>

                <div id="usb-result-box" style="margin-top:24px;display:none;padding:24px;border-radius:var(--border-radius-sm);text-align:left;">
                </div>
            </div>
        </div>
        `;
    },

    afterRender: (profile, _, uid) => {
        // Helper to mark tab completed and update score counter in real-time
        function markTabCompleted(simKey) {
            const tab = document.querySelector(`#sim-tabs [data-sim="${simKey}"]`);
            if (tab && !tab.innerHTML.includes('✓')) {
                tab.innerHTML += ' <span style="color:var(--success);margin-left:4px">✓</span>';
            }
            const count = Array.from(document.querySelectorAll('#sim-tabs .tab')).filter(t => t.innerHTML.includes('✓')).length;
            const overallEl = document.getElementById('sim-overall-score');
            if (overallEl) {
                overallEl.textContent = `${count} / 5`;
                if (count === 5) overallEl.style.color = 'var(--success)';
            }
        }

        // Tab Navigation
        const tabs = document.querySelectorAll('#sim-tabs .tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                document.querySelectorAll('.sim-panel').forEach(p => p.style.display = 'none');
                const target = document.getElementById('sim-' + tab.dataset.sim);
                if (target) {
                    target.style.display = 'block';
                    target.classList.add('fade-in-up');
                }
            });
        });

        // -------------------------------------------------------------
        // 1. Phishing Email Logic
        // -------------------------------------------------------------
        let emailFound = 0;
        const totalEmailFlags = 7;
        const emailCounter = document.getElementById('email-counter');
        const submitEmailBtn = document.getElementById('submit-email-sim');

        document.querySelectorAll('#sim-email .red-flag').forEach(flag => {
            flag.addEventListener('click', (e) => {
                e.preventDefault();
                if (!flag.classList.contains('found')) {
                    flag.classList.add('found');
                    emailFound++;
                    if (emailCounter) emailCounter.textContent = `Found: ${emailFound} / ${totalEmailFlags}`;
                    showToast(`Detected: ${flag.dataset.flag}`, 'success');

                    if (emailFound >= 3 && submitEmailBtn) {
                        submitEmailBtn.style.display = 'inline-flex';
                    }
                    if (emailFound >= totalEmailFlags) {
                        if (emailCounter) emailCounter.style.color = 'var(--success)';
                        showToast('All 7 email red flags identified! Excellent reconnaissance.', 'success');
                    }
                }
            });
        });

        submitEmailBtn?.addEventListener('click', async () => {
            submitEmailBtn.disabled = true;
            const score = Math.round((emailFound / totalEmailFlags) * 100);
            await saveSimulation(uid, 'phishing_email', score);
            markTabCompleted('email');
            showToast(`Email Threat Sim Complete: ${score}% (+${score*5} pts) 🎉`, 'success');
            submitEmailBtn.outerHTML = `
                <div class="card fade-in-up" style="max-width:560px;margin:24px auto 0;text-align:center;padding:24px;border:1px solid rgba(0,255,136,0.3);background:var(--success-muted);">
                    <div style="font-size:2.5rem;margin-bottom:8px">🛡️</div>
                    <h3 style="color:var(--success);margin-bottom:6px">Phishing Reconnaissance Passed!</h3>
                    <p style="color:var(--text-primary);font-size:0.88rem;margin-bottom:16px">Score: ${score}% • +${score*5} points awarded to your security profile.</p>
                    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
                        <button class="btn btn-primary" id="go-next-sms">Next Simulation: Smishing SMS →</button>
                        <a href="#/" class="btn btn-secondary">Dashboard</a>
                    </div>
                </div>
            `;
            document.getElementById('go-next-sms')?.addEventListener('click', () => {
                document.querySelector('#sim-tabs [data-sim="sms"]')?.click();
            });
        });

        // -------------------------------------------------------------
        // 2. Smishing SMS Logic
        // -------------------------------------------------------------
        let smsFlags = new Set();
        const smsCounter = document.getElementById('sms-flags-count');
        const smsFlagsList = document.getElementById('sms-flags-list');
        const smsResultBox = document.getElementById('sms-result-box');

        document.querySelectorAll('.red-flag-sms').forEach(flag => {
            flag.addEventListener('click', () => {
                const text = flag.dataset.flag;
                if (!smsFlags.has(text)) {
                    smsFlags.add(text);
                    flag.classList.add('found');
                    if (smsCounter) smsCounter.textContent = smsFlags.size;
                    showToast(`SMS Flag: ${text}`, 'success');

                    if (smsFlagsList) {
                        if (smsFlags.size === 1) smsFlagsList.innerHTML = '';
                        const item = document.createElement('div');
                        item.style.color = 'var(--success)';
                        item.innerHTML = `✓ <strong>${text}</strong>`;
                        smsFlagsList.appendChild(item);
                    }
                }
            });
        });

        document.querySelectorAll('[data-choice]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const choice = btn.dataset.choice;
                if (!smsResultBox) return;
                smsResultBox.style.display = 'block';

                if (choice === 'report') {
                    btn.classList.add('selected-correct');
                    smsResultBox.style.background = 'var(--success-muted)';
                    smsResultBox.style.border = '1px solid rgba(0,255,136,0.3)';
                    smsResultBox.innerHTML = `
                        <h4 style="color:var(--success);margin-bottom:8px">✓ Threat Neutralized!</h4>
                        <p style="color:var(--text-primary);line-height:1.6">
                            By blocking the sender and alerting the national cyber hotline (1930) and CERT-In, you prevented credential exfiltration, card cloning, and SIM swap authorization.
                        </p>
                        <button id="finish-sms-btn" class="btn btn-primary btn-sm mt-12">Claim Points (+500 pts) →</button>
                    `;
                    document.getElementById('finish-sms-btn')?.addEventListener('click', async () => {
                        const finishBtn = document.getElementById('finish-sms-btn');
                        if (finishBtn) finishBtn.disabled = true;
                        await saveSimulation(uid, 'smishing_sms', 100);
                        markTabCompleted('sms');
                        showToast('Smishing SMS Simulation Passed (+500 pts)!', 'success');
                        smsResultBox.innerHTML = `
                            <div style="text-align:center;padding:12px;">
                                <div style="font-size:2rem;margin-bottom:8px">📱</div>
                                <h4 style="color:var(--success);margin-bottom:6px">Smishing Vector Defeated (+500 pts)!</h4>
                                <p style="color:var(--text-primary);font-size:0.85rem;margin-bottom:14px">Logged and reported to CERT-In registry.</p>
                                <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
                                    <button class="btn btn-primary" id="go-next-web">Next: Fake Website →</button>
                                    <a href="#/" class="btn btn-secondary">Dashboard</a>
                                </div>
                            </div>
                        `;
                        document.getElementById('go-next-web')?.addEventListener('click', () => {
                            document.querySelector('#sim-tabs [data-sim="website"]')?.click();
                        });
                    });
                } else if (choice === 'click') {
                    btn.classList.add('selected-wrong');
                    smsResultBox.style.background = 'var(--danger-muted)';
                    smsResultBox.style.border = '1px solid rgba(255,51,102,0.3)';
                    smsResultBox.innerHTML = `
                        <h4 style="color:var(--danger);margin-bottom:8px">❌ Compromise Simulated!</h4>
                        <p style="color:var(--text-secondary);line-height:1.6">
                            The link redirects to an unverified Russian / Tokelau hosted phishing site that injects an APK malware dropper and harvests your net banking MPIN. Never click links in unsolicited transaction alerts.
                        </p>
                    `;
                } else {
                    btn.classList.add('selected-wrong');
                    smsResultBox.style.background = 'var(--warning-muted)';
                    smsResultBox.style.border = '1px solid rgba(255,184,0,0.3)';
                    smsResultBox.innerHTML = `
                        <h4 style="color:var(--warning);margin-bottom:8px">⚠️ Phone Number Confirmed Active</h4>
                        <p style="color:var(--text-secondary);line-height:1.6">
                            Replying 'STOP' to fraudulent numbers confirms that your phone number is active and monitored by a human, increasing future targeted attacks. Always block and report instead.
                        </p>
                    `;
                }
            });
        });

        // -------------------------------------------------------------
        // 3. Fake Website Logic
        // -------------------------------------------------------------
        let webFlags = new Set();
        const webCount = document.getElementById('web-flags-count');
        const submitWebBtn = document.getElementById('submit-web-sim');

        document.querySelectorAll('.red-flag-web').forEach(flag => {
            flag.addEventListener('click', () => {
                const flagName = flag.dataset.flag;
                if (!webFlags.has(flagName)) {
                    webFlags.add(flagName);
                    flag.classList.add('found');
                    if (webCount) webCount.textContent = webFlags.size;
                    showToast(`Flag: ${flagName}`, 'success');

                    if (webFlags.size >= 2 && submitWebBtn) {
                        submitWebBtn.style.display = 'inline-flex';
                    }
                }
            });
        });

        submitWebBtn?.addEventListener('click', async () => {
            submitWebBtn.disabled = true;
            await saveSimulation(uid, 'fake_website', 100);
            markTabCompleted('website');
            showToast('Takedown Filed! Fake Website Neutralized (+500 pts) 🌐', 'success');
            submitWebBtn.outerHTML = `
                <div class="card fade-in-up" style="max-width:560px;margin:20px auto 0;text-align:center;padding:24px;border:1px solid rgba(0,255,136,0.3);background:var(--success-muted);">
                    <div style="font-size:2.5rem;margin-bottom:8px">🌐</div>
                    <h3 style="color:var(--success);margin-bottom:6px">Fake Website Neutralized!</h3>
                    <p style="color:var(--text-primary);font-size:0.88rem;margin-bottom:16px">CERT-In takedown notice submitted. Subdomain sinkholed • +500 points awarded.</p>
                    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
                        <button class="btn btn-primary" id="go-next-vish">Next Simulation: Vishing Call →</button>
                        <a href="#/" class="btn btn-secondary">Dashboard</a>
                    </div>
                </div>
            `;
            document.getElementById('go-next-vish')?.addEventListener('click', () => {
                document.querySelector('#sim-tabs [data-sim="vishing"]')?.click();
            });
        });

        // -------------------------------------------------------------
        // 4. Vishing Call Logic
        // -------------------------------------------------------------
        const vishStep1 = document.getElementById('vishing-step-1');
        const vishStep2 = document.getElementById('vishing-step-2');
        const vishResult = document.getElementById('vishing-result');

        document.querySelectorAll('[data-vish]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const action = btn.dataset.vish;
                if (action === 'pass1') {
                    btn.classList.add('selected-correct');
                    if (vishStep1) vishStep1.style.display = 'none';
                    if (vishStep2) vishStep2.style.display = 'block';
                    showToast('Correct! Never provide remote desktop without formal verification.', 'success');
                } else if (action === 'fail1') {
                    btn.classList.add('selected-wrong');
                    if (vishResult) {
                        vishResult.style.display = 'block';
                        vishResult.style.background = 'var(--danger-muted)';
                        vishResult.style.border = '1px solid rgba(255,51,102,0.3)';
                        vishResult.innerHTML = `
                            <h3 style="color:var(--danger);margin-bottom:8px">❌ Full Workstation Compromise!</h3>
                            <p style="color:var(--text-secondary);line-height:1.6">
                                The caller gained remote interactive shell access, bypassed perimeter controls, and extracted session tokens and SSH keys. IT teams never call out-of-the-blue demanding third-party remote desktop software.
                            </p>
                        `;
                    }
                } else if (action === 'pass2') {
                    btn.classList.add('selected-correct');
                    if (vishStep2) vishStep2.style.display = 'none';
                    if (vishResult) {
                        vishResult.style.display = 'block';
                        vishResult.style.background = 'var(--success-muted)';
                        vishResult.style.border = '1px solid rgba(0,255,136,0.3)';
                        vishResult.innerHTML = `
                            <div style="font-size:3rem;margin-bottom:12px">🛡️</div>
                            <h3 style="color:var(--success);margin-bottom:8px">Attack Defeated! Vishing Attempt Blocked</h3>
                            <p style="color:var(--text-primary);max-width:560px;margin:0 auto 16px;line-height:1.6">
                                You resisted urgent psychological coercion and authority bias. The SOC verified no ticket existed and blocked the caller's PBX gateway.
                            </p>
                            <button id="finish-vish-btn" class="btn btn-primary btn-lg">Claim Victory (+500 pts)</button>
                        `;
                        document.getElementById('finish-vish-btn')?.addEventListener('click', async () => {
                            const finishBtn = document.getElementById('finish-vish-btn');
                            if (finishBtn) finishBtn.disabled = true;
                            await saveSimulation(uid, 'vishing_call', 100);
                            markTabCompleted('vishing');
                            showToast('Vishing Defense Passed (+500 pts)! 📞', 'success');
                            vishResult.innerHTML = `
                                <div style="text-align:center;padding:12px;">
                                    <div style="font-size:2rem;margin-bottom:8px">📞</div>
                                    <h3 style="color:var(--success);margin-bottom:6px">Vishing Defense Mastered (+500 pts)!</h3>
                                    <p style="color:var(--text-primary);font-size:0.85rem;margin-bottom:14px">Credential theft foiled and attacker IP blacklisted.</p>
                                    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
                                        <button class="btn btn-primary" id="go-next-usb">Next: USB Drop →</button>
                                        <a href="#/" class="btn btn-secondary">Dashboard</a>
                                    </div>
                                </div>
                            `;
                            document.getElementById('go-next-usb')?.addEventListener('click', () => {
                                document.querySelector('#sim-tabs [data-sim="usb"]')?.click();
                            });
                        });
                    }
                } else if (action === 'fail2') {
                    btn.classList.add('selected-wrong');
                    if (vishResult) {
                        vishResult.style.display = 'block';
                        vishResult.style.background = 'var(--danger-muted)';
                        vishResult.style.border = '1px solid rgba(255,51,102,0.3)';
                        vishResult.innerHTML = `
                            <h3 style="color:var(--danger);margin-bottom:8px">❌ Intimidation Exploit Successful</h3>
                            <p style="color:var(--text-secondary);line-height:1.6">
                                Threat actors frequently impersonate CISOs, lawyers, and executive directors to bypass employee caution. Real security incidents always follow documented protocols.
                            </p>
                        `;
                    }
                }
            });
        });

        // -------------------------------------------------------------
        // 5. USB Drop Logic
        // -------------------------------------------------------------
        const usbResult = document.getElementById('usb-result-box');
        document.querySelectorAll('[data-usb]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const choice = btn.dataset.usb;
                if (!usbResult) return;
                usbResult.style.display = 'block';

                if (choice === 'soc_kiosk') {
                    btn.classList.add('selected-correct');
                    usbResult.style.background = 'var(--success-muted)';
                    usbResult.style.border = '1px solid rgba(0,255,136,0.3)';
                    usbResult.innerHTML = `
                        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
                            <span style="font-size:2rem">🔬</span>
                            <div>
                                <h4 style="color:var(--success)">Air-Gapped Forensics Sandbox Results</h4>
                                <div style="font-size:0.75rem;color:var(--text-muted)">Hardware: Atmel Microcontroller (BadUSB HID Spoofing)</div>
                            </div>
                        </div>
                        <div style="background:var(--bg-primary);padding:14px;border-radius:6px;font-family:var(--font-mono);font-size:0.8rem;color:var(--danger);line-height:1.6;margin-bottom:16px;">
                            [DETECTED PAYLOAD]: HID Keyboard Emulation<br>
                            > EXEC: powershell.exe -WindowStyle Hidden -Enc aQB3AHIA...<br>
                            > TARGET: Exfiltrates Kerberos tickets & installs C2 Beacon.<br>
                            [RESULT]: Blocked before execution. Perimeter safe.
                        </div>
                        <button id="finish-usb-btn" class="btn btn-primary btn-lg">Claim Defense Points (+500 pts) →</button>
                    `;
                    document.getElementById('finish-usb-btn')?.addEventListener('click', async () => {
                        const finishBtn = document.getElementById('finish-usb-btn');
                        if (finishBtn) finishBtn.disabled = true;
                        await saveSimulation(uid, 'usb_drop', 100);
                        markTabCompleted('usb');
                        showToast('USB Baiting Simulation Complete (+500 pts)! 💾', 'success');
                        usbResult.innerHTML = `
                            <div style="text-align:center;padding:16px;">
                                <div style="font-size:3rem;margin-bottom:12px">🎖️</div>
                                <h3 style="color:var(--success);margin-bottom:8px">All Threat Vectors Mastered (+500 pts)!</h3>
                                <p style="color:var(--text-primary);font-size:0.9rem;margin-bottom:16px">You have completed all 5 physical and digital simulations. Your tactical readiness is at 100%.</p>
                                <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
                                    <a href="#/certificate" class="btn btn-primary btn-lg">View Official Certificate 🎓</a>
                                    <a href="#/" class="btn btn-secondary btn-lg">Dashboard</a>
                                </div>
                            </div>
                        `;
                    });
                } else {
                    btn.classList.add('selected-wrong');
                    usbResult.style.background = 'var(--danger-muted)';
                    usbResult.style.border = '1px solid rgba(255,51,102,0.3)';
                    usbResult.innerHTML = `
                        <h4 style="color:var(--danger);margin-bottom:8px">💥 Keystroke Injection Attack Triggered!</h4>
                        <p style="color:var(--text-secondary);line-height:1.6">
                            This was a <strong>BadUSB hardware attack</strong>. The drive mimics a USB keyboard and types 1,000 words per minute the instant it is inserted, executing administrative commands in seconds without triggering antivirus. Never plug unknown drives into any system!
                        </p>
                    `;
                }
            });
        });
    }
};
