const fs = require('fs')
const path = require('path')
const glob = require('glob')

const ROOT = __dirname
const DIST = path.join(ROOT, 'release')
const EXCLUDE = [
  'release.js', 'deploy.js', 'package.json', 'package-lock.json', 'node_modules',
  'release', '.git', '.agents', '.vscode', 'docs', 'graphify-out',
  'test-results', '.deployed', '.gitignore', '.graphifyignore',
  '.graphify_python', '.graphify_uncached.txt', 'AGENTS.md', 'agent.md', 'CLAUDE.md',
  'opencode.json', 'skills-lock.json', 'README.md',
  '_cart_analysis.txt', '_cart_chars.json', '_cart_elements.txt',
  'figma-photo-menu.png', 'mobile-menu-design.png',
]
const DEV_FILES = ['yandex.html']

// ---- Step 1: Detect and bump cache version ----
const htmlFiles = glob.sync('*.html', { cwd: ROOT })
let currentVersion = 0

for (const file of htmlFiles) {
  const content = fs.readFileSync(path.join(ROOT, file), 'utf-8')
  const match = content.match(/[?&]v=(\d+)/)
  if (match) {
    const v = parseInt(match[1], 10)
    if (v > currentVersion) currentVersion = v
  }
}

const newVersion = currentVersion + 1
console.log(`\n[1/4] Bumping cache version: v${currentVersion} → v${newVersion}`)

for (const file of htmlFiles) {
  const filepath = path.join(ROOT, file)
  let content = fs.readFileSync(filepath, 'utf-8')
  const updated = content.replace(/([?&])v=\d+/g, `$1v=${newVersion}`)
  if (updated !== content) {
    fs.writeFileSync(filepath, updated, 'utf-8')
    console.log(`  ${file}`)
  }
}

// ---- Step 2: Check for broken local links ----
console.log('\n[2/4] Checking internal links...')
let totalLinks = 0
let brokenLinks = []

for (const file of htmlFiles) {
  if (DEV_FILES.includes(file)) continue
  const content = fs.readFileSync(path.join(ROOT, file), 'utf-8')
  const linkRegex = /(?:href|src)="([^"]+)"/g
  let match

  while ((match = linkRegex.exec(content)) !== null) {
    const link = match[1]
    // Skip external URLs and anchors
    if (link.startsWith('http') || link.startsWith('#') || link.startsWith('tel:') || link.startsWith('mailto:')) continue
    // Clean query params
    const clean = link.replace(/\?.*$/, '')
    const full = path.join(ROOT, clean)
    totalLinks++
    if (!fs.existsSync(full)) {
      brokenLinks.push({ file, link, full })
    }
  }
}

if (brokenLinks.length === 0) {
  console.log(`  All ${totalLinks} links OK`)
} else {
  console.log(`  Found ${brokenLinks.length} broken links:`)
  for (const bl of brokenLinks) {
    console.log(`    ${bl.file}: ${bl.link}`)
  }
}

// ---- Step 3: Clean dev/test files from source ----
console.log('\n[3/4] Cleaning dev files...')
for (const file of DEV_FILES) {
  const filepath = path.join(ROOT, file)
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath)
    console.log(`  Removed ${file}`)
  }
}

// ---- Step 4: Copy to release/ directory ----
console.log('\n[4/4] Copying to release/...')

// Remove existing release directory
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true })
}

const allowedFiles = glob.sync('**/*', {
  cwd: ROOT,
  nodir: true,
  dot: true,
  ignore: EXCLUDE.map(p => p + '/**').concat(EXCLUDE.filter(f => !f.includes('/'))),
})

for (const file of allowedFiles) {
  const src = path.join(ROOT, file)
  const dest = path.join(DIST, file)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(src, dest)
}

console.log(`  Copied ${allowedFiles.length} files to release/`)

// ---- Summary ----
console.log('\n═══════════════════════════════')
console.log('  Release complete!')
console.log(`  Cache version: v${newVersion}`)
console.log(`  Files: ${allowedFiles.length}`)
if (brokenLinks.length > 0) console.log(`  Broken links: ${brokenLinks.length} ⚠️`)
console.log('═══════════════════════════════')

// ---- Deploy mode ----
if (process.argv.includes('--deploy')) {
  const { execSync } = require('child_process')

  console.log('\n[deploy] Committing changes...')
  execSync('git add -A', { cwd: ROOT, stdio: 'inherit' })
  execSync(`git commit -m "release v${newVersion}"`, { cwd: ROOT, stdio: 'inherit' })
  execSync('git push', { cwd: ROOT, stdio: 'inherit' })

  console.log('\n[deploy] Uploading via FTP...')
  require('./deploy.js')
}
