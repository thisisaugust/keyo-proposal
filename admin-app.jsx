// KEYO Admin Dashboard
// Manages all proposals: create, edit, templates, last-opened tracking.

const { useState, useEffect, useRef } = React;

// ── Storage keys ──────────────────────────────────────────────
const PROPOSALS_KEY = 'keyo-admin-proposals';
const TEMPLATES_KEY = 'keyo-admin-templates';
const OPENED_PREFIX = 'keyo-opened:';

// ── Utilities ─────────────────────────────────────────────────
const genProposalId = () => {
  const y = new Date().getFullYear();
  const n = String(Math.floor(Math.random() * 9000) + 1000);
  return `KEYO-${y}-${n}`;
};

const slugify = (s) =>
  (s || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 22) || 'proposal';

const nowIso = () => new Date().toISOString();

const fmtDateDK = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('da-DK', { day: 'numeric', month: 'short', year: 'numeric' });
};

const relTime = (iso) => {
  if (!iso) return null;
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  const h = Math.floor(ms / 3600000);
  const d = Math.floor(ms / 86400000);
  if (m < 2) return 'lige nu';
  if (m < 60) return `${m} min siden`;
  if (h < 24) return `${h} t siden`;
  if (d === 1) return 'i går';
  if (d < 7) return `${d} dage siden`;
  return `${Math.floor(d / 7)} uger siden`;
};

// Card tint class based on proposal age
const ageClass = (createdAt) => {
  if (!createdAt) return '';
  const d = Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000);
  if (d < 3)  return '';
  if (d < 7)  return 'pcard--recent';
  if (d < 21) return 'pcard--aging';
  return 'pcard--old';
};

const todayDK = () =>
  new Date().toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' });

const validUntilDK = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' });
};

const fmtNum = (n) => new Intl.NumberFormat('da-DK').format(n);

// Client-facing proposal URL
const proposalUrl = (viewerId) => {
  const base = window.location.href.replace(/admin\.html.*$/, '');
  return `${base}?id=${viewerId}`;
};

// ── LocalStorage helpers ───────────────────────────────────────
const loadProposals = () => {
  try { return JSON.parse(localStorage.getItem(PROPOSALS_KEY) || '[]'); } catch { return []; }
};
const saveProposals = (list) => localStorage.setItem(PROPOSALS_KEY, JSON.stringify(list));

const loadTemplates = () => {
  try { return JSON.parse(localStorage.getItem(TEMPLATES_KEY) || '[]'); } catch { return []; }
};
const saveTemplates = (list) => localStorage.setItem(TEMPLATES_KEY, JSON.stringify(list));

const getOpenedInfo = (viewerId) => {
  try { return JSON.parse(localStorage.getItem(OPENED_PREFIX + viewerId) || 'null'); } catch { return null; }
};

// Sync full proposal data so the viewer (index.html) can load it
const syncToViewer = (p) => {
  localStorage.setItem(`keyo-proposal:${p.viewerId}`, JSON.stringify({
    clientName: p.clientName,
    preparedFor: p.preparedFor,
    preparedBy: p.preparedBy,
    date: p.date,
    validUntil: p.validUntil,
    proposalId: p.id,
    greeting: p.greeting,
    selectedServices: p.selectedServices,
    selectedReferences: p.selectedReferences,
    customServices: p.customServices || [],
    calcInputs: p.calcInputs,
  }));
};

// ── Icons ──────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/>
  </svg>
);
const LinkIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1.5 1.5"/>
    <path d="M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1.5-1.5"/>
  </svg>
);
const ExternalIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
  </svg>
);

const KeyoWordmark = () => (
  <svg viewBox="0 0 986 293" fill="currentColor" aria-label="KEYO" style={{ height: 14, width: 'auto' }}>
    <path d="M0 285.5c7-4.2 11.4-9.7 13.4-16.4 2-7 3-17.7 3-32.1V54.5c0-15-1-25.6-3-32.1C11.4 15.7 7 10.1 0 5.6V4.5h74.6v1.1c-7 4.5-11.4 10.1-13.4 16.8-2 6.5-3 17.2-3 32.1V143.3L157.5 39.6c9.2-10 18.5-21.7 28-35.1h47v3.4c-8.2 2.7-15.3 6-21.3 9.7-6 3.7-12 8.6-18 14.5L104.5 122 235.5 284.4v2.6h-46.7L80.6 146.7l-22.4 22.8v67.5c0 14.4 1 25.1 3 32.1 2 6.7 6.4 12.2 13.4 16.4v1.5H0v-1.5zM256.2 285.5c7-4.2 11.4-9.7 13.4-16.4 2-7 3-17.7 3-32.1V54.5c0-15-1-25.6-3-32.1-2-6.7-6.4-12.3-13.4-16.8V4.5h182.5v33.6c-21.6-5.5-39-9.3-52.2-11.6-13.2-2.5-25.1-3.7-35.8-3.7h-36.2v107.1h22.4c17.9 0 45.5-1.4 82.9-4.1v26.5c-25-2.7-52.5-4.1-82.9-4.1h-22.4v120.1H357c12.2 0 25.3-1.4 39.3-4.1 14.2-3 30.6-7.4 49.3-13.1V287H256.2v-1.5zM482.4 35.5c-4.7-8.2-9-14.4-12.7-18.7-3.7-4.2-8.6-7.9-14.6-11.2V4.5h77.3v1.1c-5.5 3.2-8.2 7.7-8.2 13.4 0 4 1.9 9.7 5.6 17.2l53.7 98.5 52.3-98.9c3.7-7.5 5.6-13.3 5.6-17.6 0-5.2-2.9-9.5-8.6-12.7V4.5H633v1.1c-5.7 3.2-10.6 7.2-14.6 12-4 4.4-8.1 10.7-12.3 18.6L594.7 159v78c0 14.4 1 25.1 3 32.1 2 6.7 6.5 12.2 13.4 16.4v1.5h-74.3v-1.5c7-4.2 11.4-9.7 13.4-16.4 2-7 3-17.7 3-32.1v-78L482.4 35.5zM833.3 0c39.4 0 71.8 13.8 97.4 41.4C956.3 69 969 104.6 969 147.8c0 41.4-12.4 75.6-37.2 102.7-25 27.1-57.7 40.6-98.2 40.6-39.5 0-72-13.5-97.4-40.6-25.4-27-38.1-61.4-38.1-103.1 0-43.2 12.8-78.9 38.5-107C762.2 13.5 794.4 0 833.3 0zm-2.2 21.3c-30.6 0-55.4 12.7-74.5 38-19.1 25.5-28.7 56.6-28.7 93.3 0 35.4 8.8 65.4 26.4 89.9 17.6 24.5 41.3 36.8 71 36.8 30.4 0 55-12.5 73.9-37.5 19-25 28.4-56.6 28.4-95 0-36.9-9.1-67-27.3-90.2C882.2 33 859.4 21.3 831.1 21.3z"/>
  </svg>
);

// ── Toggle ─────────────────────────────────────────────────────
const Toggle = ({ on, onChange }) => (
  <button
    type="button"
    className={`toggle ${on ? 'toggle--on' : ''}`}
    onClick={(e) => { e.stopPropagation(); onChange(!on); }}
  />
);

// ── Toast ──────────────────────────────────────────────────────
const Toast = ({ msg }) => <div className="toast">{msg}</div>;

// ── Proposal sidebar card ─────────────────────────────────────
const ProposalCard = ({ p, isActive, onClick }) => {
  const info = getOpenedInfo(p.viewerId);
  const seen = info?.lastOpened;
  return (
    <div className={`pcard ${ageClass(p.createdAt)} ${isActive ? 'pcard--active' : ''}`} onClick={onClick}>
      <div className="pcard__name">{p.clientName}</div>
      <div className="pcard__id">{p.id}</div>
      <div className="pcard__footer">
        <span className="pcard__date">{fmtDateDK(p.createdAt)}</span>
        <span className={`pcard__opened ${seen ? 'pcard__opened--seen' : ''}`}>
          <EyeIcon />
          {seen ? relTime(seen) : 'Ikke åbnet'}
        </span>
      </div>
    </div>
  );
};

// ── Dashboard ──────────────────────────────────────────────────
const Dashboard = ({ proposals, templates, onNew, onApplyTemplate, onDeleteTemplate }) => {
  const total = proposals.length;
  const openedToday = proposals.filter(p => {
    const info = getOpenedInfo(p.viewerId);
    if (!info?.lastOpened) return false;
    return Math.floor((Date.now() - new Date(info.lastOpened).getTime()) / 86400000) === 0;
  }).length;
  const sentThisWeek = proposals.filter(p =>
    Math.floor((Date.now() - new Date(p.createdAt).getTime()) / 86400000) < 7
  ).length;

  return (
    <div>
      <div className="dash-header">
        <div className="dash-eyebrow">Oversigt</div>
        <h1 className="dash-title">
          {total === 0 ? 'Ingen tilbud endnu.' : `${total} tilbud oprettet.`}
        </h1>
      </div>

      <div className="stats-row">
        <div className="stat-cell">
          <div className="stat-cell__val stat-cell__val--green">{total}</div>
          <div className="stat-cell__label">Tilbud i alt</div>
        </div>
        <div className="stat-cell">
          <div className="stat-cell__val">{sentThisWeek}</div>
          <div className="stat-cell__label">Sendt seneste 7 dage</div>
        </div>
        <div className="stat-cell">
          <div className="stat-cell__val">{openedToday}</div>
          <div className="stat-cell__label">Åbnet i dag</div>
        </div>
      </div>

      <div className="section-head">
        <h2 className="section-head__title">Templates</h2>
      </div>

      <div className="template-grid">
        {templates.map(t => {
          const svcNames = KEYO_DATA.STANDARD_SERVICES
            .filter(s => t.selectedServices?.[s.id])
            .map(s => s.title);
          const refCount = Object.values(t.selectedReferences || {}).reduce((s, a) => s + a.length, 0);
          return (
            <div key={t.id} className="tcard">
              <div className="tcard__name">{t.name}</div>
              <div className="tcard__chips">
                {svcNames.slice(0, 4).map(n => <span key={n} className="tcard__chip">{n}</span>)}
                {svcNames.length > 4 && <span className="tcard__chip">+{svcNames.length - 4} mere</span>}
              </div>
              <div className="tcard__meta">{svcNames.length} ydelser · {refCount} referencer</div>
              <div className="tcard__actions">
                <button className="btn btn--primary btn--sm" onClick={() => onApplyTemplate(t)}>Brug til nyt tilbud</button>
                <button className="btn btn--danger btn--sm" onClick={() => onDeleteTemplate(t.id)}><TrashIcon /></button>
              </div>
            </div>
          );
        })}

        <button className="tcard-add" onClick={onNew}>
          <PlusIcon /> Opret nyt tilbud
        </button>
      </div>

      {total === 0 && (
        <div className="empty-state">
          <div className="empty-state__title">Klar til det første tilbud.</div>
          <div className="empty-state__sub">Opret et tilbud, og klienten får sin egen unikke URL — klar til at dele.</div>
          <button className="btn btn--primary" style={{ marginTop: 8 }} onClick={onNew}>
            <PlusIcon /> Opret første tilbud
          </button>
        </div>
      )}
    </div>
  );
};

// ── Proposal form (create + edit) ──────────────────────────────
const REF_CATS = [
  { id: 'meta_ads', label: 'Meta Ads' },
  { id: 'flyers',   label: 'Grafisk materiale' },
  { id: 'landing',  label: 'Landing pages' },
];

const blankForm = (templateOverride = null) => {
  const base = {
    clientName: '',
    preparedFor: '',
    preparedBy: 'Sofus Henningsen, KEYO',
    date: todayDK(),
    validUntil: validUntilDK(),
    greeting: '',
    selectedServices: { ...KEYO_DATA.DEFAULT_PROPOSAL.selectedServices },
    selectedReferences: {
      meta_ads: [...KEYO_DATA.DEFAULT_PROPOSAL.selectedReferences.meta_ads],
      flyers:   [...KEYO_DATA.DEFAULT_PROPOSAL.selectedReferences.flyers],
      landing:  [...KEYO_DATA.DEFAULT_PROPOSAL.selectedReferences.landing],
    },
    customServices: [],
    calcInputs: { ...KEYO_DATA.DEFAULT_PROPOSAL.calcInputs },
  };
  if (!templateOverride) return base;
  return {
    ...base,
    selectedServices: { ...base.selectedServices, ...templateOverride.selectedServices },
    selectedReferences: {
      meta_ads: [...new Set([...base.selectedReferences.meta_ads, ...(templateOverride.selectedReferences?.meta_ads || [])])],
      flyers:   [...new Set([...base.selectedReferences.flyers,   ...(templateOverride.selectedReferences?.flyers   || [])])],
      landing:  [...new Set([...base.selectedReferences.landing,  ...(templateOverride.selectedReferences?.landing  || [])])],
    },
  };
};

const ProposalForm = ({ initial, isEdit, onSave, onDelete, onSaveTemplate }) => {
  const [form, setForm] = useState(initial);
  const [refCat, setRefCat] = useState('meta_ads');
  const [toast, setToast] = useState(null);
  const [copied, setCopied] = useState(false);
  const stableId = useRef(genProposalId());

  const proposalId = isEdit ? initial.id       : stableId.current;
  const viewerId   = isEdit ? initial.viewerId : slugify(form.clientName) + '-' + stableId.current.slice(-4).toLowerCase();
  const url        = proposalUrl(viewerId);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setSvc = (id, on) => set('selectedServices', { ...form.selectedServices, [id]: on });
  const setRef = (cat, id, on) => {
    const cur = form.selectedReferences[cat] || [];
    const next = on ? [...new Set([...cur, id])] : cur.filter(x => x !== id);
    set('selectedReferences', { ...form.selectedReferences, [cat]: next });
  };
  const isRefOn = (cat, id) => (form.selectedReferences[cat] || []).includes(id);

  const toast_ = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  const handleSave = () => {
    if (!form.clientName.trim()) { toast_('Kundenavn mangler'); return; }
    onSave(form, proposalId, viewerId);
    toast_(isEdit ? 'Ændringer gemt' : 'Tilbud oprettet');
  };

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const handleSaveTemplate = () => {
    onSaveTemplate({
      id: 'tpl_' + Math.random().toString(36).slice(2, 8),
      name: form.clientName ? `${form.clientName} — pakke` : 'Ny template',
      selectedServices: { ...form.selectedServices },
      selectedReferences: {
        meta_ads: [...(form.selectedReferences.meta_ads || [])],
        flyers:   [...(form.selectedReferences.flyers   || [])],
        landing:  [...(form.selectedReferences.landing  || [])],
      },
      calcInputs: { ...form.calcInputs },
    });
    toast_('Gemt som template');
  };

  const activeSvcs = KEYO_DATA.STANDARD_SERVICES.filter(s => form.selectedServices[s.id]);
  const monthlyTotal = activeSvcs.reduce((s, svc) => s + svc.monthly, 0);
  const totalRefs = Object.values(form.selectedReferences).reduce((s, a) => s + a.length, 0);

  return (
    <div className="form">
      {toast && <Toast msg={toast} />}

      {/* ─ Client info ─ */}
      <div className="form-section">
        <div className="form-section__head">
          <h2 className="form-section__title">Kundeinformation</h2>
        </div>
        <div className="form-grid">
          <div className="form-field form-field--full">
            <label className="form-label">Kundenavn *</label>
            <input className="form-input" value={form.clientName}
              onChange={e => set('clientName', e.target.value)}
              placeholder="fx Estate Charlottenlund" />
          </div>
          <div className="form-field">
            <label className="form-label">Forberedt for (kontaktperson)</label>
            <input className="form-input" value={form.preparedFor}
              onChange={e => set('preparedFor', e.target.value)}
              placeholder="fx Jakob Mørch" />
          </div>
          <div className="form-field">
            <label className="form-label">Forberedt af</label>
            <input className="form-input" value={form.preparedBy}
              onChange={e => set('preparedBy', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Dato</label>
            <input className="form-input" value={form.date}
              onChange={e => set('date', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Gyldig til</label>
            <input className="form-input" value={form.validUntil}
              onChange={e => set('validUntil', e.target.value)} />
          </div>
          <div className="form-field form-field--full">
            <label className="form-label">Personlig hilsen</label>
            <textarea className="form-textarea" rows={4} value={form.greeting}
              onChange={e => set('greeting', e.target.value)}
              placeholder="Skriv en kort personlig besked til kunden..." />
          </div>
        </div>
      </div>

      {/* ─ Services ─ */}
      <div className="form-section">
        <div className="form-section__head">
          <h2 className="form-section__title">Ydelser</h2>
          <span className="form-section__meta">
            {activeSvcs.length} aktive · {fmtNum(monthlyTotal)} kr./mnd
          </span>
        </div>
        <div className="svc-list">
          {KEYO_DATA.STANDARD_SERVICES.map(svc => {
            const on = !!form.selectedServices[svc.id];
            return (
              <div key={svc.id} className={`svc-row ${!on ? 'svc-row--off' : ''}`}>
                <Toggle on={on} onChange={v => setSvc(svc.id, v)} />
                <div className="svc-row__info">
                  <div className="svc-row__name">{svc.title}</div>
                  <div className="svc-row__sub">{svc.subtitle}</div>
                </div>
                <div>
                  {svc.monthly > 0 && (
                    <div className="svc-row__price">{fmtNum(svc.monthly)} kr./mnd</div>
                  )}
                  {svc.setup > 0 && (
                    <div className="svc-row__price-setup">+ {fmtNum(svc.setup)} kr. opstart</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─ References ─ */}
      <div className="form-section">
        <div className="form-section__head">
          <h2 className="form-section__title">Referencer</h2>
          <span className="form-section__meta">{totalRefs} valgt</span>
        </div>
        <div className="ref-tabs">
          {REF_CATS.map(cat => {
            const count = (form.selectedReferences[cat.id] || []).length;
            return (
              <button key={cat.id}
                className={`ref-tab ${refCat === cat.id ? 'ref-tab--active' : ''}`}
                onClick={() => setRefCat(cat.id)}>
                {cat.label}
                <span className="ref-tab__count">{count}</span>
              </button>
            );
          })}
        </div>
        <div className="ref-grid">
          {(KEYO_DATA.REFERENCES[refCat] || []).map(ref => {
            const on = isRefOn(refCat, ref.id);
            const name = ref.brand || ref.address || ref.headline || ref.id;
            const sub = ref.platform
              ? (ref.platform === 'instagram' ? 'Instagram · Feed' : 'Facebook · Feed')
              : ref.city || ref.url || '';
            return (
              <div key={ref.id} className={`ref-item ${on ? 'ref-item--on' : ''}`}
                onClick={() => setRef(refCat, ref.id, !on)}>
                <div style={{ paddingTop: 1 }}>
                  <Toggle on={on} onChange={v => setRef(refCat, ref.id, v)} />
                </div>
                <div>
                  <div className="ref-item__name">{name}</div>
                  <div className="ref-item__sub">{sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─ Actions ─ */}
      <div className="form-bar">
        <div className="form-bar__url">
          URL: <code>?id={viewerId}</code>
        </div>
        <button className="btn" onClick={handleSaveTemplate}>Gem som template</button>
        <button className="btn" onClick={handleCopyUrl}>
          <LinkIcon /> {copied ? 'Kopieret' : 'Kopiér URL'}
        </button>
        {isEdit && (
          <button className="btn btn--danger"
            onClick={() => { if (window.confirm('Slet tilbud?')) onDelete(); }}>
            <TrashIcon /> Slet
          </button>
        )}
        <button className="btn btn--primary" onClick={handleSave}>
          {isEdit ? 'Gem ændringer' : 'Opret tilbud'}
        </button>
      </div>
    </div>
  );
};

// ── Admin root ─────────────────────────────────────────────────
const AdminApp = () => {
  const [proposals, setProposals] = useState(loadProposals);
  const [templates, setTemplates] = useState(loadTemplates);
  const [view, setView]           = useState('dashboard'); // 'dashboard' | 'new' | 'edit'
  const [activeId, setActiveId]   = useState(null);
  const [applyTpl, setApplyTpl]   = useState(null);

  const activeProp = proposals.find(p => p.id === activeId) || null;

  const goNew = (tpl = null) => { setApplyTpl(tpl); setActiveId(null); setView('new'); };
  const goEdit = (id) => { setActiveId(id); setView('edit'); };
  const goDash = () => { setActiveId(null); setView('dashboard'); };

  const handleSave = (form, proposalId, viewerId) => {
    const entry = {
      id: proposalId,
      viewerId,
      clientName:   form.clientName,
      preparedFor:  form.preparedFor,
      preparedBy:   form.preparedBy,
      date:         form.date,
      validUntil:   form.validUntil,
      greeting:     form.greeting,
      selectedServices:   form.selectedServices,
      selectedReferences: form.selectedReferences,
      customServices:     form.customServices || [],
      calcInputs:         form.calcInputs,
      createdAt:   view === 'edit' ? activeProp.createdAt : nowIso(),
      updatedAt:   nowIso(),
    };
    const next = view === 'edit'
      ? proposals.map(p => p.id === activeId ? entry : p)
      : [entry, ...proposals];
    setProposals(next);
    saveProposals(next);
    syncToViewer(entry);
    setActiveId(entry.id);
    setView('edit');
  };

  const handleDelete = () => {
    const next = proposals.filter(p => p.id !== activeId);
    setProposals(next);
    saveProposals(next);
    goDash();
  };

  const handleSaveTemplate = (t) => {
    const next = [t, ...templates];
    setTemplates(next);
    saveTemplates(next);
  };

  const handleDeleteTemplate = (id) => {
    const next = templates.filter(t => t.id !== id);
    setTemplates(next);
    saveTemplates(next);
  };

  const topbarTitle = view === 'new' ? 'Nyt tilbud'
    : view === 'edit' && activeProp ? activeProp.clientName
    : 'Dashboard';

  const formKey = view === 'edit' ? activeId : `new-${applyTpl?.id || 'blank'}`;
  const formInitial = view === 'edit' ? activeProp : blankForm(applyTpl);

  return (
    <div className="admin">
      {/* ── Sidebar ── */}
      <aside className="admin__sidebar">
        <div className="sidebar-head">
          <div className="sidebar-brand">
            <KeyoWordmark />
            <span className="sidebar-brand-tag">Admin</span>
          </div>
          <button className="new-btn" onClick={() => goNew()}>
            <PlusIcon /> Nyt tilbud
          </button>
        </div>

        <div className="proposals-list">
          {proposals.length === 0 ? (
            <div className="proposals-empty">
              Ingen tilbud endnu.<br />Opret dit første herover.
            </div>
          ) : proposals.map(p => (
            <ProposalCard key={p.id} p={p} isActive={activeId === p.id} onClick={() => goEdit(p.id)} />
          ))}
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="admin__main">
        <div className="admin-topbar">
          <span className="admin-topbar__title">{topbarTitle}</span>
          <div className="admin-topbar__actions">
            {view !== 'dashboard' && (
              <button className="btn" onClick={goDash}>← Oversigt</button>
            )}
            {view === 'edit' && activeProp && (
              <a href={proposalUrl(activeProp.viewerId)} target="_blank" rel="noopener"
                className="btn">
                <ExternalIcon /> Se tilbud
              </a>
            )}
          </div>
        </div>

        <div className="admin-content">
          {view === 'dashboard' && (
            <Dashboard
              proposals={proposals}
              templates={templates}
              onNew={() => goNew()}
              onApplyTemplate={(t) => goNew(t)}
              onDeleteTemplate={handleDeleteTemplate}
            />
          )}
          {(view === 'new' || view === 'edit') && formInitial && (
            <ProposalForm
              key={formKey}
              initial={formInitial}
              isEdit={view === 'edit'}
              onSave={handleSave}
              onDelete={handleDelete}
              onSaveTemplate={handleSaveTemplate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<AdminApp />);
