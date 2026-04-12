// =====================================================================
// Training Module Content Data — 13 Modules
// =====================================================================
export const MODULES = [
    {
        key: 'phishing', title: 'Phishing Awareness', icon: '🎣', difficulty: 'Intermediate', duration: '45 min',
        color: '#3B82F6', banner: 'linear-gradient(135deg, #1E3A5F, #0D1B2A)',
        desc: 'Identify phishing emails, smishing, and vishing attacks targeting national infrastructure.',
        sections: [
            { heading: 'What is Phishing?', body: 'Phishing uses fraudulent emails, texts (smishing), or calls (vishing) to extract sensitive information. Attackers impersonate trusted entities — banks, government agencies, or internal IT departments. Over <strong>91% of cyberattacks</strong> begin with a phishing email.' },
            { heading: 'Attack Variants', body: '<ul><li><strong>Spear Phishing</strong> — Targeted attacks using personal info</li><li><strong>Whaling</strong> — Targeting C-suite executives</li><li><strong>Clone Phishing</strong> — Duplicating legitimate emails</li><li><strong>Domain Spoofing</strong> — microsOft.com vs microsoft.com</li><li><strong>BEC (Business Email Compromise)</strong> — Impersonating a CEO or vendor</li></ul>' },
            { heading: 'Red Flags', body: '<ul><li>Urgency or threatening language</li><li>Mismatched sender addresses</li><li>Generic greetings (Dear User)</li><li>Unexpected attachments</li><li>Requests for credentials via email</li><li>Grammar/spelling errors in official mail</li><li>Suspicious shortened URLs</li></ul>' },
            { heading: 'Defense & Reporting', body: 'Never click links or download attachments from unknown senders. Hover over links to verify URLs. Report phishing to <code>phishing@ncd.gov.in</code>. Use email authentication (SPF, DKIM, DMARC) to validate senders. Enable anti-phishing filters organization-wide.' },
            { heading: 'Interactive Exercise', body: 'Go to the <a href="#/simulation" style="color:var(--accent-cyan)">Simulations tab</a> to practice identifying phishing emails in a realistic environment. Find all red flags to earn points!' }
        ]
    },
    {
        key: 'passwords', title: 'Password Hygiene', icon: '🔑', difficulty: 'Beginner', duration: '30 min',
        color: '#8B5CF6', banner: 'linear-gradient(135deg, #2D1B4E, #1A0A2E)',
        desc: 'Master passphrase creation, MFA, and credential management protocols.',
        sections: [
            { heading: 'Why Passwords Matter', body: 'Over <strong>65% of breaches</strong> involve compromised credentials. Weak passwords take seconds to crack — "password123" falls in <strong>0.29 milliseconds</strong>. A 16-character random passphrase takes <strong>centuries</strong>.' },
            { heading: 'Creating Strong Passphrases', body: '<ul><li>Use 16+ characters with random words</li><li>Mix uppercase, lowercase, numbers, symbols</li><li>Avoid personal info and dictionary words</li><li>Use unique passwords per system</li><li>Example: <code>Quantum-Tiger-Bicycle-Moon-42!</code></li></ul>' },
            { heading: 'Multi-Factor Authentication', body: 'MFA adds layers beyond passwords. <strong>Tier 1:</strong> Hardware keys (YubiKey/FIDO2) — strongest. <strong>Tier 2:</strong> Authenticator apps (TOTP). <strong>Tier 3:</strong> SMS codes — weakest (SIM-swapping risk). All classified systems require Tier 1 or 2.' },
            { heading: 'Credential Management', body: 'Use organization-approved password managers. Enable auto-rotation every 90 days for classified systems. Never share credentials via any channel. Never reuse passwords across personal and work accounts. Report suspected compromise immediately.' }
        ]
    },
    {
        key: 'social-engineering', title: 'Social Engineering Defense', icon: '🎭', difficulty: 'Advanced', duration: '60 min',
        color: '#EF4444', banner: 'linear-gradient(135deg, #3D1F1F, #1A0A0A)',
        desc: 'Defend against pretexting, baiting, tailgating, deepfakes, and psychological manipulation.',
        sections: [
            { heading: 'Psychology of Social Engineering', body: 'Social engineering exploits human psychology — trust, fear, urgency, authority, and reciprocity. These attacks bypass all technical controls because they target <em>people</em>, not systems. The attacker\'s toolkit is conversation, not code.' },
            { heading: 'Attack Vectors', body: '<ul><li><strong>Pretexting</strong> — Fabricated scenarios to extract info</li><li><strong>Baiting</strong> — USB drops, free downloads</li><li><strong>Tailgating</strong> — Following through secure doors</li><li><strong>Quid Pro Quo</strong> — Offering help in exchange for info</li><li><strong>Watering Hole</strong> — Compromising frequently visited sites</li><li><strong>Deepfakes</strong> — AI-generated audio/video impersonation</li></ul>' },
            { heading: 'Defense Strategies', body: 'Always verify identity through official channels. Use challenge-response for unverified visitors. Never give sensitive info based on phone/email alone. Be suspicious of unsolicited help. Report all anomalous social approaches. Practice "trust but verify" in all interactions.' },
            { heading: 'Real-World Case Studies', body: 'Study past attacks: The 2024 power grid social engineering campaign, government credential harvesting operations, deepfake CEO fraud causing $25M wire transfer, and insider recruitment via social media profiling.' }
        ]
    },
    {
        key: 'incident-response', title: 'Incident Response', icon: '🚨', difficulty: 'Advanced', duration: '50 min',
        color: '#F59E0B', banner: 'linear-gradient(135deg, #1F2D3D, #0A1628)',
        desc: 'NIST framework: identification, containment, eradication, recovery, and lessons learned.',
        sections: [
            { heading: 'IR Lifecycle (NIST SP 800-61)', body: 'The National Incident Response framework follows 6 phases: <strong>Preparation → Identification → Containment → Eradication → Recovery → Lessons Learned</strong>. Every employee is a sensor in the identification phase.' },
            { heading: 'Identification & Triage', body: 'Recognize Indicators of Compromise (IoCs): unusual logins, data exfiltration signs, unexpected processes, registry changes. Classify severity: <span style="color:var(--danger)">P1 Critical</span> = active breach | <span style="color:var(--warning)">P2 High</span> = confirmed threat | <span style="color:var(--info)">P3 Medium</span> = suspicious activity.' },
            { heading: 'Containment & Eradication', body: '<ul><li>Disconnect compromised systems — do NOT power off</li><li>Preserve volatile memory for forensics</li><li>Document all actions with timestamps</li><li>Notify CISO and NCD SOC</li><li>Isolate network segments if lateral movement detected</li></ul>' },
            { heading: 'Recovery & Lessons Learned', body: 'Restore from clean backups after verification. Monitor restored systems intensively for 72 hours. Conduct Post-Incident Review (PIR) within 5 business days. Update detection rules, playbooks, and training based on findings.' }
        ]
    },
    {
        key: 'data-protection', title: 'Data Protection & Privacy', icon: '🛡️', difficulty: 'Intermediate', duration: '40 min',
        color: '#10B981', banner: 'linear-gradient(135deg, #0D2818, #061A0F)',
        desc: 'Data classification, encryption standards, and DPDPA compliance.',
        sections: [
            { heading: 'Data Classification', body: '4-tier national framework: <span class="badge badge-neutral">Public</span> <span class="badge badge-info">Internal</span> <span class="badge badge-warning">Confidential</span> <span class="badge badge-danger">Top Secret</span>. Misclassification is a security violation. Each tier has specific handling requirements.' },
            { heading: 'Encryption Standards', body: '<ul><li><strong>At Rest:</strong> AES-256 for all classified data</li><li><strong>In Transit:</strong> TLS 1.3 minimum</li><li><strong>Email:</strong> S/MIME or PGP for Confidential+</li><li><strong>Portable Media:</strong> Hardware encryption mandatory</li><li><strong>Key Management:</strong> National PKI framework</li></ul>' },
            { heading: 'DPDPA Compliance', body: 'The Digital Personal Data Protection Act mandates: lawful basis for processing, purpose limitation, data minimization, retention limits, and data subject rights (access, correction, erasure). Breach notification within 72 hours to DPO.' },
            { heading: 'Secure Data Handling', body: 'Never store classified data on personal devices. Use approved cloud with data residency guarantees. Implement proper retention and destruction policies. Conduct regular access reviews. Shred physical documents before disposal.' }
        ]
    },
    {
        key: 'network-security', title: 'Network Security', icon: '🌐', difficulty: 'Intermediate', duration: '55 min',
        color: '#06B6D4', banner: 'linear-gradient(135deg, #0A1929, #041220)',
        desc: 'Zero Trust architecture, VPN protocols, firewalls, and IDS/IPS systems.',
        sections: [
            { heading: 'Defense in Depth', body: 'Multiple layers: perimeter firewalls, network segmentation, IDS/IPS, endpoint protection, and application firewalls. If one layer fails, subsequent layers continue protecting. Diagram: Internet → WAF → Firewall → DMZ → IPS → Internal Network → Endpoint.' },
            { heading: 'Zero Trust Architecture', body: '"Never trust, always verify." Every request is authenticated, authorized, and encrypted — regardless of network location. Pillars: microsegmentation, least-privilege, continuous monitoring, device health verification, and identity-centric security.' },
            { heading: 'VPN & Remote Access', body: 'Use organization VPN with split-tunneling disabled. Certificate-based auth for VPN. Never use public Wi-Fi without VPN. IPSec for site-to-site, WireGuard/OpenVPN for remote users. Report VPN anomalies immediately.' },
            { heading: 'Monitoring & Detection', body: '<ul><li>Monitor traffic for anomalous patterns</li><li>Understand common attack signatures (port scans, C2 beacons)</li><li>Interpret IDS/IPS alerts and escalate</li><li>Know your baseline — deviations signal threats</li><li>Participate in periodic network security drills</li></ul>' }
        ]
    },
    {
        key: 'mobile-security', title: 'Mobile Device Security', icon: '📱', difficulty: 'Beginner', duration: '35 min',
        color: '#EC4899', banner: 'linear-gradient(135deg, #2D1B3D, #1A0A2E)',
        desc: 'BYOD policies, MDM enforcement, app permissions, and mobile threat defense.',
        sections: [
            { heading: 'Mobile Threat Landscape', body: 'Mobile devices are prime targets: always connected, store credentials, access email, and hold MFA tokens. Threats include malicious apps, rogue Wi-Fi, SIM swapping, juice jacking (malicious USB charging), and physical theft.' },
            { heading: 'BYOD & MDM Policies', body: 'All personal devices accessing work systems must enroll in Mobile Device Management (MDM). MDM enforces: encryption, screen lock, remote wipe capability, app whitelisting, and OS update compliance. Unenrolled devices are blocked at the network level.' },
            { heading: 'App Security', body: '<ul><li>Install apps only from official stores</li><li>Review permissions before granting</li><li>Deny unnecessary access (camera, contacts, location)</li><li>Keep apps and OS updated</li><li>Use work profile to separate personal/work data</li></ul>' },
            { heading: 'Physical Security', body: 'Enable biometric + PIN lock. Set auto-lock to 30 seconds. Enable remote locate and wipe. Never leave devices unattended. Report lost/stolen devices within 1 hour. Disable Bluetooth/NFC when not in use.' }
        ]
    },
    {
        key: 'cloud-security', title: 'Cloud Security', icon: '☁️', difficulty: 'Advanced', duration: '50 min',
        color: '#6366F1', banner: 'linear-gradient(135deg, #1E1B4B, #0F0A2E)',
        desc: 'Shared responsibility model, IAM, data sovereignty, and cloud misconfigurations.',
        sections: [
            { heading: 'Shared Responsibility Model', body: 'Cloud security is shared: <strong>Provider</strong> secures infrastructure (physical, network, hypervisor). <strong>Customer</strong> secures data, identities, applications, and configurations. Most cloud breaches stem from customer misconfigurations, not provider failures.' },
            { heading: 'Identity & Access Management', body: 'Implement least privilege across all cloud resources. Use role-based access control (RBAC). Enforce MFA for all cloud console access. Use service accounts with minimal permissions. Rotate access keys every 90 days. Review IAM policies monthly.' },
            { heading: 'Data Sovereignty', body: 'All classified data must reside within India\'s borders. Verify cloud region settings before deployment. Enable data residency controls. Understand cross-border data transfer implications under DPDPA. Use sovereign cloud offerings where available.' },
            { heading: 'Common Misconfigurations', body: '<ul><li>Public S3 buckets / storage containers</li><li>Overly permissive security groups</li><li>Unencrypted databases</li><li>Default credentials on cloud services</li><li>Logging/monitoring not enabled</li><li>No network segmentation (flat VPC)</li></ul>' }
        ]
    },
    {
        key: 'insider-threats', title: 'Insider Threats', icon: '🕵️', difficulty: 'Advanced', duration: '45 min',
        color: '#DC2626', banner: 'linear-gradient(135deg, #450A0A, #1F0A0A)',
        desc: 'Behavioral indicators, data loss prevention, access monitoring, and investigation.',
        sections: [
            { heading: 'Types of Insider Threats', body: '<ul><li><strong>Malicious Insider</strong> — Intentional data theft or sabotage</li><li><strong>Negligent Insider</strong> — Careless mistakes (most common)</li><li><strong>Compromised Insider</strong> — Credentials stolen by external attacker</li><li><strong>Third-Party Insider</strong> — Contractors or vendors with access</li></ul>' },
            { heading: 'Behavioral Indicators', body: 'Watch for: accessing data outside normal scope, working unusual hours without reason, bulk downloads or transfers, expressing dissatisfaction, financial difficulties, unexplained wealth, resistance to policy changes, bypassing security controls without justification.' },
            { heading: 'Technical Controls', body: 'Deploy Data Loss Prevention (DLP) for email, USB, and cloud. Implement User and Entity Behavior Analytics (UEBA). Log and audit all privileged access. Use database activity monitoring (DAM). Apply watermarking to sensitive documents.' },
            { heading: 'Reporting & Investigation', body: 'Report suspicions to your security team confidentially. Do NOT confront suspected insiders. Preserve evidence. Follow the need-to-know principle during investigations. All investigations must follow legal and HR guidelines.' }
        ]
    },
    {
        key: 'physical-security', title: 'Physical Security', icon: '🏢', difficulty: 'Beginner', duration: '30 min',
        color: '#78716C', banner: 'linear-gradient(135deg, #292524, #1C1917)',
        desc: 'Access control systems, CCTV, visitor management, and clean desk policy.',
        sections: [
            { heading: 'Physical Access Control', body: 'Multi-factor physical access: badge + PIN + biometric for sensitive areas. Mantrap entrances for server rooms. Anti-tailgating turnstiles. Access logs reviewed daily. Lost badges must be reported and deactivated within 1 hour.' },
            { heading: 'CCTV & Surveillance', body: 'All entry/exit points monitored 24/7. Server room CCTV with 90-day retention. Periodic CCTV audit to ensure no blind spots. Integration with access control for event correlation. Footage reviewed on any security incident.' },
            { heading: 'Visitor Management', body: 'All visitors must sign in, show ID, and be escorted. Temporary badges must be returned on exit. Visitors prohibited from sensitive areas without CISO approval. Visitor logs retained for 1 year. Escort must maintain visual contact at all times.' },
            { heading: 'Clean Desk Policy', body: 'Clear all documents and devices when leaving your desk. Lock computers (Win+L / Cmd+L). Store sensitive documents in locked cabinets. Shred waste — never use regular bins. No sticky notes with passwords. Whiteboard content must be erased after meetings.' }
        ]
    },
    {
        key: 'secure-sdlc', title: 'Secure SDLC', icon: '💻', difficulty: 'Advanced', duration: '55 min',
        color: '#059669', banner: 'linear-gradient(135deg, #064E3B, #022C22)',
        desc: 'OWASP Top 10, secure code review, DevSecOps, and vulnerability management.',
        sections: [
            { heading: 'Security in the SDLC', body: 'Security must be embedded in every phase: Requirements (threat modeling) → Design (secure architecture) → Development (secure coding) → Testing (SAST/DAST) → Deployment (hardening) → Maintenance (patching). Shifting left saves 100x cost of fixing in production.' },
            { heading: 'OWASP Top 10 (2025)', body: '<ul><li>A01: Broken Access Control</li><li>A02: Cryptographic Failures</li><li>A03: Injection (SQLi, XSS, Command)</li><li>A04: Insecure Design</li><li>A05: Security Misconfiguration</li><li>A06: Vulnerable Components</li><li>A07: Authentication Failures</li><li>A08: Data Integrity Failures</li><li>A09: Logging & Monitoring Failures</li><li>A10: Server-Side Request Forgery</li></ul>' },
            { heading: 'DevSecOps Practices', body: 'Integrate SAST (SonarQube, Semgrep) in CI/CD. Use DAST (OWASP ZAP) for deployed apps. Container scanning (Trivy, Snyk). Dependency checking (npm audit, Dependabot). Infrastructure as Code scanning. Secret detection in commits (GitLeaks).' },
            { heading: 'Code Review Security Checklist', body: 'Check for: input validation, output encoding, authentication/authorization checks, error handling (no stack traces to users), parameterized queries, CORS configuration, CSRF protection, secure headers (CSP, HSTS).' }
        ]
    },
    {
        key: 'email-security', title: 'Email & Communication Security', icon: '📧', difficulty: 'Intermediate', duration: '35 min',
        color: '#0EA5E9', banner: 'linear-gradient(135deg, #0C4A6E, #082F49)',
        desc: 'S/MIME, digital signatures, BEC prevention, and secure communication channels.',
        sections: [
            { heading: 'Email Security Protocols', body: '<ul><li><strong>SPF</strong> — Validates sending server</li><li><strong>DKIM</strong> — Cryptographic email signing</li><li><strong>DMARC</strong> — Policy enforcement (reject/quarantine)</li><li><strong>S/MIME</strong> — End-to-end email encryption</li><li><strong>TLS</strong> — Transport layer encryption</li></ul>' },
            { heading: 'Business Email Compromise', body: 'BEC costs organizations $43B+ annually. Attackers compromise or spoof executive email to authorize fraudulent transactions. Defense: verify payment changes via phone, use dual-authorization for transactions, train finance teams on BEC indicators.' },
            { heading: 'Secure Communication Channels', body: 'Use approved encrypted messaging for sensitive discussions. Video calls: verify participants, use waiting rooms, disable recording. File sharing: use approved enterprise platforms only. Never use personal email or WhatsApp for classified communications.' },
            { heading: 'Digital Signatures', body: 'Digitally sign all official communications. Verify signatures before trusting content. Use organization-issued certificates. Report any signature verification failures. Digital signatures provide non-repudiation — legal proof of sender.' }
        ]
    },
    {
        key: 'compliance', title: 'Regulatory Compliance', icon: '⚖️', difficulty: 'Intermediate', duration: '40 min',
        color: '#D97706', banner: 'linear-gradient(135deg, #451A03, #292524)',
        desc: 'IT Act 2000, CERT-In directives, ISO 27001, GDPR, and audit readiness.',
        sections: [
            { heading: 'India\'s Cyber Legal Framework', body: '<ul><li><strong>IT Act 2000</strong> — Primary cyber law foundation</li><li><strong>IT Rules 2011</strong> — Reasonable security practices</li><li><strong>DPDPA 2023</strong> — Personal data protection</li><li><strong>CERT-In Directives</strong> — 6-hour incident reporting</li><li><strong>RBI CSCRF</strong> — Financial sector requirements</li></ul>' },
            { heading: 'ISO 27001 & ISMS', body: 'Information Security Management System (ISMS) based on ISO 27001 provides the framework for managing security risks. Key elements: risk assessment, Statement of Applicability, controls implementation, internal audit, management review, and continual improvement.' },
            { heading: 'CERT-In Compliance', body: 'CERT-In\'s April 2022 directive requires: 6-hour incident reporting, 180-day log retention, synchronized system clocks (NTP), KYC for VPN/cloud providers. Non-compliance can result in imprisonment.' },
            { heading: 'Audit Readiness', body: 'Maintain evidence: documented policies, training records, access reviews, incident reports, vulnerability scan reports, change management logs. Conduct quarterly internal audits. Remediate findings within defined SLAs. Prepare for annual external audits.' }
        ]
    }
];

export function getModuleByKey(key) {
    return MODULES.find(m => m.key === key);
}
