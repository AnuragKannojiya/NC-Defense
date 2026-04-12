const fs = require('fs');
let content = fs.readFileSync('js/app.js', 'utf8');
content = content.replace(
    /window\.addEventListener\('unhandledrejection', function\(event\) \{/,
    `window.addEventListener('unhandledrejection', function(event) {
    let errStr = String(event.reason?.stack || event.reason?.message || event.reason);
    if(event.detail && event.detail.reason) errStr = String(event.detail.reason.stack || event.detail.reason);`
);
content = content.replace(
    /\$\{event\.reason\?\.message \|\| event\.reason\}/g,
    '${errStr}'
);
fs.writeFileSync('js/app.js', content, 'utf8');
