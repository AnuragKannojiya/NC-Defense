// Dynamic Training Module Renderer
import { getModuleByKey } from '../data/modules.js';
import { completeModule } from '../services/db.js';
import { showToast } from '../components/Toast.js';

export const TrainingModule = {
    render: (profile, moduleKey) => {
        const mod = getModuleByKey(moduleKey);
        if (!mod) return `<div class="page-header"><h1>Module Not Found</h1><p>The requested training module does not exist.</p><a href="#/training" class="btn btn-primary mt-16">← Back to Modules</a></div>`;
        const isComplete = profile?.progress?.[moduleKey]?.completed;
        return `
        <div class="fade-in-up">
            <a href="#/training" class="btn btn-secondary btn-sm mb-24" style="display:inline-flex">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg> Back to All Modules
            </a>
            <div class="module-detail-header" style="background:${mod.banner};padding:40px;border-radius:var(--border-radius);margin-bottom:32px;position:relative;overflow:hidden;">
                <div style="position:relative;z-index:2;">
                    <div style="display:flex;align-items:center;gap:16px;margin-bottom:12px;">
                        <span style="font-size:3rem">${mod.icon}</span>
                        <div>
                            <div style="display:flex;gap:8px;margin-bottom:8px;">
                                ${isComplete?'<span class="badge badge-success">✓ Completed</span>':'<span class="badge badge-neutral">In Progress</span>'}
                                <span class="badge" style="background:${mod.color}22;color:${mod.color};border:1px solid ${mod.color}44">${mod.difficulty}</span>
                                <span class="badge badge-neutral">⏱ ${mod.duration}</span>
                            </div>
                            <h1 style="font-size:1.8rem;">${mod.title}</h1>
                        </div>
                    </div>
                    <p style="color:var(--text-secondary);max-width:700px;">${mod.desc}</p>
                </div>
            </div>

            <!-- Section Navigation -->
            <div class="tabs mb-24" id="section-tabs">
                ${mod.sections.map((s,i)=>`<button class="tab ${i===0?'active':''}" data-section="${i}">${s.heading}</button>`).join('')}
            </div>

            <!-- Section Content -->
            <div id="section-content">
                ${mod.sections.map((s,i)=>`
                    <div class="section-panel card ${i===0?'':'hidden'}" data-section-panel="${i}" style="margin-bottom:24px;">
                        <h2 style="color:${mod.color};margin-bottom:16px;font-size:1.3rem;">${s.heading}</h2>
                        <div style="color:var(--text-secondary);line-height:1.8;font-size:0.95rem;" class="module-content">${s.body}</div>
                    </div>
                `).join('')}
            </div>

            <!-- Complete Button -->
            <div style="display:flex;gap:16px;justify-content:center;margin-top:32px;">
                ${!isComplete? `<button class="btn btn-primary btn-lg" id="complete-module-btn">✓ Mark as Complete (+250 pts)</button>` : '<span class="badge badge-success" style="font-size:1rem;padding:12px 24px;">✓ Module Completed — 100%</span>'}
                <a href="#/quiz" class="btn btn-secondary btn-lg">Take Quiz →</a>
            </div>
        </div>`;
    },

    afterRender: (profile, moduleKey, uid) => {
        // Tab switching
        document.querySelectorAll('#section-tabs .tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('#section-tabs .tab').forEach(t=>t.classList.remove('active'));
                tab.classList.add('active');
                document.querySelectorAll('.section-panel').forEach(p => p.classList.add('hidden'));
                const panel = document.querySelector(`[data-section-panel="${tab.dataset.section}"]`);
                if (panel) { panel.classList.remove('hidden'); panel.classList.add('fade-in-up'); }
            });
        });

        // Complete
        const btn = document.getElementById('complete-module-btn');
        if (btn) {
            btn.addEventListener('click', async () => {
                await completeModule(uid, moduleKey, 100);
                showToast(`Module "${moduleKey.replace(/-/g,' ')}" completed! +250 points 🎉`, 'success');
                btn.outerHTML = '<span class="badge badge-success" style="font-size:1rem;padding:12px 24px;">✓ Module Completed — 100%</span>';
            });
        }
    }
};
