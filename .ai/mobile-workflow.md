# Mobile Verification Workflow for Agent

## 📋 Overview

Пошаговый процесс проверки мобильной версии сайта по Figma.

## 🔄 General Workflow

### Step 1: Open Figma Page
1. Read `.ai/mobile-pages.yml` — find next `status: pending` page
2. Ask user to open the corresponding Figma page in desktop app
3. Call `figma-bridge_get_metadata()` to confirm page is open
4. Call `figma-bridge_get_document()` to get frame structure
5. For each mobile frame (375px), extract:
   - frame name
   - node-id
   - key children structure

### Step 2: Record Frame IDs
1. Update `.ai/mobile-pages.yml` with the frame's `node_id`
2. Set `status: ready`

### Step 3: Compare Mobile (for each frame)
1. Read the HTML file(s) listed in the mapping
2. Read the mobile CSS rules (search for `@media` blocks with mobile breakpoints)
3. For each section in the Figma frame:
   - Extract dimensions, typography, spacing, colors from Figma (via `get_node`)
   - Compare with CSS values in the codebase
   - Report differences

### Step 4: Fix (if needed)
Follow rules in `mobile-rules.md`:
1. Modify existing CSS rule first
2. Modify existing mobile breakpoint
3. Reuse existing classes
4. Add new CSS only if necessary

### Step 5: Report
1. Update `.ai/mobile-status.json` with results
2. Print summary to user

### Step 6: Repeat
Move to next page.

## 📐 Frame Reading Template

```
Frame: {name}
ID: {node_id}
Width: {w} × {height}

Sections:
  1. {section_name} ({w}×{h})
     - {child_name}: {details}
  2. ...
```

## 📝 Report Template

```
Page: {html_file}
Figma: {figma_page} / {frame_name}

Issues:
  [ ] {section} — {problem} (expected: {expected}, actual: {actual})
  [ ] ...

Fixed:
  [x] {section} — {problem} → {solution}

Needs manual review:
  [ ] {section} — {reason}
```

## 🎯 Breakpoints

- Mobile breakpoint: ≤ 768px (CSS media query)
  - But check actual mobile frame width in Figma (usually 375px)
- Desktop: ≥ 769px — DO NOT TOUCH

## ✅ Completion Checklist per Page

- [ ] All mobile frames recorded in `mobile-pages.yml`
- [ ] Layout matches Figma (±1px)
- [ ] Typography matches Figma
- [ ] Spacing matches Figma
- [ ] Colors match Figma
- [ ] No overflow/horizontal scroll
- [ ] Desktop unchanged
- [ ] Report written to user