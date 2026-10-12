# Heilo27.github.io (heiloprojects.com)
Ryan's studio site: Home Screen concept, one page per app, legal and support documents.
Stack: Astro 7, static output. GSAP, SplitText and Lenis for motion. Design record in DESIGN.md.
Commands: `npm run dev` (local), `npm run build` (static site to dist/).
Deploy: push to main runs the GitHub Actions workflow (.github/workflows/deploy.yml). Pages source must be "GitHub Actions", not "Deploy from a branch".
Rules:
- Push to main is live: confirm before pushing.
- Content lives in src/data (apps.ts, site.ts, docs/). Legal and support text in src/data/docs is verbatim: never edit it without Ryan.
- Document URLs keep their .html suffix (build.format 'preserve'): the App Store links to /stripes/privacy.html and /stripes/support.html.
- public/surveys, public/css, public/js and public/stripes/qb-callback are legacy, kept verbatim. Do not restyle them.
- legacy/ is reference only (the old Jekyll site). Do not build from it.
