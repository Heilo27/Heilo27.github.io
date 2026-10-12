import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://heiloprojects.com',
  integrations: [
    sitemap({ filter: (page) => !/\/(skylog|pantrychef)\/?$/.test(page) }),
  ],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  // 'preserve' keeps the URLs the App Store already links to: /stripes/privacy.html, /stripes/support.html.
  build: { format: 'preserve', inlineStylesheets: 'auto' },
  trailingSlash: 'ignore',
});
