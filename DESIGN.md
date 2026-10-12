# HeiloProjects site: design record

## Brief

- **Subject:** Ryan Primeau, an independent developer of native iPhone, iPad, Mac and Apple TV apps, publishing as HeiloProjects.
- **Audience:** (1) businesses and founders deciding who should build their app; (2) people deciding whether to download one of Ryan's apps.
- **Jobs:** the home page sells app development, with the shipped apps as proof. Each app has its own sales page that shows the app working and sends visitors to the App Store.
- **Facts used:** App Store listings, checked through the iTunes lookup API on 2026-10-12. Ten apps are live under Ryan Primeau: Right Rudder, Right Rudder Student, Stripes, StockUp, Grove, Skylog, Lodestone PF1, DSM Video, CAP Wingman and Green Arc. Not on the App Store: Radial AR (in TestFlight), Foreman (no store ID), Castle of the Winds (no store ID). RadioWriter is a free Mac app on GitHub. SpecterDC is a service.
- **Stack:** Astro 7, static output, deployed to GitHub Pages through Actions. GSAP, SplitText and Lenis on one clock. No WebGL: the work is screenshots, and the signature moment is a DOM shared-element transition.

## Concept (picked from three)

| | A. Springboard (the medium) | B. Build log (the process) | C. Instrument panel (the maker) |
|---|---|---|---|
| Idea | The site behaves like an iPhone Home Screen: every app opens from its icon and closes back into it | The site reads like a commit log: each app is a release | Every app sits on a radial of a VOR rose |
| O/F/Fe/P | 4 / 5 / 4 / 3 | 3 / 3 / 5 / 3 | 4 / 2 / 4 / 2 |

**Picked A.** Ryan builds native Apple apps, and the app launch is the gesture everyone already knows from his platform. C was rejected by Ryan for the site as a whole (2026-10-12). It survives only on the Radial: AR page, where the instrument is the product.

```
Idea:        HeiloProjects is a Home Screen of apps one person built; each one opens like an app.
Metaphor:    iOS springboard: icons, the launch zoom, the close-to-icon gesture, the empty slot.
Signature:   Shared-element launch. The tapped icon grows to fill the screen in that app's colour,
             then lands as the hero icon of the app's page. Going back closes the page like an app.
             On the home page, the grid ends in an empty slot ("Your app") that opens the contact form.
Emotion:     the quiet confidence of a well-made native app: crisp, quick, physical.
Motion verb: launch and settle. Fast zoom out of a point (expo.inOut), content settles upward (expo.out).
Screenshot:  the home hero: a large plain statement beside a grid of real app icons, one slot empty.
```

## Art direction

**Studio palette (home, legal, 404):**
- ground `#F2F3F5`, a cool glass white (not cream)
- ink `#0B0C0E`
- muted `#5A6069` (6.0:1 on ground)
- line `rgb(11 12 14 / 0.12)`
- accent: none. The icons bring the colour, and the CTAs are solid ink.
- curtain: the destination app's colour

**Per-app worlds:** each app page sets `data-app` on `<html>`. That gives it its own `--c-bg`, `--c-fg`, `--c-muted` and `--c-key`, sampled from the app's icon and screens. All text follows the global ink variable. Radial is the dark avionics page: cyan is the selected course and amber is DME, the same as in the app.

**Type:** Mona Sans (variable width 75 to 125, weight 200 to 900) for everything. Display uses width 112 to 125 at weight 640 to 760, tracking -0.035 to -0.05em, leading 0.9 to 0.95. Body uses width 100 at weight 400 to 450. The width axis is the kinetic idea: hero words settle from condensed to their resting width. On the Radial page only, B612 Mono (the Airbus cockpit face) sets the instrument readouts.

**Grid:** 12 columns, fluid gutter. Text hangs from column lines 1, 5 and 8. Section rhythm moves between tight, normal, airy and full viewport.

**Shape:** one radius rule. Rounded rectangles are app things (icons use a 22.4% continuous radius, devices use their own). Everything else in the layout is square.

**Motion:** the engine eases only. Launch 0.9 s in and 0.8 s land. Text lines 1.1 s at a 0.07 s stagger. Hovers 0.35 s.

## Composition

Home:
```
[hero: statement 7 cols | icon grid 5 cols, last slot empty]     poster / split frame
[proof facts: 4 real numbers]                                     data
[apps index: rows with icon, name, line, platforms, status; hover = floating device preview]  index list
[what I build: 4 offers, each linked to the apps that prove it]   asymmetric pairs
[how a project runs: 5 real steps]                                sticky narrative (sequence)
[contact: dark finale, form becomes an email]                     footer as finale
```
App page:
```
[hero: icon lands here, name, pitch, CTA | device with first screen]  split frame
[the problem, set large]                                              statement
[features: sticky device on one side, chapters scroll; the screen follows the chapter]  sticky narrative
[more screens: iPad / extra shots, horizontal snap]                   filmstrip (real sequence)
[pricing tiers, if any] [FAQ] [download CTA]
[next app: its icon, launch transition]                               footer finale
```
Radial: an instrument stage. A sticky VOR (rose, CDI, TO/FROM/OFF flag, DME) is driven by one variable: the walk path around a virtual station, using the same math as VORCore. Chapters narrate what the instrument is doing.

## Genericness test

- Dark page with a single accent was the default. Changed: the studio is light and colourless, and every app brings its own world.
- Three equal feature cards per app was the default. Changed: a sticky device with real screens that follows the chapters.
- A centred hero was the default. Changed: a split frame with the icon grid as proof, ending in the empty "Your app" slot.
- Mono for every label was the default. Changed: no mono outside the Radial instrument.
