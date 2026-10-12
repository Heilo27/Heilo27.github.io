// Every app page, in one place. Facts checked 2026-10-12 against the App Store listings and each
// project's docs. Things only Ryan can confirm are marked `confirm:` in comments.
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/apps/**/*.{png,jpg}', { eager: true });
const img = (p: string) => {
  const m = files[`../assets/apps/${p}`];
  if (!m) throw new Error(`Missing image: src/assets/apps/${p}`);
  return m.default;
};

export type Device = 'phone' | 'ipad' | 'landscape';
export type Shot = { src: ImageMetadata; alt: string; device: Device };
export type Feature = { title: string; text: string; shot?: number };
export type Tier = { name: string; price: string; period?: string; note?: string; items: string[]; featured?: boolean };
export type Status = 'live' | 'testflight' | 'development' | 'github' | 'service' | 'companion';

export type App = {
  slug: string;
  name: string;
  category: string;          // index line: what it is, for whom
  line: string;              // hero tagline
  pitch: string;             // hero paragraph
  description: string;       // meta description
  icon?: ImageMetadata;
  monogram?: string;         // stand-in mark when an app has no icon yet
  status: Status;
  platforms: string[];
  price: string;
  cta?: { label: string; href: string };
  ctaNote?: string;
  external?: string;         // apps with their own site: the index links out
  problem?: { heading: string; text: string[] };
  shots: Shot[];
  features: Feature[];
  gallery?: number[];        // more screens, shown as a filmstrip
  tiers?: Tier[];
  tiersNote?: string;
  steps?: { heading: string; intro?: string; items: { title: string; text: string }[]; link?: { label: string; href: string }; note?: string };
  columns?: { heading: string; intro?: string; groups: { title: string; items: string[] }[] };
  family?: { heading: string; intro: string; items: { name: string; edition: string; status: string; text: string; icon?: ImageMetadata; href?: string }[] };
  quote?: { text: string; name: string; role: string }[];
  faq: { q: string; a: string }[];
  docs: { label: string; href: string }[];
  support: string;           // support email for this app
};

const APPSTORE = 'Download on the App Store';

export const apps: App[] = [
  // ───────────────────────────────── Radial AR (custom page: src/pages/radial/index.astro)
  {
    slug: 'radial',
    name: 'Radial AR',
    category: 'AR radio-navigation trainer for pilots',
    line: 'The room is the sky.',
    pitch:
      'Put a virtual VOR station on your floor and walk around it. Your phone is the aircraft, and the needle, flag and DME show exactly what a real receiver would at that spot. Fifteen minutes of walking teaches what a semester of diagrams doesn’t.',
    description:
      'Radial AR puts a virtual VOR, NDB or ILS in your room. Walk around it with your iPhone or iPad and the instruments read exactly as a real receiver would.',
    icon: img('radial/icon.png'),
    status: 'testflight',
    platforms: ['iPhone', 'iPad'],
    price: 'Coming soon',
    cta: { label: 'Ask to join the TestFlight', href: 'mailto:heiloprojects@icloud.com?subject=Radial%20AR%20TestFlight' },
    ctaNote: 'In TestFlight now. Coming to the App Store for iPhone and iPad, iOS 17 or later.',
    shots: [
      { src: img('radial/APP_IPHONE_67_01-vor-room.png'), alt: 'A virtual VOR station on a wooden floor with a compass rose, a small aircraft marker, and the VOR receiver below reading course 360, TO, DME 4.9 feet', device: 'phone' },
      { src: img('radial/APP_IPHONE_67_02-vor-track.png'), alt: 'Tracking a radial toward the station in the AR trainer', device: 'phone' },
      { src: img('radial/APP_IPHONE_67_03-ils-approach.png'), alt: 'Tabletop ILS approach with mile markers on the extended centerline and an HSI reading 3.9 nautical miles', device: 'phone' },
      { src: img('radial/APP_IPHONE_67_04-ils-da.png'), alt: 'ILS approach approaching decision altitude', device: 'phone' },
      { src: img('radial/APP_IPHONE_67_05-ils-short-final.png'), alt: 'Short final on the tabletop ILS', device: 'phone' },
      { src: img('radial/APP_IPHONE_67_06-hud.png'), alt: 'Green head-up display over the room showing heading tape, groundspeed 18, altitude 2,160 and localizer and glideslope diamonds', device: 'phone' },
      { src: img('radial/KT-02-typeA1-pick-gauge.png'), alt: 'Knowledge test question: pick the VOR indication that matches the aircraft on the map', device: 'phone' },
      { src: img('radial/KT-06-typeB-pick-aircraft.png'), alt: 'Knowledge test question: pick which numbered aircraft matches the VOR indication', device: 'phone' },
    ],
    features: [],
    faq: [
      { q: 'Is this a flight simulator?', a: 'No. There are no flight dynamics. Your phone’s position is the aircraft’s position, and its attitude is where it points. The point is to build the mental picture behind each instrument, not to fly an airplane.' },
      { q: 'How much space do I need?', a: 'About 3 by 3 meters of lit, textured floor for the VOR and NDB rooms. A rug or a wood floor tracks well; a plain glossy floor may not. The tabletop ILS needs a table and a few steps of walking room.' },
      { q: 'Can I log the time?', a: 'No. Radial AR is a training aid, not an FAA-approved training device, and it makes no logbook claims.' },
      { q: 'Does the knowledge test need AR?', a: 'No. The knowledge test practice works anywhere, including on devices without AR. Its answers come from the same math that drives the AR instruments.' },
      { q: 'What does it collect?', a: 'Nothing. No account, no analytics, no backend. If you choose true north, location is used once by ARKit to align the room and is never stored or sent.' },
    ],
    docs: [],
    support: 'heiloprojects@icloud.com',
  },

  // ───────────────────────────────── Right Rudder
  {
    slug: 'rightrudder',
    name: 'Right Rudder',
    category: 'Student records and endorsements for flight instructors',
    line: 'Less paperwork. More flight time.',
    pitch:
      'Right Rudder keeps every student’s progress, checklists and endorsements in one place, so a flight instructor spends the hour teaching instead of filling in forms. Built by a working CFI who got tired of spreadsheets.',
    description:
      'Right Rudder tracks student progress, generates Part 61 endorsements and keeps training records for flight instructors on iPhone, iPad and Mac. $14.99 once.',
    icon: img('rightrudder/icon.png'),
    status: 'live',
    platforms: ['iPhone', 'iPad', 'Mac'],
    price: '$14.99 once',
    cta: { label: APPSTORE, href: 'https://apps.apple.com/us/app/right-rudder/id6753633792' },
    ctaNote: 'One purchase, every future update. The Right Rudder Student companion is a separate $4.99 app.',
    problem: {
      heading: 'You became a CFI to teach, not to file.',
      text: [
        'Between progress tracking, endorsements, checkride paperwork and scheduling, the admin piles up. Spreadsheets sprawl, and details slip through the cracks right before a checkride.',
        'Right Rudder handles the record keeping, so the briefing room is for teaching again.',
      ],
    },
    shots: [
      { src: img('rightrudder/phone-1.jpg'), alt: 'Students list with PPL, IFR, CPL and CFI filters', device: 'phone' },
      { src: img('rightrudder/phone-2.jpg'), alt: 'A student record with contact details, total dual given and lesson checklists', device: 'phone' },
      { src: img('rightrudder/phone-3.jpg'), alt: 'Straight and level flight lesson checklist with completed items', device: 'phone' },
      { src: img('rightrudder/phone-5.jpg'), alt: 'Endorsement generator listing Part 61 endorsements to choose from', device: 'phone' },
      { src: img('rightrudder/phone-6.jpg'), alt: 'A filled endorsement with student name and date ready to export', device: 'phone' },
      { src: img('rightrudder/phone-4.jpg'), alt: 'Sharing a student profile with the student companion app', device: 'phone' },
      { src: img('rightrudder/ipad-2.jpg'), alt: 'Right Rudder on iPad with the student list beside a lesson checklist', device: 'ipad' },
      { src: img('rightrudder/ipad-4.jpg'), alt: 'Checklist templates on iPad', device: 'ipad' },
      { src: img('rightrudder/ipad-5.jpg'), alt: 'Settings on iPad with iCloud backup and theme choices', device: 'ipad' },
    ],
    features: [
      { title: 'Every student, one view', text: 'See who is ready for a stage check, who needs another lesson and who is close to the checkride. Filter by certificate: private, instrument, commercial, CFI.', shot: 0 },
      { title: 'The whole record, in one tap', text: 'Contact details, dual given, lesson history and the next lesson plan, together on one screen instead of scattered across a logbook, a binder and your memory.', shot: 1 },
      { title: 'Checklists that follow the syllabus', text: 'Work through each lesson’s items and tick them off as the student demonstrates them. Build your own templates for the way you teach.', shot: 2 },
      { title: 'Endorsements, correctly worded', text: 'Every Part 61 endorsement, filled in with the student’s name, your certificate number and the date. Export to PDF or print it straight into the logbook.', shot: 3 },
      { title: 'Students stay in the loop', text: 'Share a profile with the student and they follow their own progress and endorsements in the Right Rudder Student app.', shot: 5 },
    ],
    gallery: [6, 7, 8],
    quote: [
      { text: 'I’ve been using this since you first put it in the beta release. For the first month or two it was pretty much a useful gimmick, but the more time I put into it the more useful it became. Excellent job.', name: 'Scotty', role: 'CFI, beta user' },
      { text: 'Can confirm, app works great!', name: 'Matt', role: 'CFI' },
    ],
    faq: [
      { q: 'Is it approved by the FAA?', a: 'Right Rudder helps you produce correctly formatted endorsements and records, but you remain responsible for their accuracy and your signature. It is a tool, not a substitute for your judgment as an instructor.' },
      { q: 'Does it work offline?', a: 'Yes. Record lesson notes on the ramp without a signal. Everything syncs through your iCloud when you are back online.' },
      { q: 'What if I stop using it?', a: 'Export your data any time. Student records, endorsements and history are yours.' },
      { q: 'Can my flight school use it?', a: 'Right Rudder is built for individual instructors. If you run a school and want it for several instructors, email me about volume licensing.' },
      { q: 'What does the student app do?', a: 'Right Rudder Student ($4.99, sold separately) lets your students see their progress, upcoming lessons and endorsements, synced from your instructor app.' },
    ],
    docs: [{ label: 'Privacy policy', href: '/rightrudder/privacy' }, { label: 'Right Rudder Student on the App Store', href: 'https://apps.apple.com/us/app/right-rudder-student/id6753929067' }],
    support: 'heiloprojects@icloud.com',
  },

  // ───────────────────────────────── Green Arc (own site; listed in the index only)
  {
    slug: 'greenarc',
    name: 'Green Arc',
    category: 'Scheduling and operations for flight schools',
    line: 'Your school runs on Green Arc.',
    pitch: 'The scheduling and operations platform for flight schools, with an iPhone and iPad companion for students, renters, instructors and mechanics.',
    description: 'Green Arc is the scheduling and operations app for flight schools.',
    icon: img('greenarc/icon.png'),
    status: 'live',
    platforms: ['iPhone', 'iPad', 'Web'],
    price: 'School subscription',
    external: 'https://greenarc.app',
    shots: [{ src: img('greenarc/phone-1.jpg'), alt: 'Green Arc home screen with overdue close-outs, today’s bookings and grounded aircraft', device: 'phone' }],
    features: [],
    faq: [],
    docs: [],
    support: 'heiloprojects@icloud.com',
  },

  // ───────────────────────────────── Stripes
  {
    slug: 'stripes',
    name: 'Stripes',
    category: 'Crew dispatch and billing for lawn care companies',
    line: 'Dispatch smarter. Bill faster.',
    pitch:
      'The dispatcher plans the day on an iPad. The crews get their jobs on their iPhones, in English or Spanish. Time tracks itself when a truck arrives on site, and finished jobs become invoices ready for QuickBooks.',
    description:
      'Stripes is crew dispatch for lawn care companies: schedules, route order, geofence job timers and QuickBooks invoicing on iPad and iPhone. From $35 a month.',
    icon: img('stripes/icon.png'),
    status: 'live',
    platforms: ['iPad', 'iPhone'],
    price: 'From $35 a month',
    cta: { label: APPSTORE, href: 'https://apps.apple.com/us/app/stripes-lawn-crew-dispatch/id6760204244' },
    ctaNote: 'iPad for the dispatcher, iPhone for the crews. Crew members download free.',
    problem: {
      heading: 'Most field software is priced for someone else.',
      text: [
        'The big platforms run $150 to $350 a month and hold scheduling, invoicing and QuickBooks behind their top tiers. Small operators end up on spreadsheets and group texts instead.',
        'Stripes is built for the company running one to ten crews that just needs the day to go right.',
      ],
    },
    shots: [
      { src: img('stripes/phone-4.jpg'), alt: 'Stripes schedule for Thursday with jobs blocked out on the timeline', device: 'phone' },
      { src: img('stripes/phone-6.jpg'), alt: 'Customer list with mowing, edging and trimming tags and an Optimize Route button', device: 'phone' },
      { src: img('stripes/phone-5.jpg'), alt: 'Invoices screen filtered by draft, pending, sent and failed', device: 'phone' },
      { src: img('stripes/phone-3.jpg'), alt: 'The crew view of today’s date with jobs from the dispatcher', device: 'phone' },
      { src: img('stripes/ipad-1.jpg'), alt: 'Stripes on iPad in dark mode: a day of crew jobs with drive times between them beside a customer list', device: 'ipad' },
      { src: img('stripes/ipad-3.jpg'), alt: 'Choosing between the Starter and Pro plans on iPad', device: 'ipad' },
    ],
    features: [
      { title: 'Dispatch in seconds', text: 'Drag customers onto the day, set the order and send it to every crew in one tap. No phone calls, no group texts.', shot: 0 },
      { title: 'Route order that saves fuel', text: 'Stripes works out the most efficient driving order for each crew’s day. Fewer miles, more jobs, and you can still drag a stop wherever you want it.', shot: 1 },
      { title: 'Time that tracks itself', text: 'When a crew arrives at a property the job timer starts. When they leave it stops. Your labor costs become exact without anyone touching a clock.', shot: 4 },
      { title: 'Invoices, then QuickBooks', text: 'A finished job becomes an invoice waiting for your review. Approve it and it goes to QuickBooks. No double entry.', shot: 1 },
      { title: 'A crew app in English and Spanish', text: 'Job details, navigation, the timer and notes are fully translated, so you can hire the best crew regardless of language.', shot: 0 },
    ],
    gallery: [4, 5],
    // confirm: names and prices from the in-app plan sheet on the App Store (Starter $35, Pro $79.99);
    // the old site called them Calendar and Server at $35 and $79.
    tiers: [
      { name: 'Starter', price: '$35', period: 'a month', note: 'For one or two crews', items: ['Customer database and scheduling', 'Route optimization', 'Geofence job timers', 'Crew app for iPhone', 'Syncs through your own calendar, no server'] },
      { name: 'Pro', price: '$79.99', period: 'a month', note: 'For three crews or more', featured: true, items: ['Everything in Starter', 'Unlimited crews', 'Real-time cloud sync', 'Photos and field notes', 'QuickBooks invoicing', 'Priority support'] },
    ],
    tiersNote: 'Save about 15% billed yearly. Unlimited crew members on both plans. Cancel any time in the App Store.',
    faq: [
      { q: 'Do crew members pay anything?', a: 'No. One subscription covers every crew device. Crew members download the free app and join with an AirDrop invitation on Starter or a linking code on Pro.' },
      { q: 'How does QuickBooks work?', a: 'Connect QuickBooks once in Settings. When a job is marked complete, Stripes drafts the invoice for your review; approve it and it is sent to QuickBooks.' },
      { q: 'Does it work without internet?', a: 'Starter syncs through iOS Calendar and iCloud. Pro needs a connection for live crew sync, and the crew app keeps its job list for offline viewing.' },
      { q: 'Which plan do I need?', a: 'Starter covers one or two crews with no server. Pro adds cloud sync, photos and QuickBooks for bigger operations.' },
    ],
    docs: [{ label: 'Support', href: '/stripes/support' }, { label: 'Privacy policy', href: '/stripes/privacy' }],
    support: 'heiloprojects@icloud.com',
  },

  // ───────────────────────────────── StockUp
  {
    slug: 'stockup',
    name: 'StockUp',
    category: 'Pantry tracking and recipes from what you already own',
    line: 'Cook what you already have.',
    pitch:
      'Most recipe apps tell you what to buy. StockUp starts with the chicken in your fridge, the tomatoes in your pantry and the pasta that has been in the cupboard for two months, and tells you what you can make tonight.',
    description:
      'StockUp tracks your pantry, warns before food expires and finds recipes you can make right now. Free to try, $5.99 once on iPhone, iPad and Mac.',
    icon: img('stockup/icon.png'),
    status: 'live',
    platforms: ['iPhone', 'iPad', 'Mac'],
    price: '$5.99 once',
    cta: { label: APPSTORE, href: 'https://apps.apple.com/us/app/stockup-pantry-organizer/id6760556351' },
    ctaNote: 'Free to try, then $5.99 once to unlock everything. No subscription.',
    problem: {
      heading: 'The problem is not the recipe. It is the shopping trip.',
      text: [
        'Recipe apps assume you will go shopping. Meanwhile the spinach wilts and the ground beef passes its date.',
        'StockUp works from what is already in your kitchen and puts the food that is about to turn first in line.',
      ],
    },
    shots: [
      { src: img('stockup/local/02-pantry.png'), alt: 'My Pantry listing 15 ingredients with expiry warnings on spinach and ground beef', device: 'phone' },
      { src: img('stockup/local/03-receipt-scan.png'), alt: 'Add Ingredients by scanning a receipt, by voice or by typing', device: 'phone' },
      { src: img('stockup/local/04-recipes.png'), alt: 'Recipes ready to cook now, with a Use It First row for ingredients close to expiry', device: 'phone' },
      { src: img('stockup/local/07-mealplan.png'), alt: 'Meal planner for the week with dinner slots', device: 'phone' },
      { src: img('stockup/local/05-ingredient-detail.png'), alt: 'Ingredient detail for all-purpose flour with quantity, category and expiry date', device: 'phone' },
    ],
    features: [
      { title: 'Know what you have', text: 'Pantry, fridge and freezer in one list, with a warning before anything goes bad. Never buy a duplicate again.', shot: 0 },
      { title: 'Add it however you like', text: 'Scan the receipt and everything goes in at once. Or say “add milk” to Siri, or just type it.', shot: 1 },
      { title: 'Recipes you can make now', text: 'Not almost, actually. More than 500 built-in recipes, filtered by what you own, with the food that is about to expire first in line. They work offline.', shot: 2 },
      { title: 'A week of dinners in minutes', text: 'Drop recipes onto the week. Missing ingredients go straight to the shopping list, so the trip is shorter and the bill is smaller.', shot: 3 },
    ],
    faq: [
      { q: 'Is it a subscription?', a: 'No. StockUp is free to try, then $5.99 once to unlock everything for good.' },
      { q: 'Where does my data go?', a: 'Nowhere we can see it. Your pantry lives on your devices and syncs through your own iCloud. No account, no tracking, no ads.' },
      { q: 'Can my family share it?', a: 'Yes, with Family Sharing, including the shopping list.' },
      { q: 'Can I add my own recipes?', a: 'Yes, and StockUp tracks whether you have their ingredients.' },
    ],
    docs: [{ label: 'Privacy policy', href: '/stockup/privacy' }],
    support: 'heiloprojects@icloud.com',
  },

  // ───────────────────────────────── Grove
  {
    slug: 'grove',
    name: 'Grove',
    category: 'Chores, points and goals for families',
    line: 'Habits that grow with your kids.',
    pitch:
      'Grove turns chores and good behavior into points, and points into goals your kids actually want. Routines stay consistent, progress stays visible, and both parents see the same household.',
    description:
      'Grove helps parents build routines with chores, points, behavior scores and goals kids care about. On iPhone and iPad, with co-parent support.',
    icon: img('grove/icon.png'),
    status: 'live',
    platforms: ['iPhone', 'iPad'],
    price: 'Subscription',
    cta: { label: APPSTORE, href: 'https://apps.apple.com/us/app/grove-family-behavior-tracker/id6761078753' },
    ctaNote: 'Free to download; a subscription unlocks the household.',
    problem: {
      heading: 'Kids do better when they can see the finish line.',
      text: [
        'Consistent routines, immediate positive feedback and visible progress toward something they care about. That is how children build follow-through, and it is hard to keep up on a whiteboard.',
        'Grove does the bookkeeping so the encouragement can stay personal.',
      ],
    },
    shots: [
      { src: img('grove/phone-2.jpg'), alt: 'Grove dashboard with three children, their points and progress toward goals', device: 'phone' },
      { src: img('grove/phone-4.jpg'), alt: 'Emma’s ledger with daily points, a bonus for a great week and chore completions', device: 'phone' },
      { src: img('grove/phone-6.jpg'), alt: 'Emma’s goals: Movie Night achieved, New Video Game in progress', device: 'phone' },
      { src: img('grove/phone-3.jpg'), alt: 'The dashboard in dark mode', device: 'phone' },
      { src: img('grove/ipad-2.jpg'), alt: 'Grove dashboard on iPad', device: 'ipad' },
      { src: img('grove/ipad-3.jpg'), alt: 'A child’s ledger on iPad', device: 'ipad' },
    ],
    features: [
      { title: 'Every child at a glance', text: 'Points, behavior and progress toward each goal, for every child, on one screen. Celebrate each one on their own terms.', shot: 0 },
      { title: 'Effort that adds up', text: 'Daily points, chores and bonuses for going above and beyond land in each child’s ledger the moment you approve them.', shot: 1 },
      { title: 'Goals worth waiting for', text: 'A new game, a movie night, extra screen time. Watching the bar fill is a daily lesson in delayed gratification.', shot: 2 },
      { title: 'Growth over perfection', text: 'The behavior score weights recent weeks more than old ones, so improvement shows up quickly and nobody is defined by their worst week.', shot: 1 },
      { title: 'One household, two parents', text: 'Co-parents share the same household and see the same data. Kids on a shared iPad sign in with a four-digit PIN.', shot: 3 },
    ],
    gallery: [4, 5],
    faq: [
      { q: 'How does pricing work?', a: 'Grove is free to download, and a subscription unlocks chores, behavior scoring, goals and multiple children.' },
      { q: 'How many kids can I add?', a: 'As many as you need. Each child gets a profile, chores, a behavior score and a points balance.' },
      { q: 'Can kids use it on their own?', a: 'Yes. They see their own chores and mark them done; parents approve from their view. On a shared device each child has a PIN.' },
    ],
    docs: [{ label: 'Privacy policy', href: '/privacy' }],
    support: 'heiloprojects@icloud.com',
  },

  // ───────────────────────────────── Lodestone
  {
    slug: 'lodestone',
    name: 'Lodestone',
    category: 'Pathfinder and Starfinder rules reference',
    line: 'Every rule. Right there.',
    pitch:
      'The whole Pathfinder ruleset, searchable in a tap and cross-linked the way the rules actually connect. Everything lives on your device, so there are no spinners at the table and no Wi-Fi required.',
    description:
      'Lodestone is the Pathfinder and Starfinder rules reference for iPhone and iPad: instant search, deep cross-links and full offline access. Free with optional premium.',
    icon: img('lodestone/icon.png'),
    status: 'live',
    platforms: ['iPhone', 'iPad'],
    price: 'Free, premium $2.99 a month',
    cta: { label: APPSTORE, href: 'https://apps.apple.com/us/app/lodestone-pf1/id6761501375' },
    ctaNote: 'Core Rulebook free forever. Premium unlocks the expanded ruleset.',
    problem: {
      heading: 'Mid-combat is no time for page flipping.',
      text: [
        'The ruleset spans dozens of books and thousands of entries. Finding a feat’s prerequisite chain or a monster’s full stat block shouldn’t take thirty seconds of frantic searching.',
        'Lodestone makes it three.',
      ],
    },
    shots: [
      { src: img('lodestone/phone-1.jpg'), alt: 'Lodestone PF1 home with quick access to spells, classes, monsters, feats, items and races', device: 'phone' },
      { src: img('lodestone/phone-2.jpg'), alt: 'Spells list A to Z with a search field', device: 'phone' },
      { src: img('lodestone/phone-3.jpg'), alt: 'Spell detail for Abadar’s Truthtelling with class levels and casting time', device: 'phone' },
      { src: img('lodestone/phone-5.jpg'), alt: 'Alchemist class detail with hit die, saving throws and class skills as links', device: 'phone' },
      { src: img('lodestone/phone-6.jpg'), alt: 'GM Screen with combat actions and combat maneuver rules', device: 'phone' },
      { src: img('lodestone/ipad-1.jpg'), alt: 'Lodestone on iPad', device: 'ipad' },
    ],
    features: [
      { title: 'Search the whole ruleset at once', text: 'Spells, feats, classes, monsters and items in one search, grouped by type, with results in a blink.', shot: 1 },
      { title: 'Rules that link to rules', text: 'A prerequisite links to the feat. A special ability links to the rule it mirrors. Follow the rules wherever they lead without losing your place.', shot: 2 },
      { title: 'Built for the GM, too', text: 'A GM screen with combat actions, maneuvers and conditions, a tap away from the full entry behind each one.', shot: 4 },
      { title: 'Your table, your bookmarks', text: 'Bookmark any entry into folders: your character’s spells, tonight’s monsters, the rules you reach for every session.', shot: 3 },
    ],
    family: {
      heading: 'Three systems. One subscription.',
      intro: 'One premium subscription unlocks the expanded content across every Lodestone app.',
      items: [
        { name: 'Lodestone PF1', edition: 'Pathfinder 1st Edition', status: 'On the App Store', text: 'Core classes, races, 300+ feats and 500+ spells free. Premium adds 2,000+ feats, 4,000+ monsters, prestige classes, Unchained, Occult, Mythic and magic items.', icon: img('lodestone/icon.png'), href: 'https://apps.apple.com/us/app/lodestone-pf1/id6761501375' },
        { name: 'Lodestone PF2', edition: 'Pathfinder 2nd Edition', status: 'In development', text: 'Ancestries and heritages, class and archetype feats, the three-action system and the full bestiary.' },
        { name: 'Lodestone SF1', edition: 'Starfinder 1st Edition', status: 'In development', text: 'Species and themes, tech and hybrid equipment, starship rules and the Alien Archive.' },
      ],
    },
    faq: [
      { q: 'What is free and what is premium?', a: 'The Core Rulebook is free forever. Premium ($2.99 a month) unlocks every supplement, prestige classes, the complete bestiary, magic items and the advanced systems.' },
      { q: 'Does it work offline?', a: 'Yes. Everything is stored on your device after the first download.' },
      { q: 'Does premium cover PF2 and SF1?', a: 'Yes. One subscription unlocks premium across all three apps as they launch.' },
      { q: 'Is my data private?', a: 'Yes. No analytics and no tracking. Favorites and settings stay on your device.' },
    ],
    docs: [{ label: 'Privacy policy', href: '/privacy' }],
    support: 'heiloprojects@icloud.com',
  },

  // ───────────────────────────────── DSM Video
  {
    slug: 'dsmvideo',
    name: 'DSM Video',
    category: 'Your Synology video library on iPhone, iPad and Apple TV',
    line: 'Your NAS, beautifully.',
    pitch:
      'Synology dropped Video Station. DSM Video replaces it: a fast, native player for iPhone, iPad and Apple TV, powered by a small server package on your NAS. Your library stays on your hardware, in your home.',
    description:
      'DSM Video is a free native iPhone, iPad and Apple TV player for your Synology NAS, the replacement for Video Station. Open source, no cloud, no subscription.',
    icon: img('dsmvideo/icon.png'),
    status: 'live',
    platforms: ['iPhone', 'iPad', 'Apple TV'],
    price: 'Free and open source',
    cta: { label: APPSTORE, href: 'https://apps.apple.com/us/app/dsm-video/id6760669315' },
    ctaNote: 'Free on iPhone, iPad and Apple TV. Needs a Synology NAS running DSVideoServer.',
    problem: {
      heading: 'Update your NAS, lose your video app.',
      text: [
        'Video Station was a solid app until Synology stopped supporting it on current DSM firmware. The alternatives are complicated to set up and never quite look right on Apple devices.',
        'DSM Video fills the gap with a native app and a lightweight server that manages your library directly.',
      ],
    },
    shots: [
      { src: img('dsmvideo/ipad-2.jpg'), alt: 'DSM Video on iPad: a sidebar of libraries beside a grid of movie posters', device: 'ipad' },
      { src: img('dsmvideo/phone-1.jpg'), alt: 'DSM Video sign-in with a NAS address, username and Pair with Apple TV', device: 'phone' },
      { src: img('dsmvideo/phone-2.jpg'), alt: 'Libraries list with Movies and TV Shows', device: 'phone' },
    ],
    features: [
      { title: 'A library that looks like one', text: 'Movies and shows with poster art, seasons and episode lists, and full-text search across the whole collection.', shot: 2 },
      { title: 'A player for people who watch a lot', text: 'Swipe anywhere to scrub, where a full swipe covers 30 minutes. Swipe for volume, pinch for fill or fit, AirPlay, speed control.', shot: 2 },
      { title: 'Apple TV, made for the couch', text: 'A full tvOS app with focus navigation and cinematic poster art. Stop on your phone and pick up on the TV where you left off.', shot: 1 },
      { title: 'Away from home, too', text: 'Use your QuickConnect ID and DSM Video finds your NAS. No static IP, no port forwarding. Download to your iPhone or iPad for a flight.', shot: 1 },
    ],
    steps: {
      heading: 'Set up the server in four steps.',
      intro: 'DSM Video connects to DSVideoServer, a small package on your NAS that manages the library, handles sign-in and transcodes for smooth streaming.',
      items: [
        { title: 'Download the package', text: 'Get the latest DSVideoServer .spk from GitHub Releases.' },
        { title: 'Open Package Center', text: 'In DSM, choose Manual Install and upload the .spk file.' },
        { title: 'Point it at your videos', text: 'In DSVideoServer’s settings, set the paths to your video folders.' },
        { title: 'Connect the app', text: 'Open DSM Video, enter your NAS address or QuickConnect ID and sign in.' },
      ],
      link: { label: 'Download DSVideoServer v0.3.8', href: 'https://github.com/Heilo27/DSM-video/releases/download/v0.3.8-0001/DSVideoServer-0.3.8-0001-x64.spk' },
      note: 'v0.3.8-0001. Needs DSM 7.2 Update 3 or later on an Intel or AMD (x86_64) NAS.',
    },
    faq: [
      { q: 'What do I need?', a: 'A Synology NAS and the free DSVideoServer package. Video Station is not required.' },
      { q: 'Is it really free?', a: 'Yes. No purchases, no subscription, no ads. The app and the server are open source on GitHub.' },
      { q: 'Which NAS models work?', a: 'The current server package is for Intel and AMD (x86_64) models running DSM 7.2 Update 3 or later, which also handle transcoding best.' },
      { q: 'Can I download for offline viewing?', a: 'Yes, on iPhone and iPad.' },
    ],
    docs: [{ label: 'Source on GitHub', href: 'https://github.com/Heilo27/DSM-video' }, { label: 'Privacy policy', href: '/privacy' }],
    support: 'heiloprojects@icloud.com',
  },

  // ───────────────────────────────── CAP Wingman
  {
    slug: 'capwingman',
    name: 'CAP Wingman',
    category: 'Publications, forms and goals for Civil Air Patrol members',
    line: 'Everything CAP. In your pocket.',
    pitch:
      'Regulations, forms, professional development goals and orientation ride scheduling for Civil Air Patrol members, downloaded once and available with no signal. Built by CAP members, for CAP members.',
    description:
      'CAP Wingman puts CAP publications, forms, professional development tracking and O-Ride coordination on iPhone and iPad, offline. Free. Unofficial, made by members.',
    icon: img('capwingman/icon.png'),
    status: 'live',
    platforms: ['iPhone', 'iPad'],
    price: 'Free',
    cta: { label: APPSTORE, href: 'https://apps.apple.com/us/app/cap-wingman/id6757346638' },
    ctaNote: 'Free. Not an official product of Civil Air Patrol.',
    problem: {
      heading: 'The form you need is online. You are not.',
      text: [
        'A squadron meeting with no Wi-Fi and a question about CAPR 60-1. A search sortie where the cell service ended twenty miles back. The answer is on a website you cannot reach.',
        'CAP Wingman keeps it on your phone.',
      ],
    },
    shots: [
      { src: img('capwingman/phone-4.jpg'), alt: 'Regulations list with CAPR 70-1, 40-1, 60-1 and 60-2, filterable by type', device: 'phone' },
      { src: img('capwingman/phone-5.jpg'), alt: 'Forms list with CAPF 70-5A, 70-5Q-A and 70-91', device: 'phone' },
      { src: img('capwingman/phone-6.jpg'), alt: 'CAPF 70-5A pilot flight evaluation form open in the viewer', device: 'phone' },
      { src: img('capwingman/phone-3.jpg'), alt: 'Selecting professional development and emergency services goals', device: 'phone' },
      { src: img('capwingman/phone-2.jpg'), alt: 'Level I onboarding goal with step-by-step progress', device: 'phone' },
      { src: img('capwingman/ipad-1.jpg'), alt: 'The regulations library on iPad', device: 'ipad' },
    ],
    features: [
      { title: 'The publications library', text: 'CAPRs, CAPPs and CAPMs, searchable and filterable, cached for offline reading so you are never without a reference in the field.', shot: 0 },
      { title: 'Forms, ready when you are', text: 'Pilot evaluations, mission paperwork, cadet forms. Open them on the ramp instead of hunting for a printer.', shot: 1 },
      { title: 'Goals with a path', text: 'Pick a professional development level or an emergency services qualification and work through it step by step.', shot: 3 },
      { title: 'Orientation rides, coordinated', text: 'Pilots post availability, cadets request flights, and confirmed rides land on your calendar from your wing’s O-Ride sheet.', shot: 4 },
    ],
    gallery: [5],
    faq: [
      { q: 'Is this official CAP software?', a: 'No. CAP Wingman is an unofficial app made by CAP members. It is not affiliated with Civil Air Patrol National Headquarters or the United States Air Force.' },
      { q: 'Are the forms and regulations current?', a: 'They are updated regularly, but always verify against official CAP sources before submitting anything official.' },
      { q: 'What about my data?', a: 'Your name, CAPID and contact details are used only to coordinate with other members in the app. Location finds your nearest airfield and is never stored or sent.' },
    ],
    docs: [{ label: 'Privacy policy', href: '/capwingman/privacy' }],
    support: 'heiloprojects@icloud.com',
  },

  // ───────────────────────────────── Foreman (not on the App Store yet)
  {
    slug: 'foreman',
    name: 'Foreman',
    category: 'Field service management for small trade contractors',
    line: 'Run your trade business from your phone.',
    pitch:
      'Dispatch jobs, invoice clients, manage your crew and track time, all offline-first. For the electrician, plumber or HVAC tech running a crew of one to fifteen.',
    description:
      'Foreman is field service management for small trade contractors: dispatch, estimates, invoices, crew and geofence timers, offline-first on iPhone and iPad.',
    monogram: 'F',
    status: 'development',
    platforms: ['iPhone', 'iPad'],
    price: 'From $19 a month at launch',
    cta: { label: 'Get told when it launches', href: 'mailto:heiloprojects@icloud.com?subject=Foreman%20launch' },
    ctaNote: 'Not on the App Store yet.', // confirm: the old page linked to a placeholder App Store ID
    problem: {
      heading: 'Field software wasn’t built for the trades.',
      text: [
        'The enterprise platforms cost hundreds a month, the cheap ones are built for landscapers, and most of them need a signal just to open a job. Small contractors juggle spreadsheets, group texts and paper invoices instead.',
        'Foreman is a real business tool at a price a small crew can carry.',
      ],
    },
    shots: [],
    features: [
      { title: 'A dispatch board for the whole crew', text: 'Every tech’s day on one screen. Drag to assign, tap to reschedule, push an emergency call when someone needs to be on site now.' },
      { title: 'Time that starts at the curb', text: 'A geofence around each job starts the timer on arrival and stops it on departure. No clock-ins, no forgotten punch-outs.' },
      { title: 'Estimates and invoices on site', text: 'Branded estimates and invoices, sent by email or text, signed on the glass, tracked until paid.' },
      { title: 'Offline first, always', text: 'Jobs, time, notes and photos save on the device and sync when the signal comes back.' },
      { title: 'One app, two roles', text: 'The dispatcher sees the board, customers, invoicing and analytics. The tech sees their jobs, navigation and the timer. Same app, same subscription.' },
      { title: 'Books that stay current', text: 'Push invoices to QuickBooks Online, or export a clean CSV on the Solo plan.' },
    ],
    tiers: [
      { name: 'Solo', price: '$19', period: 'a month', note: 'One person, no crew', items: ['Jobs and customers', 'Estimates and invoices with PDF', 'Calendar sync', 'CSV export for QuickBooks', 'Complete offline support'] },
      { name: 'Team', price: '$49', period: 'a month', note: 'Up to 5 crew members', featured: true, items: ['Everything in Solo', 'Real-time dispatch', 'Geofence timers', 'Route optimization', 'QuickBooks sync', 'Push notifications'] },
      { name: 'Business', price: '$99', period: 'a month', note: 'Up to 20 crew members', items: ['Everything in Team', 'Analytics dashboard', 'Revenue risk alerts', 'Crew utilization', 'Weekly email reports', 'Priority support'] },
    ],
    tiersNote: 'Planned pricing. About 20% off billed yearly. No per-seat fees.',
    faq: [
      { q: 'Does it work without internet?', a: 'Yes. Every read and write goes to the device first, and changes sync when you reconnect.' },
      { q: 'Does each crew member need a subscription?', a: 'No. One subscription covers the company. Crew members sign in with a PIN and get the tech view.' },
      { q: 'Which trades is it for?', a: 'Electrical, plumbing, HVAC, general contracting, handyman, painting, flooring, roofing: anyone who sends people to job sites.' },
    ],
    docs: [{ label: 'Support', href: '/foreman/support/' }, { label: 'Privacy policy', href: '/privacy' }],
    support: 'support@heiloprojects.com',
  },

  // ───────────────────────────────── Castle of the Winds (in development)
  {
    slug: 'castleofthewinds',
    name: 'Castle of the Winds',
    category: 'The 1990s dungeon crawler, rebuilt for Apple devices',
    line: 'The legend returns.',
    pitch:
      'Procedural dungeons, creatures from Norse myth and loot worth dying for. The Windows 3.1 classic, rebuilt from scratch for iPhone, iPad and Mac with touch controls and iCloud saves.',
    description:
      'Castle of the Winds, the classic 1990s roguelike, rebuilt from scratch for iPhone, iPad and Mac. Procedural dungeons, Norse mythology, permadeath. In development.',
    icon: img('castle/icon.png'),
    status: 'development',
    platforms: ['iPhone', 'iPad', 'Mac'],
    price: 'One purchase, no in-app purchases',
    cta: { label: 'Get told when it launches', href: 'mailto:heiloprojects@icloud.com?subject=Castle%20of%20the%20Winds' },
    ctaNote: 'In development. Not on the App Store yet.', // confirm: the old page linked to a placeholder App Store URL
    problem: {
      heading: 'Not a port. A rebuild.',
      text: [
        'If you played Castle of the Winds in the nineties you remember the descent, the tension of permadeath and the thrill of an unidentified sword.',
        'This version keeps all of it and adds what the original never had: touch controls, modern clarity and your hero waiting on every device.',
      ],
    },
    shots: [{ src: img('castle/title.png'), alt: 'Castle of the Winds title screen: A Question of Vengeance, with a New Game button', device: 'landscape' }],
    features: [
      { title: 'Every descent is different', text: 'Layouts, monsters and loot are generated fresh, so no two runs share a dungeon.' },
      { title: 'Foes from Norse legend', text: 'Trolls, giants and dragons, each with their own tactics. Learn them or fall to them.' },
      { title: 'Think before you strike', text: 'Turn-based combat where position and gear matter, and permadeath makes every choice count.' },
      { title: 'Warrior, mage or both', text: 'Learn spells from several schools of magic and build the hero you want.' },
      { title: 'One quest, every device', text: 'Start on the train, continue on the iPad, finish on the Mac. iCloud keeps your hero in step.' },
    ],
    faq: [
      { q: 'Is this the original game?', a: 'No. It is a complete rebuild that recreates the gameplay and spirit of the original for modern Apple devices.' },
      { q: 'Are there in-app purchases?', a: 'No. No energy bars, no loot boxes, no premium currency. Buy it once.' },
      { q: 'Is it really permadeath?', a: 'Yes, by default. Difficulty settings let you ease in.' },
    ],
    docs: [{ label: 'Privacy policy', href: '/castleofthewinds/privacy' }],
    support: 'heiloprojects@icloud.com',
  },

  // ───────────────────────────────── RadioWriter (Mac, GitHub)
  {
    slug: 'radiowriter',
    name: 'RadioWriter',
    category: 'Motorola radio programming on the Mac',
    line: 'Program your radios. Skip Windows.',
    pitch:
      'Motorola’s programming software only runs on Windows. RadioWriter is a native Mac app for frequencies, channels, tones and codeplugs. No Boot Camp, no virtual machine, no borrowed PC.',
    description:
      'RadioWriter programs Motorola radios natively on the Mac: channels, frequencies, CTCSS and DCS tones, codeplugs. Free download, universal for Intel and Apple silicon.',
    monogram: 'R',
    status: 'github',
    platforms: ['Mac'],
    price: 'Free',
    cta: { label: 'Download for Mac', href: 'https://github.com/Heilo27/radiowriter/releases/latest' },
    ctaNote: 'Version 1.0.0, macOS 12 or later. Universal for Intel and Apple silicon.',
    problem: {
      heading: 'Mac users have been stuck with workarounds.',
      text: [
        'Boot Camp, virtual machines, a friend’s laptop, or simply not programming the radio at all.',
        'RadioWriter is a focused native tool that does one job well.',
      ],
    },
    shots: [],
    features: [
      { title: 'Channels', text: 'Frequencies, names and power levels per channel. Import and export codeplugs to share a setup.' },
      { title: 'Frequencies', text: 'TX and RX frequencies, offsets and splits, for simplex and repeater use.' },
      { title: 'Tones and squelch', text: 'CTCSS, DCS and digital squelch codes with the full tone table.' },
      { title: 'Codeplugs', text: 'Read, write and edit codeplug files. Keep a backup before every write.' },
    ],
    columns: {
      heading: 'Supported radios',
      intro: 'Don’t see yours? Email me and I’ll look at adding it.',
      groups: [{ title: 'Motorola series', items: ['CLP', 'CLS', 'CP200d', 'DLR', 'DTR', 'RDM', 'RDU', 'RM', 'RMM', 'RMU', 'SL300', 'VL50', 'XPR', 'APX'] }],
    },
    faq: [
      { q: 'Is it legal?', a: 'Yes. RadioWriter is original software that talks to the radios over documented protocols. It is not a copy of Motorola’s CPS.' },
      { q: 'Do I need a programming cable?', a: 'Yes, the standard Motorola-compatible USB programming cable for your model.' },
      { q: 'Will it brick my radio?', a: 'It checks configurations before writing, but always keep a backup of a working codeplug first.' },
      { q: 'Can I support development?', a: 'RadioWriter is free. If it saved you a Windows license, you can buy me a coffee at buymeacoffee.com/heiloprojects.' },
    ],
    docs: [{ label: 'All releases', href: 'https://github.com/Heilo27/radiowriter/releases' }, { label: 'Buy me a coffee', href: 'https://buymeacoffee.com/heiloprojects' }],
    support: 'heiloprojects@icloud.com',
  },

  // ───────────────────────────────── SpecterDC (service)
  {
    slug: 'specterdc',
    name: 'SpecterDC',
    category: 'Legacy code recovery and modernization',
    line: 'Your code has a future.',
    pitch:
      'Source code recovery, COBOL conversion and legacy modernization. The original developers are gone and the documentation never existed, but the code still runs the business. I bring it into the present, with or without the source.',
    description:
      'SpecterDC recovers lost source code, converts COBOL and other legacy languages and modernizes old systems. With or without source. Free first consultation.',
    monogram: 'S',
    status: 'service',
    platforms: ['Service'],
    price: 'Free first consultation',
    cta: { label: 'Email about your system', href: 'mailto:heiloprojects@icloud.com?subject=SpecterDC%20inquiry' },
    ctaNote: 'The first consultation is free. NDA on request.',
    problem: {
      heading: 'It works. Nobody knows how.',
      text: [
        'Decades of business logic, written in a language nobody on staff reads, by people who left years ago. Replacing it from scratch risks everything it quietly gets right.',
        'You don’t need to start over. You need a bridge.',
      ],
    },
    shots: [],
    features: [
      { title: 'Source code recovery', text: 'Lost the source? I reconstruct readable, maintainable code from compiled binaries.' },
      { title: 'COBOL conversion', text: 'COBOL to Java, C#, Python and more, with the business logic intact.' },
      { title: 'Modernization', text: 'Not just translation: restructured, documented and given modern APIs, with the same behavior.' },
      { title: 'Binary analysis', text: 'Understand what a program does without its source: documented functions, mapped logic, flagged vulnerabilities.' },
      { title: 'Code rescue', text: 'Corrupted files, incomplete backups and half-finished migrations, pieced back together.' },
    ],
    columns: {
      heading: 'From legacy to modern',
      groups: [
        { title: 'From', items: ['COBOL', 'FORTRAN', 'Pascal', 'PL/I', 'RPG', 'Assembly', 'BASIC variants', 'NATURAL'] },
        { title: 'To', items: ['Java', 'C# and .NET', 'Python', 'Go', 'Rust', 'TypeScript', 'Swift', 'Kotlin'] },
        { title: 'Platforms', items: ['IBM mainframe', 'AS/400 and IBM i', 'VAX/VMS', 'Unix variants', 'Legacy Windows', 'DOS', 'Embedded systems'] },
      ],
    },
    steps: {
      heading: 'How an engagement runs.',
      items: [
        { title: 'Discovery', text: 'Source, binaries, documentation or just a running system. I scope what you have and the best approach.' },
        { title: 'Analysis', text: 'Business logic, data flows and dependencies, mapped. You get a complete picture of what the system does.' },
        { title: 'Translation', text: 'Converted to your target language with structure improved and behavior preserved.' },
        { title: 'Validation', text: 'Side-by-side comparison and regression tests prove the new code behaves like the old.' },
        { title: 'Delivery', text: 'Clean, documented code and a handover so your team can carry it forward.' },
      ],
    },
    faq: [
      { q: '“Our COBOL developer retired.”', a: 'I translate the system to a language your current team already knows.' },
      { q: '“We lost the source code.”', a: 'I recover readable source from the compiled binaries.' },
      { q: '“The vendor went out of business.”', a: 'I reverse engineer and modernize it so you are not stuck.' },
      { q: '“We need an API for the mainframe.”', a: 'I add REST APIs without disturbing the core.' },
      { q: '“Auditors want documentation.”', a: 'I analyze the system and document what it actually does.' },
    ],
    docs: [],
    support: 'heiloprojects@icloud.com',
  },
];

export const appBySlug = (slug: string) => apps.find((a) => a.slug === slug);
/** Apps that get a page on this site (Green Arc has its own site). */
export const pagedApps = apps.filter((a) => !a.external);
/** The home index and every "next app" link share this order. SpecterDC is a service, shown with the offers. */
export const showcase = apps.filter((a) => a.status !== 'service');
export const nextApp = (slug: string) => {
  const list = pagedApps;
  const i = list.findIndex((a) => a.slug === slug);
  return list[(i + 1) % list.length];
};

export const statusLabel: Record<Status, string> = {
  live: 'On the App Store',
  testflight: 'In TestFlight',
  development: 'In development',
  github: 'Free on GitHub',
  service: 'Service',
  companion: 'On the App Store',
};
