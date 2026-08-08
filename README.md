# Bright Solar Engineering — Website

A complete, ready-to-publish website. No build tools, no npm, no server needed.
Double-click `index.html` to open it in your browser right now.

---

## ⚡ Everything lives in one file

Open **`assets/js/config.js`** in Notepad (or any text editor). Everything in it appears across all
seven pages — change it once, it updates everywhere. Contact details are already filled in from the
business card:

| Setting | Current value |
|---|---|
| `phone` / `phone2` | +91 99370 82488 · +91 94370 58255 |
| `whatsapp` | 919937082488 — **confirm this is the WhatsApp number** |
| `email` | brightsolarengg@gmail.com |
| `contactPerson` | Ardhendu Pattnaik, Partner |
| `addressLine1/2`, `addressState` | Pipili showroom — the address customers visit |
| `town` | Pipili — just the town name, used mid-sentence in the page copy |
| `regdLine1/2` | Andilo Balianta, Khurda — shown small, for invoices and legal use |
| `serviceArea` | all 30 districts of Odisha — the area you **supply** |
| `serviceAreaHome` | Pipili, Puri, Khurda and Bhubaneswar — the districts you reach quickly for a site visit and for service |
| `serviceState` | Odisha — used by the Google structured data |
| `mapEmbed` | Keyless Google Maps embed for the showroom — **check the pin** |

The blocks below that — `calc`, `pricing`, `finance`, `state` — control the calculator, panel
prices, the finance section and the Odisha subsidy. Those still need your real numbers.

---

## 📄 The pages

| File | What's on it |
|---|---|
| `index.html` | Home — hero (3D panel), why solar, both brands, what's included, subsidy summary, process, FAQ |
| `products.html` | Full panel catalogue with live filters by brand, technology and use |
| `subsidy.html` | Complete PM Surya Ghar guide — amounts, eligibility, documents, 8-step process, common rejection reasons |
| `calculator.html` | Savings calculator — bill in, system size / cost / subsidy / payback out |
| `learn.html` | Awareness content — how solar works, system types, panel tech, myths, maintenance, glossary |
| `about.html` | Your company, services, how you work |
| `contact.html` | Enquiry form + contact details + map |

---

## 🔧 Editing things

### Adding or changing a solar panel
Open `assets/js/data.js`. Each panel is a block like this:

```js
{
  id: 'wa-aditya-450',
  brand: 'waaree',            // waaree | vguard
  series: 'Aditya Series',
  name: 'Aditya Mono PERC',
  watt: 450,
  tech: 'monoperc',           // topcon | monoperc | poly
  bifacial: false,
  dcr: true,                  // true = eligible for subsidy work
  segment: 'home',            // home | commercial | offgrid
  cells: '144 half-cut cells',
  efficiency: '20.8%',
  warrantyProduct: '12 years',
  warrantyPower: '25 years linear',
  use: 'One line on who this panel suits.'
},
```

Copy a block, change the values, keep the commas. The catalogue page picks it up automatically.

### Changing your prices — do this before going live
In `assets/js/config.js`, under `calc:` → `costPerKw`. It's a list of rate bands:

```js
costPerKw: [
  { minKw: 10, rate: 48000 },   // 10 kW and above
  { minKw: 5,  rate: 52000 },
  { minKw: 3,  rate: 58000 },
  { minKw: 2,  rate: 65000 },
  { minKw: 0,  rate: 72000 }    // under 2 kW
],
```

Smaller systems cost more per kW because the inverter, structure and labour are
spread over fewer panels. **Put your real rates in here.** With the Odisha subsidy
the "you pay" figure is small, so an optimistic rate becomes a promise you have to keep.

### 📸 Adding your installation photos — do this one first

This is the highest-value thing left. Photos of real jobs convince people far more than words.

1. Drop your photos into `assets/img/projects/`
2. Open `config.js`, find `gallery`, and uncomment/edit one block per photo
3. Save. The "Our work" section appears on the home page.

Full instructions are in `assets/img/projects/READ-ME-FIRST.txt`.

**While the list is empty the whole section stays hidden**, so visitors never see an empty gallery.
Same applies to dealership certificates — drop them in `assets/img/certificates/` and list them under
`credentials`. They then appear on the About page. Check each scan and cover anything private
(bank details, ID numbers) before uploading — these go on a public website.

### Panel prices
In `config.js`, under `pricing.perWatt`. Rates are ₹ per watt, `[lowest, highest]`, panel only,
before GST — set per brand and per technology:

```js
perWatt: {
  waaree: { topcon: [24, 31], monoperc: [20, 26], poly: [17, 22] },
  vguard: { topcon: [23, 29], monoperc: [19, 25], poly: [16, 21] }
}
```

These sit at **retail** level, anchored on a verified listing: Waaree WSMD-540 sells at
₹13,296 incl. GST (₹23.5/W ex-GST) against a meaningless ₹27,279 "MRP". Trade/bulk is
around ₹15–15.50/W — that gap is your margin.

Every product card works out its own price band from these (wattage × rate) and shows a
**Negotiable** badge. Change a rate once and all 23 cards update.

**Set `pricing.enabled: false`** to hide every price and show "Price on request" instead —
useful if you'd rather quote privately.

⚠️ **These are market rates, not your rates.** Waaree and V-Guard don't publish
panel prices anywhere — they sell through distributors, so their websites carry specifications only.
The figures shipped here come from current Indian market data. **Replace them with your own dealer
rates before going live.**

### Bank finance
In `config.js`, under `finance`. The `procedureNote` is the important one. It now leads with the
line you asked for — **the criteria for availing a loan are as per bank norms** — then covers
eligibility, sanction, rate, tenure, documentation and disbursement all being the bank's decision,
and states you don't approve loans or guarantee sanction.

Eligibility is stated first on purpose: it's the thing customers most often assume the dealer
controls. Keep that wording, or something equivalent — it's what protects you when a customer's
loan is refused. It appears on the products page, and shorter versions of it are on the home page,
the calculator, the subsidy page and the enquiry form.

Set `finance.enabled: false` to remove the finance section entirely.

### Offers / what's included
In `config.js`, under `offers`. Six rows ship by default, drawn from what solar dealers across
India actually offer. **Delete any you won't honour** — every row is a promise a customer can quote
back at you. An empty list hides the whole section.

`highlight: true` gives a row the accent treatment. Two are set by default; more than that and it
stops meaning anything.

`offers.seasonal.text` shows a festive banner. Leave it blank to hide it. Use real Odia occasions —
Raja, Rath Yatra, Diwali — with an honest `until` date, rather than permanent "limited time" copy
that nobody believes.

**One honest caveat:** free maintenance for the first years is part of MNRE's quality standards for
rooftop solar, not a favour. Competitors advertising "FREE 5-YEAR AMC!" are selling something the
customer is owed anyway. The site says "included", which is the truthful framing. Market rate if you
ever charge for it is ₹2,500–₹4,000 per kW per year residential.

### Banks that finance solar
In `config.js`, under `finance.banks`. Six banks known to run PM Surya Ghar loans, with indicative
rates. **Set `finance.showRates: false` to list names only** — the safer option, since rates move
with each bank's RLLR/EBLR and you don't control them. Sources disagreed on SBI's rate (7.15% vs
7.25%), which is exactly why every figure says "around" and the note tells customers to confirm at
the branch.

### Odisha state subsidy slabs
Also in `config.js`, under `state:`. See the accuracy note at the bottom of this file
before you rely on the slab amounts.

### The logo
The logo is **inline SVG**, repeated in the header and footer of all seven pages. It's a vector
redraw of your printed logo, so it stays sharp at any size and needs no image file.

- Brand colours live at the top of `assets/css/style.css` (`--brand-navy`, `--brand-orange`, `--brand-green`)
- The letters flip white automatically on dark backgrounds via `--logo-ink`
- Your original photo is kept at `assets/img/logo-original-photo.jpg` for reference

**Standalone logo files** you can use anywhere — WhatsApp Business profile, quotations, invoices,
letterheads, van signage, social media:

| File | What it is |
|---|---|
| `assets/img/logo.svg` | The BSE mark on its own |
| `assets/img/logo-full.svg` | Mark + "BRIGHT SOLAR ENGINEERING" + tagline |
| `assets/img/logo-original-photo.jpg` | Your original printed card, kept for reference |

SVG is vector — it scales to a billboard without going blurry. To get a PNG or JPG for apps that
won't take SVG, open the `.svg` in Chrome, screenshot it, or use a free converter like cloudconvert.com.

**Note for a printer:** the wordmark in `logo-full.svg` uses live text, not outlined text. Any print
shop can rebuild it in Illustrator from these files and colours — the exact brand values are at
the top of `assets/css/style.css`.

⚠️ **Your printed logo has a typo:** the wordmark reads "BRIGHT SOLAR **ENGNEERING**" — the *I* is
missing from ENGINEERING. The website spells it correctly everywhere. Get the artwork fixed before
ordering more cards, letterheads or signage.

### Your own story on the About page
The About page is written and is true as it stands. Three things are still missing, because
only you know them — there is a marked comment above the "Our story" section listing them:

- the year you started, and what you did before solar
- how many systems you have commissioned so far
- who is on the team, and who does the electrical work

One real number ("41 systems since 2019") does more for trust than any adjective on the page.

**Why the page talks about supply and service separately.** You sell across Odisha, but your
installation and service teams work outward from Pipili. The page says exactly that, and the
two areas are two separate settings (`serviceArea` and `serviceAreaHome`). Keep them apart —
a statewide *service* promise is one you would have to keep in Sundargarh at your own cost.

---

## 📬 How the enquiry form works

Right now, submitting the form opens WhatsApp with all the details pre-filled — the customer
just presses send. No server, no hosting cost, and the lead reaches your phone instantly.

**If you'd rather receive emails instead**, sign up free at [formspree.io](https://formspree.io),
then in `contact.html` change:

```html
<form data-wa-form novalidate>
```
to
```html
<form action="https://formspree.io/f/YOURFORMID" method="POST">
```

---

## 🌐 Putting it online

**Easiest, free:** go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag this
entire folder onto the page. You get a live URL in about thirty seconds. Connect your own
domain later from the Netlify dashboard.

**Other free options:** GitHub Pages, Cloudflare Pages, Vercel — all work the same way.

**If you buy hosting:** upload every file and the `assets` folder via FTP to the `public_html`
directory, keeping the folder structure exactly as it is.

---

## ✅ Before you go live — checklist

Already done:

- [x] Phone, second phone, email and contact person — from the business card
- [x] Showroom and registered addresses, service area
- [x] Google Maps embed (keyless search embed — **check the pin is in the right place**)
- [x] Logo, tagline and brand colours
- [x] Owner photo on the About page — cropped, background removed, location data stripped
      (`assets/img/team/`). To swap it, save a new file over the old one with the same name.

Still yours to do:

- [ ] **Confirm 99370 82488 is the WhatsApp number** — the WhatsApp button uses it
- [ ] **Confirm the Odisha OASBY subsidy slabs** with OREDA on 0674-2588260 (see below)
- [ ] **Replace the panel ₹/W rates and installed-system prices with your own**
- [ ] Match `calc.costPerKw` to your actual rates — it drives the "you pay" figure
- [ ] Add your start year, systems-installed count and team to `about.html` (marked with a
      comment in the file) — the rest of the About page is written and needs nothing
- [ ] Confirm which discoms you are actually **empanelled** with. The About page tells
      customers to ask this; make sure your own answer is ready
- [ ] Test the WhatsApp and call buttons on a real phone
- [ ] Add real photos of your installations — the single biggest trust gap remaining
- [ ] **Strip location data from any photo before you publish it.** Phone cameras save GPS
      coordinates inside the file, and a website visitor can read them. In Explorer:
      right-click the file → Properties → Details → *Remove Properties and Personal
      Information*. The owner photo has already been cleaned.
- [ ] Consider claiming a **Google Business Profile** for the Pipili showroom, then swap
      `mapEmbed` for the exact embed link. It also puts you on Google Maps searches locally.

---

## 📝 Accuracy notes

Panel specifications in `data.js` were compiled from the manufacturers' published product
pages and datasheets. **Module ratings change between production series** — confirm the
current datasheet before quoting a customer. The `Datasheet ↗` button on every product card
links to the manufacturer's own catalogue.

**Central subsidy** follows PM Surya Ghar Muft Bijli Yojana as notified by the Government of India:
₹30,000/kW for the first 2 kW, ₹18,000 for the third, capped at ₹78,000; ₹18,000/kW for group
housing common facilities up to 500 kW. Official portal: [pmsuryaghar.gov.in](https://www.pmsuryaghar.gov.in/).

### ⚠️ Odisha state subsidy — verify the slabs

**This is the one thing on the site you must confirm yourself.**

What is well established: the Odisha cabinet approved additional state assistance for rooftop
solar in **January 2025** under the **Odisha Akshaya Shakti Bikash Yojana (OASBY)**, committing to
**up to ₹60,000 for residential systems up to 3 kW** on top of the central subsidy. The state
budgeted ₹890 crore for 2025–26 and ₹495 crore in the 2026–27 budget, targeting ~3 lakh households.

What is **less certain**: the exact per-kW split. The site currently uses ₹25,000 / ₹50,000 / ₹60,000
for 1 / 2 / 3 kW, which is the most commonly reported breakdown and matches the confirmed ₹60,000
ceiling — but at least one report described the slabs differently, and state schemes get revised.

**Before you publish:** ring OREDA on **0674-2588260** or your discom, confirm the current slabs,
and correct them in `assets/js/config.js` under `state.slabs`. Set `state.enabled: false` to remove
state subsidy from the site entirely.

### Odisha net metering (OERC)

Rules shown on the site: net metering from 1 kWp to 500 kWp or up to sanctioned load, whichever is
lower; total solar capped at 75% of the local distribution transformer; no feasibility study
required up to 10 kW; surplus carried forward between billing cycles within the financial year;
credited generation capped at 90% of consumption over the settlement period; hybrid inverters and
M2M data loggers permitted following a November 2025 amendment.

Regulator: [orierc.org](https://www.orierc.org/). The four Odisha discoms — TPCODL, TPNODL, TPWODL,
TPSODL — are all Tata Power / Government of Odisha joint ventures.
