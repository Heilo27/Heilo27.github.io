# CLAUDE.md

> HeiloProjects Marketing Website — The public face of all HeiloProjects apps.

---

## Project Overview

This is the marketing website for HeiloProjects, hosted on GitHub Pages at **heiloprojects.com**.

**Repository:** `Heilo27/Heilo27.github.io`
**Hosting:** GitHub Pages
**Domain:** heiloprojects.com

---

## Site Structure

```
/                       → Homepage (all apps + services)
/pantrychef/            → PantryChef app page
/pantrychef/privacy     → PantryChef privacy policy
/rightrudder/           → Right Rudder app page
/rightrudder/privacy    → Right Rudder privacy policy
/capwingman/            → CAP Wingman app page (showcase only)
/capwingman/privacy     → CAP Wingman privacy policy
/castleofthewinds/      → Castle of the Winds app page
/castleofthewinds/privacy → Castle of the Winds privacy policy
/specterdc/             → SpecterDC services page (B2B)
/privacy                → Company privacy policy
/terms                  → Terms of service
```

---

## Apps Featured

| App | Type | Price | Status |
|-----|------|-------|--------|
| **PantryChef** | Consumer | $5.99 | Available on App Store |
| **Right Rudder** | Professional | $14.99 (includes student app) | Available on App Store |
| **CAP Wingman** | Utility | Free | Showcase only (not on App Store) |
| **Castle of the Winds** | Game | TBD | Coming soon |

---

## Services Featured

| Service | Type | Description |
|---------|------|-------------|
| **SpecterDC** | B2B | Legacy code modernization, COBOL conversion, source recovery |

---

## Tech Stack

- **HTML5** — Semantic, accessible markup
- **CSS3** — Custom properties, flexbox, grid, responsive
- **Vanilla JS** — Mobile menu, minimal interactivity
- **GitHub Pages** — Static hosting with HTTPS

No build process. No frameworks. Just clean, fast HTML/CSS/JS.

---

## Design System

### Colors (CSS Custom Properties)

```css
--bg: #0a0a0a           /* Dark background */
--bg-alt: #141414       /* Card backgrounds */
--text: #ffffff         /* Primary text */
--text-muted: #a1a1aa   /* Secondary text */
--accent: #2d7d46       /* Green accent (brand) */
--accent-light: rgba(45, 125, 70, 0.1)
```

### App Icon Colors

| App | Gradient |
|-----|----------|
| PantryChef | `#4ade80 → #22c55e` (green) |
| Right Rudder | `#3b82f6 → #1d4ed8` (blue) |
| CAP Wingman | `#f59e0b → #d97706` (amber) |
| Castle of the Winds | `#8b5cf6 → #6d28d9` (purple) |
| SpecterDC | `#8b5cf6 → #7c3aed` (purple) |

### Typography

- **Font:** System font stack (`-apple-system, BlinkMacSystemFont, ...`)
- **Headings:** 700 weight, tight letter-spacing
- **Body:** 400 weight, 1.6-1.8 line height

---

## Patterns

### Page Structure

Every page follows this pattern:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title | HeiloProjects</title>
    <meta name="description" content="...">
    <link rel="stylesheet" href="/css/style.css"> <!-- or ../css/style.css -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="canonical" href="https://www.heiloprojects.com/path">
</head>
<body>
    <a href="#main" class="skip-link">Skip to main content</a>
    <header>...</header>
    <main id="main">...</main>
    <footer>...</footer>
    <script src="/js/script.js"></script>
</body>
</html>
```

### Accessibility

- Skip link on every page
- Semantic HTML (`<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`)
- ARIA labels on interactive elements
- Sufficient color contrast
- Keyboard navigable

---

## Deployment

Push to `main` branch → GitHub Pages automatically deploys.

```bash
git add .
git commit -m "Update message"
git push
```

Site updates within 1-2 minutes.

---

## Key Agents

| Agent | When to Invoke |
|-------|----------------|
| **Arachne** | Web development, new pages, structural changes |
| **Echo** | User-facing copy, marketing text |
| **Mercury** | App Store links, marketing strategy |
| **Lumen** | Design consistency, visual polish |
| **Themis** | Privacy policies, terms of service |

---

## Commands

```bash
# Preview locally (optional)
python3 -m http.server 8000

# Deploy
git push origin main
```

---

## Important Notes

- **No build process** — Edit HTML/CSS/JS directly
- **CNAME file** — Must have Unix line endings (LF, not CRLF)
- **Relative paths** — Use `../css/style.css` from subdirectories
- **App Store links** — Use `https://apps.apple.com/us/app/app-name/idXXXXXXXXXX`

---

*The public face of HeiloProjects — simple, fast, accessible.*
