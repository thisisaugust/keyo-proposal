// Referencer (References) tab — editorial intro + visual gallery of mockups.

const REF_CATS = [
  { id: "meta_ads", label: "Meta Ads", icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M12 8v8M9 11l3-3 3 3"/>
    </svg>
  )},
  { id: "flyers", label: "Grafisk materiale", icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="2" width="14" height="20" rx="1"/>
      <path d="M8 7h8M8 11h8M8 15h5"/>
    </svg>
  )},
  { id: "landing", label: "Landing pages", icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="M2 9h20"/>
    </svg>
  )},
];

const RefItemToggle = ({ on, onChange }) => (
  <button
    type="button"
    className={`toggle ${on ? "toggle--on" : ""}`}
    onClick={(e) => { e.stopPropagation(); onChange(!on); }}
    aria-label={on ? "Skjul reference" : "Vis reference"}
  />
);

const RefItem = ({ children, title, sub, isOn, onToggle, isAdmin }) => (
  <div className={`r-item ${!isOn ? "r-item--off" : ""}`}>
    {isAdmin && (
      <div className="r-item__toggle">
        <RefItemToggle on={isOn} onChange={onToggle} />
      </div>
    )}
    {children}
    <div className="r-item__meta">
      <div className="r-item__title">{title}</div>
      {sub && <div className="r-item__sub">{sub}</div>}
    </div>
  </div>
);

const TabReferences = ({ state, setState, isAdmin }) => {
  const [activeCat, setActiveCat] = React.useState("meta_ads");

  const setRefOn = (cat, id, on) => {
    const current = state.selectedReferences[cat] || [];
    const next = on ? [...current.filter(x => x !== id), id] : current.filter(x => x !== id);
    setState({ selectedReferences: { ...state.selectedReferences, [cat]: next } });
  };

  const isOn = (cat, id) => (state.selectedReferences[cat] || []).includes(id);

  const stdRefs = KEYO_DATA.REFERENCES[activeCat] || [];
  const inlineCustom = (state.inlineRefs || {})[activeCat] || [];
  const allCatRefs = [
    ...stdRefs,
    ...inlineCustom.filter(r => !stdRefs.find(s => s.id === r.id)),
  ];
  const visibleRefs = isAdmin ? allCatRefs : allCatRefs.filter(r => isOn(activeCat, r.id));

  const totalActive = Object.values(state.selectedReferences).reduce((s, arr) => s + arr.length, 0);

  return (
    <div className="references-tab">
      <section className="r-hero">
        <div className="r-hero__inner">
          <div>
            <span className="eyebrow eyebrow--green">Referencer</span>
            <h1 className="r-hero__title" style={{ marginTop: 16 }}>
              Eksempler på det,<br/>
              tallene er bygget af.
            </h1>
          </div>
          <p className="r-hero__lead">
            Annoncer, salgsmateriale og landing pages vi har leveret for andre mæglerforretninger
            — udvalgt til at vise hvad der ligger bag de ydelser, vi har sammensat til jer.
            {totalActive > 0 && <span style={{ color: "var(--ink-900)" }}> {totalActive} eksempler i alt.</span>}
          </p>
        </div>
      </section>

      <section className="section section--paper" style={{ paddingTop: 56 }}>
        <div className="container container--wide">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <div className="r-tabs">
              {REF_CATS.map((cat) => {
                const count = (state.selectedReferences[cat.id] || []).length;
                return (
                  <button
                    key={cat.id}
                    className={`r-tab ${activeCat === cat.id ? "r-tab--active" : ""}`}
                    onClick={() => setActiveCat(cat.id)}
                  >
                    {cat.icon}
                    {cat.label}
                    <span className="r-tab__count">{count}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize: "var(--fs-micro)", color: "var(--ink-500)", fontWeight: 500 }}>
              {isAdmin ? "Slå referencer til/fra med kontakten i hjørnet" : `${visibleRefs.length} eksempler`}
            </div>
          </div>

          {visibleRefs.length === 0 ? (
            <div className="empty">Ingen referencer valgt i denne kategori.</div>
          ) : activeCat === "meta_ads" ? (
            <div className="r-grid r-grid--ads">
              {visibleRefs.map((ad) => (
                <RefItem
                  key={ad.id}
                  title={ad.brand}
                  sub={ad.platform === "instagram" ? "Instagram · Feed" : "Facebook · Feed"}
                  isOn={isOn("meta_ads", ad.id)}
                  onToggle={(v) => setRefOn("meta_ads", ad.id, v)}
                  isAdmin={isAdmin}
                >
                  <AdMockup ad={ad} />
                </RefItem>
              ))}
            </div>
          ) : activeCat === "flyers" ? (
            <div className="r-grid r-grid--flyers">
              {visibleRefs.map((fl) => (
                <RefItem
                  key={fl.id}
                  title={fl.address}
                  sub={fl.brand}
                  isOn={isOn("flyers", fl.id)}
                  onToggle={(v) => setRefOn("flyers", fl.id, v)}
                  isAdmin={isAdmin}
                >
                  <FlyerMockup flyer={fl} />
                </RefItem>
              ))}
            </div>
          ) : (
            <div className="r-grid r-grid--landing">
              {visibleRefs.map((lp) => (
                <RefItem
                  key={lp.id}
                  title={lp.headline}
                  sub={lp.url}
                  isOn={isOn("landing", lp.id)}
                  onToggle={(v) => setRefOn("landing", lp.id, v)}
                  isAdmin={isAdmin}
                >
                  <LandingMockup lp={lp} />
                </RefItem>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

window.TabReferences = TabReferences;
