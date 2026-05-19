// Default service catalog + reference catalog for KEYO proposal generator.
// All prices in DKK. Monthly = løbende abonnement; setup = engangs.

window.KEYO_DATA = (function () {
  const STANDARD_SERVICES = [
    {
      id: "meta_ads",
      title: "Meta Ads",
      subtitle: "Facebook + Instagram, drevet på leads — ikke likes.",
      monthly: 6500,
      setup: 4000,
      includes: [
        "Opsætning af annoncekonti, pixel og hændelses-tracking",
        "Løbende kreativ — 4–6 nye annoncer pr. måned",
        "Daglig optimering på bud, målgrupper og kreativ",
        "A/B-test af visning, headline og CTA",
        "Månedlig rapport på leads, CPL og ROAS",
      ],
      results: {
        primary: { label: "Forventede leads / mnd", value: "120 – 180", accent: true },
        secondary: { label: "Snit-CPL (kr.)", value: "45 – 65" },
      },
    },
    {
      id: "organic_social",
      title: "Organisk social",
      subtitle: "Instagram og TikTok — bygger lokal kendthed mellem kampagner.",
      monthly: 4500,
      setup: 0,
      includes: [
        "12 organiske opslag pr. måned, 4 Reels / TikToks",
        "Manuskript, klip og motion-grafik i jeres visuelle profil",
        "Community-management: svar inden for 4 timer i hverdage",
        "Månedlig contentkalender, godkendes inden produktion",
      ],
      results: {
        primary: { label: "Forventet reach / mnd", value: "85.000+", accent: true },
        secondary: { label: "Følger-vækst / mnd", value: "+180 – 240" },
      },
    },
    {
      id: "lead_backend",
      title: "Lead-backend / CRM",
      subtitle: "Saml leads fra alle kanaler, score dem, fordel automatisk.",
      monthly: 1500,
      setup: 12000,
      includes: [
        "Opsætning af KEYO Lead-backend tilpasset jeres pipeline",
        "Routing-regler: leads sendes automatisk til rette mægler",
        "Lead-scoring: hot / warm / cold på adfærd og kilde",
        "Integration til jeres mæglersystem og kalender",
        "Brugeradgang for op til 6 mæglere inkluderet",
      ],
      results: {
        primary: { label: "Snit response-tid", value: "< 8 min", accent: true },
        secondary: { label: "Inkl. brugere", value: "6 mæglere" },
      },
    },
    {
      id: "prisberegner",
      title: "Prisberegner på hjemmeside",
      subtitle: "Hver beregning er en lead — i jeres visuelle profil.",
      monthly: 950,
      setup: 18000,
      calc: "prisberegner",
      includes: [
        "Embed-prisberegner tilpasset jeres CMS og brand",
        "Datagrundlag: tinglyste handler, m²-priser og udvikling pr. postnummer",
        "Lead-formular der sender direkte til jeres backend",
        "Månedlig vedligeholdelse af datakilder og logik",
      ],
      results: {
        primary: { label: "Konvertering på besøg", value: "5,2 %", accent: true },
        secondary: { label: "Snit-tid på beregning", value: "47 sek" },
      },
    },
    {
      id: "koeberkartotek",
      title: "Køberkartotek opsætning",
      subtitle: "Aktive købere, matchet automatisk når boliger sættes til salg.",
      monthly: 750,
      setup: 8000,
      calc: "koeberkartotek",
      includes: [
        "Opsætning af KEYO Køberkartotek med jeres kriterier",
        "Auto-matching: nye boliger sendes til relevante købere indenfor 60 sek",
        "Tilmeldingsflow på jeres hjemmeside og i nyhedsbreve",
        "Dashboard med match-statistik og engagement",
      ],
      results: {
        primary: { label: "Match-rate / bolig", value: "12 – 24", accent: true },
        secondary: { label: "Open rate på match", value: "62 %" },
      },
    },
    {
      id: "rapportering",
      title: "Månedlig rapportering",
      subtitle: "Ét overblik på tværs af kampagner, leads og kartotek.",
      monthly: 1200,
      setup: 0,
      includes: [
        "Konsolideret månedsrapport: leads, CPL, ROAS pr. kanal",
        "30-minutters månedligt opfølgningsmøde med jeres KEYO-strateg",
        "Adgang til live dashboard, opdateret hver nat",
        "Anbefalinger til næste måneds prioriteter",
      ],
      results: {
        primary: { label: "Leveres senest", value: "5. hverdag", accent: true },
        secondary: { label: "Dashboard-opdatering", value: "Dagligt" },
      },
    },
  ];

  // Reference catalog — admins curate which appear in each proposal.
  const REFERENCES = {
    meta_ads: [
      {
        id: "ad_villa_charlottenlund",
        platform: "facebook",
        brand: "Estate Charlottenlund",
        copy: "Lyst og roligt — fritliggende villa tæt på Hellerup Strand. Plads til familieliv, kort til byen.",
        image: "keyo/img/property-1.jpg",
        headline: "Strandvejen 142 · 4 vær · 168 m²",
        cta: "Book fremvisning",
        url: "estate-charlottenlund.dk",
        avatarColor: "#005032",
      },
      {
        id: "ad_apartment_aarhus",
        platform: "instagram",
        brand: "home Aarhus C",
        copy: "Penthouse · Frederiksbjerg",
        image: "keyo/img/property-2.jpg",
        headline: "Penthouse · 132 m² · 2 terrasser",
        cta: "Se boligen",
        url: "home.dk/aarhus",
        avatarColor: "#1C1C1C",
      },
      {
        id: "ad_townhouse_odense",
        platform: "facebook",
        brand: "Danbolig Odense",
        copy: "Nyrenoveret rækkehus i Hunderup-kvarteret. Klar til indflytning — fremvisning lørdag.",
        image: "keyo/img/property-3.png",
        headline: "Læssøegade 18 · 3 vær · 112 m²",
        cta: "Læs mere",
        url: "danbolig.dk/odense",
        avatarColor: "#005032",
      },
      {
        id: "ad_open_house_carousel",
        platform: "instagram",
        brand: "Nybolig Vejle",
        copy: "Åbent hus · søndag 11–13",
        image: "keyo/img/property-4.png",
        headline: "Skovparken 7 · 5 vær · 184 m²",
        cta: "Tilmeld",
        url: "nybolig.dk/vejle",
        avatarColor: "#003a24",
      },
    ],
    flyers: [
      {
        id: "flyer_villa_a4",
        image: "keyo/img/property-1.jpg",
        address: "Strandvejen 142, 2920 Charlottenlund",
        city: "Fritliggende villa",
        rooms: 4,
        sqm: 168,
        plot: 920,
        price: "11.495.000",
        brand: "Estate · Charlottenlund",
        agent: "Sofie Lindgren · 28 41 92 03",
        badge: "Til salg",
      },
      {
        id: "flyer_penthouse",
        image: "keyo/img/property-2.jpg",
        address: "Banegårdspladsen 9, 8000 Aarhus C",
        city: "Penthouse · 4. sal",
        rooms: 3,
        sqm: 132,
        plot: null,
        price: "6.250.000",
        brand: "home · Aarhus C",
        agent: "Mads Friis · 22 70 18 44",
        badge: "Til salg",
      },
      {
        id: "flyer_rowhouse",
        image: "keyo/img/property-3.png",
        address: "Læssøegade 18, 5230 Odense M",
        city: "Rækkehus · Hunderup",
        rooms: 3,
        sqm: 112,
        plot: 240,
        price: "3.795.000",
        brand: "Danbolig · Odense",
        agent: "Lone Kjeldsen · 60 15 32 88",
        badge: "Åbent hus",
      },
      {
        id: "flyer_skov",
        image: "keyo/img/property-4.png",
        address: "Skovparken 7, 7100 Vejle",
        city: "Villa · 2 plan",
        rooms: 5,
        sqm: 184,
        plot: 1140,
        price: "5.495.000",
        brand: "Nybolig · Vejle",
        agent: "Henrik Bjerg · 40 25 19 77",
        badge: "Til salg",
      },
    ],
    landing: [
      {
        id: "lp_estate",
        url: "estate-charlottenlund.dk/saelg",
        image: "keyo/img/property-1.jpg",
        brand: "ESTATE",
        eyebrow: "Salgsvurdering",
        headline: "Hvad er din bolig værd i dag?",
        sub: "Få en uforpligtende salgsvurdering af en lokal mægler — som kender postnummeret.",
        button: "Bestil vurdering",
        navLinks: ["Til salg", "Solgte", "Salgsvurdering", "Kontakt"],
      },
      {
        id: "lp_home",
        url: "home.dk/aarhus-c/saelg",
        image: "keyo/img/property-2.jpg",
        brand: "HOME",
        eyebrow: "Aarhus C",
        headline: "Vi sælger flest boliger på Frederiksbjerg.",
        sub: "Få vores lokale markedsanalyse for dit postnummer — leveret indenfor 24 timer.",
        button: "Hent rapport",
        navLinks: ["Boliger", "Mæglere", "Vurdering", "Om os"],
      },
      {
        id: "lp_danbolig",
        url: "danbolig.dk/odense/aabent-hus",
        image: "keyo/img/property-3.png",
        brand: "DANBOLIG",
        eyebrow: "Åbent hus · søndag",
        headline: "Tilmeld dig fremvisningen.",
        sub: "Vi sender adresse, tidspunkt og en kort guide til boligen direkte til din indbakke.",
        button: "Tilmeld åbent hus",
        navLinks: ["Boliger", "Sælg", "Køb", "Find mægler"],
      },
    ],
  };

  // Default selections — admin starts with these checked.
  const DEFAULT_SELECTED_SERVICES = {
    meta_ads: true,
    organic_social: true,
    lead_backend: true,
    prisberegner: true,
    koeberkartotek: false,
    rapportering: true,
  };

  const DEFAULT_SELECTED_REFERENCES = {
    meta_ads: ["ad_villa_charlottenlund", "ad_apartment_aarhus", "ad_townhouse_odense", "ad_open_house_carousel"],
    flyers: ["flyer_villa_a4", "flyer_penthouse", "flyer_rowhouse"],
    landing: ["lp_estate", "lp_home"],
  };

  const DEFAULT_PROPOSAL = {
    clientName: "Estate Charlottenlund",
    preparedFor: "Jakob Mørch",
    preparedBy: "Sofus Henningsen, KEYO",
    date: "18. maj 2026",
    validUntil: "18. juni 2026",
    proposalId: "KEYO-2026-0184",
    greeting:
      "Tak for den gode snak i sidste uge. Jeg har sammensat et oplæg, der tager fat dér hvor vi ser den klareste effekt på jeres leadstrøm — Meta-annoncering på de aktive boliger, en prisberegner på sitet, og rapportering så vi kan måle os frem hver måned.\n\nGiv lyd hvis I vil justere før vi mødes på fredag.",
    heroImage: "keyo/img/property-2.jpg",
    selectedServices: DEFAULT_SELECTED_SERVICES,
    selectedReferences: DEFAULT_SELECTED_REFERENCES,
    customServices: [],
    calcInputs: {
      prisberegner_visitors: 4200, // monthly site visitors
      prisberegner_conversion: 5.2, // %
      koeberkartotek_listings: 18, // active listings per month
      koeberkartotek_matchrate: 18, // avg matches per listing
    },
  };

  return {
    STANDARD_SERVICES,
    REFERENCES,
    DEFAULT_PROPOSAL,
  };
})();
