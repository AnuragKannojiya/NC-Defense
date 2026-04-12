// Certificate View
export const Certificate = {
    render: (profile) => {
        const p = profile || {};
        const completed = Object.values(p.progress || {}).filter(v=>v.completed).length;
        const completionPct = Math.round((completed/13)*100);
        const bestQuiz = p.quizScores?.length ? Math.max(...p.quizScores.map(q=>q.percentage)) : 0;
        const eligible = completionPct >= 50 || bestQuiz >= 80;
        const today = new Date().toLocaleDateString('en-IN', {year:'numeric',month:'long',day:'numeric'});
        const certId = `NCD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2,4).toUpperCase()}`;
        const name = p.displayName || p.name || 'Agent';

        return eligible ? `
        <div class="page-header fade-in-up"><h1>Your Certificate</h1><p>Congratulations on earning your National Cyber Defense certification.</p></div>
        <div class="certificate-container fade-in-up">
            <div class="cert-logo"><svg width="60" height="60" viewBox="0 0 24 24" fill="none"><path d="M12 22S2 16 2 8V5L12 2L22 5V8C22 16 12 22 12 22Z" stroke="url(#cG)" stroke-width="1.2"/><path d="M9 12l2 2 4-4" stroke="url(#cG)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="cG" x1="2" y1="2" x2="22" y2="22"><stop stop-color="#00F0FF"/><stop offset="1" stop-color="#7C3AED"/></linearGradient></defs></svg></div>
            <div class="cert-heading">Government of India — National Cyber Defense</div>
            <h2 class="cert-title">Certificate of Completion</h2>
            <p style="color:var(--text-secondary);margin-bottom:16px">This certifies that</p>
            <div class="cert-name">${name}</div>
            <div class="cert-body">has successfully completed the National Security Awareness Training Program, demonstrating proficiency across ${completed} cybersecurity modules including phishing, social engineering, incident response, data protection, and more.</div>
            <div style="display:flex;justify-content:center;gap:48px;margin-bottom:24px">
                <div style="text-align:center"><div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px">Training</div><div style="font-size:1.2rem;font-weight:700;color:var(--accent-cyan);margin-top:4px">${completionPct}%</div></div>
                <div style="text-align:center"><div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px">Quiz</div><div style="font-size:1.2rem;font-weight:700;color:var(--accent-cyan);margin-top:4px">${bestQuiz}%</div></div>
                <div style="text-align:center"><div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px">Points</div><div style="font-size:1.2rem;font-weight:700;color:var(--accent-cyan);margin-top:4px">${(p.totalPoints||0).toLocaleString()}</div></div>
            </div>
            <div class="cert-date">Issued: ${today}<br>Certificate ID: ${certId}</div>
        </div>
        <div style="text-align:center;margin-top:24px" class="fade-in-up"><button class="btn btn-primary btn-lg" onclick="window.print()">🖨️ Print Certificate</button></div>
        ` : `
        <div class="page-header fade-in-up"><h1>Certification</h1><p>Earn your National Cyber Defense certification.</p></div>
        <div class="card fade-in-up" style="text-align:center;padding:60px"><div style="font-size:4rem;margin-bottom:16px">🔒</div><h2 class="mb-16">Certificate Not Yet Available</h2><p style="color:var(--text-secondary);max-width:500px;margin:0 auto 32px">Complete 50%+ training modules OR score 80%+ on the quiz.</p><div style="display:flex;gap:24px;justify-content:center;margin-bottom:32px"><div class="card" style="padding:20px 32px;text-align:center"><div style="font-size:1.5rem;font-weight:800;color:${completionPct>=50?'var(--success)':'var(--danger)'}">${completionPct}%</div><div style="font-size:0.7rem;color:var(--text-muted)">Training (need 50%)</div></div><div class="card" style="padding:20px 32px;text-align:center"><div style="font-size:1.5rem;font-weight:800;color:${bestQuiz>=80?'var(--success)':'var(--danger)'}">${bestQuiz}%</div><div style="font-size:0.7rem;color:var(--text-muted)">Quiz (need 80%)</div></div></div><div style="display:flex;gap:12px;justify-content:center"><a href="#/training" class="btn btn-primary">Training</a><a href="#/quiz" class="btn btn-secondary">Quiz</a></div></div>`;
    }
};
