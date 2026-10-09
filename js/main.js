/* ==========================================================================
   OMNAMHAPROPERTIES — interactions
   ========================================================================== */
(() => {
  'use strict';

  const SITE = window.SITE;
  const PROPS = window.PROPERTIES || [];
  const byId = Object.fromEntries(PROPS.map((p) => [p.id, p]));

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scrollBehavior = () => (reducedMotion.matches ? 'auto' : 'smooth');

  /* ---------- Storage (fails silently in private mode) ---------- */
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
    }
  };

  /* ---------- Formatting helpers ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (name, cls = '') => `<svg class="ic ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const STATUS_LABEL = { sale: 'For Sale', rent: 'For Rent' };
  const TAG_CLASS = {
    'Featured': 'tag--featured',
    'Hot Deal': 'tag--hot',
    'Premium': 'tag--premium',
    'Pre-Leased': 'tag--premium',
    'Brand New': 'tag--new',
    'New Booking': 'tag--new'
  };

  function priceParts(p) {
    const v = p.price;
    if (v >= 1e7) return { num: (v / 1e7).toFixed(2), unit: 'Cr.' };
    if (v >= 1e5) return { num: (v / 1e5).toFixed(2), unit: 'Lakh' };
    return { num: v.toLocaleString('en-IN'), unit: '' };
  }
  function priceHTML(p) {
    const { num, unit } = priceParts(p);
    return `<span class="price-num">₹${num}</span>` +
      (unit ? `<span class="price-slash">/</span><span class="price-unit">${unit}</span>` : '') +
      (p.status === 'rent' ? '<span class="price-per">per month</span>' : '');
  }
  function priceText(p) {
    const { num, unit } = priceParts(p);
    return `₹${num}${unit ? ' ' + unit : ''}${p.status === 'rent' ? ' / month' : ''}`;
  }
  const dateText = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const media = (item) => (item.image ? `<img src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy">` : '');
  const waLink = (msg) => `https://wa.me/${SITE.whatsapp.number}${msg ? '?text=' + encodeURIComponent(msg) : ''}`;
  const enquiry = (p) => `Hi ${SITE.name}, I'm interested in "${p.title}" (${priceText(p)}). Please share more details.`;

  /* ---------- Shared markup ---------- */
  function tagsHTML(p) {
    return `<span class="tag tag--status">${STATUS_LABEL[p.status]}</span>` +
      (p.tags || []).map((t) => `<span class="tag ${TAG_CLASS[t] || 'tag--featured'}">${esc(t)}</span>`).join('');
  }

  function metaHTML(p) {
    const items = [];
    if (p.beds) items.push(`<li title="Bedrooms">${icon('bed')}${p.beds}<span class="visually-hidden"> bedrooms</span></li>`);
    if (p.baths) items.push(`<li title="Bathrooms">${icon('bath')}${p.baths}<span class="visually-hidden"> bathrooms</span></li>`);
    items.push(`<li title="Area">${icon('area')}${p.area.toLocaleString('en-IN')} sq ft</li>`);
    return `<ul class="prop-meta">${items.join('')}</ul>`;
  }

  function actionsHTML(p, extra = '') {
    return `<div class="prop-actions">
      <button type="button" class="act act--fav ${extra}" data-fav="${p.id}" aria-pressed="false" aria-label="Save ${esc(p.title)}" title="Save">${icon('heart')}</button>
      <button type="button" class="act act--cmp ${extra}" data-cmp="${p.id}" aria-pressed="false" aria-label="Compare ${esc(p.title)}" title="Compare">${icon('compare')}</button>
    </div>`;
  }

  function cardHTML(p) {
    return `<article class="prop-card" role="listitem">
      <div class="prop-card__thumb">
        <div class="ph">${media(p)}</div>
        <button type="button" class="thumb-hit" data-view="${p.id}" aria-label="View ${esc(p.title)}"></button>
        <div class="prop-card__tags">${tagsHTML(p)}</div>
        <div class="prop-card__bottom">
          <span class="media-count" title="Photos">${icon('camera')}${p.photos}</span>
          ${actionsHTML(p)}
        </div>
      </div>
      <div class="prop-card__body">
        <h3 class="prop-title"><a href="#p-${p.id}" data-view="${p.id}">${esc(p.title)}</a></h3>
        <p class="prop-addr">${icon('pin')}<span>${esc(p.address)}</span></p>
        <p class="prop-type">${esc(p.type)}</p>
        <div class="prop-price">${priceHTML(p)}</div>
        ${metaHTML(p)}
        <p class="prop-added">${icon('calendar')}Added: ${dateText(p.added)}</p>
      </div>
    </article>`;
  }

  function listCardHTML(p, i) {
    const extraTags = (p.tags || []).map((t) => `<span class="tag ${TAG_CLASS[t] || 'tag--featured'}">${esc(t)}</span>`).join('');
    return `<article class="list-card" style="--i:${i * 0.06}s">
      <div class="list-card__thumb">
        <div class="ph">${media(p)}</div>
        <button type="button" class="thumb-hit" data-view="${p.id}" aria-label="View ${esc(p.title)}"></button>
        <span class="media-count" title="Photos">${icon('camera')}${p.photos}</span>
      </div>
      <div class="list-card__body">
        <div class="list-card__top">
          <div>
            <div class="list-card__tags">
              <span class="tag tag--outline">${STATUS_LABEL[p.status]}</span>${extraTags}
              ${p.floor ? `<span class="floor-label">${esc(p.floor)}</span>` : ''}
            </div>
            <h3 class="prop-title"><a href="#p-${p.id}" data-view="${p.id}">${esc(p.title)}</a></h3>
            <p class="prop-addr">${icon('pin')}<span>${esc(p.address)}</span></p>
          </div>
          <div class="list-card__price">
            <div class="prop-price">${priceHTML(p)}</div>
            <p class="prop-type">${esc(p.type)}</p>
          </div>
        </div>
        <p class="list-card__excerpt">${esc(p.excerpt)}</p>
        ${metaHTML(p)}
        <div class="list-card__bottom">
          <span class="prop-added">${icon('calendar')}Added: ${dateText(p.added)}</span>
          ${actionsHTML(p, 'act--soft')}
        </div>
      </div>
    </article>`;
  }

  /* ---------- Contact details from data.js ---------- */
  function bindContacts() {
    $$('[data-contact]').forEach((el) => {
      const key = el.dataset.contact;
      const label = $('.t', el) || el;
      const keep = 'keep' in el.dataset;
      if (key === 'email') {
        el.href = `mailto:${SITE.email}`;
        if (!keep) label.textContent = SITE.email;
      } else if (key === 'whatsapp') {
        el.href = waLink(`Hi ${SITE.name}, I'd like to know more about your properties.`);
        el.target = '_blank';
        el.rel = 'noopener';
        if (!keep) label.textContent = SITE.whatsapp.display;
      } else if (SITE[key]) {
        el.href = `tel:${SITE[key].tel}`;
        if (!keep) label.textContent = SITE[key].display;
      } else {
        // Number not set in data.js — hide its slot (and a preceding ", ")
        (el.closest('li') || el).hidden = true;
        const sep = el.previousElementSibling;
        if (sep && sep.classList.contains('sep')) sep.hidden = true;
      }
    });

    $$('[data-social]').forEach((el) => {
      const url = SITE.social && SITE.social[el.dataset.social];
      if (url) {
        el.href = url;
        el.target = '_blank';
        el.rel = 'noopener';
      } else {
        el.setAttribute('data-soon', '');
      }
    });

    const g = SITE.google || {};
    if (g.rating) $('#g-rating').textContent = Number(g.rating).toFixed(1);
    if (g.count) $('#g-count').textContent = g.count;
    const write = $('#g-write');
    if (g.reviewUrl) {
      write.href = g.reviewUrl;
      write.target = '_blank';
      write.rel = 'noopener';
    } else {
      write.setAttribute('data-soon', '');
    }

    $('#year').textContent = new Date().getFullYear();
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-show'), 3000);
  }

  /* ==========================================================================
     Favourites & compare
     ========================================================================== */
  const favs = new Set(store.get('gp:favs', []).filter((id) => byId[id]));
  let compare = store.get('gp:compare', []).filter((id) => byId[id]).slice(0, 4);

  function syncButtons() {
    $$('[data-fav]').forEach((b) => {
      const on = favs.has(b.dataset.fav);
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    $$('[data-cmp]').forEach((b) => {
      const on = compare.includes(b.dataset.cmp);
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    const count = $('#saved-count');
    count.textContent = favs.size;
    count.hidden = favs.size === 0;
  }

  function toggleFav(id) {
    const p = byId[id];
    if (!p) return;
    if (favs.has(id)) {
      favs.delete(id);
      toast('Removed from saved properties');
    } else {
      favs.add(id);
      toast('Saved — find it under “Saved” in the property list');
    }
    store.set('gp:favs', [...favs]);
    syncButtons();
    if (listing.filter === 'saved') renderListing();
  }

  function toggleCompare(id) {
    if (!byId[id]) return;
    if (compare.includes(id)) {
      compare = compare.filter((x) => x !== id);
    } else {
      if (compare.length >= 4) {
        compare.shift();
        toast('You can compare up to 4 properties — the oldest one was replaced.');
      }
      compare.push(id);
    }
    store.set('gp:compare', compare);
    renderTray();
    syncButtons();
  }

  function renderTray() {
    const tray = $('#compare-tray');
    const open = compare.length > 0;
    tray.classList.toggle('is-open', open);
    tray.inert = !open;
    document.body.classList.toggle('has-tray', open);
    $('#compare-count').textContent = compare.length;
    $('#compare-chips').innerHTML = compare.map((id) => {
      const p = byId[id];
      return `<span class="chip"><span>${esc(p.locality)} · ${p.beds ? p.beds + ' BHK' : esc(p.type)}</span>
        <button type="button" data-cmp-remove="${id}" aria-label="Remove ${esc(p.title)} from compare">${icon('close')}</button></span>`;
    }).join('');
    const btn = $('#compare-open');
    btn.disabled = compare.length < 2;
    btn.title = compare.length < 2 ? 'Add at least 2 properties to compare' : '';
  }

  /* ---------- Modals ---------- */
  function closeModals() {
    $$('dialog[open]').forEach((d) => d.close());
  }

  function openQuickView(id) {
    const p = byId[id];
    if (!p) return;
    closeModals();
    $('#qv-content').innerHTML = `<div class="qv">
      <div class="qv__media">
        <div class="ph">${media(p)}</div>
        <div class="prop-card__tags">${tagsHTML(p)}</div>
        <span class="media-count">${icon('camera')}${p.photos} photos</span>
      </div>
      <div class="qv__body">
        <p class="prop-type">${esc(p.type)}${p.floor ? ' · ' + esc(p.floor) : ''}</p>
        <h2 class="qv__title" id="qv-title">${esc(p.title)}</h2>
        <p class="prop-addr">${icon('pin')}<span>${esc(p.address)}</span></p>
        <div class="prop-price qv__price">${priceHTML(p)}</div>
        ${metaHTML(p)}
        <p>${esc(p.excerpt)}</p>
        ${p.features && p.features.length ? `<ul class="qv__features">${p.features.map((f) => `<li>${icon('check')}${esc(f)}</li>`).join('')}</ul>` : ''}
        <p class="prop-added">${icon('calendar')}Added: ${dateText(p.added)}</p>
        <div class="qv__btns">
          <a class="btn btn--primary" href="tel:${esc(SITE.office.tel)}">${icon('phone')}Call Now</a>
          <a class="btn btn--wa" href="${waLink(enquiry(p))}" target="_blank" rel="noopener">${icon('whatsapp')}WhatsApp</a>
        </div>
        <div class="qv__secondary">
          <button type="button" class="btn btn--soft" data-fav="${p.id}" aria-pressed="false">${icon('heart')}Save</button>
          <button type="button" class="btn btn--soft" data-cmp="${p.id}" aria-pressed="false">${icon('compare')}Compare</button>
        </div>
      </div>
    </div>`;
    syncButtons();
    const dlg = $('#qv-modal');
    dlg.showModal();
    dlg.scrollTop = 0;
    history.replaceState(null, '', `#p-${p.id}`);
  }

  function openCompare() {
    const list = compare.map((id) => byId[id]);
    if (list.length < 2) return;
    closeModals();
    const rows = [
      ['Price', (p) => priceText(p)],
      ['Status', (p) => STATUS_LABEL[p.status]],
      ['Type', (p) => p.type],
      ['Bedrooms', (p) => p.beds || '—'],
      ['Bathrooms', (p) => p.baths || '—'],
      ['Area', (p) => `${p.area.toLocaleString('en-IN')} sq ft`],
      ['Floor', (p) => p.floor || '—'],
      ['Location', (p) => p.address],
      ['Added', (p) => dateText(p.added)]
    ];
    $('#compare-content').innerHTML = `<div class="compare-wrap">
      <h2 id="compare-title">Compare Properties</h2>
      <div class="table-scroll">
        <table class="compare-table">
          <thead><tr>
            <td></td>
            ${list.map((p) => `<th scope="col"><div class="ct-thumb"><div class="ph">${media(p)}</div></div><a href="#p-${p.id}" data-view="${p.id}">${esc(p.title)}</a></th>`).join('')}
          </tr></thead>
          <tbody>
            ${rows.map(([label, fn]) => `<tr><th scope="row">${label}</th>${list.map((p) => `<td>${esc(fn(p))}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
    $('#compare-modal').showModal();
  }

  function initModals() {
    $$('dialog.modal').forEach((dlg) => {
      dlg.addEventListener('click', (e) => {
        if (e.target === dlg || e.target.closest('[data-close]')) dlg.close();
      });
      dlg.addEventListener('close', () => {
        if (location.hash.startsWith('#p-')) history.replaceState(null, '', location.pathname + location.search);
      });
    });
    $('#compare-open').addEventListener('click', openCompare);
    $('#compare-clear').addEventListener('click', () => {
      compare = [];
      store.set('gp:compare', compare);
      renderTray();
      syncButtons();
    });

    // Deep link: index.html#p-<id> opens that property
    const openFromHash = () => {
      const match = location.hash.match(/^#p-(.+)$/);
      if (match && byId[match[1]]) openQuickView(match[1]);
    };
    window.addEventListener('hashchange', openFromHash);
    openFromHash();
  }

  /* ==========================================================================
     Carousels (scroll-snap tracks with looping arrows)
     ========================================================================== */
  function initCarousel(root) {
    const track = $('[data-track]', root);
    const prev = $('[data-prev]', root);
    const next = $('[data-next]', root);
    if (!track) return;

    const step = () => {
      const first = track.children[0];
      if (!first) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return first.getBoundingClientRect().width + gap;
    };
    const atStart = () => track.scrollLeft <= 4;
    const atEnd = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;

    prev && prev.addEventListener('click', () => {
      if (atStart()) track.scrollTo({ left: track.scrollWidth, behavior: scrollBehavior() });
      else track.scrollBy({ left: -step(), behavior: scrollBehavior() });
    });
    next && next.addEventListener('click', () => {
      if (atEnd()) track.scrollTo({ left: 0, behavior: scrollBehavior() });
      else track.scrollBy({ left: step(), behavior: scrollBehavior() });
    });

    const update = () => root.classList.toggle('no-overflow', track.scrollWidth <= track.clientWidth + 4);
    new ResizeObserver(update).observe(track);
    update();
  }

  /* ==========================================================================
     Featured slider
     ========================================================================== */
  function initFeatured() {
    const root = $('#featured');
    const items = PROPS.filter((p) => p.featured);
    const n = items.length;
    if (!root || !n) {
      if (root) root.hidden = true;
      return;
    }

    const stage = $('.featured__main', root);
    const content = $('.featured__content', root);
    const dots = $('.featured__dots', root);
    const thumbs = $('.featured__thumbs-list', root);
    $('#featured-count').textContent = n;
    dots.innerHTML = items.map((p) => `<button type="button" aria-label="Show ${esc(p.title)}"></button>`).join('');

    let index = 0;
    let timer = null;
    let swapTimer = null;
    let inView = false;
    let hovering = false;

    function fill() {
      const p = items[index];
      stage.innerHTML = `<div class="ph">${media(p)}</div>
        <button type="button" class="thumb-hit" data-view="${p.id}" aria-label="View ${esc(p.title)}"></button>
        <span class="media-count">${icon('camera')}${p.photos}</span>
        ${actionsHTML(p)}`;

      const metaBoxes = [];
      if (p.beds) metaBoxes.push(`<li class="meta-box" title="Bedrooms">${icon('bed')}${p.beds}<span class="visually-hidden"> bedrooms</span></li>`);
      if (p.baths) metaBoxes.push(`<li class="meta-box" title="Bathrooms">${icon('bath')}${p.baths}<span class="visually-hidden"> bathrooms</span></li>`);
      metaBoxes.push(`<li class="meta-box" title="Area">${icon('area')}${p.area.toLocaleString('en-IN')} sq ft</li>`);

      content.innerHTML = `<div class="featured__tags">${tagsHTML(p)}</div>
        <h3 class="featured__title"><a href="#p-${p.id}" data-view="${p.id}">${esc(p.title)}</a></h3>
        <p class="prop-addr">${icon('pin')}<span>${esc(p.address)}</span></p>
        <ul class="featured__meta">${metaBoxes.join('')}</ul>
        <div class="prop-price featured__price">${priceHTML(p)}</div>
        <p class="featured__excerpt">${esc(p.excerpt)}</p>
        <div class="featured__btns">
          <button type="button" class="btn btn--primary" data-view="${p.id}">View Details ${icon('arrow')}</button>
          <a class="btn btn--outline" href="${waLink(enquiry(p))}" target="_blank" rel="noopener">${icon('whatsapp')}Enquire Now</a>
        </div>`;

      $$('button', dots).forEach((b, i) => b.setAttribute('aria-current', String(i === index)));

      const upcoming = [];
      for (let k = 1; k <= Math.min(3, n - 1); k++) upcoming.push((index + k) % n);
      thumbs.innerHTML = upcoming.map((i) => {
        const t = items[i];
        return `<button type="button" class="thumb-btn" data-go="${i}" aria-label="Show ${esc(t.title)}">
          <span class="ph">${media(t)}</span><span class="thumb-cap">${esc(t.locality)}</span></button>`;
      }).join('');
      syncButtons();
    }

    function go(i, fromUser) {
      const target = (i + n) % n;
      if (target === index) return;
      index = target;
      content.setAttribute('aria-live', fromUser ? 'polite' : 'off');
      clearTimeout(swapTimer);
      if (reducedMotion.matches) {
        fill();
      } else {
        root.classList.add('is-switching');
        swapTimer = setTimeout(() => {
          fill();
          root.classList.remove('is-switching');
        }, 280);
      }
      if (fromUser) restart();
    }

    function stop() { clearInterval(timer); timer = null; }
    function start() {
      stop();
      if (reducedMotion.matches || n < 2 || !inView || hovering || document.hidden) return;
      timer = setInterval(() => go(index + 1, false), 6500);
    }
    const restart = () => start();

    $('[data-fprev]', root).addEventListener('click', () => go(index - 1, true));
    $('[data-fnext]', root).addEventListener('click', () => go(index + 1, true));
    dots.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (b) go($$('button', dots).indexOf(b), true);
    });
    thumbs.addEventListener('click', (e) => {
      const b = e.target.closest('[data-go]');
      if (b) go(Number(b.dataset.go), true);
    });
    root.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea, select')) return;
      if (e.key === 'ArrowRight') go(index + 1, true);
      if (e.key === 'ArrowLeft') go(index - 1, true);
    });

    // Touch swipe on the main image
    let touchX = null;
    stage.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1), true);
    });

    // Autoplay only while visible and not being interacted with
    root.addEventListener('mouseenter', () => { hovering = true; stop(); });
    root.addEventListener('mouseleave', () => { hovering = false; start(); });
    root.addEventListener('focusin', () => { hovering = true; stop(); });
    root.addEventListener('focusout', (e) => {
      if (!root.contains(e.relatedTarget)) { hovering = false; start(); }
    });
    document.addEventListener('visibilitychange', start);
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      start();
    }, { threshold: 0.35 }).observe(root);

    fill();
  }

  /* ==========================================================================
     Listing: filter, search, sort, paginate
     ========================================================================== */
  const listing = { filter: 'all', q: '', sort: 'newest', page: 1, perPage: 4 };

  // Common local short forms people type when searching
  const ALIASES = [
    [/greater kailash 1/i, 'gk1 gk-1 gk 1 gk'],
    [/greater kailash 2/i, 'gk2 gk-2 gk 2 gk'],
    [/greater kailash/i, 'gk'],
    [/east of kailash/i, 'eok'],
    [/chittaranjan park/i, 'cr park crpark'],
    [/defence colony/i, 'def col'],
    [/lajpat nagar/i, 'ln']
  ];
  const aliasText = (p) => ALIASES.filter(([re]) => re.test(p.address)).map(([, words]) => words).join(' ');

  function filteredProps() {
    let list = PROPS.slice();
    if (listing.filter === 'sale' || listing.filter === 'rent') list = list.filter((p) => p.status === listing.filter);
    if (listing.filter === 'saved') list = list.filter((p) => favs.has(p.id));

    const tokens = listing.q.toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length) {
      list = list.filter((p) => {
        const hay = [p.title, p.address, p.locality, p.type, STATUS_LABEL[p.status], p.beds ? `${p.beds} bhk ${p.beds}bhk` : '', aliasText(p), ...(p.tags || [])].join(' ').toLowerCase();
        return tokens.every((t) => hay.includes(t));
      });
    }

    if (listing.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (listing.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => b.added.localeCompare(a.added));
    return list;
  }

  function renderListing() {
    const list = filteredProps();
    const pages = Math.max(1, Math.ceil(list.length / listing.perPage));
    listing.page = Math.min(Math.max(1, listing.page), pages);
    const slice = list.slice((listing.page - 1) * listing.perPage, listing.page * listing.perPage);
    const el = $('#listing');

    if (!slice.length) {
      const savedEmpty = listing.filter === 'saved' && !listing.q;
      el.innerHTML = `<div class="empty-state">
        ${icon(savedEmpty ? 'heart' : 'search')}
        <h3>${savedEmpty ? 'No saved properties yet' : 'No properties match your search'}</h3>
        <p>${savedEmpty ? 'Tap the heart on any property to save it here.' : 'Try a different locality, BHK or filter.'}</p>
        <button type="button" class="btn btn--outline" data-reset-listing>Show all properties</button>
      </div>`;
    } else {
      el.innerHTML = slice.map((p, i) => listCardHTML(p, i)).join('');
    }

    $('#result-count').textContent = list.length;
    const labels = {
      all: 'properties for sale and rent in South Delhi',
      sale: 'properties for sale in South Delhi',
      rent: 'properties for rent in South Delhi',
      saved: 'saved properties'
    };
    $('#result-label').textContent = list.length === 1 ? labels[listing.filter].replace('properties', 'property') : labels[listing.filter];

    $$('.seg [data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === listing.filter)));
    renderPagination(pages);
    syncButtons();
  }

  function renderPagination(pages) {
    const pg = $('#pagination');
    if (pages <= 1) {
      pg.innerHTML = '';
      return;
    }
    const btn = (label, page, aria, current) =>
      `<button type="button" data-page="${page}" aria-label="${aria}"${current ? ' aria-current="page"' : ''}>${label}</button>`;
    let html = '';
    if (listing.page > 1) html += btn('First', 1, 'First page') + btn('Prev', listing.page - 1, 'Previous page');
    for (let i = 1; i <= pages; i++) html += btn(i, i, `Page ${i}`, i === listing.page);
    if (listing.page < pages) html += btn('Next', listing.page + 1, 'Next page') + btn('Last', pages, 'Last page');
    pg.innerHTML = html;
  }

  function scrollToListing() {
    const section = $('#properties');
    const top = section.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * 0.5) section.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  }

  function setFilter(filter, { scroll = false } = {}) {
    listing.filter = filter;
    listing.page = 1;
    renderListing();
    if (scroll) $('#properties').scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  }

  function initListing() {
    $$('.seg [data-filter]').forEach((b) => b.addEventListener('click', () => setFilter(b.dataset.filter)));

    const search = $('#listing-search');
    let debounce;
    search.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        listing.q = search.value.trim();
        listing.page = 1;
        renderListing();
      }, 200);
    });

    $('#listing-sort').addEventListener('change', (e) => {
      listing.sort = e.target.value;
      listing.page = 1;
      renderListing();
    });

    $('#pagination').addEventListener('click', (e) => {
      const b = e.target.closest('[data-page]');
      if (!b) return;
      listing.page = Number(b.dataset.page);
      renderListing();
      scrollToListing();
    });

    $('#listing').addEventListener('click', (e) => {
      if (!e.target.closest('[data-reset-listing]')) return;
      listing.q = '';
      search.value = '';
      setFilter('all');
    });

    $('#footer-search').addEventListener('submit', (e) => {
      e.preventDefault();
      const q = $('#footer-q').value.trim();
      listing.q = q;
      search.value = q;
      setFilter('all', { scroll: true });
    });

    renderListing();
  }

  /* ==========================================================================
     Static sections rendered from data
     ========================================================================== */
  function renderLatest() {
    const latest = PROPS.slice().sort((a, b) => b.added.localeCompare(a.added)).slice(0, 10);
    $('#latest-track').innerHTML = latest.map(cardHTML).join('');
  }

  function starsHTML(n) {
    return `<div class="stars" role="img" aria-label="Rated ${n} out of 5">${Array.from({ length: 5 }, (_, i) => icon('star', 'ic--fill' + (i < n ? '' : ' is-off'))).join('')}</div>`;
  }

  function renderReviews() {
    const reviews = window.REVIEWS || [];
    $('#reviews-track').innerHTML = reviews.map((r) => `<article class="review-card" role="listitem">
      <div class="review-head">
        <span class="avatar">${icon('user')}</span>
        <div><b>${esc(r.name)}</b><small>${esc(r.date)}</small></div>
        <span class="review-g" aria-label="Google review">G</span>
      </div>
      ${starsHTML(r.rating)}
      <p class="review-text">${esc(r.text)}</p>
      ${r.text.length > 170 ? '<button type="button" class="read-more" aria-expanded="false">Read more</button>' : ''}
    </article>`).join('');

    $('#reviews-track').addEventListener('click', (e) => {
      const b = e.target.closest('.read-more');
      if (!b) return;
      const card = b.closest('.review-card');
      const open = card.classList.toggle('is-expanded');
      b.textContent = open ? 'Read less' : 'Read more';
      b.setAttribute('aria-expanded', String(open));
    });
  }

  function renderTestimonials() {
    const items = window.TESTIMONIALS || [];
    $('#testimonials-track').innerHTML = items.map((t) => `<article class="t-card" role="listitem">
      <div class="t-card__top">${icon('quote', 'ic--fill t-quote')}${starsHTML(5)}</div>
      <p class="t-text">${esc(t.text)}</p>
      <div class="t-author">
        <span class="avatar">${icon('user')}</span>
        <div><b>${esc(t.name)}</b><small>${esc(t.role)}</small></div>
      </div>
    </article>`).join('');
  }

  function renderBlogs() {
    const posts = window.BLOGS || [];
    $('#blog-grid').innerHTML = posts.map((b, i) => `<article class="blog-card" data-reveal style="--d:${i * 0.08}s">
      <div class="blog-card__thumb"><div class="ph">${media(b)}</div><span class="tag tag--status">${esc(b.category)}</span></div>
      <div class="blog-card__body">
        <p class="prop-added">${icon('calendar')}${dateText(b.date)}</p>
        <h3>${esc(b.title)}</h3>
        <p>${esc(b.excerpt)}</p>
        <a href="#blogs" class="link-arrow" data-soon>Read More ${icon('arrow')}<span class="visually-hidden"> about ${esc(b.title)}</span></a>
      </div>
    </article>`).join('');
  }

  /* ==========================================================================
     Header: sticky shadow, mobile menu, scroll-spy
     ========================================================================== */
  function initHeader() {
    const header = $('.site-header');
    const nav = $('#main-nav');
    const toggle = $('.nav-toggle');
    const toTop = $('#to-top');
    const waFab = $('.fab--wa');
    const page = $('.page');
    const links = $$('[data-spy]', nav);
    const spyTargets = ['about', 'properties', 'blogs'].map((id) => ({ id, el: document.getElementById(id) }));

    const setMenu = (open) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
    });
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('is-open') && !header.contains(e.target)) setMenu(false);
    });

    let ticking = false;
    let lastActive = null;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 8);
      toTop.classList.toggle('is-show', y > 700);
      waFab.classList.toggle('is-show', y > 300);

      const line = window.innerHeight * 0.4;
      let active = 'home';
      if (page.getBoundingClientRect().bottom < window.innerHeight * 0.6) {
        active = 'contact';
      } else {
        spyTargets.forEach(({ id, el }) => {
          const r = el.getBoundingClientRect();
          if (r.top <= line && r.bottom > line) active = id;
        });
      }
      if (active === lastActive) return;
      lastActive = active;
      links.forEach((a) => {
        const on = a.dataset.spy === active;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();

    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: scrollBehavior() }));
  }

  /* ==========================================================================
     Footer reveal fallback
     The parallax overlap runs in CSS (scroll-driven animations). Browsers
     without that support get a simple fade-up on the footer blocks instead.
     ========================================================================== */
  function initFooterFallback() {
    if (window.CSS && CSS.supports('animation-timeline', 'view()')) return;
    $$('.footer-cta, .footer-main, .footer-bottom').forEach((el, i) => {
      el.setAttribute('data-reveal', '');
      el.style.setProperty('--d', `${i * 0.08}s`);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const els = $$('[data-reveal]');
    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Callback form → WhatsApp ---------- */
  function initCallbackForm() {
    const form = $('#callback-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const lines = [
        `Hi ${SITE.name}, please call me back.`,
        `Name: ${data.get('name').trim()}`,
        `Phone: ${data.get('phone').trim()}`,
        `Looking to: ${data.get('intent')}`
      ];
      const locality = data.get('locality').trim();
      const message = data.get('message').trim();
      if (locality) lines.push(`Preferred locality: ${locality}`);
      if (message) lines.push(`Requirement: ${message}`);
      window.open(waLink(lines.join('\n')), '_blank', 'noopener');
      form.reset();
      toast('Opening WhatsApp with your details…');
    });
  }

  /* ---------- Global click delegation ---------- */
  function initDelegation() {
    document.addEventListener('click', (e) => {
      const fav = e.target.closest('[data-fav]');
      if (fav) { e.preventDefault(); toggleFav(fav.dataset.fav); return; }

      const cmp = e.target.closest('[data-cmp]');
      if (cmp) { e.preventDefault(); toggleCompare(cmp.dataset.cmp); return; }

      const rm = e.target.closest('[data-cmp-remove]');
      if (rm) { toggleCompare(rm.dataset.cmpRemove); return; }

      const view = e.target.closest('[data-view]');
      if (view) { e.preventDefault(); openQuickView(view.dataset.view); return; }

      const filterLink = e.target.closest('[data-filter-link]');
      if (filterLink) {
        e.preventDefault();
        listing.q = '';
        $('#listing-search').value = '';
        setFilter(filterLink.dataset.filterLink, { scroll: true });
        return;
      }

      const soon = e.target.closest('[data-soon]');
      if (soon) { e.preventDefault(); toast('This page is coming soon.'); }
    });
  }

  /* ---------- Boot ---------- */
  bindContacts();
  renderLatest();
  renderReviews();
  renderTestimonials();
  renderBlogs();
  $$('[data-carousel]').forEach(initCarousel);
  initFeatured();
  initListing();
  renderTray();
  initDelegation();
  initModals();
  initHeader();
  initFooterFallback();
  initCallbackForm();
  initReveal();
})();
