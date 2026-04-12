// Training Hub — All 13 Modules Overview
import { MODULES } from '../data/modules.js';

export const TrainingHub = {
    render: (profile) => {
        const progress = profile?.progress || {};
        const completed = Object.values(progress).filter(p=>p.completed).length;

        return `
        <div class="page-header fade-in-up">
            <div class="page-header-row">
                <div><h1>Training Modules</h1><p>Complete all 13 cybersecurity modules to earn national certification. Each module contains interactive lessons and real-world case studies.</p></div>
                <div style="display:flex;gap:12px;align-items:center;">
                    <span class="badge badge-info">${completed}/13 Completed</span>
                    <input type="text" class="form-input" id="module-search" placeholder="Search modules..." style="width:200px;padding:8px 14px;">
                </div>
            </div>
        </div>

        <div class="tabs fade-in-up" id="difficulty-tabs">
            <button class="tab active" data-filter="all">All (13)</button>
            <button class="tab" data-filter="Beginner">Beginner</button>
            <button class="tab" data-filter="Intermediate">Intermediate</button>
            <button class="tab" data-filter="Advanced">Advanced</button>
            <button class="tab" data-filter="completed">✓ Completed</button>
        </div>

        <div class="module-grid" id="module-grid">
            ${MODULES.map((mod, i) => {
                const isComplete = progress[mod.key]?.completed;
                return `
                <div class="module-card fade-in-up stagger-${Math.min(i%4+1,4)}" data-difficulty="${mod.difficulty}" data-completed="${isComplete}" data-title="${mod.title.toLowerCase()}">
                    <div class="module-card-banner" style="background:${mod.banner}"><span class="module-icon">${mod.icon}</span></div>
                    <div class="module-card-body">
                        <div class="module-card-meta">
                            ${isComplete ? '<span class="badge badge-success">✓ Done</span>' : '<span class="badge badge-neutral">Pending</span>'}
                            <span class="badge" style="background:${mod.color}22;color:${mod.color};border:1px solid ${mod.color}44">${mod.difficulty}</span>
                            <span style="color:var(--text-muted);font-size:0.7rem">⏱ ${mod.duration}</span>
                        </div>
                        <h3 class="module-card-title">${mod.title}</h3>
                        <p class="module-card-desc">${mod.desc}</p>
                        <div class="module-card-footer">
                            <div class="module-progress-info">
                                <div class="module-progress-text">${isComplete?'Score: 100%':'Not started'}</div>
                                <div class="progress-track"><div class="progress-fill ${isComplete?'green':'gradient'}" style="width:${isComplete?100:0}%"></div></div>
                            </div>
                            <a href="#/training/${mod.key}" class="btn btn-primary btn-sm">${isComplete?'Review':'Start'}</a>
                        </div>
                    </div>
                </div>`;
            }).join('')}
        </div>`;
    },

    afterRender: () => {
        // Tab filtering
        document.querySelectorAll('#difficulty-tabs .tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('#difficulty-tabs .tab').forEach(t=>t.classList.remove('active'));
                tab.classList.add('active');
                const filter = tab.dataset.filter;
                document.querySelectorAll('.module-card').forEach(card => {
                    if (filter === 'all') { card.style.display = ''; }
                    else if (filter === 'completed') { card.style.display = card.dataset.completed === 'true' ? '' : 'none'; }
                    else { card.style.display = card.dataset.difficulty === filter ? '' : 'none'; }
                });
            });
        });

        // Search
        document.getElementById('module-search')?.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase();
            document.querySelectorAll('.module-card').forEach(card => {
                card.style.display = card.dataset.title.includes(q) ? '' : 'none';
            });
        });
    }
};
