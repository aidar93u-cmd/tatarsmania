# AGENTS.md — TATARSMANIA

## Project Overview
Static landing page for furniture brand «ТАТАРСМАНИЯ». No build step. Open `index.html` directly in browser.

## Commands
- **Preview**: `Invoke-Item index.html` (PowerShell) or double-click `index.html`
- **Install deps**: `npm install` (only brings in `swiper`)
- No test/lint/typecheck scripts exist

## Architecture
- **Entry**: `index.html` (main), `about.html` (secondary page), `catalog.html`, `product-page.html`
- **Main styles**: `css/style.css` — all global styles
- **Page-specific styles**: `css/catalog.css`, `css/catalog-listing.css`, `css/product-page.css`
- **Library CSS**: `css/lib/` — `swiper-bundle.min.css`, `fancybox.css`, `aos.css`
- **Library JS**: `js/lib/` — `swiper-bundle.min.js`, `fancybox.umd.js`, `jquery.min.js`, `aos.js`
- **Custom JS modules** (loaded individually per page):
  - `js/main.js` — shared (AOS init, Fancybox, Intersection Observer, smooth scroll, favorites)
  - `js/preloader.js` — preloader animation
  - `js/scroll-header.js` — fixed header on scroll (every page)
  - `js/featured-tabs.js` — featured section tabs (index only)
  - `js/showrooms.js` — showroom open/closed status (index only)
  - `js/swipers.js` — hero + categories + collections + blog + promotions swipers
  - `js/gallery-hover.js` — featured card + catalog card gallery on hover
  - `js/newsletter.js` — footer email form validation
  - `js/footer-accordion.js` — footer accordion on mobile
  - `js/mobile-menu.js` — burger menu overlay
  - `js/search-popup.js` — header search popup
  - `js/mega-menu.js` — desktop catalog mega menu
  - `js/yandexmap.js` — Yandex map
  - `js/product-page.js` — accordions (jQuery slideToggle), mobile gallery swiper, size/color selectors, interior slider, other models swiper, fancybox
- **Images**: `assets/images/` — all backgrounds loaded via CSS `url()`
- **Fonts**: `assets/fonts/` — 3 custom font families via `@font-face`

## Key Implementation Details

### catalog-cat-s Swiper (mobile ≤992px)
- **File**: `catalog.html:518` — grid wrapped in `.swiper > .swiper-wrapper > .swiper-slide`
- **CSS**: `css/catalog.css:306-333` — Swiper neutralization for ≥993px (`overflow: visible`, `display: contents` on wrapper), Swiper mode for ≤992px
- **JS**: `js/main.js:473-505` — `initCatCatSwiper()` / `destroyCatCatSwiper()` with `slidesPerView: 1.3`, `spaceBetween: 6`, `speed: 600`, navigation arrows, dark pagination dots
- **Pagination**: `.catalog-cat-s__pagination` reuses `.promotions__dot` classes with dark color overrides

### Catalog Listing Mobile (≤768px)
- **File**: `css/catalog-listing.css:1159-1175`
- `.product-card__colors` and `.product-card__price-split` hidden
- Title: 2-line clamp with `-webkit-line-clamp: 2`

### Product Page Accordions
- **File**: `js/product-page.js:1-17`
- jQuery `slideToggle(600)` with `stop(true, true)` — replaces CSS `max-height` transition
- Independent toggle — opening one does NOT close others
- Default-open state: `.product-accordion--open` → content starts visible via `.show()`

### Product Page Mobile (≤768px)
- **No gallery duplication**: `.product-gallery` (desktop) is reused as swiper on mobile via JS DOM manipulation
- **HTML**: `product-page.html`
  - `product-mobile-title` (before `.product-content`): brand + favorite icon + product name
  - `product-mobile-badges` (before `.product-content`): Sale/New badges + article
  - `product-mobile-price` (inside `.product-info-bottom`): price, old price, split, production time
- **CSS**: `css/product-page.css` — mobile-only blocks hidden on desktop, shown at ≤768px
- **Gallery (≤768px)**: `.product-gallery` moved inside `.product-info` (first child), on mobile JS restructures it into `.swiper > .swiper-wrapper > .swiper-slide`, init Swiper with pagination. On resize >768px → destroy swiper, restore original HTML.
- **Flex reorder** inside `.product-info` (≤768px):
  - `order: 1` → `.product-gallery` (swiper mode)
  - `order: 2` → `.product-sizes`
  - `order: 3` → `.product-options`
  - `order: 4` → `.product-mobile-price`
  - `order: 5` → `.product-actions`
  - `order: 6` → `.product-accordions`
- Original `.product-title-block`, `.product-price-block` hidden with `!important`
- `.product-info-top` / `.product-info-bottom` use `display: contents`
- **JS**: `js/product-page.js:19-54` — mobile gallery swiper init/destroy with DOM restructuring on resize

### Yandex Map
- **File**: `js/yandexmap.js` — loads Yandex Maps API and initializes map

## Design Tokens
- **Colors** (from CSS custom properties): `--graphite: #212121`, `--copper: #BF6E34`
- **Gutter**: `var(--gutter)` used for horizontal padding on mobile blocks
