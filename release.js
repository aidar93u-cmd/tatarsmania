const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT = __dirname;
const HTML_GLOB = path.join(PROJECT, '*.html');

// 1. Find all ?v=NUM patterns, get max version
const files = fs.readdirSync(PROJECT).filter(f => f.endsWith('.html'));
let maxV = 0;
const versionRE = /\?v=(\d+)/g;

for (const file of files) {
    const content = fs.readFileSync(path.join(PROJECT, file), 'utf8');
    let m;
    while ((m = versionRE.exec(content)) !== null) {
        maxV = Math.max(maxV, parseInt(m[1], 10));
    }
}

const newV = maxV + 1;
console.log(`Bumping ?v=${maxV} → ?v=${newV} in ${files.length} files`);

// 2. Replace in all HTML files
for (const file of files) {
    const fp = path.join(PROJECT, file);
    let content = fs.readFileSync(fp, 'utf8');
    const updated = content.replace(/\?v=(\d+)/g, `?v=${newV}`);
    if (updated !== content) {
        fs.writeFileSync(fp, updated, 'utf8');
        console.log(`  ${file}`);
    }
}

// 3. Git commit + push
console.log('\nCommitting...');
execSync('git add -A', { cwd: PROJECT, stdio: 'inherit' });
execSync(`git commit -m "release v${newV}"`, { cwd: PROJECT, stdio: 'inherit' });
console.log('Pushing...');
execSync('git push', { cwd: PROJECT, stdio: 'inherit' });

// 4. Deploy via FTP
console.log('\nDeploying via FTP...');
execSync('npm run deploy', { cwd: PROJECT, stdio: 'inherit' });
