// Studio-level content: the home page sells app development; apps.ts holds every app page.
// Facts checked 2026-10-12 against the App Store (iTunes lookup API, artist "Ryan Primeau").
export const site = {
  name: 'HeiloProjects',
  person: 'Ryan Primeau',
  role: 'Native iPhone, iPad and Mac apps by Ryan Primeau',
  url: 'https://heiloprojects.com',
  description:
    'Ryan Primeau designs and builds native iPhone, iPad and Mac apps under the HeiloProjects name. Ten are on the App Store. Yours could be next.',
  email: 'heiloprojects@icloud.com',
  appStoreDeveloper: 'https://apps.apple.com/us/developer/ryan-primeau/id1844103663',
  github: 'https://github.com/Heilo27',
};

export const hero = {
  title: ['Ten apps shipped.', 'Yours is next.'],
  intro:
    'I’m Ryan Primeau. Under the HeiloProjects name I design and build native apps for iPhone, iPad and Mac, from the first written spec to the App Store listing.',
};

// Only true numbers. Each one is checkable on the App Store or in the apps below.
export const facts = [
  { value: '10', label: 'apps live on the App Store under my name' },
  { value: '4', label: 'Apple platforms shipped: iPhone, iPad, Mac and Apple TV' },
  { value: '1', label: 'person from the first spec to App Store review' },
];

export const offers = [
  {
    title: 'Operations apps for crews in the field',
    text: 'Dispatch boards, schedules, time that tracks itself with geofences, invoices that land in QuickBooks. Built for the owner on an iPad and the crew on their phones.',
    proof: ['stripes', 'greenarc', 'skylog', 'foreman'],
  },
  {
    title: 'Training and reference tools',
    text: 'Software that teaches or puts the rulebook in your pocket. Student records and endorsements, an AR radio-nav trainer, thousands of cross-linked rules, all available without a signal.',
    proof: ['rightrudder', 'radial', 'lodestone', 'capwingman'],
  },
  {
    title: 'Consumer apps that earn their price',
    text: 'Onboarding, StoreKit trials and subscriptions, iCloud sync and the App Store paperwork that comes with them. Apps people pay for and keep.',
    proof: ['stockup', 'grove', 'dsmvideo'],
  },
  {
    title: 'Rescue for old systems',
    text: 'Code with no source, no author and no documentation. Under the SpecterDC name I recover it, explain it and move it to a language your team can maintain.',
    proof: ['specterdc'],
  },
];

// The real sequence every project follows. Numbers are a sequence here, not decoration.
export const process = [
  {
    title: 'A spec in plain English',
    text: 'Before any code, a written description of what the app does, who it is for and how we will know it works. You approve it, and it stays the reference for the whole build.',
  },
  {
    title: 'Screens you can react to',
    text: 'The key screens are designed and reviewed with you before the build starts, so the expensive changes happen while they are still cheap.',
  },
  {
    title: 'Builds on your own phone',
    text: 'As features land, they arrive on your devices through TestFlight. You judge working software, not a slide deck.',
  },
  {
    title: 'The App Store, handled',
    text: 'Listing copy, screenshots, privacy labels, pricing and the review submission. I have taken ten apps through review and know where it snags.',
  },
  {
    title: 'After launch',
    text: 'Fixes, OS updates and the next version, on terms we agree up front.',
  },
];

export const principles = [
  { title: 'Native, all the way down', text: 'Swift and SwiftUI on every Apple platform. No web views dressed up as apps.' },
  { title: 'Works where the work is', text: 'Hangars, job sites and basements lose signal. My apps keep working offline and sync when they can.' },
  { title: 'Private by default', text: 'Where an app allows it, your data stays on your devices and in your own iCloud, with no ad trackers.' },
];

export const contact = {
  title: 'Tell me what you need built.',
  text: 'Email comes straight to me, and I reply within two business days. A first conversation costs nothing.',
  kinds: ['A custom app for my business', 'A consumer app idea', 'Rescue for an old system', 'Help with one of your apps', 'Something else'],
};
