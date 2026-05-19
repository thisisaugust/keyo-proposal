// Reference mockups — Meta Ads (Facebook + Instagram), Flyer, Landing page.
// Visually realistic at "close-to-real but simplified" fidelity.

const fmtPrice = (n) => new Intl.NumberFormat("da-DK").format(n);

// ----- META AD: Facebook variant -----
const FBAd = ({ ad }) => (
  <div className="ad-card">
    <div className="ad-card__head">
      <div className="ad-card__avatar" style={{ background: ad.avatarColor }}>
        <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "#fff", fontSize: 14, fontWeight: 600, letterSpacing: "0.04em" }}>
          {ad.brand.split(" ").map(w => w[0]).slice(0,2).join("")}
        </div>
      </div>
      <div className="ad-card__brand-line">
        <div className="ad-card__brand">{ad.brand}</div>
        <div className="ad-card__sponsored">
          Sponsoreret · <svg viewBox="0 0 12 12" width="11" height="11" fill="#65676B"><circle cx="6" cy="6" r="5" fill="none" stroke="#65676B"/><path d="M6 4v3M6 8.5v.5" stroke="#65676B" fill="none"/></svg>
        </div>
      </div>
      <div className="ad-card__more">···</div>
    </div>
    <div className="ad-card__copy">{ad.copy}</div>
    <div className="ad-card__image" style={{ backgroundImage: `url(${ad.image})` }} />
    <div className="ad-card__cta-bar">
      <div className="ad-card__cta-text">
        <span className="ad-card__cta-url">{ad.url}</span>
        <span className="ad-card__cta-headline">{ad.headline}</span>
      </div>
      <div className="ad-card__cta-btn">{ad.cta}</div>
    </div>
    <div className="ad-card__social">
      <div className="ad-card__social-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#65676B" style={{ display: "inline", verticalAlign: -3, marginRight: 4 }}>
          <path d="M2 9h4v12H2zM22 11c0-1.1-.9-2-2-2h-6l1-4c.3-1.4-.8-2.5-2-2.5-.7 0-1.4.4-1.7 1L8 9v12h10c.9 0 1.7-.6 1.9-1.4L22 13z"/>
        </svg>
        Synes godt om
      </div>
      <div className="ad-card__social-btn">Kommenter</div>
      <div className="ad-card__social-btn">Del</div>
    </div>
  </div>
);

// ----- META AD: Instagram variant -----
const IGAd = ({ ad }) => (
  <div className="ad-card ad-card--ig">
    <div className="ad-card__head">
      <div className="ad-card__avatar" style={{ width: 32, height: 32, background: ad.avatarColor }}>
        <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "#fff", fontSize: 11, fontWeight: 600 }}>
          {ad.brand.split(" ").map(w => w[0]).slice(0,2).join("")}
        </div>
      </div>
      <div className="ad-card__brand-line">
        <div className="ad-card__brand">{ad.brand.toLowerCase().replace(/\s+/g, "_")}</div>
        <div className="ad-card__sponsored">Sponsoreret</div>
      </div>
      <div className="ad-card__more">···</div>
    </div>
    <div className="ad-card__image" style={{ backgroundImage: `url(${ad.image})` }} />
    <div className="ad-card__icons">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s-7-4.5-7-10a4 4 0 017-2.7A4 4 0 0119 11c0 5.5-7 10-7 10z"/></svg>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 11.5a8.4 8.4 0 01-1.1 4.2A8.5 8.5 0 0112 20a8.4 8.4 0 01-4.2-1.1L3 20l1.1-4.8A8.5 8.5 0 0112 3a8.5 8.5 0 019 8.5z"/></svg>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
      <div style={{ marginLeft: "auto" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M19 21l-7-4-7 4V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
      </div>
    </div>
    <div className="ad-card__cta-bar">
      <div className="ad-card__cta-text" style={{ flex: 1 }}>
        <span className="ad-card__cta-headline" style={{ fontSize: 12 }}>{ad.brand} <span style={{ fontWeight: 400 }}>{ad.copy}</span></span>
        <span className="ad-card__cta-url" style={{ marginTop: 6 }}>{ad.headline}</span>
      </div>
      <div className="ad-card__cta-btn">{ad.cta}</div>
    </div>
  </div>
);

const AdMockup = ({ ad }) => ad.platform === "instagram" ? <IGAd ad={ad} /> : <FBAd ad={ad} />;

// ----- FLYER — generic multi-page OR legacy property -----
const FlyerMockup = ({ flyer }) => {
  const [pageIdx, setPageIdx] = React.useState(0);
  if (flyer.pages !== undefined) {
    const pages = flyer.pages || [];
    const activeSrc = pages[pageIdx];
    return (
      <div className="flyer">
        <div className="flyer__photo" style={{ backgroundImage: activeSrc ? `url(${activeSrc})` : 'none', backgroundColor: activeSrc ? 'transparent' : 'var(--bone)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!activeSrc && <span style={{ fontSize: 11, color: 'var(--ink-400)' }}>Ingen sider</span>}
          {pages.length > 1 && (
            <div className="flyer__page-nav">
              {pages.map((_, i) => (
                <button key={i} className={`flyer__page-dot ${i === pageIdx ? 'flyer__page-dot--active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setPageIdx(i); }} />
              ))}
            </div>
          )}
        </div>
        <div className="flyer__body">
          {flyer.brand && <div className="flyer__brand">{flyer.brand}</div>}
          {flyer.title && <div className="flyer__address">{flyer.title}</div>}
          {flyer.description && <div className="flyer__city">{flyer.description}</div>}
        </div>
      </div>
    );
  }
  return (
    <div className="flyer">
      <div className="flyer__photo" style={{ backgroundImage: `url(${flyer.image})` }}>
        {flyer.badge && <div className="flyer__badge">{flyer.badge}</div>}
      </div>
      <div className="flyer__body">
        <div>
          <div className="flyer__address">{flyer.address}</div>
          <div className="flyer__city">{flyer.city}</div>
        </div>
        <div className="flyer__specs">
          {flyer.rooms && <span><strong>{flyer.rooms}</strong> vær.</span>}
          {flyer.sqm && <span><strong>{flyer.sqm} m²</strong></span>}
          {flyer.plot && <span><strong>{flyer.plot} m²</strong> gr.</span>}
        </div>
        {flyer.price && <div className="flyer__price">Kontant {flyer.price} kr.</div>}
        <div className="flyer__foot">
          <div className="flyer__brand">{flyer.brand}</div>
          {flyer.agent && <div>{flyer.agent}</div>}
        </div>
      </div>
    </div>
  );
};

// ----- LANDING PAGE (browser frame) -----
const LandingMockup = ({ lp }) => (
  <div className="browser">
    <div className="browser__chrome">
      <div className="browser__dots">
        <div className="browser__dot"></div>
        <div className="browser__dot"></div>
        <div className="browser__dot"></div>
      </div>
      <div className="browser__url-bar">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>
        {lp.url}
      </div>
      <div style={{ width: 28 }}></div>
    </div>
    <div className="browser__viewport">
      <div className="lp">
        <nav className="lp__nav">
          <div className="lp__nav-brand">{lp.brand}</div>
          <div className="lp__nav-links">
            {lp.navLinks.map((l) => <span key={l}>{l}</span>)}
          </div>
          <div style={{ fontSize: 9, color: "var(--keyo-green)", fontWeight: 600 }}>Book vurdering</div>
        </nav>
        <div className="lp__hero" style={{ backgroundImage: `url(${lp.image})` }} />
        <div className="lp__form-side">
          <div className="lp__form-eyebrow">{lp.eyebrow}</div>
          <div className="lp__form-headline">{lp.headline}</div>
          <div className="lp__form-sub">{lp.sub}</div>
          <div className="lp__form-field">Adresse</div>
          <div className="lp__form-field">E-mail</div>
          <div className="lp__form-field">Telefon</div>
          <div className="lp__form-cta">{lp.button}</div>
        </div>
      </div>
    </div>
  </div>
);

window.AdMockup = AdMockup;
window.FlyerMockup = FlyerMockup;
window.LandingMockup = LandingMockup;
window.fmtPrice = fmtPrice;
