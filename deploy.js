const ftp = require('basic-ftp');
const ignore = require('ignore');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT = __dirname;
const CONFIG = JSON.parse(fs.readFileSync(path.join(PROJECT, '.vscode', 'sftp.json'), 'utf8'));
const REMOTE = CONFIG.remotePath || '/';
const DEPLOY_LOG = path.join(PROJECT, '.deployed');

// Parse .gitignore
const ig = ignore().add(fs.readFileSync(path.join(PROJECT, '.gitignore'), 'utf8'));

// Get current HEAD hash
const currentHash = execSync('git rev-parse HEAD', { cwd: PROJECT }).toString().trim();

// Read last deployed hash
let fromHash = '';
try { fromHash = fs.readFileSync(DEPLOY_LOG, 'utf8').trim(); } catch (e) {}

// Determine diff range
let diffCmd;
if (fromHash && fromHash !== currentHash) {
    // Diff from last deployed commit to HEAD (including uncommitted)
    diffCmd = `git diff --name-only ${fromHash} HEAD && echo "---UNCOMMITTED---" && git diff --name-only`;
} else if (fromHash === currentHash) {
    // Already deployed at this commit — only uncommitted changes
    diffCmd = 'git diff --name-only';
} else {
    // First deploy — diff from HEAD~1 (or everything if no parent)
    try {
        execSync('git rev-parse HEAD~1', { cwd: PROJECT, stdio: 'ignore' });
        diffCmd = 'git diff --name-only HEAD~1 HEAD && echo "---UNCOMMITTED---" && git diff --name-only';
    } catch (e) {
        // Only 1 commit — just deploy uncommitted + tracked files
        diffCmd = 'git diff --name-only';
    }
}

const output = execSync(diffCmd, { cwd: PROJECT }).toString().trim();
const parts = output.split('---UNCOMMITTED---');
const committedPart = (parts[0] || '').trim();
const uncommittedPart = (parts[1] || '').trim();

const files = new Set();
committedPart.split('\n').filter(Boolean).forEach(f => files.add(f));
uncommittedPart.split('\n').filter(Boolean).forEach(f => files.add(f));

// .gitignore check + only existing files + exclude tool scripts
const EXCLUDE = new Set(['deploy.js', 'release.js', '.deployed']);
const toDeploy = [...files].filter(f => {
    if (EXCLUDE.has(f)) return false;
    if (ig.ignores(f.replace(/\\/g, '/'))) return false;
    return fs.existsSync(path.join(PROJECT, f));
}).sort();

if (toDeploy.length === 0) {
    console.log('No files to deploy.');
    process.exit(0);
}

console.log(`Files to deploy (${toDeploy.length}):`);
toDeploy.forEach(f => console.log(`  ${f}`));

async function main() {
    const client = new ftp.Client();
    client.ftp.verbose = false;

    try {
        console.log(`\nConnecting to ${CONFIG.host}...`);
        await client.access({
            host: CONFIG.host,
            port: CONFIG.port || 21,
            user: CONFIG.username,
            password: CONFIG.password,
            secure: CONFIG.secure || false,
        });

        if (REMOTE !== '/') await client.ensureDir(REMOTE);

        let ok = 0, fail = 0;
        for (const file of toDeploy) {
            const local = path.join(PROJECT, file);
            const remote = REMOTE === '/' ? '/' + file : REMOTE + '/' + file;
            try {
                await client.ensureDir(path.posix.dirname(remote));
                await client.uploadFrom(local, remote);
                ok++;
            } catch (e) {
                fail++;
                console.error(`  FAIL: ${file} - ${e.message}`);
            }
        }

        fs.writeFileSync(DEPLOY_LOG, currentHash);
        console.log(`\nDone. ${ok} deployed, ${fail} failed.`);
    } catch (e) {
        console.error('Deploy failed:', e.message);
        process.exit(1);
    } finally {
        client.close();
    }
}

main();
