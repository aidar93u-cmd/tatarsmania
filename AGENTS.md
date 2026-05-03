# AGENTS.md — TATARSMANIA

## Project Overview
Static landing page for furniture brand «ТАТАРСМАНИЯ». No build step. Open `index.html` directly in browser.

## Commands
- **Preview**: `Invoke-Item index.html` (PowerShell) or double-click `index.html`
- **Install deps**: `npm install` (only brings in `swiper`)
- No test/lint/typecheck scripts exist

## Architecture
- **Entry**: `index.html` (main), `about.html` (secondary page)
- **Styles**: `css/style.css` (~2300 lines, single file)
- **Scripts**: `js/main.js` (DOM ready handlers + 4 Swiper instances)
- **Images**: `assets/images/` — all backgrounds loaded via CSS `url()`
- **Fonts**: `assets/fonts/` — 3 custom font families via `@font-face`

## Swiper Setup
4 independent Swipers initialized in `js/main.js`:
- `.hero-swiper` — fade effect, autoplay 5s, custom pagination/arrows
- `.categories-small-swiper` — 4 slides → 1 on mobile, responsive breakpoints
- `.collections-swiper` — loop mode, custom pagination/arrows
- `.blog-swiper` — same breakpoints as categories-small

All use **custom pagination classes** (not default `.swiper-pagination-bullet`). CSS overrides are in `style.css` under `/* Swiper Custom Styles */`.

## Image Convention
- All card/section backgrounds use `background-image` in CSS, not `<img>` tags
- Images are **individual exports** from Figma, named by component (e.g., `product-1.jpg`, `cat-sofas.jpg`)
- Do NOT export full-section screenshots — export individual Figma component frames
- Collections use variant suffixes (`--alt`, `--alt2`) for different slide rotations

## Figma MCP
- Configured in `opencode.json` using `@gethopp/figma-mcp-bridge`
- Use `figma-bridge_save_screenshots` with **base node IDs** (format `XXXX:YYYY`, no `I:` prefix)
- Format must match file extension (PNG→.jpg will fail, use JPG or rename after)
- Conflicting `format` + `outputPath` extension causes errors — keep them consistent

## CSS Design Tokens
Defined in `:root`:
- Colors: `--graphite` (#212121), `--copper` (#bf6e34), `--red`, `--green`, `--gray-light`
- Fonts: `"TEST Circe"` (primary), `"Inter Tight"`, `"Involve"`, `"TEST Circe Contrast VF"`
- Container: `--container-max: 1440px`, `--gutter: 20px`
- Base font-size: `12px` (unusually small, intentional per design)

## Gotchas
- `body` font-size is 12px — all spacing/sizing references assume this base
- `.product-card:nth-child()` selectors are **scoped by parent** in some cases (e.g., `.featured__left .product-card:nth-child(3)`)
- Legacy dot-click handler in `main.js` (lines 155-163) is a fallback for Swiper pagination — don't remove without testing
- No mobile hamburger menu JS implemented yet — topbar desktop-only
- Newsletter form has stub submit logic (line 207 in `main.js`)
