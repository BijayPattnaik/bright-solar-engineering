/* ============================================================
   Bright Solar Engineering — Product & Brand Data
   ------------------------------------------------------------
   Specs below are compiled from the manufacturers' own public
   product pages and datasheets. Module ratings change with each
   production series — ALWAYS confirm against the current
   datasheet before quoting a customer.

   To edit the catalogue: change the objects in PRODUCTS below.
   Nothing else in the site needs touching.
   ============================================================ */

const BRANDS = {
  waaree: {
    id: 'waaree',
    name: 'Waaree',
    full: 'Waaree Energies Ltd.',
    site: 'https://www.waaree.com/',
    catalogue: 'https://www.waaree.com/solar-panel/',
    tagline: "India's largest solar module manufacturer",
    since: '1989',
    blurb:
      "Waaree Energies is India's largest solar PV module manufacturer by installed capacity, with a multi-GW plant footprint in Gujarat. Its residential range is built around the Aditya Mono PERC series, while the Elite N-Type TOPCon and bifacial lines serve high-output commercial and utility projects.",
    strengths: [
      'Largest module capacity in India — strong stock availability',
      'Widest series range from 50 W portable to 700 W+ utility modules',
      'ALMM + DCR listed models available for subsidy projects',
      'Extensive service network across India'
    ]
  },
  vguard: {
    id: 'vguard',
    name: 'V-Guard',
    full: 'V-Guard Industries Ltd.',
    site: 'https://www.vguard.in/',
    catalogue: 'https://www.vguard.in/product-categories/solar-panels-vguard',
    tagline: 'Trusted home electricals, now in solar',
    since: '1977',
    blurb:
      "V-Guard brings four decades of home-electrical reliability to solar. Its range covers everything from 50 W 12 V panels for small off-grid loads up to 585 W N-Type TOPCon bifacial modules, and it is the only one of our two brands that also supplies matching solar inverters and water heaters — useful when a customer wants one brand end to end.",
    strengths: [
      'Complete home-energy range: panels, inverters, water heaters',
      'Widest low-wattage lineup (50 W–200 W) for off-grid and pumps',
      'Up to 30-year linear power output warranty',
      'BIS certified; deep service reach in South and West India'
    ]
  }
};

/* ------------------------------------------------------------
   PRODUCTS
   watt        — rated peak power in Wp
   tech        — 'topcon' | 'monoperc' | 'poly'
   bifacial    — true if dual-glass bifacial
   dcr         — Domestic Content Requirement listed (needed for
                 PM Surya Ghar subsidy claims)
   segment     — 'home' | 'commercial' | 'offgrid'
   ------------------------------------------------------------ */

const PRODUCTS = [
  /* ---------------- WAAREE ---------------- */
  {
    id: 'wa-aditya-400',
    brand: 'waaree', series: 'Aditya Series', name: 'Aditya Mono PERC',
    watt: 400, tech: 'monoperc', bifacial: false, dcr: true, segment: 'home',
    cells: '72 cells (Mono PERC)', efficiency: '20.2%',
    warrantyProduct: '12 years', warrantyPower: '25 years linear',
    use: 'The everyday workhorse for 1–3 kW home rooftops. Best price per watt in the Waaree range.'
  },
  {
    id: 'wa-aditya-450',
    brand: 'waaree', series: 'Aditya Series', name: 'Aditya Mono PERC',
    watt: 450, tech: 'monoperc', bifacial: false, dcr: true, segment: 'home',
    cells: '144 half-cut cells', efficiency: '20.8%',
    warrantyProduct: '12 years', warrantyPower: '25 years linear',
    use: 'Top of the Mono PERC range. Fewer panels for the same kW — good when roof space is tight.'
  },
  {
    id: 'wa-aditya-hc-390',
    brand: 'waaree', series: 'Aditya HC Series', name: 'Aditya Half-Cut',
    watt: 390, tech: 'monoperc', bifacial: false, dcr: true, segment: 'home',
    cells: '120 half-cut cells', efficiency: '20.1%',
    warrantyProduct: '12 years', warrantyPower: '25 years linear',
    use: 'Half-cut design lowers hot-spot risk on roofs with partial shading from tanks or parapets.'
  },
  {
    id: 'wa-aditya-hc-440',
    brand: 'waaree', series: 'Aditya HC Series', name: 'Aditya Half-Cut',
    watt: 440, tech: 'monoperc', bifacial: false, dcr: true, segment: 'home',
    cells: '144 half-cut cells', efficiency: '20.6%',
    warrantyProduct: '12 years', warrantyPower: '25 years linear',
    use: 'Sweet spot for 3–5 kWp Indian homes — the most common subsidy system size.'
  },
  {
    id: 'wa-topcon-545',
    brand: 'waaree', series: 'Aditya TOPCon', name: 'N-Type TOPCon',
    watt: 545, tech: 'topcon', bifacial: false, dcr: false, segment: 'commercial',
    cells: '144 half-cut N-type cells', efficiency: '21.6%',
    warrantyProduct: '12 years', warrantyPower: '30 years linear',
    use: 'N-type cells degrade slower and hold output better on hot days (−0.29 %/°C).'
  },
  {
    id: 'wa-topcon-580',
    brand: 'waaree', series: 'Aditya TOPCon', name: 'N-Type TOPCon',
    watt: 580, tech: 'topcon', bifacial: true, dcr: false, segment: 'commercial',
    cells: '144 half-cut N-type cells', efficiency: '22.1%',
    warrantyProduct: '12 years', warrantyPower: '30 years linear',
    use: 'Bifacial dual-glass — captures reflected light off the roof for extra yield on light surfaces.'
  },
  {
    id: 'wa-elite-585',
    brand: 'waaree', series: 'Elite Series N-Type', name: 'Elite BiN-08 Bifacial',
    watt: 585, tech: 'topcon', bifacial: true, dcr: false, segment: 'commercial',
    cells: '144 half-cut N-type cells', efficiency: '22.4%',
    warrantyProduct: '12 years', warrantyPower: '30 years linear',
    use: 'Waaree flagship. Highest efficiency in the range — best ₹/kWh over 25 years for large roofs.'
  },
  {
    id: 'wa-elite-600',
    brand: 'waaree', series: 'Elite Series N-Type', name: 'Elite BiN-08 Bifacial',
    watt: 600, tech: 'topcon', bifacial: true, dcr: false, segment: 'commercial',
    cells: '144 half-cut N-type cells', efficiency: '22.8%',
    warrantyProduct: '12 years', warrantyPower: '30 years linear',
    use: 'Maximum output per panel. Ideal for factory sheds, warehouses and open-ground plants.'
  },
  {
    id: 'wa-bifacial-660',
    brand: 'waaree', series: 'Bifacial Series', name: 'Bifacial Dual Glass',
    watt: 660, tech: 'topcon', bifacial: true, dcr: false, segment: 'commercial',
    cells: '132 half-cut N-type cells', efficiency: '22.6%',
    warrantyProduct: '12 years', warrantyPower: '30 years linear',
    use: 'Utility-scale module for ground-mount and elevated structures with reflective ground.'
  },

  /* ---------------- V-GUARD ---------------- */
  {
    id: 'vg-585-topcon',
    brand: 'vguard', series: 'RS Series', name: 'Panel 585 (RS) TOPCon',
    watt: 585, tech: 'topcon', bifacial: true, dcr: false, segment: 'commercial',
    cells: 'N-Type TOPCon bifacial', efficiency: '22.5%',
    warrantyProduct: '15 years', warrantyPower: '30 years linear',
    use: "V-Guard's highest-output module and its longest product warranty at 15 years."
  },
  {
    id: 'vg-580-topcon',
    brand: 'vguard', series: 'SW Series', name: 'Panel 580 (SW) TOPCon',
    watt: 580, tech: 'topcon', bifacial: true, dcr: false, segment: 'commercial',
    cells: 'N-Type TOPCon bifacial', efficiency: '22.3%',
    warrantyProduct: '12 years', warrantyPower: '30 years linear',
    use: 'N-type performance at a friendlier price than the 585 RS. Great for commercial roofs.'
  },
  {
    id: 'vg-550-rs-mphc',
    brand: 'vguard', series: 'RS Series', name: 'Panel 550 (RS) MPHC',
    watt: 550, tech: 'monoperc', bifacial: false, dcr: false, segment: 'commercial',
    cells: 'Mono PERC half-cut', efficiency: '21.3%',
    warrantyProduct: '12 years', warrantyPower: '30 years linear',
    use: '30-year power warranty on a Mono PERC module — unusually strong cover for the price.'
  },
  {
    id: 'vg-550-ax',
    brand: 'vguard', series: 'AX Series', name: 'Panel 550 (AX)',
    watt: 550, tech: 'monoperc', bifacial: false, dcr: false, segment: 'commercial',
    cells: 'Mono PERC', efficiency: '21.0%',
    warrantyProduct: '10 years', warrantyPower: '25 years linear',
    use: 'Value high-wattage option. Lowest cost per watt in the V-Guard lineup.'
  },
  {
    id: 'vg-550-ax-bi-dcr',
    brand: 'vguard', series: 'AX Series', name: 'Panel 550 (AX) Bifacial DCR',
    watt: 550, tech: 'monoperc', bifacial: true, dcr: true, segment: 'commercial',
    cells: 'Mono PERC bifacial', efficiency: '21.2%',
    warrantyProduct: '10 years', warrantyPower: '25 years linear',
    use: 'DCR-listed bifacial — eligible for PM Surya Ghar subsidy work.'
  },
  {
    id: 'vg-545-rs-bi-dcr',
    brand: 'vguard', series: 'RS Series', name: 'Panel 545 (RS) Bifacial DCR',
    watt: 545, tech: 'monoperc', bifacial: true, dcr: true, segment: 'home',
    cells: 'Mono PERC bifacial', efficiency: '21.1%',
    warrantyProduct: '12 years', warrantyPower: '30 years linear',
    use: 'DCR + bifacial + 30-year power warranty. Strong pick for subsidy-backed home systems.'
  },
  {
    id: 'vg-545-mphc',
    brand: 'vguard', series: 'Standard', name: 'Panel 545 Wp Monoperc Half-Cut',
    watt: 545, tech: 'monoperc', bifacial: false, dcr: false, segment: 'home',
    cells: 'Mono PERC half-cut', efficiency: '21.0%',
    warrantyProduct: '12 years', warrantyPower: '30 years linear',
    use: 'AR-coated tempered glass for higher conversion. Solid mainstream home module.'
  },
  {
    id: 'vg-540-ax-bi-dcr',
    brand: 'vguard', series: 'AX Series', name: 'Panel 540 (AX) Bifacial DCR',
    watt: 540, tech: 'monoperc', bifacial: true, dcr: true, segment: 'home',
    cells: 'Mono PERC bifacial', efficiency: '20.9%',
    warrantyProduct: '10 years', warrantyPower: '25 years linear',
    use: 'Entry point into DCR bifacial. Good value for 3–5 kW subsidy systems.'
  },
  {
    id: 'vg-400-mono',
    brand: 'vguard', series: 'Standard', name: 'Panel 400 W Mono PERC (24 V)',
    watt: 400, tech: 'monoperc', bifacial: false, dcr: false, segment: 'home',
    cells: '72 cells, 24 V', efficiency: '19.8%',
    warrantyProduct: '10 years', warrantyPower: '25 years performance',
    use: 'PID resistant with low-iron AR glass. Works well in low-light and cloudy conditions.'
  },
  {
    id: 'vg-340-dcr',
    brand: 'vguard', series: 'DCR Series', name: 'Panel 340 Wp DCR Poly',
    watt: 340, tech: 'poly', bifacial: false, dcr: true, segment: 'home',
    cells: 'Polycrystalline', efficiency: '17.4%',
    warrantyProduct: '10 years', warrantyPower: '25 years performance',
    use: 'Budget DCR polycrystalline module for cost-sensitive subsidy projects.'
  },
  {
    id: 'vg-200-mono',
    brand: 'vguard', series: 'Off-Grid', name: 'Panel 200 Wp Mono PERC (24 V)',
    watt: 200, tech: 'monoperc', bifacial: false, dcr: false, segment: 'offgrid',
    cells: 'Mono PERC, 24 V', efficiency: '19.2%',
    warrantyProduct: '10 years', warrantyPower: '25 years performance',
    use: 'Off-grid battery charging, shop backup, small pump sets.'
  },
  {
    id: 'vg-120-mono',
    brand: 'vguard', series: 'Off-Grid', name: 'Panel 120 Wp Mono PERC (12 V)',
    watt: 120, tech: 'monoperc', bifacial: false, dcr: false, segment: 'offgrid',
    cells: 'Mono PERC, 12 V', efficiency: '18.8%',
    warrantyProduct: '10 years', warrantyPower: '25 years performance',
    use: '12 V systems — solar street lights, CCTV poles, farm huts, boats.'
  },
  {
    id: 'vg-110-poly',
    brand: 'vguard', series: 'Off-Grid', name: 'Panel 110 W Poly (12 V)',
    watt: 110, tech: 'poly', bifacial: false, dcr: false, segment: 'offgrid',
    cells: '36 cells, 12 V', efficiency: '16.9%',
    warrantyProduct: '10 years', warrantyPower: '25 years performance',
    use: 'Entry-level 12 V panel for lighting kits and small DC loads.'
  },
  {
    id: 'vg-50-mono',
    brand: 'vguard', series: 'Off-Grid', name: 'Panel 50 Wp Mono PERC (12 V)',
    watt: 50, tech: 'monoperc', bifacial: false, dcr: false, segment: 'offgrid',
    cells: 'Mono PERC, 12 V', efficiency: '18.2%',
    warrantyProduct: '10 years', warrantyPower: '25 years performance',
    use: 'Smallest module we stock. Garden lights, mobile charging points, signage.'
  }
];

/* Human-readable labels used by the catalogue filters */
const TECH_LABELS = {
  topcon: 'N-Type TOPCon',
  monoperc: 'Mono PERC',
  poly: 'Polycrystalline'
};

const SEGMENT_LABELS = {
  home: 'Home rooftop',
  commercial: 'Commercial / large roof',
  offgrid: 'Off-grid & small loads'
};
