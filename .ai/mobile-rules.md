# Mobile Figma Verification Rules

## 1. Main Objective

The goal is to synchronize the existing implementation with the Mobile Figma design.

The Mobile Figma design is the source of truth.

The goal is NOT to redesign, refactor, or improve the website.
The goal is to make the current mobile version match the provided Figma design.

---

# 2. Desktop Protection Rules

Desktop implementation is already approved and must be preserved.

STRICT RULES:

- Do not change desktop styles.
- Do not modify styles that affect desktop layouts.
- Do not change HTML structure.
- Do not reorder DOM elements.
- Do not move sections.
- Do not rename existing classes.
- Do not rewrite components.
- Do not replace existing architecture.

Only apply mobile-specific changes.

Allowed:

- Mobile media queries.
- Existing mobile overrides.
- Mobile-only CSS rules.
- Responsive property changes inside mobile breakpoints.

If a required fix cannot be achieved without affecting desktop:

DO NOT CHANGE THE CODE.

Report the issue instead.

---

# 3. Header and Footer

Ignore completely:

- Header.
- Navigation.
- Mobile menu.
- Footer.

Do not inspect.

Do not report issues.

Do not modify.

---

# 4. Figma Comparison Rules

Compare:

Figma Mobile Frame
against
Current mobile browser rendering.

Do not compare against desktop.

Do not use assumptions.

If Figma behavior is unclear:

- Do not guess.
- Do not redesign.
- Report as "Needs manual decision".

---

# 5. Pixel Accuracy

Target accuracy:

Tolerance: ±1px.

Check:

- Width.
- Height.
- Position.
- Padding.
- Margin.
- Gap.
- Alignment.
- Typography.
- Colors.
- Borders.
- Radius.
- Shadows.

---

# 6. Before Editing Code

Always analyze first.

Before changing anything:

1. Identify the visual difference.
2. Find the source of the problem.
3. Locate the responsible CSS rule.
4. Check if the problem comes from:
   - child element;
   - parent container;
   - flex/grid settings;
   - typography;
   - spacing system;
   - breakpoint.

Do not immediately add new CSS.

---

# 7. Fix Priority

Always use this order:

1. Modify existing CSS rule.
2. Modify existing mobile breakpoint.
3. Reuse existing classes.
4. Add new CSS only if necessary.

Avoid:

- duplicated styles;
- unnecessary overrides;
- temporary fixes.

---

# 8. Component System

Before editing pages:

Create a component inventory.

Identify reusable components:

Examples:

- Buttons.
- Cards.
- Inputs.
- Accordions.
- Tabs.
- Feature blocks.
- CTA blocks.
- Section headings.
- Images.
- Badges.

After fixing a shared component:

Do not analyze every instance again.

Mark it as verified.

---

# 9. Shared Component Rules

If multiple pages use the same component:

Fix once.

Do not create page-specific overrides unless absolutely necessary.

Preferred:

Change:

.button-primary

Avoid:

.home-page .button-primary

unless the design requires a unique variation.

---

# 10. Section Rules

Identify repeated sections.

Examples:

- Hero.
- Testimonials.
- Features.
- Pricing.
- FAQ.
- CTA.

If a section is identical:

Fix once.

Reuse the solution.

---

# 11. Typography Checklist

Verify:

- Font family.
- Font size.
- Font weight.
- Line height.
- Letter spacing.
- Text color.
- Text alignment.
- Text transformation.
- Text wrapping.
- Number of lines.
- Text truncation.

Do not manually add line breaks unless they exist in Figma.

---

# 12. Layout Checklist

Verify:

- Container width.
- Max width.
- Horizontal padding.
- Vertical spacing.
- Section spacing.
- Grid columns.
- Flex direction.
- Alignment.
- Ordering.
- Positioning.
- Overflow.

---

# 13. Images and Media

Verify:

- Image dimensions.
- Aspect ratio.
- Object-fit.
- Position.
- Border radius.
- Cropping.
- Background images.

Do not replace assets.

Do not optimize images.

Do not change image sources.

---

# 14. Buttons

Verify:

- Width.
- Height.
- Padding.
- Font.
- Radius.
- Icon position.
- Gap.
- Alignment.

Do not recreate buttons.

Use existing button components.

---

# 15. Responsive Behavior

Check:

- No horizontal scrolling.
- No overflow.
- No clipped content.
- No broken flex layouts.
- No overlapping elements.
- No distorted images.
- No hidden content.

---

# 16. CSS Quality Rules

Do not:

- Use !important unless absolutely unavoidable.
- Add inline styles.
- Duplicate existing CSS.
- Create unnecessary selectors.
- Add hacks.

Prefer fixing the layout logic.

---

# 17. Validation After Changes

After every fix:

Check:

1. Mobile matches Figma.
2. Desktop remains unchanged.
3. No new layout issues appeared.
4. Existing components still work.

---

# 18. Multiple Passes

Work in passes.

## Pass 1:

Fix major differences:

- Layout.
- Structure issues.
- Wrong sizes.
- Broken responsive behavior.

## Pass 2:

Fix:

- Spacing.
- Typography.
- Alignment.
- Component details.

## Pass 3:

Pixel refinement:

- 1-2px differences.
- Small visual inconsistencies.

---

# 19. Reporting

For every issue provide:

Page:

Section:

Element:

Problem:

Expected:

Actual:

Difference:

Solution:

Status:

---

Example:

Page:
Home

Section:
Hero

Element:
CTA Button

Problem:
Button height mismatch

Expected:
56px

Actual:
48px

Difference:
8px

Solution:
Updated mobile button height

Status:
Fixed

---

# 20. Completion Criteria

A page is complete only when:

- Mobile matches Figma.
- No critical differences remain.
- Desktop is unchanged.
- Shared components are verified.
- No unnecessary CSS was introduced.