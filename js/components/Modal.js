// Reusable Modal System
export function openModal(title, contentHTML, actions = []) {
    let overlay = document.getElementById('global-modal-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'global-modal-overlay';
        overlay.className = 'modal-overlay';
        document.body.appendChild(overlay);
    }
    const actionsHTML = actions.map(a =>
        `<button class="btn ${a.class || 'btn-secondary'}" data-action="${a.id}">${a.label}</button>`
    ).join('');

    overlay.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close" data-action="close">✕</button>
            </div>
            <div class="modal-body">${contentHTML}</div>
            ${actionsHTML ? `<div class="modal-actions">${actionsHTML}</div>` : ''}
        </div>
    `;
    overlay.classList.add('active');

    overlay.querySelector('[data-action="close"]').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

    // Return a promise-like interface
    return {
        onAction: (actionId, callback) => {
            const btn = overlay.querySelector(`[data-action="${actionId}"]`);
            if (btn) btn.addEventListener('click', () => { callback(); });
        }
    };
}

export function closeModal() {
    const overlay = document.getElementById('global-modal-overlay');
    if (overlay) overlay.classList.remove('active');
}
