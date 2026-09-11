// Knowledge Quiz — 20 Questions
import { saveQuizScore } from '../services/db.js';
import { showToast } from '../components/Toast.js';

const QUESTIONS = [
    { q: 'A phishing email from "IT Support" has sender: support@company-helpdesk.tk. What do you do?', o: ['Click the link', 'Forward to colleagues', 'Report to security team', 'Reply asking for info'], c: 2, e: '.tk is suspicious. Always report suspected phishing to your security team.' },
    { q: 'Recommended minimum passphrase length for national systems?', o: ['8 chars', '12 chars', '16 chars', '6 chars'], c: 2, e: 'National standards require 16+ characters for strong passphrases.' },
    { q: 'Which is a social engineering attack?', o: ['SQL injection', 'Impersonating IT to get credentials', 'DDoS attack', 'Buffer overflow'], c: 1, e: 'Social engineering targets people, not systems — impersonation is classic pretexting.' },
    { q: 'You find a USB labeled "Salary Data 2026" in the parking lot. What do you do?', o: ['Plug it in', 'Give to colleague', 'Turn in to security without plugging in', 'Use a public computer'], c: 2, e: 'USB drops are baiting attacks. Never plug unknown devices — submit to security.' },
    { q: 'What does Zero Trust mean?', o: ['Trust internal traffic', 'Never trust, always verify', 'Trust VPN devices', 'Trust verified-once users'], c: 1, e: 'Zero Trust: authenticate every request regardless of origin.' },
    { q: 'Your workstation is compromised. First action?', o: ['Shut down', 'Investigate yourself', 'Disconnect from network, keep powered on', 'Continue working'], c: 2, e: 'Disconnect to prevent spread, keep powered on to preserve volatile memory for forensics.' },
    { q: 'Which encryption standard is used for classified data at rest?', o: ['DES', 'AES-128', 'AES-256', 'ROT13'], c: 2, e: 'AES-256 is required for all classified data at rest per national policy.' },
    { q: 'A colleague asks for your login credentials for an urgent task. You should:', o: ['Share credentials', 'Share username only', 'Refuse and suggest proper access channels', 'Write password on sticky note'], c: 2, e: 'Never share credentials. Each user must have their own authenticated access.' },
    { q: 'What is "smishing"?', o: ['Phishing via SMS', 'Network scanning', 'Social media theft', 'Smartphone malware'], c: 0, e: 'Smishing = SMS + phishing — luring victims via text messages.' },
    { q: 'Data breach reporting deadline under DPDPA?', o: ['1 week', '24 hours', '72 hours', '30 days'], c: 2, e: 'DPDPA requires breach notification within 72 hours.' },
    { q: 'What is the shared responsibility model in cloud security?', o: ['Provider secures everything', 'Customer secures everything', 'Provider: infrastructure; Customer: data/config', 'Cloud is inherently secure'], c: 2, e: 'Provider secures infra; customer secures data, identities, and configurations.' },
    { q: 'Which MFA method is strongest?', o: ['SMS codes', 'Email codes', 'Hardware security key (FIDO2)', 'Security questions'], c: 2, e: 'FIDO2 hardware keys are the strongest — resistant to phishing and SIM-swapping.' },
    { q: 'CERT-In requires incident reporting within:', o: ['24 hours', '6 hours', '48 hours', '72 hours'], c: 1, e: 'CERT-In mandates reporting within 6 hours of detection.' },
    { q: 'Which is NOT a behavioral indicator of insider threat?', o: ['Accessing data outside scope', 'Working unusual hours', 'Following security policies diligently', 'Bulk downloading files'], c: 2, e: 'Following policies is normal behavior, not an insider threat indicator.' },
    { q: 'What does SPF protect against in email?', o: ['Malware attachments', 'Sender address spoofing', 'Email encryption', 'Spam filtering'], c: 1, e: 'SPF validates that the sending server is authorized for that domain.' },
    { q: 'Primary cyber law in India?', o: ['GDPR', 'HIPAA', 'IT Act 2000', 'SOX'], c: 2, e: 'The Information Technology Act 2000 is India\'s primary cyber law.' },
    { q: 'Best practice for mobile device security?', o: ['Disable screen lock', 'Install apps from any source', 'Enroll in MDM and enable encryption', 'Share device freely'], c: 2, e: 'MDM enrollment and encryption are mandatory for devices accessing work systems.' },
    { q: 'What is a BEC (Business Email Compromise) attack?', o: ['Brute force email', 'Spoofing executive email for fraud', 'Email virus', 'Email DoS'], c: 1, e: 'BEC impersonates executives to authorize fraudulent transactions — costs $43B+ annually.' },
    { q: 'ISO 27001 provides a framework for:', o: ['Software development', 'Information Security Management', 'Network design', 'Physical security only'], c: 1, e: 'ISO 27001 is the ISMS standard for managing information security risks.' },
    { q: 'OWASP Top 10 #1 vulnerability (2025)?', o: ['Injection', 'Broken Access Control', 'XSS', 'CSRF'], c: 1, e: 'Broken Access Control has been #1 since 2021 — improper authorization checks.' }
];

export const Quiz = {
    render: () => `
        <div class="page-header fade-in-up"><div class="page-header-row"><div><h1>Knowledge Assessment</h1><p>20-question comprehensive cybersecurity assessment. Score 80%+ for certification eligibility.</p></div><div><span class="badge badge-info">20 Questions</span> <span class="badge badge-warning" style="margin-left:8px">Pass: 80%</span></div></div></div>
        <div class="quiz-container fade-in-up">
            <div id="quiz-progress" class="mb-24"><div class="flex-between mb-16"><span style="font-size:0.85rem;color:var(--text-secondary)" id="q-prog-text">Question 1 of 20</span><span class="text-mono" style="font-size:0.85rem;color:var(--accent-cyan)" id="q-score-live">Score: 0/20</span></div><div class="progress-track"><div class="progress-fill gradient" id="q-prog-bar" style="width:0%"></div></div></div>
            <div id="quiz-area"></div>
        </div>`,

    afterRender: (profile, _, uid) => {
        let cur = 0, score = 0, answered = false;
        const area = document.getElementById('quiz-area');

        function renderQ() {
            answered = false;
            const q = QUESTIONS[cur];
            document.getElementById('q-prog-text').textContent = `Question ${cur+1} of ${QUESTIONS.length}`;
            document.getElementById('q-prog-bar').style.width = `${(cur/QUESTIONS.length)*100}%`;
            area.innerHTML = `<div class="card"><div class="quiz-question"><div class="quiz-question-text">${cur+1}. ${q.q}</div><div class="quiz-options">${q.o.map((o,i)=>`<button class="quiz-option" data-i="${i}">${String.fromCharCode(65+i)}. ${o}</button>`).join('')}</div></div><div id="q-fb" style="display:none;margin-top:16px;padding:16px;border-radius:var(--border-radius-sm);font-size:0.85rem;line-height:1.6"></div><div style="display:flex;justify-content:flex-end;margin-top:20px"><button id="q-next" class="btn btn-primary" style="display:none">${cur<QUESTIONS.length-1?'Next Question →':'View Results'}</button></div></div>`;

            document.querySelectorAll('.quiz-option').forEach(opt => {
                opt.addEventListener('click', () => {
                    if (answered) return;
                    answered = true;
                    const idx = parseInt(opt.dataset.i);
                    const fb = document.getElementById('q-fb');
                    document.querySelectorAll('.quiz-option').forEach((o,i)=>{
                        if(i===q.c) o.classList.add('correct');
                        if(i===idx && idx!==q.c) o.classList.add('wrong');
                        o.style.pointerEvents='none';
                    });
                    if(idx===q.c) { score++; fb.style.background='var(--success-muted)'; fb.style.border='1px solid rgba(0,255,136,0.2)'; fb.innerHTML=`<strong style="color:var(--success)">✓ Correct!</strong><br><span style="color:var(--text-secondary)">${q.e}</span>`; }
                    else { fb.style.background='var(--danger-muted)'; fb.style.border='1px solid rgba(255,51,102,0.2)'; fb.innerHTML=`<strong style="color:var(--danger)">✗ Incorrect</strong><br><span style="color:var(--text-secondary)">${q.e}</span>`; }
                    fb.style.display='block';
                    document.getElementById('q-next').style.display='inline-flex';
                    document.getElementById('q-score-live').textContent=`Score: ${score}/${QUESTIONS.length}`;
                });
            });

            document.getElementById('q-next').addEventListener('click', () => { cur++; cur < QUESTIONS.length ? renderQ() : showResults(); });
        }

        async function showResults() {
            const pct = Math.round((score/QUESTIONS.length)*100);
            const passed = pct >= 80;
            document.getElementById('q-prog-bar').style.width='100%';
            document.getElementById('q-prog-text').textContent='Assessment Complete';
            await saveQuizScore(uid, 'Security Awareness Assessment', score, QUESTIONS.length);
            area.innerHTML = `
                <div class="card fade-in-up" style="text-align:center;padding:48px">
                    <div style="font-size:4rem;margin-bottom:16px">${passed?'🏆':'📋'}</div>
                    <h2 class="mb-16">Assessment ${passed?'Passed!':'Complete'}</h2>
                    <p style="color:var(--text-secondary);margin-bottom:24px">
                        Final Score: <strong style="color:${passed?'var(--success)':'var(--danger)'}">${score}/${QUESTIONS.length} (${pct}%)</strong>
                    </p>
                    <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-bottom:32px">
                        <div class="card" style="padding:20px 32px;text-align:center">
                            <div style="font-size:2rem;font-weight:800;color:var(--accent-cyan)">${score}</div>
                            <div style="font-size:0.75rem;color:var(--text-muted)">Correct</div>
                        </div>
                        <div class="card" style="padding:20px 32px;text-align:center">
                            <div style="font-size:2rem;font-weight:800;color:var(--danger)">${QUESTIONS.length-score}</div>
                            <div style="font-size:0.75rem;color:var(--text-muted)">Incorrect</div>
                        </div>
                        <div class="card" style="padding:20px 32px;text-align:center">
                            <div style="font-size:2rem;font-weight:800;color:var(--warning)">${score*50}</div>
                            <div style="font-size:0.75rem;color:var(--text-muted)">Points</div>
                        </div>
                    </div>
                    ${passed ? '<span class="badge badge-success" style="font-size:0.9rem;padding:8px 20px">✓ Eligible for National Certification</span>' : '<span class="badge badge-warning" style="font-size:0.9rem;padding:8px 20px">Passing Score: 80% (16/20)</span>'}
                    <div style="margin-top:32px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
                        ${passed ? '<a href="#/certificate" class="btn btn-primary">🎓 View Certificate</a>' : ''}
                        <button id="retake-quiz-btn" class="btn btn-primary">🔄 Retake Assessment</button>
                        <a href="#/" class="btn btn-secondary">Dashboard</a>
                    </div>
                </div>`;
            document.getElementById('retake-quiz-btn')?.addEventListener('click', () => {
                cur = 0;
                score = 0;
                renderQ();
            });
            showToast(`Quiz: ${pct}% — +${score*50} pts awarded`, passed ? 'success' : 'info');
        }

        renderQ();
    }
};
