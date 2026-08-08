/* ============================================================
   Bright Solar Engineering — Shared site behaviour
   Runs on every page. Safe if an element is missing.
   ============================================================ */

(function () {
  'use strict';

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ---------- 1. Inject contact details from config.js ---------- */
  function applyConfig() {
    if (typeof SITE === 'undefined') return;

    $$('[data-site]').forEach(el => {
      const key = el.dataset.site;
      const val = SITE[key];
      if (val === undefined || val === null || val === '') {
        if (el.dataset.hideIfEmpty !== undefined) el.style.display = 'none';
        return;
      }
      el.textContent = val;
    });

    // Finance copy comes from SITE.finance so it's edited in one place
    if (SITE.finance) {
      $$('[data-site-finance]').forEach(el => {
        const val = SITE.finance[el.dataset.siteFinance];
        if (val) el.textContent = val;
      });
      if (SITE.finance.enabled === false) {
        $$('.finance-box, [data-finance-block]').forEach(el => {
          const sec = el.closest('section') || el;
          sec.style.display = 'none';
        });
      }
    }

    $$('[data-link="whatsapp"]').forEach(el => {
      el.href = SITE.waLink(el.dataset.waMsg || '');
      el.rel = 'noopener';
      el.target = '_blank';
    });
    $$('[data-link="call"]').forEach(el => { el.href = SITE.telLink; });
    $$('[data-link="email"]').forEach(el => { el.href = SITE.mailLink; });

    // Company name in <title> and anywhere marked
    $$('[data-site="company"]').forEach(el => { el.textContent = SITE.company; });

    // Current year in the footer
    $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  }

  /* ---------- 2. Sticky header + mobile menu ---------- */
  function initHeader() {
    const header = $('.header');
    const burger = $('.burger');
    const nav = $('.nav');
    if (!header) return;

    const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (burger && nav) {
      burger.addEventListener('click', () => {
        const open = nav.classList.toggle('is-open');
        burger.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', String(open));
      });
      $$('a', nav).forEach(a => a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }));
    }

    // Mark the current page in the nav
    const here = location.pathname.split('/').pop() || 'index.html';
    $$('.nav a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === here) a.classList.add('is-active');
    });
  }

  /* ---------- 3. Scroll reveal (elements + staggered groups) ---------- */
  function initReveal() {
    const items = $$('.reveal, [data-stagger]');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => el.classList.add('is-in'), delay);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    items.forEach(el => io.observe(el));
  }

  /* ---------- 4. Animated counters ---------- */
  function initCounters() {
    const nums = $$('[data-count]');
    if (!nums.length || !('IntersectionObserver' in window)) {
      nums.forEach(el => {
        el.textContent = (el.dataset.prefix || '') +
          parseFloat(el.dataset.count).toLocaleString('en-IN') + (el.dataset.suffix || '');
      });
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        io.unobserve(el);

        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const decimals = (el.dataset.count.split('.')[1] || '').length;
        const duration = 1500;
        const start = performance.now();

        // Indian grouping: 1,38,000 rather than 138000
        const fmt = n => n.toLocaleString('en-IN', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        });

        el.classList.add('is-counting');
        function frame(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + fmt(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(frame);
          else el.classList.remove('is-counting');
        }
        requestAnimationFrame(frame);
      });
    }, { threshold: 0.5 });

    nums.forEach(el => io.observe(el));
  }

  /* ---------- 5. Accordions (FAQ) ---------- */
  function initAccordions() {
    $$('.acc__q').forEach(btn => {
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', () => {
        const acc = btn.closest('.acc');
        const open = acc.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
      });
    });
  }

  /* ---------- 6. Enquiry form ----------
     No backend is wired up. On submit we build a pre-filled
     WhatsApp message so the lead reaches you instantly.
     If you later add a form service (Formspree, Google Forms,
     your own PHP), set the <form> action and remove data-wa-form.
  ------------------------------------------------------------ */
  function initForms() {
    $$('form[data-wa-form]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const status = $('.form-status', form);
        const data = new FormData(form);

        const name = (data.get('name') || '').toString().trim();
        const phone = (data.get('phone') || '').toString().trim();

        if (!name || !phone) {
          if (status) { status.className = 'form-status is-err'; status.textContent = 'Please enter your name and phone number.'; }
          return;
        }

        const lines = [`New solar enquiry for ${SITE.company}`, ''];
        const labels = {
          name: 'Name', phone: 'Phone', email: 'Email', city: 'City / Area',
          type: 'Property type', bill: 'Monthly electricity bill', brand: 'Preferred brand',
          size: 'System size interest', payment: 'Payment preference', message: 'Message'
        };
        for (const [key, val] of data.entries()) {
          const v = val.toString().trim();
          if (v) lines.push(`${labels[key] || key}: ${v}`);
        }

        window.open(SITE.waLink(lines.join('\n')), '_blank', 'noopener');

        if (status) {
          status.className = 'form-status is-ok';
          status.textContent = 'Thank you! WhatsApp is opening with your details — just press send and we will call you back within 24 hours.';
        }
        form.reset();
      });
    });
  }

  /* ---------- 7. Prefill enquiry from a product card ---------- */
  function initPrefill() {
    const params = new URLSearchParams(location.search);
    const product = params.get('product');
    if (!product) return;

    const msg = $('#message');
    if (msg && !msg.value) {
      msg.value = `I am interested in: ${product}. Please share a quotation.`;
    }
    const anchor = $('#enquiry');
    if (anchor) setTimeout(() => anchor.scrollIntoView({ behavior: 'smooth' }), 200);
  }

  /* ---------- 8. Photo grids (installations, certificates) ----------
     Both sections hide themselves while their list in config.js is
     empty, so a visitor never sees an empty gallery.
  ------------------------------------------------------------------ */
  function renderGrid(rootId, cfg, kind) {
    const root = document.getElementById(rootId);
    if (!root) return;

    const section = root.closest('section') || root;
    const items = (cfg && cfg.items) || [];

    if (!items.length) { section.style.display = 'none'; return; }

    const head = $('[data-grid-heading]', section);
    const intro = $('[data-grid-intro]', section);
    if (head && cfg.heading) head.textContent = cfg.heading;
    if (intro && cfg.intro) intro.textContent = cfg.intro;

    root.innerHTML = items.map(it => `
      <figure class="shot${kind === 'cert' ? ' shot--cert' : ''}">
        <img src="${it.src}" alt="${(it.alt || '').replace(/"/g, '&quot;')}" loading="lazy">
        ${(it.caption || it.label) ? `<figcaption>${it.caption || it.label}</figcaption>` : ''}
      </figure>`).join('');

    // Drop any image that fails to load rather than showing a broken icon.
    // A wrong filename in config.js is the likeliest mistake here.
    const drop = (img) => {
      const fig = img.closest('.shot');
      if (fig) fig.remove();
      if (!$$('.shot', root).length) section.style.display = 'none';
    };
    $$('img', root).forEach(img => {
      img.addEventListener('error', () => drop(img));
      // The error may already have fired before this listener was attached
      if (img.complete && img.naturalWidth === 0) drop(img);
    });
  }

  /* ---------- 8d. People (owner / team portraits) ----------
     Same contract as the photo grids: hidden entirely while
     SITE.team.items is empty, and any portrait that fails to load
     is removed rather than left as a broken icon. So the section
     simply does not exist until a real photo file is in place.
  ------------------------------------------------------------ */
  function renderTeam() {
    const root = document.getElementById('teamGrid');
    if (!root || typeof SITE === 'undefined') return;

    const cfg = SITE.team || {};
    const section = root.closest('section') || root;
    const items = cfg.items || [];

    if (!items.length) { section.style.display = 'none'; return; }

    const head = $('[data-grid-heading]', section);
    const intro = $('[data-grid-intro]', section);
    if (head && cfg.heading) head.textContent = cfg.heading;
    if (intro) {
      if (cfg.intro) intro.textContent = cfg.intro;
      else intro.style.display = 'none';
    }

    const esc = (s) => (s || '').replace(/"/g, '&quot;');
    // One partner reads best as a wide signed statement; two or more must
    // be shown as equal cards, or the second looks like an afterthought.
    root.classList.toggle('people--pair', items.length > 1);

    root.innerHTML = items.map(p => `
      <figure class="person">
        <div class="person__shot">
          <img src="${p.src}" alt="${esc(p.alt || p.name)}"
               style="object-position:${esc(p.focus || '50% 20%')}">
        </div>
        <figcaption>
          ${p.quote ? `<blockquote class="person__quote">${p.quote}</blockquote>` : ''}
          <div class="person__sig${p.quote ? '' : ' person__sig--bare'}">
            ${p.name ? `<span class="person__name">${p.name}</span>` : ''}
            ${p.role ? `<span class="person__role">${p.role}</span>` : ''}
          </div>
          ${p.line ? `<p class="person__line">${p.line}</p>` : ''}
          ${p.phone ? `<a class="person__phone" href="tel:${esc(p.phone).replace(/[^\d+]/g, '')}">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor"
                   stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.2a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z"/></svg>
              ${p.phone}</a>` : ''}
        </figcaption>
      </figure>`).join('');

    const drop = (img) => {
      const fig = img.closest('.person');
      if (fig) fig.remove();
      const left = $$('.person', root).length;
      // Re-check the layout: if a portrait 404s we may be back to one
      // partner, which wants the wide single treatment, not a lone card.
      root.classList.toggle('people--pair', left > 1);
      if (!left) section.style.display = 'none';
    };
    $$('img', root).forEach(img => {
      img.addEventListener('error', () => drop(img));
      if (img.complete && img.naturalWidth === 0) drop(img);
    });
  }

  /* ---------- 8e. "Go green" figures ----------
     Derived from SITE.calc so they can never contradict the
     calculator. The 25-year total applies the same annual
     degradation the calculator uses, rather than just
     multiplying by 25 — otherwise the two pages disagree.
  ------------------------------------------------------------ */
  function renderGreen() {
    if (typeof SITE === 'undefined' || !SITE.calc) return;
    const el = document.querySelector('[data-green]');
    if (!el) return;

    const KW = 3;                                   // a typical home system
    const c = SITE.calc;
    const unitsYear = KW * c.unitsPerKwPerDay * 365;
    const co2Year = unitsYear * c.co2PerUnit;       // kg

    let co2Life = 0;
    for (let y = 0; y < 25; y++) {
      co2Life += co2Year * Math.pow(1 - (c.annualDegradation || 0), y);
    }

    const set = (key, val) => {
      $$(`[data-green="${key}"]`).forEach(n => { n.textContent = val; });
    };
    set('units',   Math.round(unitsYear).toLocaleString('en-IN'));
    set('co2Year', (co2Year / 1000).toFixed(1));
    set('co2Life', Math.round(co2Life / 1000).toLocaleString('en-IN'));
    set('factor',  c.co2PerUnit);
  }

  /* ---------- 9. Local-business structured data ----------
     Built from SITE so there is only one source of truth. Helps the
     business surface in local Google searches and Maps.
  -------------------------------------------------------- */
  function injectSchema() {
    if (typeof SITE === 'undefined' || !document.body.dataset.schema) return;

    const data = {
      '@context': 'https://schema.org',
      '@type': 'ElectricalContractor',
      name: SITE.company,
      slogan: SITE.tagline,
      description: 'Authorised dealer and installer of Waaree and V-Guard ' +
                   'rooftop solar systems, with full PM Surya Ghar and Odisha OASBY subsidy assistance.',
      telephone: SITE.phoneDial,
      email: SITE.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE.addressLine1 + ', ' + SITE.addressLine2,
        addressLocality: 'Pipili',
        addressRegion: 'Odisha',
        postalCode: '752104',
        addressCountry: 'IN'
      },
      /* The business supplies the whole state, so the area served is the
         state itself — not a list of towns. The home districts stay in
         as named places, because those are the ones worth ranking for
         locally. Falls back gracefully if either key is missing. */
      areaServed: [
        { '@type': 'State', name: SITE.serviceState || 'Odisha' }
      ].concat(
        (SITE.serviceAreaHome || '').split(/,| and /).map(s => s.trim()).filter(Boolean)
          .map(name => ({ '@type': 'City', name: name }))
      ),
      openingHours: 'Mo-Sa 09:00-19:00',
      priceRange: '₹₹',
      brand: ['Waaree', 'V-Guard']
    };

    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(data);
    document.head.appendChild(el);
  }

  /* ---------- 8b. Offers / what's included ----------
     Config-driven, and hides itself when the list is empty so the
     owner can switch the whole section off by clearing config.
  ------------------------------------------------------------ */
  const OFFER_ICONS = {
    survey: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>',
    doc:    '<path d="M14.5 2v6h6"/><path d="M20 9v11a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h8.5z"/><path d="M9 13h6M9 17h4"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
    clean:  '<path d="M3 21h18"/><path d="M7 21V10l5-7 5 7v11"/><path d="M12 3v18"/>',
    wind:   '<path d="M3 8h11a3 3 0 10-3-3"/><path d="M3 14h15a3 3 0 11-3 3"/><path d="M3 11h8"/>',
    gift:   '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18"/><path d="M12 8S9 3 7 5s2 3 5 3zM12 8s3-5 5-3-2 3-5 3z"/>'
  };

  function renderOffers() {
    const root = document.getElementById('offerGrid');
    if (!root || typeof SITE === 'undefined' || !SITE.offers) return;

    const cfg = SITE.offers;
    const section = root.closest('section') || root;
    const items = cfg.items || [];
    if (!items.length) { section.style.display = 'none'; return; }

    const head = $('[data-offers-heading]', section);
    const intro = $('[data-offers-intro]', section);
    if (head && cfg.heading) head.textContent = cfg.heading;
    if (intro && cfg.intro) intro.textContent = cfg.intro;

    root.innerHTML = items.map(o => `
      <div class="offer${o.highlight ? ' offer--key' : ''}">
        <div class="offer__ico">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"
               stroke-linecap="round" stroke-linejoin="round">${OFFER_ICONS[o.icon] || OFFER_ICONS.shield}</svg>
        </div>
        <div>
          <h3>${o.title}</h3>
          <p>${o.text}</p>
        </div>
      </div>`).join('');

    // Seasonal banner — only when the owner has written one
    const band = $('[data-seasonal]', section);
    if (band) {
      const s = cfg.seasonal || {};
      if (s.text) {
        band.innerHTML = `<strong>${s.text}</strong>` +
          (s.until ? ` <span class="offer-band__until">Valid until ${s.until}.</span>` : '');
      } else {
        band.style.display = 'none';
      }
    }
  }

  /* ---------- 8c. Banks that finance solar ----------
     Names always; rates only when SITE.finance.showRates is true,
     because the owner does not control them and they move.
  ------------------------------------------------------------ */
  function renderBanks() {
    const root = document.getElementById('bankList');
    if (!root || typeof SITE === 'undefined' || !SITE.finance) return;

    const f = SITE.finance;
    const banks = f.banks || [];
    const wrap = root.closest('[data-banks-block]') || root;
    if (!banks.length) { wrap.style.display = 'none'; return; }

    root.innerHTML = banks.map(b => `
      <li class="bank">
        <span class="bank__name">${b.name}</span>
        ${f.showRates && b.rate ? `<span class="bank__rate">${b.rate}</span>` : ''}
      </li>`).join('');

    const note = $('[data-banks-note]', wrap);
    if (note && f.banksNote) note.textContent = f.banksNote;
  }

  /* ---------- 9b. Scroll progress bar ---------- */
  function initScrollProgress() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- 10. Hero sun rays ---------- */
  function buildRays() {
    const holder = $('.sun-rays');
    if (!holder) return;
    const count = 16;
    for (let i = 0; i < count; i++) {
      const ray = document.createElement('i');
      ray.style.transform = `translate(-50%, -50%) rotate(${(360 / count) * i}deg) translateY(-118px)`;
      holder.appendChild(ray);
    }
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    applyConfig();
    initHeader();
    renderOffers();
    renderBanks();
    renderGrid('projectGrid', SITE.gallery, 'work');
    renderGrid('certGrid', SITE.credentials, 'cert');
    renderTeam();
    renderGreen();
    injectSchema();
    initScrollProgress();
    buildRays();
    initReveal();
    initCounters();
    initAccordions();
    initForms();
    initPrefill();
  });

  // Expose for other page scripts
  window.BSE = { $, $$ };
})();
