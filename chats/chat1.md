# Digital Agency Proposal Tool

_Started 2026-05-18 13:44 UTC_

---

## User

<system-info comment="Only acknowledge these if relevant">
Project title is now "Proposal"
Current date is now May 18, 2026
</system-info>

<pasted_text name="Pasted text (19 lines)">
Jeg ønsker at lave en proposal generator-side, hvor jeg lynhurtigt kan lave nye tilbud til kunder. Jeg vil gerne have, at denne proposal-side er dynamisk, så jeg hurtigt kan lave en ny for en kunde, hvor de får deres egen unikke URL, som dette proposal ligger på.

Proposal-siden skal bestå af:

1. **Selve tilbuddet**: Her skal man kun se de forskellige ydelser, som vi kan hjælpe med. Der skal være nogle standardydelser, man kan tilføje, og så skal man kunne lave nogle specifikke ekstra ydelser, hvor man selv skriver tingene ind. 

   Jeg forestiller mig, at der er vores forskellige ydelser, og så kan man markere dem med en toggle-funktion, eller man kan selv skrive sin egen linje og tilføje det. 

   Tilbuddet skal kun læses, og jeg forestiller mig faktisk også, at der skal være nogle faner ude i venstre side. Øverste fane er tilbud. Den kan man trykke på, og så kan man se det overordnede tilbud, hvilke services vi kan hjælpe med, og hvad det koster. 

   Du skal kunne trykke på de forskellige services, og så skal den udvide sig, så man kan se, hvad den enkelte service faktisk består af. Forestil dig lidt sådan et kort, hvor der står eksempelvis "digital marketing". Man kan trykke på det, og så er der en accordion-funktion, som udvider kortet og fortæller, hvad denne service består af, og hvad den koster. Det skal også stå uden på kortet, og så skal der være en samlet pris nede i bunden. 

2. **Referencer**: Her skal vi selv kunne vælge mellem nogle standardreferencer, vi har, eller selv tilføje nogle ekstra. Der skal både være referencer for annoncer, og der skal være referencer for hjemmesider, samt referencer for grafisk materiale. Det kan være flyers eller lignende. 

   Eksempelvis, når man ser annoncerne, skal det være et mockup på, hvordan en Meta Ads-annonce eksempelvis ser ud, så man virkelig kan forestille sig, hvordan det kommer til at se ud visuelt. 

Det er faktisk de to faner, jeg forestiller mig: en, der hedder tilbud, og en, der hedder referencer. Under referencerne skal man kunne se eksempler på det tilbud, man har fået. 

Eksempelvis, hvis det er Meta Ads, man har fået tilbud på, skal man kunne se nogle forskellige ads under referencerne, og det skal være nemt at forstå sammenhængen mellem de to ting: tilbuddet og referencen. 
</pasted_text>

<!-- The user explicitly selected the following skills for this project, as attachments to their message. These are not optional context — they define how you work. Use them. -->
<attached-skill name="Hi-fi design">
Create a high-fidelity, polished design. Follow the instructions about design in your system prompt, particularly the 'How to do design work' section. Use the design_canvas starter component, or make a full-bleed prototype and offer options via Tweaks.
</attached-skill>

<attached-skill name="Interactive prototype">
Create a fully interactive prototype with realistic state management and transitions. Use React useState/useEffect for dynamic behavior. Include hover states, click interactions, form validation, animated transitions, and multi-step navigation flows. It should feel like a real working app, not a static mockup.
</attached-skill>

<attached-skill name="KEYO Design System (design system)">
[Design System] This project uses the **KEYO Design System** design system. This is a binding choice for visual style — every visual must follow it. Don't invent colors, type, spacing, or components not grounded here.

Scope: the design system is a visual style reference only. Its guide may describe example products, brands, or people that are unrelated to the user and unrelated to the subject of this conversation. Never treat anything in the design system as a fact about the user, their work, or the topic they asked about.

    Explore it to find what you need:
    - Always copy out the fonts and colors you need
    - For prototypes and designs, always copy out any relevant components
    - If the design system contains existing mocks of products, and you were asked to design or prototype something similar, copy and fork those mocks to start your design. This helps you make high-quality designs.
    
    Explore it quickly to find relevant UI kits (e.g. mocks of existing products you can copy and fork)

Full system at `/projects/ac847cd7-b772-4976-87e8-024d06f6e6c0/`. Its guide is reproduced below so you don't need to fetch it:

<design-system-guide>
# KEYO Design System

KEYO bygger digital markedsføring og datadrevne værktøjer til
**ejendomsmæglere**. Vi hjælper mæglere med at få flere, bedre leads,
holde styr på køberkartoteket og måle effekten af hver eneste indsats —
fra betalte kampagner og organisk social til prisberegnere og en
backend, der binder hele markedsføringen sammen. Alt vi laver er drevet
af tal, og målt på resultater i mæglerens forretning.

> Visual direction is inspired by **Legora** (legora.com). The KEYO design uses
> the same restrained, editorial sensibility — a single sans-serif typeface
> (Inter), a deep "forest" green, paper-warm neutrals, and warm full-bleed
> imagery — adapted to the KEYO wordmark and the Danish real estate market.

## Sources

- **Figma** — `KEYO.fig`, page `/Aktiv/Hjemmeside` (Legora frame used as
  visual reference; content is _not_ used — KEYO is real-estate, not legal).
- **Reference site** — https://legora.com/ (visual treatment only)
- **Uploaded assets** — `uploads/Logo.svg` (KEYO wordmark), Inter font family
  (18 / 24 / 28 pt optical sizes), `uploads/Menu.png`.

---

## Index

| File / folder | What's in it |
| --- | --- |
| `README.md` | This file. Brand, content fundamentals, visual foundations, iconography. |
| `SKILL.md` | Agent-skill entry point (Claude Code compatible). |
| `colors_and_type.css` | All design tokens — colors, type, spacing, motion, glass. Import this first. |
| `fonts/` | Inter TTFs (18 / 24 / 28 pt optical sizes). |
| `assets/` | Logos, hero imagery, broker / property imagery, certification icons. |
| `preview/` | 32 cards across Type, Colors, Spacing, Components, Brand — populates the **Design System** tab. |
| `ui_kits/website/` | High-fidelity recreation of the KEYO marketing site — `index.html` + 11 JSX components (Nav, Hero, TrustedBy, Products, Practices, ROIBanner, Stats, Vision, Security, Footer, parts). |

---

## Brand at a glance

| | |
| --- | --- |
| **Navn** | KEYO |
| **Kategori** | Datadrevet markedsføringsplatform for ejendomsmæglere |
| **Målgruppe** | Ejendomsmæglerkæder, enkeltmæglere, mæglerforretninger i hele Danmark |
| **Tagline** | _Salg, drevet af data._ |
| **Subhead** | _Markedsføring, køberkartotek og indsigt — bygget til mæglere._ |
| **Primary CTA** | Book en demo |
| **Wordmark** | Custom geometric letterforms (uppercase K · E · Y · O) — see `assets/keyo-wordmark.svg` |

---

## CONTENT FUNDAMENTALS

### Hvem taler vi til
Indehavere, partnere og marketing­ansvarlige hos danske
ejendomsmæglerforretninger. De er travle, kommercielle og kender deres
egne tal bedre end nogen ekstern leverandør. De har set rigeligt af
"marketing-bureauer" og er trætte af hypede løfter uden tal at vise frem.

KEYO skriver derfor som en **resultat­fokuseret partner**, ikke som et
bureau. Tonen er rolig, præcis og taldreven — vi viser hellere et tal end
en flot tillægsord. Vi sælger ikke "vision", vi sælger mærkbare effekter
på mæglerens forretning.

### Voice
- **Sprog:** Dansk. Engelske termer ("dashboard", "leads", "PPC") bruges
  hvor de er almindelige i branchen, men vi krydsoversætter ikke
  ("Lead-backend" → ikke "lead-baghaver").
- **Sætninger:** Korte og konkrete. Slut gerne med et tal eller en
  benchmark. Ingen filler-ord ("som bekendt", "vi tror på").
- **Stemme:** "vi" om KEYO. "du / din" om mægleren. Aldrig "jeg".

### Casing
- **Sentence case** overalt, også på knapper og eyebrows.
  ✓ `Book en demo`   ✓ `Læs mere`   ✗ `BOOK EN DEMO`
- Overskrifter slutter ofte med punktum: _"Salg, drevet af data."_
- Produktnavne i Title Case: _Køberkartotek_, _Prisberegner_,
  _Lead-backend_, _Betalte kampagner_, _Organisk social_.
- "KEYO" altid versaler. "AI" altid versaler.

### Tone of UI strings
- Labels: ét eller to ord, sentence case (`Produkt`, `Løsninger`,
  `Sikkerhed`, `Kunder`, `Virksomhed`).
- Knaptekst: imperativ + objekt (`Book en demo`, `Læs mere`, `Se rapport`).
- Eyebrows er korte og rolige: lowercase eller sentence case, aldrig
  set-versaler med tracking.
- Tal er hovedpersonen. Brug konkrete tal: `+38%`, `2.4 mio eksponeringer`,
  `186 leads`, `3.2× ROI`. Aldrig "mange", "massive", "kæmpe".

### Eksempler fra produkterne

> **Hero** — "Salg, drevet af data." / "Markedsføring, køberkartotek
> og indsigt — bygget til mæglere."
>
> **Sektion** — "Hele markedsføringen, samlet ét sted."
>
> **Sektion subhead** — "Fra første visning til underskreven slutseddel.
> KEYO samler kampagner, leads og kartotek, så du kan måle hvad der
> faktisk virker."
>
> **Produktkort** — "Køberkartotek — Et levende register af aktive
> købere, matchet med dine boliger i øjeblikket de kommer på markedet."
>
> **Vision** — "Mæglerfaget vinder ikke på flotte ord. Det vinder på tal.
> KEYO bygger værktøjerne, der gør de tal til daglig drift."

### Hvad KEYO aldrig gør
- **Ingen emoji.** Hverken i marketing eller produkt.
- **Ingen udråbstegn.**
- **Ingen tomme tillægsord** — "innovativ", "banebrydende", "unik",
  "magisk", "verdens bedste". Vis tallet i stedet.
- **Ingen "vi tror på" / "passion" / "drømme"-sætninger.**
- **Ingen procenttal uden grundlag.** Hvert tal skal kunne forklares.

---

## VISUAL FOUNDATIONS

### Palette
A near-monochrome paper-and-ink palette punctuated by a single, deep brand
green. See [`colors_and_type.css`](./colors_and_type.css) for the full token
set.

| Role | Token | Value | Notes |
| --- | --- | --- | --- |
| Primary brand | `--keyo-green` | `#005032` | CTAs, footer wordmark, eyebrow labels, accent stat |
| Primary ink | `--ink-900` | `#0D1016` | Body text, dark sections |
| Muted ink | `--ink-500` | `#68655E` | Body alt, captions, eyebrow on light |
| Page (paper) | `--paper` | `#FAFAF9` | Default canvas — warm, _not_ pure white |
| Feature panel | `--bone` | `#E1DFDA` | Vision/feature panel background — warm beige |
| Dark panel | `--ink-900` | `#0D1016` | Security section background |
| Hairline | `--ink-300` | `#D0CDC8` | Dividers on light; only ever 1px |

The palette is purposely small. Don't introduce additional hues; if more
contrast is needed, reach for the bone panel or the ink-900 panel.

### Typography
- **Inter** as the only family. Heavy use of weight 500 (medium) at small
  sizes; display sizes also set in **Medium**, never Light.
- Tight negative tracking on display sizes (`-2.88px` at 92px); neutral
  tracking on body.
- Line-height is dense: 1.10 for headlines, 1.46 for body.
- **No serif.** No italic. No SmallCaps.

### Spacing — 4 / 8 / 16 / 24 system
Base unit **4px**. Scale: **4 · 8 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192**.
Use small steps (4–24) inside components, large steps (48–192) between
sections.

### Layout
- 1920 × N desktop canvas. Content lives inside a **1680px container**
  with **120px** outer gutters.
- Page is a long, single-column scroll of full-bleed bands. Bands
  alternate between `--paper`, `--bone` and `--ink-900`.

### Backgrounds & imagery
- Full-bleed photography is core: **boliger** (smukke danske hjem),
  **arbejdspladser** (åbne kontorer, mæglere på tablet), **byliv**
  (golden-hour bygader), **portrætter** af mæglere og kunder. Altid
  warm-toned, golden-hour eller overskyet — aldrig kølig / blå.
- Photo overlays bruger top- og bottom-darken (`--overlay-hero`).

### Glass — NEW
Translucent panels med backdrop-blur bruges på:
- Nav dropdowns (`.k-glass` over imagery eller paper).
- Sekundære overlay-paneler i produkt-screenshots (fx kommandopalette /
  filter dropdown).

Glass bruges **ikke** som floating HUD-bar oven på hero-fotos — det er
tilvalgt fra. Dropdown/menu er det primære use case.

Tokens i `colors_and_type.css`:
- `--glass-dark-bg` `rgba(13,16,22,0.42)`
- `--glass-light-bg` `rgba(250,250,249,0.62)`
- `--glass-blur` `saturate(150%) blur(28px)`
- `--glass-radius` `14px`, `--glass-radius-bar` `999px`

Brug klasserne `.k-glass` (mørk), `.k-glass.k-glass--light` (lys),
`.k-glass.k-glass--bar` (pille / toast i nav), `.k-glass.k-glass--strong`
(stærkere blur til større paneler).

### Borders, radii, shadows
- **Corner radius er 0 by default.** Kort, paneler og media-frames har
  skarpe 0–2px hjørner. De eneste runde former er pille-CTA'en (`48px`)
  og små cirkulære nav-arrows (`999px`). Glass-elementer bruger `14px`.
- Hairlines er præcis **1px** i `--ink-300` på lys, `--ink-700` på mørk.
- **Ingen drop shadows** på normale kort. Glass-paneler bruger en blød
  `--glass-shadow` til at "løfte" sig.

### Motion & interaction
- Hover: `opacity: 0.7` på links; `background: var(--keyo-green-700)` på
  primary button.
- Active/press: ingen scale transforms. Bare farveskift.
- Easings: `cubic-bezier(0.2, 0, 0, 1)` (standard), `cubic-bezier(0.16, 1, 0.3, 1)` (out).
- Durations: `120ms` / `220ms` / `480ms`.

### Cards
Standardkortet er borderless og shadowless: et højt foto med label sat i
hvidt øverst, og support-tekst i `--fg-2` under billedet. Kortet er ren
visuel rytme — ingen indrammende border.

### Transparency, blur
Bruges nu mere — se Glass-sektionen ovenfor. Resten af systemet er
fortsat stort set opacity-fri.

### Layout rules / fixed elements
- Top nav er fuld-bleed `--paper`, 72px høj. På scroll over imagery
  skifter den til `.k-glass`-look. Wordmark dødcentreret, links left,
  Log ind + Book en demo right.
- Footer: link-kolonner på `--paper`, derefter en stor `--keyo-green`
  wordmark.

---

## ICONOGRAPHY

KEYO's iconography er bevidst diskret. Sitet læner sig mod fotografi
frem for ikoner.

### Inventory of icons that actually appear
- **`↳` (U+21B3)** — arrow link glyph. Workhorse. Sat inline med label.
- **Hairline carousel chevrons** — tynde 1.4px streger i 24px cirkulær
  `--ink-200` chip. Bruges på carousel-controls.
- **Pill-button trailing chip** — 20×20 hvid cirkel i grøn CTA med lille
  pil-glyph.
- **Trusted-by logoer** — mæglerkæder + samarbejdspartnere (Bolig­sites,
  Boligsiden m.fl.). Monokrom, ~24px høj.
- **Certification-ikoner** — ISAE 3402, GDPR, DPA m.fl. i 48×48 mono i
  den mørke security-panel.

### No icon font, no Lucide, no Heroicons
Sitet bruger essentielt **ingen UI-ikoner** udover ovenstående. Hvis et
interface kræver et ikon (fx hamburger på mobil), brug
**[Lucide](https://lucide.dev/)** ved `stroke-width: 1.5` matchet
text-color. Det er en substitution, ikke en del af brand-systemet.

### Emoji
**Aldrig.** Hverken i marketing, produkt eller error states.

### Unicode glyphs
Tilladt og brugt målrettet:
- `↳` — arrow links.
- `™` efter produktnavne — `KEYO aOS™`.
- `©` i footer.
- `&` i egennavne.
- `—` em dash og `–` en dash i prosa. Aldrig hyphens i prosa.

### Logos & wordmarks
- `assets/keyo-wordmark.svg` — primary KEYO wordmark, sat med
  `fill="currentColor"`. Brug `--keyo-green` på lys baggrund, `#FFFFFF`
  på mørk. Strækkes, beskæres eller roteres aldrig.

---

## Substitutions flagged for the user

- ⚠ **Hero / bolig-fotografi.** Den nuværende hero bruger en city-skyline
  fra Legora-referencen. Til KEYO bør den udskiftes med dansk
  bolig-fotografi (smukke villaer, lejligheder ved golden hour eller
  åbent-hus-stemninger). Send venligst final foto-pakke.
- ⚠ **Trusted-by-logoer** er placeholders. Send mæglerkæder /
  samarbejdspartnere du vil vise.
- ⚠ **Inter Display 28pt** bruges som display-face. Display weight er nu
  Medium (500) per dit feedback — Light er ikke længere brugt.

---

## How to use

1. Drop `colors_and_type.css` into your project.
2. Brug semantiske klasser (`.k-h1`, `.k-body`, `.k-btn`, `.k-glass`,
   `.k-arrow`, `.k-container`) eller hent tokens via `var(--fg-1)` osv.
3. Kopier fra `ui_kits/website/` til hi-fi-layouts.
4. I tvivl: færre farver, mere luft, lavere kontrast på support-tekst,
   ingen pynt. Brandet vinder tillid ved at se afmålt ud.

</design-system-guide>

CSS tokens: the guide may describe tokens in prose, but the exact `--*` names are defined in the design system's stylesheet(s) (`/projects/ac847cd7-b772-4976-87e8-024d06f6e6c0/colors_and_type.css`, `/projects/ac847cd7-b772-4976-87e8-024d06f6e6c0/preview/_card.css`). The 104 custom properties it defines are:

--accent, --accent-fg, --bg-card, --bg-dark, --bg-feature, --bg-page, --bone, --bone-deep, --border, --border-on-dark, --canvas, --dur-base, --dur-fast, --dur-slow, --ease-out, --ease-standard, --fg-1, --fg-2, --fg-3, --fg-on-dark, --fg-on-dark-muted, --font-display, --font-sans, --fs-body, --fs-body-sm, --fs-caption, --fs-display, --fs-h1, --fs-h2, --fs-h3, --fs-h4, --fs-lead, --fs-micro, --fw-bold, --fw-light, --fw-medium, --fw-regular, --fw-semibold, --glass-blur, --glass-blur-strong, --glass-dark-bg, --glass-dark-border, --glass-light-bg, --glass-light-border, --glass-radius, --glass-radius-bar, --glass-shadow, --gutter, --gutter-sm, --hairline, --hairline-dark, --ink-200, --ink-300, --ink-400, --ink-500, --ink-600, --ink-700, --ink-800, --ink-900, --keyo-green, --keyo-green-300, --keyo-green-700, --lh-body, --lh-display, --lh-h1, --lh-h2, --lh-h3, --lh-h4, --lh-tight, --max-w, --overlay-card, --overlay-eyebrow, --overlay-hero, --paper, --paper-100, --paper-50, --r-0, --r-1, --r-full, --r-pill, --shadow-none, --shadow-soft, --space-1, --space-10, --space-2, --space-3, --space-4, --space-5, --space-6, --space-7, --space-8, --space-9, --space-l, --space-m, --space-s, --space-xl, --space-xs, --space-xxl, --tracking-body, --tracking-display, --tracking-h1, --tracking-h2, --tracking-h3, --tracking-h4

Only use `var(--*)` names from that list. Never guess a token name — an unresolved `var()` silently falls back to the browser default.

For assets and UI kits beyond the guide: `read_file("/projects/ac847cd7-b772-4976-87e8-024d06f6e6c0/<path>")` and `copy_files` to bring them into the current project.
</attached-skill>

## Assistant

_[tool: questions_v2]_

Spændende projekt! Før jeg går i gang vil jeg lige stille et par fokuserede spørgsmål så jeg rammer rigtigt — særligt omkring hvilke ydelser/referencer der skal være standard, og hvordan admin/kunde-flowet skal hænge sammen.

## User

Questions answered:
- scope: Begge — admin builder + kunde-view i samme prototype (med toggle)
- standard_services: Meta Ads (Facebook + Instagram), Organisk social (Instagram/TikTok), Lead-backend / CRM, Prisberegner på hjemmeside, Månedlig rapportering, Køberkartotek opsætning
- pricing_model: Begge — nogle er månedlige, andre engangs
- client_info: Kundens navn / mæglerkædens logo, Kort personlig hilsen / intro
- reference_categories: Meta Ads (Facebook/Instagram-mockup i feed), Grafisk materiale (flyers, brochurer), Landing pages
- reference_linking: Manuel: jeg vælger selv hvilke referencer der vises pr. proposal
- ad_mockup_fidelity: Tæt på rigtige men forenklede
- variations: Én polished version (jeg ved hvad jeg vil have)
- accordion_behavior: Flere kan være åbne samtidig
- extras: Print/PDF-eksport for kunden, Estimerede resultater pr. service (forventede leads/ROI), Det kunne være fedt med en Calculator for blandt andet prisberegneren og køberkartotek

## Assistant

_[tool: list_files]_

_[tool: update_todos]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: copy_files]_

Got it. Plan is clear — let me build a single prototype with admin/client toggle, two tabs (Tilbud/Referencer), accordion service cards with calculators for Prisberegner and Køberkartotek, and visual mockups for references.

Copying KEYO assets I need first:

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: done]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Klar — proposal generatoren er bygget.

**Hvad den indeholder:**
- **To faner** i venstre sidebar: Tilbud + Referencer, med live tællere
- **Admin/Kunde toggle** nederst i sidebaren — switcher mellem builder-tilstand og det rene kunde-view
- **Unik URL pr. proposal** (`?id=…` i topbaren, klik for at kopiére) — hver kunde får sin egen, gemmes i localStorage
- **Tilbud-fanen**: editerbar overskrift + hilsen, 6 standardydelser med toggle (Meta Ads, Organisk social, Lead-backend, Prisberegner, Køberkartotek, Rapportering), accordion-kort (flere kan være åbne samtidigt), inkluderet-liste, forventet effekt, og to interaktive **calculators** på Prisberegner (besøgende × konvertering = leads) og Køberkartotek (boliger × match-rate). "+ Tilføj specifik ydelse" hvor du selv skriver pris og deliverables.
- **Referencer-fanen**: tre underkategorier (Meta Ads, Grafisk materiale, Landing pages) med visuelle mockups — Facebook/Instagram-feed annoncer med profil, billede, CTA-bar; A4-flyers med adresse/m²/pris/mægler; landing pages i browser-frames med form-side. Toggle pr. reference styrer hvad kunden ser.
- **Totals** nederst splittet i månedligt + opstart engangs
- **Print/PDF**-knap i kunde-view — print-stylesheet skjuler kontroller og fravalgte kort

**Sådan bruges den:** Åbn i admin, juster ydelser/referencer/hilsen, klik "Del med kunde" for at kopiére URL'en, eller skift til Kunde-view for at se hvad de ser.

**Næste skridt hvis du vil:** rigtige ejendomsfotos til reference-mockups, KEYO-logo som SVG i sidebaren (jeg bruger en simpel tekst-SVG nu), eller et "Accepter tilbud"-flow.

## User

Verifier agent check completed

## Assistant

_[tool: str_replace_edit]_

_[tool: done]_

Title fixed — i admin er klientnavnet nu et inline auto-sized input felt uden den løsrevne prik, og i kunde-view sidder punktum lige efter navnet som det skal.

## User

Jeg synes, vi har det, der ligner en wireframe nu. Du benytter da ikke 100% af Kios design system. Det må gerne være mere moderne i sit udtryk. Der må gerne benyttes noget glas effekt. Der må gerne være, visualt må det bare gerne være mere interessant og spændende. Lige nu er det meget bokset og firkantet, og det er egentlig ikke det, vi lægger op til i vores design system. Så kig gerne det dybt igennem. Ja, for at For en bedre version

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

Forstået — jeg laver en version med fuld editorial KEYO-følelse: full-bleed hero med foto, glass-paneler over imagery, varmere farver, større display-typo, og rytme mellem sektioner. Lad mig først kigge på hvordan KEYO bruger hero/glas.

_[tool: read_file]_

_[tool: image_metadata]_

_[tool: image_metadata]_

_[tool: image_metadata]_

_[tool: write_file]_

Going to rebuild the visual layer — full-bleed hero with photo + glass topbar, editorial service rows instead of boxes, dark totals band, refined references gallery.Now the offer tab with hero + editorial service rows + dark totals band:

_[tool: write_file]_

Now references tab + app update:

_[tool: write_file]_

_[tool: write_file]_

_[tool: done]_

_[tool: snip]_

_[tool: fork_verifier_agent]_

Stor opdatering klar — fuld editorial KEYO-fornemmelse:

- **Full-bleed photo hero** med dark overlay og dansk bolig-foto, glass meta-card øverst (Tilbud · Dato · Gyldig · Forberedt af), display-size titel hvor klientnavnet står i KEYO-grøn, hilsen, og chips med valgte ydelser
- **Stor pris i højre hjørne af heroen** — display-typo i grøn
- **Glass topbar** der starter transparent over hero og bliver lys-glass med blur når man scroller (alle CTAs er glass-piller)
- **Service-rækker i stedet for bokse** — 01, 02 nummerering, titel i 26px, hairline imellem, animeret chevron-knap der bliver mørk når åbnet. Åbnet kort får subtil bone-baggrund + grøn nummerering
- **Forventet effekt som split panel**: venstre celle er ink-900 mørk med tallet i grøn display, højre er lys
- **Calculator er nu et glass-light panel** med rigtige range-sliders, grøn thumb, output i display-font og grøn
- **Dark totals-band** i ink-900 med radial green glow, 3 kolonner: månedligt (grøn display-tal), opstart, og første 12 måneder — plus pille-CTA "Accepter tilbud" i kunde-view
- **Referencer-fanen** har sin egen editorial hero (paper, ikke foto, type-driven), glass pill-style tabs, og en bredere mockup-grid (flyers nu 3-up)
- **Sidebar** har KEYO-wordmark som SVG øverst, 01/02 indekser, og active tab har bone-baggrund + grøn 2px venstre-bjælke

Glass-effekt sidder nu på topbar, hero meta-card, hero chips, kategori-tabs og calculator — alt sammen i tråd med KEYO's glass tokens.

## User

Der er mange ting som ikke stemmer overens med vores design system

## Assistant

_[tool: write_file]_

Du har ret — jeg går igennem og fjerner det der ikke matcher. Tydelige brud på systemet jeg så:

1. **Uppercase/tracking på eyebrows** (systemet siger sentence case, ingen tracking) — fjernes
2. **Glass HUD-card oven på hero** (eksplicit *fravalgt* i systemet) — fjernes
3. **Drop shadows** på flyer, browser, ad-card (systemet er shadowless) — fjernes
4. **Border-radius** 8-10px på browser/ad-card (systemet bruger 0-2px, kun pills/glass undtagne) — strammes
5. **Hero typografi** for stor (92px) — KEYO's hero bruger k-h1 (56px) centreret
6. **Sidebar active tab** med grøn venstre-streg (slop-pattern) — udskiftes
7. **Copy-tone**: "flytte tal" osv. er for flowery — direkte taldrevet

Ordner det nu.Nu opdaterer jeg hero+offer-tab så det matcher: ingen glass-HUD, k-h1 centreret, meta som ribbon under hero, tonet copy.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Also clean the references hero copy and tab references styling:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

Opdateret med systemtro tilpasninger:

- **Eyebrows**: sentence case, ingen tracking, ingen uppercase — overalt
- **Hero**: glass HUD-card fjernet (var eksplicit fravalgt). Nu centreret med k-h1 (56px) og fs-lead, fast på systemets typografi
- **Meta** flyttet til en stille paper-ribbon direkte under heroen (Forberedt for/af · Dato · Gyldig)
- **Shadows fjernet** fra flyer og browser-frame (Meta Ads beholder Facebook/Instagram-platform-skygger da det er ekstern UI)
- **Radii** strammet: browser nu r-1 (2px), flyer 0, ad-card beholder 8px da det er Facebook's eget format
- **Sidebar tab** uden grøn venstre-bjælke (slop-pattern fjernet). Aktiv tab er nu kun ink-900 farve + grøn nummer
- **CTAs**: alle bruger nu k-btn proportioner — 30px høj, pille, k-btn__chip 20×20
- **Calc** bruger nu var(--glass-light-bg) + glass-radius direkte fra systemet
- **Mode-pille** bruger bone (system-token) i stedet for ink-200
- **Typografi**: alle størrelser refererer var(--fs-h1/h2/h3/h4) i stedet for hardcoded clamp-værdier
- **Copy** tonet ned: "Tilbud til X" (ikke Forslag), "ydelser, sammensat til at flytte leadstrømmen" — taldreven, ikke flowery

Sig til hvis der stadig er ting der skurrer — så fortsætter jeg.

## User

Du må genre lave hero på tilbudssiden tilbage i samme design som inden du opdaterede det igen

## Assistant

## User

Prøv igen

## Assistant

_[tool: str_replace_edit]_

Tager hero'en tilbage til den tidligere version — glass meta-card, display-størrelse, chips og samlet pris i bundkant.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

Hero er tilbage til den tidligere version — full-bleed foto, display-titel (92px) med klientnavn i grøn, glass meta-card øverst til højre, chips med valgte ydelser, og samlet pris i bunden til højre. Resten af systemfix'ene (eyebrows uden uppercase, ingen shadow på flyer/browser, sentence case copy, ribbon fjernet) holder.

