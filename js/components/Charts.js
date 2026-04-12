// Chart.js Wrapper Components
export function createDoughnutChart(canvasId, label, value, max = 100) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Remaining'],
            datasets: [{
                data: [value, max - value],
                backgroundColor: ['#00F0FF', 'rgba(255,255,255,0.05)'],
                borderWidth: 0,
                cutout: '80%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } }
        }
    });
}

export function createRadarChart(canvasId, labels, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    return new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Your Score',
                data: data,
                backgroundColor: 'rgba(0, 240, 255, 0.1)',
                borderColor: '#00F0FF',
                borderWidth: 2,
                pointBackgroundColor: '#00F0FF',
                pointBorderColor: '#00F0FF',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { display: false, stepSize: 25 },
                    grid: { color: 'rgba(255,255,255,0.06)' },
                    angleLines: { color: 'rgba(255,255,255,0.06)' },
                    pointLabels: { color: '#8B949E', font: { size: 11, family: 'Inter' } }
                }
            },
            plugins: { legend: { display: false } }
        }
    });
}

export function createBarChart(canvasId, labels, datasets) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    return new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8B949E', font: { size: 11 } } },
                y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8B949E', font: { size: 11 } }, beginAtZero: true }
            },
            plugins: { legend: { labels: { color: '#8B949E', font: { size: 12 } } } }
        }
    });
}

export function createLineChart(canvasId, labels, datasets) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    return new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8B949E', font: { size: 11 } } },
                y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8B949E', font: { size: 11 } }, beginAtZero: true }
            },
            plugins: { legend: { labels: { color: '#8B949E', font: { size: 12 } } } },
            elements: { line: { tension: 0.4 }, point: { radius: 3 } }
        }
    });
}
