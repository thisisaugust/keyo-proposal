// Tilbud (Offer) tab — full-bleed photo hero + editorial service rows + dark totals band.

const ChevRight = () => (
  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.4">
    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Plus = () => (
  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/>
  </svg>
);

// ----- Admin Toggle -----
const Toggle = ({ on, onChange, variant }) => (
  <button
    type="button"
    className={`toggle ${on ? "toggle--on" : ""} ${variant === "ghost" ? "toggle--ghost" : ""}`}
    onClick={(e) => { e.stopPropagation(); onChange(!on); }}
    aria-label={on ? "Slå fra" : "Slå til"}
  />
);

// ----- Calculator: Prisberegner -----
const PrisbergCalc = ({ inputs, onChange, isAdmin }) => {
  const visitors = inputs.prisberegner_visitors;
  const conv = inputs.prisberegner_conversion;
  const leads = Math.round(visitors * conv / 100);
  return (
    <div className="calc">
      <div className="calc__header">
        <span className="calc__label">Beregner</span>
        <span className="calc__tag">{isAdmin ? "Justér" : "Estimat"}</span>
      </div>
      <div className="calc__field">
        <div className="calc__field-label">
          Besøgende på sitet / mnd
          <span className="calc__field-value">{fmtPrice(visitors)}</span>
        </div>
        <input
          type="range"
          className="calc__slider"
          min="500" max="20000" step="100"
          value={visitors}
          disabled={!isAdmin}
          onChange={(e) => onChange({ prisberegner_visitors: +e.target.value })}
        />
      </div>
      <div className="calc__field">
        <div className="calc__field-label">
          Konvertering på beregner
          <span className="calc__field-value">{conv.toFixed(1)} %</span>
        </div>
        <input
          type="range"
          className="calc__slider"
          min="1" max="15" step="0.1"
          value={conv}
          disabled={!isAdmin}
          onChange={(e) => onChange({ prisberegner_conversion: +e.target.value })}
        />
      </div>
      <div className="calc__output">
        <span className="calc__output-label">Forventede leads / mnd</span>
        <span className="calc__output-value">{fmtPrice(leads)}</span>
      </div>
    </div>
  );
};

// ----- Calculator: Køberkartotek -----
const KartotekCalc = ({ inputs, onChange, isAdmin }) => {
  const listings = inputs.koeberkartotek_listings;
  const matchRate = inputs.koeberkartotek_matchrate;
  const total = listings * matchRate;
  return (
    <div className="calc">
      <div className="calc__header">
        <span className="calc__label">Beregner</span>
        <span className="calc__tag">{isAdmin ? "Justér" : "Estimat"}</span>
      </div>
      <div className="calc__field">
        <div className="calc__field-label">
          Aktive boliger / mnd
          <span className="calc__field-value">{listings}</span>
        </div>
        <input
          type="range" className="calc__slider"
          min="1" max="80" step="1"
          value={listings}
          disabled={!isAdmin}
          onChange={(e) => onChange({ koeberkartotek_listings: +e.target.value })}
        />
      </div>
      <div className="calc__field">
        <div className="calc__field-label">
          Snit-matches pr. bolig
          <span className="calc__field-value">{matchRate}</span>
        </div>
        <input
          type="range" className="calc__slider"
          min="4" max="40" step="1"
          value={matchRate}
          disabled={!isAdmin}
          onChange={(e) => onChange({ koeberkartotek_matchrate: +e.target.value })}
        />
      </div>
      <div className="calc__output">
        <span className="calc__output-label">Forventede matches / mnd</span>
        <span className="calc__output-value">{fmtPrice(total)}</span>
      </div>
    </div>
  );
};

const calcComponent = {
  prisberegner: PrisbergCalc,
  koeberkartotek: KartotekCalc,
};

// ----- Service row -----
const ServiceRow = ({ service, idx, isOn, isOpen, onToggleOpen, onToggleOn, onDelete, isAdmin, calcInputs, onCalcChange }) => {
  const off = !isOn;
  const CalcComp = service.calc ? calcComponent[service.calc] : null;
  const hasSetup = service.setup > 0;
  const hasMonthly = service.monthly > 0;

  return (
    <article className={`svc ${off ? "svc--off" : ""} ${isOpen ? "svc--open" : ""}`}>
      <div role="button" tabIndex={0} className="svc__row" onClick={onToggleOpen}
           onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggleOpen(); } }}>
        <div className="svc__index">{String(idx + 1).padStart(2, "0")}</div>
        <div className="svc__main">
          <h3 className="svc__title">
            {service.title}
            {service.custom && <span className="svc__custom">Specifik</span>}
          </h3>
          <p className="svc__subtitle">{service.subtitle}</p>
        </div>
        <div className="svc__price">
          {hasMonthly
            ? <div className="svc__price-monthly">{fmtPrice(service.monthly)} kr.<span className="svc__price-unit">/ mnd</span></div>
            : hasSetup
              ? <div className="svc__price-monthly">{fmtPrice(service.setup)} kr.<span className="svc__price-unit">opstart</span></div>
              : <div className="svc__price-monthly">Inkluderet</div>}
          {hasMonthly && hasSetup && <div className="svc__price-setup">+ {fmtPrice(service.setup)} kr. opstart</div>}
        </div>
        <div className="svc__actions" onClick={(e) => e.stopPropagation()}>
          {isAdmin && service.custom && (
            <button className="svc__delete" onClick={onDelete} title="Slet ydelse">
              <TrashIcon />
            </button>
          )}
          {isAdmin && <Toggle on={isOn} onChange={onToggleOn} />}
          <span className="svc__chevron"><ChevRight /></span>
        </div>
      </div>

      {isOpen && (
        <div className="svc__body">
          <div>
            <div className="svc__col-label">Hvad er inkluderet</div>
            <ul className="svc__includes">
              {(service.includes || []).map((it, i) => <li key={i}>{it}</li>)}
            </ul>
          </div>
          <div className="svc__results-col">
            {service.results && (
              <div>
                <div className="svc__col-label">Forventet effekt</div>
                <div className="svc__results">
                  <div className="svc__result-cell svc__result-cell--accent">
                    <span className="svc__result-label">{service.results.primary.label}</span>
                    <span className="svc__result-value">{service.results.primary.value}</span>
                  </div>
                  <div className="svc__result-cell">
                    <span className="svc__result-label">{service.results.secondary.label}</span>
                    <span className="svc__result-value">{service.results.secondary.value}</span>
                  </div>
                </div>
              </div>
            )}
            {CalcComp && <CalcComp inputs={calcInputs} onChange={onCalcChange} isAdmin={isAdmin} />}
          </div>
        </div>
      )}
    </article>
  );
};

// ----- Add custom form -----
const AddCustomForm = ({ onAdd, onCancel }) => {
  const [title, setTitle] = React.useState("");
  const [subtitle, setSubtitle] = React.useState("");
  const [monthly, setMonthly] = React.useState("");
  const [setup, setSetup] = React.useState("");
  const [includes, setIncludes] = React.useState("");
  return (
    <div className="custom-form">
      <div className="custom-form__field custom-form__field--full">
        <label className="custom-form__label">Titel</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="fx Video-content til boliger" />
      </div>
      <div className="custom-form__field custom-form__field--full">
        <label className="custom-form__label">Kort beskrivelse</label>
        <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="En sætning der forklarer hvad I leverer" />
      </div>
      <div className="custom-form__field">
        <label className="custom-form__label">Månedlig pris (kr.)</label>
        <input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} placeholder="0" />
      </div>
      <div className="custom-form__field">
        <label className="custom-form__label">Opstart engangs (kr.)</label>
        <input type="number" value={setup} onChange={(e) => setSetup(e.target.value)} placeholder="0" />
      </div>
      <div className="custom-form__field custom-form__field--full">
        <label className="custom-form__label">Inkluderet (én pr. linje)</label>
        <textarea rows="3" value={includes} onChange={(e) => setIncludes(e.target.value)} placeholder={"fx 4 video-shoots pr. måned\nKlipning og motion-grafik\nLevering på 5 hverdage"} />
      </div>
      <div className="custom-form__actions">
        <button className="btn-ghost" onClick={onCancel}>Annullér</button>
        <button
          className="btn-primary"
          disabled={!title}
          onClick={() => {
            onAdd({
              id: "custom_" + Math.random().toString(36).slice(2, 8),
              title: title || "Ekstra ydelse",
              subtitle,
              monthly: +monthly || 0,
              setup: +setup || 0,
              includes: includes.split("\n").map(s => s.trim()).filter(Boolean),
              custom: true,
              results: null,
            });
          }}
        >Tilføj ydelse</button>
      </div>
    </div>
  );
};

// ----- Hero (full-bleed photo, display title, glass meta-card, chips, totals) -----
const Hero = ({ state, setState, isAdmin, monthlyTotal, activeServices }) => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setMounted(true), 30); return () => clearTimeout(t); }, []);

  const editClient = (val) => setState({ clientName: val });
  const editGreeting = (val) => setState({ greeting: val });

  return (
    <section className={`hero ${mounted ? "hero--mounted" : ""}`}>
      <div className="hero__photo" style={{ backgroundImage: `url('${state.heroImage || 'keyo/img/property-2.jpg'}')` }} />
      <div className="hero__overlay" />
      <div className="hero__content">
        <div className="hero__top">
          <div className="hero__meta-card">
            <div className="hero__meta-cell">
              <span className="hero__meta-label">Tilbud</span>
              <span className="hero__meta-value">{state.proposalId}</span>
            </div>
            <div className="hero__meta-cell">
              <span className="hero__meta-label">Forberedt</span>
              <span className="hero__meta-value">{state.date}</span>
            </div>
            <div className="hero__meta-cell">
              <span className="hero__meta-label">Gyldig til</span>
              <span className="hero__meta-value">{state.validUntil}</span>
            </div>
            <div className="hero__meta-cell">
              <span className="hero__meta-label">Forberedt af</span>
              <span className="hero__meta-value">{state.preparedBy.split(",")[0]}</span>
            </div>
          </div>
        </div>

        <div className="hero__main">
          <span className="hero__eyebrow">Sammensat til {state.clientName}</span>
          <h1 className="hero__title">
            Tilbud til
            <br />
            {isAdmin ? (
              <input
                className="hero__title-client-input"
                value={state.clientName}
                onChange={(e) => editClient(e.target.value)}
                size={Math.max(state.clientName.length + 1, 8)}
              />
            ) : (
              <span className="hero__title-client">{state.clientName}</span>
            )}.
          </h1>
          {isAdmin ? (
            <textarea
              className="hero__lead-editor"
              value={state.greeting}
              onChange={(e) => editGreeting(e.target.value)}
              rows={4}
            />
          ) : (
            <p className="hero__lead">{state.greeting}</p>
          )}
          <div className="hero__chips">
            {activeServices.map((s) => (
              <span key={s.id} className="hero__chip">
                <span className="hero__chip-dot" />
                {s.title}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="hero__totals">
        <span className="hero__totals-label">Samlet pr. måned</span>
        <span className="hero__totals-value">{fmtPrice(monthlyTotal)} <span className="hero__totals-unit">kr.</span></span>
      </div>
    </section>
  );
};

// ----- Meta ribbon (kept available, but disabled when hero shows meta-card) -----
const MetaRibbon = ({ state }) => (
  <section className="meta-ribbon">
    <div className="meta-ribbon__inner">
      <div className="meta-ribbon__cell">
        <span className="meta-ribbon__label">Forberedt for</span>
        <span className="meta-ribbon__value">{state.preparedFor}</span>
      </div>
      <div className="meta-ribbon__cell">
        <span className="meta-ribbon__label">Forberedt af</span>
        <span className="meta-ribbon__value">{state.preparedBy}</span>
      </div>
      <div className="meta-ribbon__cell">
        <span className="meta-ribbon__label">Dato</span>
        <span className="meta-ribbon__value">{state.date}</span>
      </div>
      <div className="meta-ribbon__cell">
        <span className="meta-ribbon__label">Gyldig til</span>
        <span className="meta-ribbon__value">{state.validUntil}</span>
      </div>
    </div>
  </section>
);

// ----- Offer tab -----
const TabOffer = ({ state, setState, isAdmin }) => {
  const [openIds, setOpenIds] = React.useState(new Set());
  const [addingCustom, setAddingCustom] = React.useState(false);

  const allServices = [
    ...KEYO_DATA.STANDARD_SERVICES,
    ...state.customServices,
  ];

  const activeServices = allServices.filter(s =>
    s.custom ? state.selectedServices[s.id] !== false : state.selectedServices[s.id]
  );

  const visibleServices = isAdmin ? allServices : activeServices;

  const toggleOpen = (id) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const setServiceOn = (id, on) => {
    setState({ selectedServices: { ...state.selectedServices, [id]: on } });
  };

  const setCalc = (patch) => setState({ calcInputs: { ...state.calcInputs, ...patch } });

  const addCustom = (svc) => {
    setState({
      customServices: [...state.customServices, svc],
      selectedServices: { ...state.selectedServices, [svc.id]: true },
    });
    setOpenIds(prev => new Set(prev).add(svc.id));
    setAddingCustom(false);
  };

  const deleteCustom = (id) => {
    setState({ customServices: state.customServices.filter(s => s.id !== id) });
  };

  const monthlyTotal = activeServices.reduce((sum, s) => sum + (s.monthly || 0), 0);
  const setupTotal = activeServices.reduce((sum, s) => sum + (s.setup || 0), 0);
  const annualTotal = monthlyTotal * 12 + setupTotal;

  return (
    <div className="offer-tab">
      <Hero state={state} setState={setState} isAdmin={isAdmin} monthlyTotal={monthlyTotal} activeServices={activeServices} />

      <section className="svc-section">
        <header className="svc-section__head">
          <div>
            <span className="eyebrow eyebrow--green">Ydelser</span>
            <h2 className="svc-section__title">
              {activeServices.length} ydelser, sammensat<br/>til at flytte leadstrømmen.
            </h2>
          </div>
          <div className="svc-section__count">
            <span className="svc-section__hint">Klik en ydelse for at folde ud</span>
            <span>{activeServices.length} aktive · {fmtPrice(monthlyTotal)} kr. / mnd</span>
          </div>
        </header>

        {visibleServices.length === 0 ? (
          <div className="empty">Ingen ydelser valgt endnu. Slå nogle til i admin-tilstand.</div>
        ) : (
          <div className="svc-list">
            {visibleServices.map((svc, idx) => {
              const on = svc.custom ? state.selectedServices[svc.id] !== false : !!state.selectedServices[svc.id];
              return (
                <ServiceRow
                  key={svc.id}
                  service={svc}
                  idx={idx}
                  isOn={on}
                  isOpen={openIds.has(svc.id)}
                  onToggleOpen={() => toggleOpen(svc.id)}
                  onToggleOn={(v) => setServiceOn(svc.id, v)}
                  onDelete={() => deleteCustom(svc.id)}
                  isAdmin={isAdmin}
                  calcInputs={state.calcInputs}
                  onCalcChange={setCalc}
                />
              );
            })}

            {isAdmin && (
              addingCustom ? (
                <div style={{ padding: "24px 0 0" }}>
                  <AddCustomForm onAdd={addCustom} onCancel={() => setAddingCustom(false)} />
                </div>
              ) : (
                <button className="add-svc" onClick={() => setAddingCustom(true)}>
                  <span className="add-svc__icon"><Plus /></span>
                  Tilføj specifik ydelse
                </button>
              )
            )}
          </div>
        )}
      </section>

      <section className="totals-band">
        <div className="totals-band__inner">
          <div>
            <div className="totals-band__label">Månedligt</div>
            <div className="totals-band__value">
              {fmtPrice(monthlyTotal)}<span className="totals-band__unit">kr. / mnd</span>
            </div>
            <div className="totals-band__sub">
              Faktureres månedligt forud. Ingen binding udover løbende måned + 30 dage.
            </div>
          </div>
          <div>
            <div className="totals-band__label">Opstart, engangs</div>
            <div className="totals-band__value">
              {fmtPrice(setupTotal)}<span className="totals-band__unit">kr.</span>
            </div>
            <div className="totals-band__sub">
              Faktureres når aftalen underskrives. Alle priser ekskl. moms.
            </div>
          </div>
          <div>
            <div className="totals-band__label">Første 12 måneder</div>
            <div className="totals-band__value">
              {fmtPrice(annualTotal)}<span className="totals-band__unit">kr.</span>
            </div>
            {!isAdmin && (
              <button className="totals-band__cta">
                Accepter tilbud
                <span className="totals-band__cta-chip">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

window.TabOffer = TabOffer;
