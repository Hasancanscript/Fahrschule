(() => {
  'use strict';
  const originalFetch = window.fetch.bind(window);
  const BASE = '/Fahrschule';
  const pathname = value => value === BASE ? '/' : value.startsWith(BASE + '/') ? value.slice(BASE.length) : value;
  const snapshots = { '/api/public/offers': '/preview-data/offers.json', '/api/gifts/settings': '/preview-data/gifts.json', '/api/vku': '/preview-data/vku.json', '/api/nothelferkurs': '/preview-data/nothelferkurs.json' };
  const french = () => { try { return localStorage.getItem('lang') === 'fr'; } catch { return false; } };
  const message = () => french() ? 'Aperçu du site. Les réservations, commandes et connexions sont désactivées.' : 'Websitevorschau. Buchungen, Bestellungen und Anmeldung sind deaktiviert.';
  function notice() { const node = document.getElementById('preview-notice'); if (node) { node.textContent = message(); node.setAttribute('role','status'); } }
  window.fetch = (input, options = {}) => {
    const url = new URL(typeof input === 'string' || input instanceof URL ? String(input) : input.url, location.href);
    const localPath = pathname(url.pathname);
    const method = (options.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
    if (url.origin === location.origin && localPath.startsWith('/api/')) {
      if (method === 'GET' && snapshots[localPath]) return originalFetch(BASE + snapshots[localPath], {signal: options.signal});
      if (method === 'GET' && localPath === '/api/auth/session') return Promise.resolve(new Response('null', {status:200,headers:{'Content-Type':'application/json'}}));
      return Promise.resolve(new Response(JSON.stringify({error: message()}), {status:405,headers:{'Content-Type':'application/json'}}));
    }
    if (url.origin === location.origin && (url.searchParams.has('_rsc') || new Headers(options.headers || (input instanceof Request ? input.headers : {})).get('rsc') === '1')) return Promise.resolve(new Response(null,{status:204}));
    return originalFetch(input,options);
  };
  document.addEventListener('submit', event => { event.preventDefault(); event.stopImmediatePropagation(); notice(); }, true);
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href]');
    if (!anchor || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
    const url = new URL(anchor.href,location.href);
    if (url.origin !== location.origin || url.pathname.startsWith('/_next/') || /\.[a-z0-9]+$/i.test(url.pathname)) return;
    if (url.pathname === location.pathname && url.hash) return;
    event.preventDefault(); event.stopImmediatePropagation();
    const route = pathname(url.pathname);
    location.assign(route.startsWith('/admin') || route.startsWith('/booking') ? BASE + '/vorschau/' : BASE + (route === '/' ? '/' : route) + url.search + url.hash);
  }, true);
  function mount() {
    const node=document.createElement('aside');node.id='preview-notice';node.textContent=message();
    node.style.cssText='position:fixed;bottom:12px;left:12px;max-width:calc(100vw - 100px);z-index:9999;background:#10283a;color:#fff;padding:9px 14px;border-radius:12px;font:12px/1.5 system-ui;box-shadow:0 3px 15px #0002;pointer-events:none';
    document.body.append(node);setInterval(()=>{if(node.getAttribute('role')!=='status')node.textContent=message()},1000);
  }
  window.addEventListener('load',()=>setTimeout(mount,1000),{once:true});
})();
