# PROJECT-CONTEXT.md

> Runtime context for HeiloProjects marketing website.

---

## Quick Facts

| Attribute | Value |
|-----------|-------|
| **Project** | HeiloProjects Marketing Website |
| **Type** | Static website |
| **Hosting** | GitHub Pages |
| **Domain** | heiloprojects.com |
| **Repository** | Heilo27/Heilo27.github.io |

---

## File Structure

```
heiloprojects.com/
├── index.html              # Homepage
├── privacy.html            # Company privacy policy
├── terms.html              # Terms of service
├── favicon.svg             # Green "H" brand mark
├── CNAME                   # Custom domain config
├── css/
│   └── style.css           # Global styles
├── js/
│   └── script.js           # Mobile menu, interactivity
├── images/                 # Shared images
├── pantrychef/
│   ├── index.html          # App page
│   └── privacy.html        # App privacy policy
├── rightrudder/
│   ├── index.html          # App page
│   └── privacy.html        # App privacy policy
├── capwingman/
│   ├── index.html          # App page (showcase only)
│   └── privacy.html        # App privacy policy
├── castleofthewinds/
│   ├── index.html          # App page
│   └── privacy.html        # App privacy policy
├── specterdc/
│   └── index.html          # Services page (B2B)
└── .claude/
    └── PROJECT-CONTEXT.md  # This file
```

---

## Current State

### Live Pages

- [x] Homepage with all apps and services
- [x] PantryChef app page ($5.99)
- [x] Right Rudder app page ($14.99, includes student app)
- [x] CAP Wingman app page (showcase only)
- [x] Castle of the Winds app page
- [x] SpecterDC services page
- [x] All privacy policies
- [x] Terms of service
- [x] Favicon

### App Store Links

| App | App Store ID | Status |
|-----|--------------|--------|
| PantryChef | TBD | Pending |
| Right Rudder | 6753633792 | Live |
| CAP Wingman | N/A | Not on App Store |
| Castle of the Winds | TBD | Coming soon |

---

## Conventions

### Adding a New App Page

1. Create directory: `appname/`
2. Create `appname/index.html` using existing app page as template
3. Create `appname/privacy.html` using existing privacy page as template
4. Add app card to homepage `index.html`
5. Update footer links across all pages
6. Update this context file

### CSS Patterns

- Page-specific styles go in `<style>` block at end of HTML file
- Shared styles go in `/css/style.css`
- Use CSS custom properties for colors
- Mobile-first responsive design

### Privacy Policy Pattern

Each app has its own privacy policy at `/appname/privacy.html`. They share:
- Same structure and styling
- App-specific badge with icon color
- App-specific data handling details
- Same "What We Do NOT Collect" section
- Contact email: heiloprojects@icloud.com

---

## Known Quirks

1. **CNAME file** — Must use Unix line endings (LF). Windows line endings (CRLF) break GitHub Pages custom domain.

2. **Relative paths** — Subdirectory pages use `../css/style.css` and `../js/script.js`.

3. **Page-specific styles** — Each app/legal page has embedded `<style>` block for page-specific CSS.

4. **No Jekyll** — Site doesn't use Jekyll, just static HTML served directly.

---

## Deployment Checklist

Before pushing:
- [ ] All links work (relative paths correct)
- [ ] Favicon link present in `<head>`
- [ ] Canonical URL is correct
- [ ] Meta description is meaningful
- [ ] Skip link present for accessibility
- [ ] Footer links updated if adding new pages

---

## Contact

- **Email:** heiloprojects@icloud.com
- **Support:** Links to email on all pages

---

*Last updated: January 2026*
