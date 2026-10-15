/* ==========================================================================
   OMNAMHAPROPERTIES — interactions
   ========================================================================== */
(() => {
  'use strict';

  const SITE = window.SITE;
  const PROPS = window.PROPERTIES || [];
  const MEDIA = window.PROPERTY_MEDIA || {};
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
  const statusLabel = (p) => STATUS_LABEL[p.status] || 'Available';
  const TAG_CLASS = {
    'Brand New': 'tag--new',
    'Fully Furnished': 'tag--premium',
    'Terrace': 'tag--featured',
    'Corner': 'tag--hot'
  };

  function priceParts(p) {
    const v = p.price;
    if (v >= 1e7) return { num: (v / 1e7).toFixed(2), unit: 'Cr.' };
    if (v >= 1e5) return { num: (v / 1e5).toFixed(2), unit: 'Lakh' };
    return { num: v.toLocaleString('en-IN'), unit: '' };
  }
  function priceHTML(p) {
    if (p.price == null) return '<span class="price-num price-num--ask">Price on Request</span>';
    const { num, unit } = priceParts(p);
    return `<span class="price-num">₹${num}</span>` +
      (unit ? `<span class="price-slash">/</span><span class="price-unit">${unit}</span>` : '') +
      (p.status === 'rent' ? '<span class="price-per">per month</span>' : '') +
      (p.priceNote ? `<span class="price-note">${esc(p.priceNote)}</span>` : '');
  }
  function priceText(p) {
    if (p.price == null) return 'Price on request';
    const { num, unit } = priceParts(p);
    return `₹${num}${unit ? ' ' + unit : ''}${p.status === 'rent' ? ' / month' : ''}${p.priceNote ? ' ' + p.priceNote : ''}`;
  }
  const dateText = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const typeLine = (p) => `${esc(p.type)}${p.floor ? ` · ${esc(p.floor)}` : ''}`;
  const waLink = (msg) => `https://wa.me/${SITE.whatsapp.number}${msg ? '?text=' + encodeURIComponent(msg) : ''}`;
  const enquiry = (p) => `Hi ${SITE.name}, I'm interested in "${p.title}" (${priceText(p)}). Please share more details.`;

  /* ---------- Property media (listed in js/media.js) ---------- */
  const photosOf = (p) => (MEDIA[p.id] && MEDIA[p.id].photos) || [];
  const videoOf = (p) => (MEDIA[p.id] && MEDIA[p.id].video) || null;

  function imgHTML(photo, { size = 'sm', alt = '', eager = false } = {}) {
    return `<img class="ph-img" src="${photo.src}-${size}.webp" alt="${esc(alt)}" width="${photo.w}" height="${photo.h}" loading="${eager ? 'eager' : 'lazy'}" decoding="async">`;
  }

  // Cover photo on its dominant colour, or a designed "photos on request" panel
  function coverHTML(p, opts = {}) {
    const photo = photosOf(p)[0];
    if (!photo) {
      return `<div class="ph ph--empty"><svg class="logo-mark" aria-hidden="true"><use href="#i-logo"/></svg><span>Photos on request</span></div>`;
    }
    return `<div class="ph" style="--c:${photo.color}">${imgHTML(photo, { alt: p.title, ...opts })}</div>`;
  }

  function mediaCountHTML(p) {
    const n = photosOf(p).length;
    if (!n) return '';
    const video = videoOf(p);
    return `<span class="media-count" title="${n} photos${video ? ' and a video tour' : ''}">${icon('camera')}${n}` +
      (video ? `<span class="media-count__sep"></span>${icon('play', 'ic--fill')}` : '') + '</span>';
  }

  function scrubBarsHTML(p) {
    const n = Math.min(5, photosOf(p).length);
    if (n < 2) return '';
    return `<div class="scrub-bars" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<i${i ? '' : ' class="is-on"'}></i>`).join('')}</div>`;
  }

  /* ---------- Shared markup ---------- */
  const extraTagsHTML = (p) => (p.tags || []).map((t) => `<span class="tag ${TAG_CLASS[t] || 'tag--featured'}">${esc(t)}</span>`).join('');
  const tagsHTML = (p) => `<span class="tag tag--status">${statusLabel(p)}</span>${extraTagsHTML(p)}`;

  function metaItems(p) {
    const items = [];
    if (p.beds) items.push(['bed', String(p.beds), 'Bedrooms', ' bedrooms']);
    if (p.baths) items.push(['bath', String(p.baths), 'Bathrooms', ' bathrooms']);
    if (p.area) items.push(['area', `${p.area.toLocaleString('en-IN')} sq yd`, 'Plot size', '']);
    if (p.parking) items.push(['car', String(p.parking), 'Car parking', ' car parks']);
    return items;
  }
  function metaHTML(p, listCls = 'prop-meta', itemCls = '') {
    return `<ul class="${listCls}">${metaItems(p).map(([ic, val, title, sr]) =>
      `<li${itemCls ? ` class="${itemCls}"` : ''} title="${title}">${icon(ic)}${esc(val)}${sr ? `<span class="visually-hidden">${sr}</span>` : ''}</li>`).join('')}</ul>`;
  }

  function actionsHTML(p, extra = '') {
    return `<div class="prop-actions">
      <button type="button" class="act act--fav ${extra}" data-fav="${p.id}" aria-pressed="false" aria-label="Save ${esc(p.title)}" title="Save">${icon('heart')}</button>
      <button type="button" class="act act--cmp ${extra}" data-cmp="${p.id}" aria-pressed="false" aria-label="Compare ${esc(p.title)}" title="Compare">${icon('compare')}</button>
    </div>`;
  }

  function cardHTML(p) {
    return `<article class="prop-card" role="listitem">
      <div class="prop-card__thumb" data-scrub="${p.id}">
        ${coverHTML(p)}
        <button type="button" class="thumb-hit" data-view="${p.id}" aria-label="View ${esc(p.title)}"></button>
        <div class="prop-card__tags">${tagsHTML(p)}</div>
        <div class="prop-card__bottom">
          ${mediaCountHTML(p) || '<span></span>'}
          ${actionsHTML(p)}
        </div>
        ${scrubBarsHTML(p)}
      </div>
      <div class="prop-card__body">
        <p class="prop-type">${typeLine(p)}</p>
        <h3 class="prop-title"><a href="#p-${p.id}" data-view="${p.id}">${esc(p.title)}</a></h3>
        <p class="prop-addr">${icon('pin')}<span>${esc(p.address)}</span></p>
        <div class="prop-price">${priceHTML(p)}</div>
        ${metaHTML(p)}
      </div>
    </article>`;
  }

  function listCardHTML(p, i) {
    return `<article class="list-card" style="--i:${i * 0.06}s">
      <div class="list-card__thumb" data-scrub="${p.id}">
        ${coverHTML(p)}
        <button type="button" class="thumb-hit" data-view="${p.id}" aria-label="View ${esc(p.title)}"></button>
        <div class="prop-card__tags">${tagsHTML(p)}</div>
        <div class="prop-card__bottom">${mediaCountHTML(p)}</div>
        ${scrubBarsHTML(p)}
      </div>
      <div class="list-card__body">
        <div class="list-card__top">
          <div>
            <p class="prop-type">${typeLine(p)}</p>
            <h3 class="prop-title"><a href="#p-${p.id}" data-view="${p.id}">${esc(p.title)}</a></h3>
            <p class="prop-addr">${icon('pin')}<span>${esc(p.address)}</span></p>
          </div>
          <div class="list-card__price"><div class="prop-price">${priceHTML(p)}</div></div>
        </div>
        <p class="list-card__excerpt">${esc(p.excerpt)}</p>
        ${metaHTML(p)}
        <div class="list-card__bottom">
          <a href="#p-${p.id}" class="link-arrow" data-view="${p.id}">View details ${icon('arrow')}</a>
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

  /* ---------- Images fade in over their dominant colour once decoded ---------- */
  function initImageFade() {
    const isPh = (el) => el && el.classList && el.classList.contains('ph-img');
    document.addEventListener('load', (e) => { if (isPh(e.target)) e.target.classList.add('is-loaded'); }, true);
    document.addEventListener('error', (e) => { if (isPh(e.target)) e.target.classList.add('is-failed'); }, true);
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
      return `<span class="chip"><span>${esc(p.locality)} · ${p.beds ? p.beds + ' BHK' : `${p.area} sq yd`}</span>
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

  // Mosaic of the first photos; every tile opens the full-screen gallery
  function galleryHTML(p) {
    const photos = photosOf(p);
    if (!photos.length) return `<div class="qv-gallery qv-gallery--empty">${coverHTML(p)}</div>`;
    const shown = photos.slice(0, photos.length >= 5 ? 5 : Math.min(3, photos.length));
    const tiles = shown.map((ph, i) => `<button type="button" class="qv-tile" data-lb="${p.id}" data-lb-index="${i}" aria-label="Open photo ${i + 1} of ${photos.length}">
        <span class="ph" style="--c:${ph.color}">${imgHTML(ph, { size: i === 0 ? 'lg' : 'sm', alt: i === 0 ? p.title : '', eager: true })}</span>
      </button>`).join('');
    const video = videoOf(p);
    return `<div class="qv-gallery qv-gallery--${shown.length}">
      ${tiles}
      <div class="qv-gallery__actions">
        ${video ? `<button type="button" class="qv-chip qv-chip--dark" data-lb="${p.id}" data-lb-index="${photos.length}">${icon('play', 'ic--fill')}Video tour</button>` : ''}
        <button type="button" class="qv-chip" data-lb="${p.id}" data-lb-index="0">${icon('grid')}Show all ${photos.length} photos</button>
      </div>
    </div>`;
  }

  function openQuickView(id) {
    const p = byId[id];
    if (!p) return;
    closeModals();
    const features = (p.features || []).map((f) => `<li>${icon('check')}${esc(f)}</li>`).join('');
    const priceLabel = p.status === 'rent' ? 'Monthly rent' : p.status === 'sale' ? 'Asking price' : 'Price';
    $('#qv-content').innerHTML = `${galleryHTML(p)}
      <div class="qv-body">
        <div class="qv-main">
          <div class="qv-tags">${tagsHTML(p)}</div>
          <p class="prop-type">${typeLine(p)}</p>
          <h2 class="qv-title" id="qv-title">${esc(p.title)}</h2>
          <p class="prop-addr">${icon('pin')}<span>${esc(p.address)}</span></p>
          ${metaHTML(p, 'qv-meta', 'meta-box')}
          <h3 class="qv-subhead">About this property</h3>
          <p class="qv-desc">${esc(p.excerpt)}</p>
          ${features ? `<h3 class="qv-subhead">Highlights</h3><ul class="qv-features">${features}</ul>` : ''}
        </div>
        <aside class="qv-aside">
          <div class="qv-price-card">
            <span class="qv-price-label">${priceLabel}</span>
            <div class="prop-price qv-price">${priceHTML(p)}</div>
            <a class="btn btn--primary btn--block" href="tel:${esc(SITE.office.tel)}">${icon('phone')}Call ${esc(SITE.office.display)}</a>
            <a class="btn btn--wa btn--block" href="${waLink(enquiry(p))}" target="_blank" rel="noopener">${icon('whatsapp')}Enquire on WhatsApp</a>
            <div class="qv-secondary">
              <button type="button" class="btn btn--soft" data-fav="${p.id}" aria-pressed="false">${icon('heart')}Save</button>
              <button type="button" class="btn btn--soft" data-cmp="${p.id}" aria-pressed="false">${icon('compare')}Compare</button>
            </div>
          </div>
        </aside>
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
      ['Status', (p) => statusLabel(p)],
      ['Type', (p) => p.type],
      ['Floor', (p) => p.floor || '—'],
      ['Bedrooms', (p) => p.beds || '—'],
      ['Bathrooms', (p) => p.baths || '—'],
      ['Plot size', (p) => (p.area ? `${p.area.toLocaleString('en-IN')} sq yd` : '—')],
      ['Car parking', (p) => p.parking || '—'],
      ['Location', (p) => p.address]
    ];
    $('#compare-content').innerHTML = `<div class="compare-wrap">
      <h2 id="compare-title">Compare Properties</h2>
      <div class="table-scroll">
        <table class="compare-table">
          <thead><tr>
            <td></td>
            ${list.map((p) => `<th scope="col"><div class="ct-thumb">${coverHTML(p)}</div><a href="#p-${p.id}" data-view="${p.id}">${esc(p.title)}</a></th>`).join('')}
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
     Full-screen gallery (photos + optional video tour)
     ========================================================================== */
  const lb = { items: [], index: 0, title: '' };

  function openLightbox(id, start = 0) {
    const p = byId[id];
    if (!p) return;
    lb.items = photosOf(p).map((ph) => ({ type: 'img', ...ph }));
    const video = videoOf(p);
    if (video) lb.items.push({ type: 'video', ...video });
    if (!lb.items.length) return;
    lb.title = p.title;

    $('#lb-title').textContent = p.title;
    $('#lb-stage').innerHTML = '';
    $('#lb-thumbs').innerHTML = lb.items.map((it, i) => {
      const isVideo = it.type === 'video';
      return `<button type="button" class="lb__thumb" data-lb-go="${i}" style="--c:${it.color}" aria-label="${isVideo ? 'Video tour' : `Photo ${i + 1}`}">
        <img src="${isVideo ? it.poster : it.src}-sm.webp" alt="" loading="lazy" decoding="async">
        ${isVideo ? `<span class="lb__play">${icon('play', 'ic--fill')}</span>` : ''}
      </button>`;
    }).join('');
    $('#lightbox').showModal();
    lbShow(start, true);
  }

  function lbShow(i, instant = false) {
    const n = lb.items.length;
    lb.index = (i + n) % n;
    const it = lb.items[lb.index];
    const stage = $('#lb-stage');
    $$('video', stage).forEach((v) => v.pause());

    let el;
    if (it.type === 'video') {
      el = document.createElement('video');
      el.src = it.src;
      el.poster = `${it.poster}-lg.webp`;
      el.controls = true;
      el.playsInline = true;
      el.preload = 'metadata';
    } else {
      el = new Image();
      el.src = `${it.src}-lg.webp`;
      el.alt = `${lb.title} — photo ${lb.index + 1}`;
      el.decoding = 'async';
    }
    el.width = it.w;
    el.height = it.h;
    el.className = 'lb__media';
    stage.appendChild(el);

    const old = $$('.lb__media', stage).filter((m) => m !== el);
    const reveal = () => {
      requestAnimationFrame(() => el.classList.add('is-in'));
      old.forEach((m) => {
        m.classList.remove('is-in');
        setTimeout(() => m.remove(), 450);
      });
    };
    if (it.type === 'img' && el.decode) el.decode().then(reveal, reveal);
    else reveal();

    $('#lb-count').textContent = `${lb.index + 1} / ${n}`;
    const strip = $('#lb-thumbs');
    $$('.lb__thumb', strip).forEach((b, k) => b.setAttribute('aria-current', String(k === lb.index)));
    const active = $(`[data-lb-go="${lb.index}"]`, strip);
    if (active) {
      strip.scrollTo({
        left: active.offsetLeft - strip.clientWidth / 2 + active.offsetWidth / 2,
        behavior: instant ? 'auto' : scrollBehavior()
      });
    }

    // Warm up the neighbours so the arrows feel instant
    [lb.index + 1, lb.index - 1].forEach((k) => {
      const nb = lb.items[(k + n) % n];
      if (nb.type === 'img') new Image().src = `${nb.src}-lg.webp`;
    });
  }

  function initLightbox() {
    const dlg = $('#lightbox');
    const stage = $('#lb-stage');
    $('[data-lb-prev]', dlg).addEventListener('click', () => lbShow(lb.index - 1));
    $('[data-lb-next]', dlg).addEventListener('click', () => lbShow(lb.index + 1));
    $('[data-close]', dlg).addEventListener('click', () => dlg.close());
    $('#lb-thumbs').addEventListener('click', (e) => {
      const b = e.target.closest('[data-lb-go]');
      if (b) lbShow(Number(b.dataset.lbGo));
    });
    stage.addEventListener('click', (e) => { if (e.target === stage) dlg.close(); });
    dlg.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'VIDEO') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); lbShow(lb.index + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); lbShow(lb.index - 1); }
    });
    dlg.addEventListener('close', () => {
      $$('video', dlg).forEach((v) => v.pause());
      stage.innerHTML = '';
    });

    let touchX = null;
    stage.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 45) lbShow(lb.index + (dx < 0 ? 1 : -1));
    });
  }

  /* ---------- Card photo scrubbing (desktop): move across a photo to flip through ---------- */
  function initScrub() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const warmed = new Set();

    const setIdx = (thumb, i) => {
      if (thumb.dataset.idx === String(i)) return;
      const photo = photosOf(byId[thumb.dataset.scrub])[i];
      const img = $('.ph-img', thumb);
      if (!photo || !img) return;
      thumb.dataset.idx = i;
      img.src = `${photo.src}-sm.webp`;
      $('.ph', thumb).style.setProperty('--c', photo.color);
      $$('.scrub-bars i', thumb).forEach((b, k) => b.classList.toggle('is-on', k === i));
    };

    document.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const thumb = e.target.closest('[data-scrub]');
      if (!thumb) return;
      const id = thumb.dataset.scrub;
      const photos = photosOf(byId[id]).slice(0, 5);
      if (photos.length < 2) return;
      if (!warmed.has(id)) {
        warmed.add(id);
        photos.forEach((ph) => { new Image().src = `${ph.src}-sm.webp`; });
      }
      const r = thumb.getBoundingClientRect();
      const i = Math.min(photos.length - 1, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * photos.length)));
      setIdx(thumb, i);
    }, { passive: true });

    document.addEventListener('pointerout', (e) => {
      const thumb = e.target.closest && e.target.closest('[data-scrub]');
      if (thumb && !thumb.contains(e.relatedTarget)) setIdx(thumb, 0);
    });
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
      stage.innerHTML = `${coverHTML(p, { size: 'lg', eager: true })}
        <button type="button" class="thumb-hit" data-view="${p.id}" aria-label="View ${esc(p.title)}"></button>
        ${mediaCountHTML(p)}
        ${actionsHTML(p)}`;

      content.innerHTML = `<div class="featured__tags">${tagsHTML(p)}</div>
        <p class="prop-type">${typeLine(p)}</p>
        <h3 class="featured__title"><a href="#p-${p.id}" data-view="${p.id}">${esc(p.title)}</a></h3>
        <p class="prop-addr">${icon('pin')}<span>${esc(p.address)}</span></p>
        ${metaHTML(p, 'featured__meta', 'meta-box')}
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
        const c = photosOf(t)[0];
        return `<button type="button" class="thumb-btn" data-go="${i}" aria-label="Show ${esc(t.title)}">
          ${c ? `<span class="ph" style="--c:${c.color}">${imgHTML(c, { alt: '' })}</span>` : '<span class="ph ph--empty"></span>'}
          <span class="thumb-cap">${esc(t.locality)}</span></button>`;
      }).join('');

      // Preload the next cover so the cross-fade lands on a ready image
      const nextCover = photosOf(items[(index + 1) % n])[0];
      if (nextCover) new Image().src = `${nextCover.src}-lg.webp`;
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
      timer = setInterval(() => go(index + 1, false), 7000);
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
    [/greater kailash 1/i, 'gk1 gk-1 gk 1 gk'],
    [/greater kailash 2/i, 'gk2 gk-2 gk 2 gk'],
    [/greater kailash enclave/i, 'gk enclave gke'],
    [/greater kailash/i, 'gk'],
    [/new friends colony/i, 'nfc'],
    [/hauz khas enclave/i, 'hke'],
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
        const hay = [
          p.title, p.address, p.locality, p.type, p.floor || '', statusLabel(p),
          p.beds ? `${p.beds} bhk ${p.beds}bhk` : '',
          p.area ? `${p.area} sq yd yards gaj` : '',
          aliasText(p), ...(p.tags || [])
        ].join(' ').toLowerCase();
        return tokens.every((t) => hay.includes(t));
      });
    }

    if (listing.sort === 'price-asc') list.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    else if (listing.sort === 'price-desc') list.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
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
    const blogMedia = (b) => (b.image ? `<img src="${esc(b.image)}" alt="${esc(b.title)}" loading="lazy">` : '');
    $('#blog-grid').innerHTML = posts.map((b, i) => `<article class="blog-card" data-reveal style="--d:${i * 0.08}s">
      <div class="blog-card__thumb"><div class="ph">${blogMedia(b)}</div><span class="tag tag--status">${esc(b.category)}</span></div>
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

      const gallery = e.target.closest('[data-lb]');
      if (gallery) { e.preventDefault(); openLightbox(gallery.dataset.lb, Number(gallery.dataset.lbIndex) || 0); return; }

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
  initImageFade();
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
  initLightbox();
  initScrub();
  initHeader();
  initFooterFallback();
  initCallbackForm();
  initReveal();
})();
