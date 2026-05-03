# Graph Report - .  (2026-05-03)

## Corpus Check
- 51 files · ~480,913 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 49 nodes · 32 edges · 22 communities detected
- Extraction: 59% EXTRACTED · 41% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Project Structure & Config|Project Structure & Config]]
- [[_COMMUNITY_Design System & Colors|Design System & Colors]]
- [[_COMMUNITY_About Page Images|About Page Images]]
- [[_COMMUNITY_Typography Scale|Typography Scale]]
- [[_COMMUNITY_Mega Menu UI|Mega Menu UI]]
- [[_COMMUNITY_Category Images|Category Images]]
- [[_COMMUNITY_Production Images|Production Images]]
- [[_COMMUNITY_Category Cards|Category Cards]]
- [[_COMMUNITY_Collection Images|Collection Images]]
- [[_COMMUNITY_Promo Banners|Promo Banners]]
- [[_COMMUNITY_Build Scripts|Build Scripts]]
- [[_COMMUNITY_jQuery Library|jQuery Library]]
- [[_COMMUNITY_Main JavaScript|Main JavaScript]]
- [[_COMMUNITY_Hero Swiper|Hero Swiper]]
- [[_COMMUNITY_Categories Swiper|Categories Swiper]]
- [[_COMMUNITY_Collections Swiper|Collections Swiper]]
- [[_COMMUNITY_Circe Font Regular|Circe Font Regular]]
- [[_COMMUNITY_Circe Font Bold|Circe Font Bold]]
- [[_COMMUNITY_Circe Font Extrabold|Circe Font Extrabold]]
- [[_COMMUNITY_Circe Font Extralight|Circe Font Extralight]]
- [[_COMMUNITY_Circe Font Light|Circe Font Light]]
- [[_COMMUNITY_Circe Font Thin|Circe Font Thin]]

## God Nodes (most connected - your core abstractions)
1. `index.html (Main Page)` - 7 edges
2. `about.html (About Page)` - 5 edges
3. `CSS Design Tokens` - 4 edges
4. `Design System Colors` - 4 edges
5. `TATARSMANIA Project` - 3 edges
6. `js/main.js` - 3 edges
7. `css/style.css` - 2 edges
8. `Swiper JS Library` - 2 edges
9. `swiper-bundle.min.css` - 2 edges
10. `About Production Left Image` - 2 edges

## Surprising Connections (you probably didn't know these)
- `CSS Design Tokens` --semantically_similar_to--> `Design System Colors`  [INFERRED] [semantically similar]
  AGENTS.md → README.md
- `index.html (Main Page)` --references--> `css/style.css`  [EXTRACTED]
  index.html → AGENTS.md
- `index.html (Main Page)` --shares_data_with--> `about.html (About Page)`  [INFERRED]
  index.html → about.html
- `index.html (Main Page)` --references--> `js/main.js`  [INFERRED]
  index.html → AGENTS.md
- `about.html (About Page)` --references--> `css/style.css`  [EXTRACTED]
  about.html → AGENTS.md

## Hyperedges (group relationships)
- **Swiper Integration Ecosystem** — index_hero_swiper, index_categories_swiper, index_collections_swiper, swiper_lib [INFERRED 0.85]
- **CSS Design Tokens Collection** — token_graphite, token_copper, readme_white, readme_gray_light, token_circe [INFERRED 0.80]
- **Shared Stylesheet Usage** — index_html_file, about_html_file, style_css [EXTRACTED 1.00]
- **Circe Font Family** — circe_font, circe_bold_font, circe_extrabold_font, circe_extralight_font, circe_light_font, circe_thin_font [EXTRACTED 1.00]
- **About Page Images** — about-2-left_image, about-2-right_image, about-production-left_image, about-production-right_image, about-production-video_image, about_image, about2_image [INFERRED 0.80]
- **Product Category Images** — cat-poufs_image, cat-sofas_image, category-european_image, category-own-production_image, category1_image, category2_image [INFERRED 0.80]

## Communities

### Community 0 - "Project Structure & Config"
Cohesion: 0.25
Nodes (11): about.html (About Page), Figma MCP Bridge, hero-bg.jpg, index.html (Main Page), promo-1.jpg, jquery.min.js, js/main.js, css/style.css (+3 more)

### Community 1 - "Design System & Colors"
Cohesion: 0.22
Nodes (8): CSS Design Tokens, Design System Colors, Design System Fonts, --gray-light (#f3f3f3), --white (#fff), TEST Circe (Primary Font), --copper (#bf6e34), --graphite (#212121)

### Community 2 - "About Page Images"
Cohesion: 1.0
Nodes (3): About Production Left Image, About Production Right Image, About Production Video Thumbnail

### Community 3 - "Typography Scale"
Cohesion: 1.0
Nodes (2): Base Font-size 12px, Rationale: 12px intentional per design

### Community 4 - "Mega Menu UI"
Cohesion: 1.0
Nodes (2): Mega Menu Screenshot, Mega Menu Design

### Community 5 - "Category Images"
Cohesion: 1.0
Nodes (2): About Section 2 Left Image, About Section 2 Right Image

### Community 6 - "Production Images"
Cohesion: 1.0
Nodes (2): About Page Secondary Image, About Page Main Image

### Community 7 - "Category Cards"
Cohesion: 1.0
Nodes (2): Poufs Category Image, Sofas Category Image

### Community 8 - "Collection Images"
Cohesion: 1.0
Nodes (2): European Collection Category Image, Own Production Category Image

### Community 9 - "Promo Banners"
Cohesion: 1.0
Nodes (2): Category 1 Image, Category 2 Image

### Community 10 - "Build Scripts"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "jQuery Library"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Main JavaScript"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Hero Swiper"
Cohesion: 1.0
Nodes (1): Hero Swiper

### Community 14 - "Categories Swiper"
Cohesion: 1.0
Nodes (1): Categories Small Swiper

### Community 15 - "Collections Swiper"
Cohesion: 1.0
Nodes (1): Collections Swiper

### Community 16 - "Circe Font Regular"
Cohesion: 1.0
Nodes (1): Circe Regular Font

### Community 17 - "Circe Font Bold"
Cohesion: 1.0
Nodes (1): Circe Bold Font

### Community 18 - "Circe Font Extrabold"
Cohesion: 1.0
Nodes (1): Circe Extrabold Font

### Community 19 - "Circe Font Extralight"
Cohesion: 1.0
Nodes (1): Circe Extralight Font

### Community 20 - "Circe Font Light"
Cohesion: 1.0
Nodes (1): Circe Light Font

### Community 21 - "Circe Font Thin"
Cohesion: 1.0
Nodes (1): Circe Thin Font

## Knowledge Gaps
- **33 isolated node(s):** `jquery.min.js`, `Hero Swiper`, `Categories Small Swiper`, `Collections Swiper`, `--graphite (#212121)` (+28 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Typography Scale`** (2 nodes): `Base Font-size 12px`, `Rationale: 12px intentional per design`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Mega Menu UI`** (2 nodes): `Mega Menu Screenshot`, `Mega Menu Design`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Category Images`** (2 nodes): `About Section 2 Left Image`, `About Section 2 Right Image`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Production Images`** (2 nodes): `About Page Secondary Image`, `About Page Main Image`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Category Cards`** (2 nodes): `Poufs Category Image`, `Sofas Category Image`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Collection Images`** (2 nodes): `European Collection Category Image`, `Own Production Category Image`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Promo Banners`** (2 nodes): `Category 1 Image`, `Category 2 Image`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Build Scripts`** (1 nodes): `_graphify_ast_run.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `jQuery Library`** (1 nodes): `jquery.min.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Main JavaScript`** (1 nodes): `main.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Hero Swiper`** (1 nodes): `Hero Swiper`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Categories Swiper`** (1 nodes): `Categories Small Swiper`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Collections Swiper`** (1 nodes): `Collections Swiper`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Circe Font Regular`** (1 nodes): `Circe Regular Font`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Circe Font Bold`** (1 nodes): `Circe Bold Font`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Circe Font Extrabold`** (1 nodes): `Circe Extrabold Font`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Circe Font Extralight`** (1 nodes): `Circe Extralight Font`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Circe Font Light`** (1 nodes): `Circe Light Font`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Circe Font Thin`** (1 nodes): `Circe Thin Font`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 2 inferred relationships involving `index.html (Main Page)` (e.g. with `about.html (About Page)` and `js/main.js`) actually correct?**
  _`index.html (Main Page)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `jquery.min.js`, `Hero Swiper`, `Categories Small Swiper` to the rest of the system?**
  _33 weakly-connected nodes found - possible documentation gaps or missing edges._