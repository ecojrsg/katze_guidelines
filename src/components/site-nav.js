export const NAV_ITEMS = [
  { id: 'home', label: 'Inicio', href: './index.html' },
  { id: 'diseno', label: 'Diseño', href: './diseno.html' },
  { id: 'componentes', label: 'Componentes', href: './componentes.html' },
  { id: 'brand', label: 'Brand Knowledge', href: './brand.html' },
  { id: 'slides', label: 'Slides', href: './slides.html' },
];

const headerAbortMap = new WeakMap();

function buildNavLinksHtml(activePage) {
  return NAV_ITEMS.map((item) => {
    const isActive = item.id === activePage;
    const activeAttrs = isActive ? ' class="is-active" aria-current="page"' : '';
    return `<a href="${item.href}"${activeAttrs}>${item.label}</a>`;
  }).join('');
}

function buildHeaderHtml(activePage) {
  const linksHtml = buildNavLinksHtml(activePage);
  return `
    <div class="wrap v3-header-inner">
      <a href="./index.html" class="v3-brand">
        <img src="./assets/katze-logo-purple.png" alt="Katze" width="28" height="28" />
        <span class="v3-brand-name">Katze</span>
        <span class="v3-brand-sep">Brand Guideline</span>
      </a>
      <nav class="v3-nav" aria-label="Navegación principal">
        ${linksHtml}
      </nav>
      <button
        type="button"
        class="v3-nav-toggle"
        data-nav-toggle
        aria-expanded="false"
        aria-controls="site-mobile-drawer"
        aria-label="Abrir menú de navegación"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <span>Menú</span>
      </button>
    </div>
    <div class="v3-mobile-drawer" id="site-mobile-drawer" data-nav-drawer hidden>
      <nav class="wrap v3-mobile-nav" aria-label="Navegación móvil">
        ${linksHtml}
      </nav>
    </div>
  `;
}

function buildFooterHtml(activePage) {
  const linksHtml = buildNavLinksHtml(activePage);
  return `
    <div class="wrap v3-footer-inner">
      <div class="v3-footer-brand">
        <a href="./index.html" class="v3-brand">
          <img src="./assets/katze-logo-purple.png" alt="Katze" width="24" height="24" />
          <span class="v3-brand-name">Katze</span>
        </a>
        <p class="v3-footer-slogan">Convertimos tecnología en resultados.</p>
        <span class="v3-odoo-badge">Odoo Ready Partner</span>
      </div>
      <div class="v3-footer-links">
        <nav class="v3-footer-nav" aria-label="Páginas del sistema de marca">
          ${linksHtml}
        </nav>
        <p class="v3-footer-meta mono">Sistema Graphite · 0% #000000 · HTML / CSS / JS</p>
      </div>
    </div>
  `;
}

function setDrawerState(toggle, drawer, open) {
  drawer.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute(
    'aria-label',
    open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
  );
}

function bindMobileNavToggle(header) {
  headerAbortMap.get(header)?.abort();
  const controller = new AbortController();
  headerAbortMap.set(header, controller);

  const toggle = header.querySelector('[data-nav-toggle]');
  const drawer = header.querySelector('[data-nav-drawer]');
  if (!toggle || !drawer) return;

  const closeDrawer = (restoreFocus = false) => {
    if (drawer.hidden) return;
    setDrawerState(toggle, drawer, false);
    if (restoreFocus) toggle.focus();
  };

  toggle.addEventListener(
    'click',
    () => {
      const nextOpen = drawer.hidden;
      setDrawerState(toggle, drawer, nextOpen);
    },
    { signal: controller.signal }
  );

  drawer.addEventListener(
    'click',
    (event) => {
      if (event.target.closest('a')) {
        closeDrawer(false);
      }
    },
    { signal: controller.signal }
  );

  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape') {
        closeDrawer(true);
      }
    },
    { signal: controller.signal }
  );

  document.addEventListener(
    'click',
    (event) => {
      if (!header.contains(event.target)) {
        closeDrawer(false);
      }
    },
    { signal: controller.signal }
  );

  const desktopQuery = window.matchMedia?.('(min-width: 901px)');
  desktopQuery?.addEventListener?.(
    'change',
    (event) => {
      if (event.matches) closeDrawer(false);
    },
    { signal: controller.signal }
  );
}

export function mountSiteNav(activePage) {
  const page = activePage || document.body.dataset.page || 'home';
  let header = document.querySelector('[data-site-header]');
  if (!header) {
    header = document.createElement('header');
    header.className = 'v3-header';
    header.setAttribute('data-site-header', '');
    document.body.prepend(header);
  }
  header.innerHTML = buildHeaderHtml(page);
  bindMobileNavToggle(header);
  return header;
}

export function mountSiteFooter(activePage) {
  const page = activePage || document.body.dataset.page || 'home';
  let footer = document.querySelector('[data-site-footer]');
  if (!footer) {
    footer = document.createElement('footer');
    footer.className = 'v3-footer';
    footer.setAttribute('data-site-footer', '');
    document.body.append(footer);
  }
  footer.innerHTML = buildFooterHtml(page);
  return footer;
}
