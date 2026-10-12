// Global motion for the site: runs once on the client, before the first page initializes.
// Page-level effects register through onPage() inside their own modules.
import { setupLaunch } from './launch';
import { setupFrame } from './frame';
import { setupMenu } from './menu';
import { setupSite } from './site';
import { setupApp } from './app';
import { setupHome } from './home';

export function setupMotion() {
  setupLaunch();
  setupFrame();
  setupMenu();
  setupSite();
  setupApp();
  setupHome();
}
