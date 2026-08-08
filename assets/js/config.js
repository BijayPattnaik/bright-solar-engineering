/* ============================================================
   EDIT THIS FILE FIRST
   ------------------------------------------------------------
   Everything here appears across the whole website. Change a
   value once and it updates on every page — phone numbers,
   WhatsApp links, email, address, pricing assumptions.

   Keep the quote marks. Only change the text inside them.
   ============================================================ */

const SITE = {

  /* ---- Company identity ---- */
  company: 'Bright Solar Engineering',
  tagline: 'Harness the Sun, Empower the Future.',

  /* ---- Contact details ----
     phone      : shown on the site, spaces are fine
     phoneDial  : used by the "call" button — digits only, with +91
     whatsapp   : digits only with country code, NO plus sign      */
  phone: '+91 99370 82488',
  phoneDial: '+919937082488',
  phone2: '+91 94370 58255',
  whatsapp: '919937082488',        // <- is 99370 82488 the WhatsApp number?
  email: 'brightsolarengg@gmail.com',

  /* ---- Who customers ask for ---- */
  contactPerson: 'Ardhendu Pattnaik',
  contactRole: 'Partner & Head of Sales',

  /* ---- Showroom — the address customers should visit ---- */
  addressLine1: 'Showroom No. 7 & 8, 1st Floor, Plot No. 1815',
  addressLine2: 'Sahu Resorts, Pubasasana Mauza, Pipili',
  addressState: 'Dist. Puri, Odisha – 752104',

  /* Just the town name. Used mid-sentence ("our showroom in Pipili"),
     where the full address line above would read awkwardly. */
  town: 'Pipili',

  /* ---- Registered address — for invoices and legal use ---- */
  regdLine1: '701/3607, Andilo Balianta',
  regdLine2: 'Dist. Khurda, Odisha – 752101',

  /* ---- Where you work ----
     serviceArea     : the FULL area you supply — used in the footers,
                       the About page heading and the Google listing.
     serviceAreaHome : the districts you reach quickly for a site visit
                       and for after-sales service. Shown wherever the
                       site talks about turning up in person, so the
                       statewide claim never turns into a service
                       promise you cannot keep in a distant district.
     serviceState    : used by the Google structured data.            */
  serviceArea: 'all 30 districts of Odisha',
  serviceAreaHome: 'Pipili, Puri, Khurda and Bhubaneswar',
  serviceState: 'Odisha',

  hours: 'Mon – Sat, 9:00 AM – 7:00 PM',

  /* ---- Business registration (leave blank to hide) ---- */
  gstin: '',
  regNo: '',

  /* ---- Social links (leave blank to hide the icon) ---- */
  facebook: '',
  instagram: '',
  youtube: '',

  /* ---- Google Maps embed ----
     This is a keyless search embed pointing at the Pipili showroom.
     CHECK THE PIN IS RIGHT. To make it exact, claim your Google
     Business Profile, then use Google Maps > Share > Embed a map
     and paste that "src" URL here instead.                        */
  mapEmbed: 'https://maps.google.com/maps?q=Sahu%20Resorts%2C%20Pipili%2C%20Puri%2C%20Odisha%20752104&t=&z=14&ie=UTF8&iwloc=&output=embed',

  /* ============================================================
     WHAT YOU INCLUDE / OFFERS
     ------------------------------------------------------------
     >>> ONLY PUBLISH WHAT YOU WILL ACTUALLY HONOUR. <<<
     Everything here becomes a promise a customer can hold you to,
     and can quote back at you months later. Delete any row you
     are not certain about — an empty list hides the section.

     These are drawn from what solar dealers across India actually
     offer (checked 6 Aug 2026). Most cost you very little and are
     worth a lot to a nervous first-time buyer.

     Honest note on AMC: free maintenance for the first years is
     part of MNRE's quality standards for rooftop solar, not a
     favour. Competitors advertising "FREE 5-YEAR AMC!" are
     selling you something you are owed anyway. It is listed
     below as "included", which is the truthful framing.

     `highlight: true` gives a row the accent treatment. Use it
     on one or two rows at most, or it stops meaning anything.
     ============================================================ */
  offers: {
    heading: 'What comes with every installation',
    intro: 'No asterisks and no introductory pricing. These apply to every job we take, ' +
           'whatever size it is.',

    items: [
      { icon: 'survey',  title: 'Free site survey and shadow study',
        text: 'We measure your shadow-free area across the whole day before quoting. Most dealers eyeball it from the gate.' },

      /* NOTE: we GUIDE, we do not file. The PM Surya Ghar subsidy is paid
         straight into the consumer's own bank account, so the application
         has to be in their name and made by them. Do not reword this into
         "we handle your paperwork" — it is not what the business does. */
      { icon: 'doc',     title: 'We walk you through the subsidy application', highlight: true,
        text: 'The subsidy is paid directly into your bank account, so the application has to be yours. We show you exactly what to do at each stage — portal registration, the discom application, feasibility, net meter and commissioning — and check your details before you submit. No charge for the guidance.' },

      { icon: 'shield',  title: '5 years of maintenance included',
        text: 'Performance checks and service visits for the first five years, as required under MNRE quality standards for rooftop solar. Ours is written into the quotation so you can hold us to it.' },

      { icon: 'clean',   title: 'First year of panel cleaning included',
        text: 'Two supervised cleaning visits in year one, and we teach you to do it safely yourself after that. Dust alone can cost you 10–20% of your generation.' },

      { icon: 'wind',    title: 'Cyclone-rated mounting structure', highlight: true,
        text: 'We are on the Odisha coast. Our structures are specified for local wind loading as standard, not as a paid upgrade — because Fani and Amphan happened here and cheap structures did not survive them.' },

      { icon: 'gift',    title: 'Referral reward',
        text: 'Introduce a neighbour or relative and you receive a thank-you once their system is commissioned. Ask us for the current amount.' }
    ],

    /* A dated, seasonal offer. Leave `text` blank to hide this
       banner completely. Use real Odia festivals — Raja, Rath
       Yatra, Diwali — rather than generic "limited time" copy,
       which nobody believes. ALWAYS set an honest `until` date
       and honour it. */
    seasonal: {
      text: '',
      until: ''
    }
  },

  /* ============================================================
     YOUR WORK — installation photos
     ------------------------------------------------------------
     THE MOST VALUABLE THING YOU CAN ADD TO THIS SITE.
     Photos of real jobs beat any wording on this page.

     1. Put your photos in  assets/img/projects/
     2. Add a line below for each one
     3. That's it — the section appears on the home page

     While this list is empty the whole section stays hidden,
     so the site never shows an empty gallery to a visitor.

     Good photos: the finished array on the roof, the inverter
     neatly mounted, you or your team on site, a happy customer
     with their new meter. Shoot in daylight, hold the phone
     level, and get the whole array in frame.
     ============================================================ */
  gallery: {
    heading: 'Recent installations',
    intro: 'Real roofs and real systems, photographed on site.',
    items: [
      // { src: 'assets/img/projects/pipili-3kw.jpg',
      //   alt: '3 kW Waaree rooftop system in Pipili',
      //   caption: '3 kW · Waaree Mono PERC · Pipili' },
    ]
  },

  /* ============================================================
     DEALERSHIP CERTIFICATES
     ------------------------------------------------------------
     Scans or photos of your authorisation letters from Waaree
     and V-Guard. Competitors claim to be authorised dealers
     too — showing the paperwork is what separates you from them.

     Put them in  assets/img/certificates/  and list them below.
     Hidden entirely while the list is empty.
     ============================================================ */
  credentials: {
    heading: 'Our dealership authorisations',
    intro: 'Plenty of people say they are authorised dealers. Here is ours, in writing.',
    items: [
      // { src: 'assets/img/certificates/waaree.jpg',
      //   alt: 'Waaree authorised dealer certificate',
      //   label: 'Waaree Energies' },
    ]
  },

  /* ============================================================
     WHO THE CUSTOMER IS DEALING WITH — photo of you / your team
     ------------------------------------------------------------
     A real face is worth a lot on a local trade website. People
     buying a 25-year product want to see who they are buying from.

     1. Save your photo in  assets/img/team/
     2. Fill in the block below and delete the // marks
     3. That's it — the section appears on the About page

     HIDDEN while the list is empty, so the site never shows a
     broken image or an empty space.

     `focus` moves the circular crop. The photo is cropped to a
     circle, which removes most of a busy shop background on its
     own. If the crop cuts the chin off or leaves too much
     headroom, change the second number only:
        '50% 10%'  = crop higher (use if too much headroom)
        '50% 20%'  = default, suits most head-and-shoulders shots
        '50% 35%'  = crop lower (use if the top of the head is cut)
     ============================================================ */
  team: {
    heading: 'Who you will be dealing with',
    intro: '',
    /* ALREADY SET UP FOR YOU. The only thing left to do is save the
       photo into  assets/img/team/  with exactly this filename:

           ardhendu-pattnaik.jpg

       Until that file exists the section stays hidden, so nothing on
       the site breaks in the meantime. Save the file and it appears. */
    items: [
      { src: 'assets/img/team/ardhendu-pattnaik.jpg',
        alt: 'Ardhendu Pattnaik, Partner and Head of Sales at Bright Solar Engineering',
        name: 'Ardhendu Pattnaik',
        role: 'Partner & Head of Sales',
        focus: '50% 50%',   // photo is already cropped square, so centre it

        /* >>> READ THIS BEFORE THE SITE GOES LIVE <<<
           This is printed in the FIRST PERSON, next to your face and
           over your name. A customer will quote it back to you. Read
           it aloud and make sure you are happy to be held to it — if
           not, rewrite it in your own words. Shorter is stronger.

           It is deliberately about PRICING AND ADVICE, not about
           service call-outs, because that is the part of the business
           you personally answer for. Keep it that way. */
        quote: 'I spent thirty-five years in the electrical trade before I sold my first solar ' +
               'panel. It taught me that the cheapest quotation is very rarely the cheapest system.',

        /* Naming a former employer is a statement of fact about his career.
           Keep it worded so it never suggests Havells endorses, supplies or
           is connected to this business — it does not. */
        line: 'Ardhendu spent thirty-five years in electricals and sales, most of that career with ' +
              'Havells, before retiring. He co-owns Bright Solar Engineering and leads the ' +
              'commercial side — pricing, quotations, and guiding customers through their subsidy ' +
              'application.',
        phone: '+91 99370 82488' },

      /* ---- SECOND PARTNER ----
         PHOTO STILL NEEDED. Save it as  assets/img/team/subhendu-pattnaik.jpg
         and this card appears. Until then only Ardhendu shows — the
         renderer drops any portrait whose file is missing.

         The quote below is drafted from his actual career — forty-five
         years selling and servicing vehicles — and deliberately covers
         AFTER-SALES, because that is the part of this business he runs.
         It is still printed in the first person over his face, so read
         it to him and change any word he would not say himself.        */
      { src: 'assets/img/team/subhendu-pattnaik.jpg',
        alt: 'Subhendu Pattnaik, Partner at Bright Solar Engineering',
        name: 'Subhendu Pattnaik',
        role: 'Partner & Head of Operations',
        focus: '50% 50%',
        quote: 'Forty-five years in automobile sales taught me that the sale is the easy part. ' +
               'What decides whether a customer comes back is the service in the years afterwards. ' +
               'Solar is no different.',

        line: 'Subhendu spent forty-five years in automobile sales, retiring as a General Manager ' +
              'with Mahindra. He runs the day-to-day side of the business — the team, the ' +
              'operations, and looking after customers once a system is in.',
        phone: '+91 99386 78255' },
    ]
  },

  /* ============================================================
     PRICING ASSUMPTIONS used by the Savings Calculator
     Update these as your market rates change.
     ============================================================ */
  calc: {
    // Average units (kWh) generated per 1 kW per day, over a year
    unitsPerKwPerDay: 4.0,

    /* Installed cost per kW, INR — before subsidy.
       >>> PUT YOUR REAL PRICES HERE. <<<
       Smaller systems cost MORE per kW, because the inverter,
       structure and labour are spread over fewer panels.
       Checked top-down: the first band whose minKw you meet wins.
       These figures now drive the "you pay" number on your site,
       and with the Odisha subsidy that number is small — so an
       optimistic rate here becomes a promise you have to keep. */
    costPerKw: [
      { minKw: 10, rate: 48000 },
      { minKw: 5,  rate: 52000 },
      { minKw: 3,  rate: 58000 },
      { minKw: 2,  rate: 65000 },
      { minKw: 0,  rate: 72000 }
    ],

    // Default electricity tariff, INR per unit
    defaultTariff: 8,

    // Roof area needed per kW, in square feet
    sqftPerKw: 90,

    // Grid emission factor: kg of CO2 avoided per unit of solar
    co2PerUnit: 0.82,

    // Annual panel degradation used for the 25-year projection
    annualDegradation: 0.005,   // 0.5% per year

    // Assumed annual electricity tariff inflation
    tariffInflation: 0.04       // 4% per year
  },

  /* ============================================================
     PANEL PRICING
     ------------------------------------------------------------
     Waaree and V-Guard do NOT publish panel
     prices on their websites — they sell through distributors,
     so their sites carry specifications only. The rates below are
     current INDIAN MARKET rates for each brand and technology,
     in rupees per watt, panel only, before GST.

     >>> REPLACE THESE WITH YOUR OWN DEALER RATES. <<<
     They are what your customers will see. Set `enabled: false`
     to hide all prices from the site and show "Price on request".
     ============================================================ */
  pricing: {
    enabled: true,

    /* ---- WHAT THESE NUMBERS ACTUALLY ARE (checked 6 Aug 2026) ----
       There is no such thing as a real "MRP" for solar panels in
       India. Three different prices exist for the same module:

         Listed "MRP"  ~Rs 50/W   a struck-through anchor. Meaningless.
         Retail online ~Rs 23/W   what a consumer pays for one panel
         Trade / bulk  ~Rs 15/W   what a dealer pays by the pallet

       Verified anchor: Waaree WSMD-540 (540 W Mono PERC) on Moglix
       listed at Rs 27,279 "MRP", selling at Rs 13,296 incl. GST
       (Rs 12,665 + Rs 631 GST) = Rs 23.5/W ex-GST.
       IndiaMART trade sellers quote Rs 15.00-15.50/W for Waaree.

       The bands below sit at RETAIL level, which is the right thing
       to show a homeowner. Your buying price is far lower, and that
       gap is your margin and your room to negotiate.

       >>> STILL REPLACE THESE WITH YOUR OWN RATES. <<<           */
    perWatt: {
      waaree: { topcon: [24, 31], monoperc: [20, 26], poly: [17, 22] },
      vguard: { topcon: [23, 29], monoperc: [19, 25], poly: [16, 21] }
    },

    gstPercent: 12,
    negotiableLabel: 'Negotiable',

    // Shown under every price on the site
    note: 'Indicative rates for the panel only. Final price depends on quantity, ' +
          'the mounting structure, inverter and your roof — and is negotiable.'
  },

  /* ============================================================
     BANK FINANCE
     ------------------------------------------------------------
     Keep this factual. You are not the lender — the bank decides
     eligibility, rate and tenure entirely by its own procedure.
     ============================================================ */
  finance: {
    enabled: true,
    headline: 'Bank finance available',
    summary: 'You do not have to pay the full amount upfront. Solar systems are ' +
             'financed by most major banks, and we will help you put the file together.',
    // The one line that protects you and sets expectations honestly.
    // Eligibility is deliberately stated first — it is the thing
    // customers most often assume you control, and you do not.
    /* ---- Banks known to run PM Surya Ghar solar loans ----
       Checked 6 Aug 2026 from secondary sources, NOT from the banks
       themselves. Rates move with each bank's RLLR/EBLR and sources
       disagreed (SBI was quoted at both 7.15% and 7.25%), so every
       rate below is shown as "around" and must be confirmed at the
       branch. Set `showRates: false` to hide the numbers entirely
       and list bank names only — the safer option if you would
       rather not quote a rate you do not control.
       Remove or add rows freely; the section hides itself if empty. */
    showRates: true,
    banksNote: 'Collateral-free up to ₹2 lakh for residential systems up to 3 kW, ' +
               'tenure up to 10 years. Rates are indicative and change — confirm at the branch.',
    banks: [
      { name: 'State Bank of India', rate: 'around 7.15%' },
      { name: 'Canara Bank',         rate: 'around 7.30%' },
      { name: 'Union Bank of India', rate: 'around 7.35%' },
      { name: 'Punjab National Bank', rate: 'concessional' },
      { name: 'Bank of Baroda',      rate: 'concessional' },
      { name: 'Bank of India',       rate: 'concessional' }
    ],

    procedureNote: 'The criteria for availing a loan are entirely as per the bank\'s norms. ' +
                   'Eligibility, sanction, interest rate, tenure, documentation and disbursement ' +
                   'are decided by the bank under its own procedure and approval. ' +
                   'Bright Solar Engineering assists with the quotation and paperwork the bank ' +
                   'requires, but does not approve loans, set terms, or guarantee that any ' +
                   'application will be sanctioned.'
  },

  /* ============================================================
     STATE SUBSIDY — Odisha
     ------------------------------------------------------------
     Odisha pays an ADDITIONAL subsidy on top of the central
     PM Surya Ghar amount, under the Odisha Akshaya Shakti Bikash
     Yojana (OASBY), approved by the state cabinet in January 2025.

     >>> CONFIRM THESE SLABS BEFORE QUOTING <<<
     The state has publicly committed to additional assistance of
     "up to Rs 60,000 for systems up to 3 kW". The per-slab split
     below reflects the amounts currently reported, but news
     sources have differed on the exact split and state schemes
     get revised.

     Verify with OREDA (0674-2588260) or your discom, then
     correct the three numbers below.
     Set `enabled: false` to remove state subsidy from the site.
     ============================================================ */
  state: {
    enabled: true,
    name: 'Odisha',
    scheme: 'Odisha Akshaya Shakti Bikash Yojana (OASBY)',
    verifyWith: 'OREDA or your discom',

    // Additional STATE subsidy by installed capacity, in rupees.
    // Checked top-down: the first slab whose minKw you meet wins.
    slabs: [
      { minKw: 3, amount: 60000 },   // 3 kW and above
      { minKw: 2, amount: 50000 },   // 2 kW to under 3 kW
      { minKw: 1, amount: 25000 }    // 1 kW to under 2 kW
    ],

    // Your usual distribution company — TPCODL, TPNODL,
    // TPWODL or TPSODL. Reference only.
    discom: 'TPCODL'
  }
};

/* ---- Derived helpers — no need to edit below this line ---- */
SITE.waLink = function (msg) {
  const text = encodeURIComponent(msg || `Hello ${SITE.company}, I would like a free solar quote.`);
  return `https://wa.me/${SITE.whatsapp}?text=${text}`;
};
SITE.telLink = 'tel:' + SITE.phoneDial;
SITE.mailLink = 'mailto:' + SITE.email;
