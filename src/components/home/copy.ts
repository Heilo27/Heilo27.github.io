// Home-only strings: section headings and UI lines that appear once, on the home page.
// Studio content (hero, facts, offers, process, principles, contact) lives in src/data/site.ts.
export const meta = {
  title: 'HeiloProjects: native Apple apps, designed and built by Ryan Primeau',
  description:
    'Hire Ryan Primeau to design and build your native iPhone, iPad or Mac app. Ten apps shipped to the App Store, from the first spec to review.',
};

export const heroUi = {
  start: 'Start a project',
  see: 'See the apps',
  slot: 'Your app',
  gridLabel: 'Apps I have built',
};

export const factsUi = { heading: 'In numbers' };

export const appsUi = {
  heading: 'The apps',
  intro: 'Each one opens to its own page with real screens, prices and support.',
  cols: { name: 'App', category: 'What it does', platforms: 'Runs on', status: 'Status' },
};

export const offersUi = {
  heading: 'What I build',
  intro: 'Four kinds of work, each with apps you can open and judge for yourself.',
  proof: 'Built this way',
};

export const processUi = { heading: 'How a project runs' };

export const principlesUi = { heading: 'How I build' };

export const contactUi = {
  fields: { name: 'Your name', email: 'Your email', kind: 'What do you need?', details: 'Tell me about it' },
  hints: { details: 'The problem, who uses it, and any deadline. A few sentences is plenty.' },
  errors: {
    name: 'Add your name so I know who is writing.',
    email: 'Add an email address I can reply to, like name@company.com.',
    details: 'A sentence or two about the project, please.',
  },
  submit: 'Write the email',
  note: 'Opens your mail app with the message filled in. Nothing is sent until you press send.',
  direct: 'Or write directly to',
  subject: 'New project',
};
