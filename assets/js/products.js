/* ============================================================
   Product catalogue — filtering, sorting and rendering
   Used by products.html
   ============================================================ */

(function () {
  'use strict';

  const grid = document.getElementById('productGrid');
  if (!grid || typeof PRODUCTS === 'undefined') return;

  const countEl = document.getElementById('filterCount');

  const state = {
    brand: 'all',
    tech: 'all',
    segment: 'all',
    sort: 'watt-desc'
  };

  /* ---------- Rendering ---------- */

  function tagsFor(p) {
    const tags = [];
    if (p.tech === 'topcon') tags.push('<span class="tag tag--topcon">TOPCon</span>');
    if (p.bifacial) tags.push('<span class="tag tag--bi">Bifacial</span>');
    if (p.dcr) tags.push('<span class="tag tag--dcr">DCR · Subsidy OK</span>');
    return tags.join('');
  }

  const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');

  // Indicative panel-only price band, from the ₹/W rates in config.js
  function priceHTML(p) {
    const cfg = SITE.pricing;
    if (!cfg || !cfg.enabled) {
      return `<div class="pcard__price"><span class="pcard__price-on-req">Price on request</span></div>`;
    }
    const band = (cfg.perWatt[p.brand] || {})[p.tech];
    if (!band) {
      return `<div class="pcard__price"><span class="pcard__price-on-req">Price on request</span></div>`;
    }
    const lo = Math.round(p.watt * band[0] / 100) * 100;
    const hi = Math.round(p.watt * band[1] / 100) * 100;
    return `
      <div class="pcard__price">
        <div class="pcard__price-row">
          <span class="pcard__price-val">${inr(lo)} – ${inr(hi)}</span>
          <span class="pcard__price-tag">${cfg.negotiableLabel}</span>
        </div>
        <span class="pcard__price-unit">≈ ₹${band[0]}–₹${band[1]} per watt · panel only · +${cfg.gstPercent}% GST</span>
      </div>`;
  }

  function cardHTML(p) {
    const brand = BRANDS[p.brand];
    const enquiryText = `${brand.name} ${p.name} ${p.watt}W`;
    return `
      <article class="pcard reveal">
        <div class="pcard__top">
          <div class="pcard__head">
            <span class="pcard__brand">${brand.name}</span>
            <div class="pcard__tags">${tagsFor(p)}</div>
          </div>
          <h3 class="pcard__name">${p.name}</h3>
          <div class="pcard__watt">${p.watt}<span> Wp</span></div>
        </div>
        <div class="pcard__body">
          <dl>
            <div class="spec-row"><dt>Series</dt><dd>${p.series}</dd></div>
            <div class="spec-row"><dt>Technology</dt><dd>${TECH_LABELS[p.tech]}</dd></div>
            <div class="spec-row"><dt>Cell layout</dt><dd>${p.cells}</dd></div>
            <div class="spec-row"><dt>Module efficiency</dt><dd>${p.efficiency}</dd></div>
            <div class="spec-row"><dt>Product warranty</dt><dd>${p.warrantyProduct}</dd></div>
            <div class="spec-row"><dt>Power warranty</dt><dd>${p.warrantyPower}</dd></div>
          </dl>
        </div>
        ${priceHTML(p)}
        <p class="pcard__use">${p.use}</p>
        <div class="pcard__foot">
          <a class="btn btn--primary btn--sm btn--block"
             href="contact.html?product=${encodeURIComponent(enquiryText)}#enquiry">Get price</a>
          <a class="btn btn--ghost btn--sm" href="${brand.catalogue}" target="_blank" rel="noopener"
             title="Open the official ${brand.name} catalogue">Datasheet ↗</a>
        </div>
      </article>`;
  }

  function apply() {
    let list = PRODUCTS.filter(p =>
      (state.brand === 'all' || p.brand === state.brand) &&
      (state.tech === 'all' || p.tech === state.tech) &&
      (state.segment === 'all' || p.segment === state.segment)
    );

    const sorters = {
      'watt-desc': (a, b) => b.watt - a.watt,
      'watt-asc':  (a, b) => a.watt - b.watt,
      'brand':     (a, b) => a.brand.localeCompare(b.brand) || b.watt - a.watt,
      'eff-desc':  (a, b) => parseFloat(b.efficiency) - parseFloat(a.efficiency)
    };
    list.sort(sorters[state.sort] || sorters['watt-desc']);

    grid.innerHTML = list.length
      ? list.map(cardHTML).join('')
      : `<div class="empty-state">
           <h3>No panels match those filters</h3>
           <p>Try widening your choice — or call us and we will source it for you.</p>
           <a class="btn btn--primary" data-link="whatsapp" href="#">Ask on WhatsApp</a>
         </div>`;

    if (countEl) {
      countEl.textContent = list.length + (list.length === 1 ? ' panel' : ' panels');
    }

    // Re-run shared behaviours on the new nodes
    grid.querySelectorAll('.reveal').forEach(el => el.classList.add('is-in'));
    grid.querySelectorAll('[data-link="whatsapp"]').forEach(el => {
      el.href = SITE.waLink('');
      el.target = '_blank';
      el.rel = 'noopener';
    });
  }

  /* ---------- Filter controls ---------- */

  document.querySelectorAll('.chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      state[group] = btn.dataset.value;
      document.querySelectorAll(`.chip-btn[data-group="${group}"]`)
        .forEach(b => b.classList.toggle('is-on', b === btn));
      apply();
    });
  });

  const sortSel = document.getElementById('sortBy');
  if (sortSel) sortSel.addEventListener('change', () => { state.sort = sortSel.value; apply(); });

  /* ---------- Deep link: products.html?brand=waaree ---------- */
  const qBrand = new URLSearchParams(location.search).get('brand');
  if (qBrand && BRANDS[qBrand]) {
    state.brand = qBrand;
    document.querySelectorAll('.chip-btn[data-group="brand"]')
      .forEach(b => b.classList.toggle('is-on', b.dataset.value === qBrand));
  }

  apply();
})();
