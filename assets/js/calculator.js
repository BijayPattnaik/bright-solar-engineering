/* ============================================================
   Solar Savings Calculator
   Used by calculator.html and the home-page teaser.
   All assumptions live in SITE.calc (config.js).
   ============================================================ */

(function () {
  'use strict';

  const form = document.getElementById('calcForm');
  if (!form || typeof SITE === 'undefined') return;

  const C = SITE.calc;

  const el = id => document.getElementById(id);
  const billIn   = el('bill');
  const billRange= el('billRange');
  const tariffIn = el('tariff');
  const typeIn   = el('propType');
  const sizeRange= el('sizeRange');
  const sizeVal  = el('sizeVal');
  const resetBtn = el('calcReset');

  let sizeIsManual = false;

  /* ---------- Formatting ---------- */
  const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
  const num = n => Math.round(n).toLocaleString('en-IN');

  /* ---------- Core maths ---------- */

  // PM Surya Ghar central subsidy, in rupees
  function subsidyFor(kw, type) {
    if (type === 'society') {
      // Group housing / RWA common facilities: ₹18,000 per kW, up to 500 kW
      return Math.min(kw, 500) * 18000;
    }
    if (type !== 'home') return 0;  // commercial & industrial get no PM Surya Ghar subsidy

    const k = Math.min(kw, 3);
    if (k <= 2) return k * 30000;
    return 60000 + (k - 2) * 18000;   // caps at ₹78,000 at 3 kW
  }

  // Additional state subsidy (Odisha OASBY) — residential only,
  // paid on top of the central amount. Slabs come from config.js.
  function stateSubsidyFor(kw, type) {
    const S = SITE.state;
    if (!S || !S.enabled || type !== 'home') return 0;
    const slab = S.slabs.find(s => kw >= s.minKw);
    return slab ? slab.amount : 0;
  }

  // Rate per kW falls as the system gets bigger — see costPerKw
  // in config.js. Returns the flat rate that applies at this size.
  function ratePerKw(kw) {
    const band = C.costPerKw.find(b => kw >= b.minKw);
    return band ? band.rate : C.costPerKw[C.costPerKw.length - 1].rate;
  }

  function systemCost(kw) {
    return kw * ratePerKw(kw);
  }

  function lifetimeSavings(kw, tariff, netCost) {
    let total = 0;
    let annualUnits = kw * C.unitsPerKwPerDay * 365;
    let rate = tariff;
    for (let year = 1; year <= 25; year++) {
      total += annualUnits * rate;
      annualUnits *= (1 - C.annualDegradation);
      rate *= (1 + C.tariffInflation);
    }
    return total - netCost;
  }

  /* ---------- Recompute + paint ---------- */

  function compute() {
    const bill   = Math.max(0, parseFloat(billIn.value) || 0);
    const tariff = Math.max(1, parseFloat(tariffIn.value) || C.defaultTariff);
    const type   = typeIn.value;

    // Units consumed each month, and the size that would cover them
    const monthlyUnits = bill / tariff;
    const suggested = monthlyUnits / (30 * C.unitsPerKwPerDay);

    if (!sizeIsManual) {
      // Round to the nearest 0.5 kW, keep within slider bounds
      const rounded = Math.max(1, Math.min(50, Math.round(suggested * 2) / 2));
      sizeRange.value = rounded;
    }

    const kw = parseFloat(sizeRange.value);
    sizeVal.textContent = kw.toFixed(1).replace(/\.0$/, '') + ' kW';

    const gross     = systemCost(kw);
    const subsidy   = subsidyFor(kw, type);
    const stateSub  = stateSubsidyFor(kw, type);
    const totalSub  = subsidy + stateSub;
    const net       = Math.max(0, gross - totalSub);

    const unitsMonth  = kw * C.unitsPerKwPerDay * 30;
    const unitsYear   = kw * C.unitsPerKwPerDay * 365;

    // You only save on what you actually consume; surplus is banked
    // through net metering, so we value all generation at the tariff.
    const saveMonth = unitsMonth * tariff;
    const saveYear  = unitsYear * tariff;

    const payback   = saveYear > 0 ? net / saveYear : 0;
    const lifetime  = lifetimeSavings(kw, tariff, net);
    const co2Year   = unitsYear * C.co2PerUnit;      // kg
    const trees     = co2Year / 22;                   // ~22 kg CO2 absorbed per tree per year
    const roof      = kw * C.sqftPerKw;
    const newBill   = Math.max(0, bill - saveMonth);

    paint({
      kw, gross, subsidy, stateSub, totalSub, net, unitsMonth, unitsYear,
      saveMonth, saveYear, payback, lifetime, co2Year, trees, roof, newBill, bill, type
    });
  }

  function paint(r) {
    const set = (id, val) => { const n = el(id); if (n) n.textContent = val; };

    set('rSize',      r.kw.toFixed(1).replace(/\.0$/, '') + ' kW');
    set('rSaveMonth', inr(r.saveMonth));
    set('rGross',     inr(r.gross));
    set('rSubsidy',   r.subsidy > 0 ? '– ' + inr(r.subsidy) : 'Not applicable');
    set('rStateSub',  r.stateSub > 0 ? '– ' + inr(r.stateSub) : 'Not applicable');
    set('rTotalSub',  r.totalSub > 0 ? '– ' + inr(r.totalSub) : '₹0');
    set('rNet',       inr(r.net));

    // Hide the state-subsidy row entirely if the scheme is switched off
    const stateRow = el('stateSubRow');
    if (stateRow) stateRow.style.display = (SITE.state && SITE.state.enabled) ? '' : 'none';
    set('rUnits',     num(r.unitsMonth) + ' units / month');
    set('rNewBill',   inr(r.newBill));
    set('rPayback',   r.payback > 0 ? r.payback.toFixed(1) + ' years' : '—');
    set('rLifetime',  inr(r.lifetime));
    set('rRoof',      num(r.roof) + ' sq ft');
    set('rCo2',       num(r.co2Year) + ' kg / year');
    set('rTrees',     num(r.trees) + ' trees');

    // Subsidy note changes with property type
    const note = el('subsidyNote');
    if (note) {
      const hasState = SITE.state && SITE.state.enabled;
      const notes = {
        home: 'Central PM Surya Ghar subsidy: ₹30,000/kW for the first 2 kW, ₹18,000 for the 3rd, capped at ₹78,000.' +
              (hasState ? ` ${SITE.state.name} adds a further amount under ${SITE.state.scheme} — confirm the current slab with ${SITE.state.verifyWith} before treating it as final.` : ''),
        society: 'Group housing rate applied: ₹18,000 per kW for common facilities, up to 500 kW. State assistance does not apply to society common-area systems.',
        commercial: 'Commercial and industrial systems get no PM Surya Ghar or state subsidy — but you can claim 40% accelerated depreciation in year one. Ask us how that changes the numbers.'
      };
      note.textContent = notes[r.type];
    }

    // Keep the WhatsApp button carrying the result
    const wa = el('calcWa');
    if (wa) {
      wa.href = SITE.waLink(
        `Hello ${SITE.company}, I used your solar calculator.\n\n` +
        `Monthly bill: ${inr(r.bill)}\n` +
        `Suggested system: ${r.kw} kW\n` +
        `Estimated cost after subsidy: ${inr(r.net)}\n\n` +
        `Please send me a detailed quotation.`
      );
    }
  }

  /* ---------- Wiring ---------- */

  billIn.addEventListener('input', () => {
    if (billRange) billRange.value = Math.min(billRange.max, billIn.value || 0);
    sizeIsManual = false;
    compute();
  });

  if (billRange) {
    billRange.addEventListener('input', () => {
      billIn.value = billRange.value;
      sizeIsManual = false;
      compute();
    });
  }

  tariffIn.addEventListener('input', () => { sizeIsManual = false; compute(); });
  typeIn.addEventListener('change', compute);
  sizeRange.addEventListener('input', () => { sizeIsManual = true; compute(); });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      billIn.value = 3000;
      if (billRange) billRange.value = 3000;
      tariffIn.value = C.defaultTariff;
      typeIn.value = 'home';
      sizeIsManual = false;
      compute();
    });
  }

  compute();
})();
