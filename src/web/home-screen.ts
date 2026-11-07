interface HomeScreenIdentity {
  name: string;
  icon?: string;
  id: string;
  startURL: string;
  scope: string;
  themeColor: string;
}

let currentIdentity = '';
let generation = 0;

function meta(name: string, content: string) {
  const element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`) ?? document.createElement('meta');
  element.name = name; element.content = content;
  if (!element.isConnected) document.head.append(element);
}

/** Reuse authored artwork; the manifest lives in the page, not in another file. */
export function setHomeScreenIdentity(identity: HomeScreenIdentity) {
  const revision = JSON.stringify(identity);
  if (revision === currentIdentity) return;
  currentIdentity = revision;
  const update = ++generation;
  meta('application-name', identity.name);
  meta('apple-mobile-web-app-title', identity.name);
  document.head.querySelector('link[rel="manifest"]')?.remove();
  document.head.querySelector('link[rel="apple-touch-icon"]')?.remove();
  // Incomplete drafts stay playable, but have no install icon or manifest.
  if (!identity.icon) return;
  const touchIcon = document.createElement('link');
  touchIcon.rel = 'apple-touch-icon'; touchIcon.href = identity.icon;
  document.head.append(touchIcon);
  const image = new Image(); image.src = identity.icon;
  void image.decode().then(() => {
    if (generation !== update) return;
    const manifest = document.createElement('link'); manifest.rel = 'manifest';
    // data: has no directory against which to resolve relative URLs. Every URL
    // here is absolute, including the stable identity and the navigation scope.
    manifest.href = 'data:application/manifest+json,' + encodeURIComponent(JSON.stringify({
      id: identity.id, name: identity.name, short_name: identity.name,
      start_url: identity.startURL, scope: identity.scope, display: 'standalone',
      theme_color: identity.themeColor, background_color: identity.themeColor,
      icons: [{src: identity.icon, sizes: `${image.naturalWidth}x${image.naturalHeight}`, purpose: 'any'}],
    }));
    document.head.append(manifest);
  }).catch(() => { /* Invalid draft artwork needs no substitute installation identity. */ });
}

/** Both paths report the current window, never another tab's installation. */
export function observeStandalone(update: (standalone: boolean) => void) {
  const mode = matchMedia('(display-mode: standalone)');
  const refresh = () => update(mode.matches || (navigator as Navigator & {standalone?: boolean}).standalone === true);
  mode.addEventListener('change', refresh);
  window.addEventListener('pageshow', refresh);
  refresh();
}

export function addStoryHome(app: HTMLElement, catalogueURL: string) {
  const requested = new URL(location.href).searchParams.get('home') === 'show';
  const home = document.createElement('a');
  home.className = 'story-home'; home.href = catalogueURL;
  home.setAttribute('aria-label', 'Home'); home.title = 'Home';
  home.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 9-8 9 8M5 9v12h5v-7h4v7h5V9"/></svg>';
  observeStandalone(standalone => {
    if (requested && standalone) { if (!home.isConnected) app.append(home); }
    else home.remove();
  });
}
