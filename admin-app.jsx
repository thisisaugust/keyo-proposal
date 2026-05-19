// KEYO Admin Dashboard

const { useState, useEffect, useRef } = React;

// ── Utilities ─────────────────────────────────────────────────
const genId = (prefix = 'KEYO') => `${prefix}-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}`;
const genShortId = () => Math.random().toString(36).slice(2, 9);
const slugify = (s) => (s||'').toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'').slice(0,22)||'proposal';
const nowIso = () => new Date().toISOString();
const fmtDateDK = (iso) => iso ? new Date(iso).toLocaleDateString('da-DK',{day:'numeric',month:'short',year:'numeric'}) : '';
const relTime = (iso) => {
  if (!iso) return null;
  const ms = Date.now()-new Date(iso).getTime(), m=Math.floor(ms/60000), h=Math.floor(ms/3600000), d=Math.floor(ms/86400000);
  if (m<2) return 'lige nu'; if (m<60) return `${m} min siden`; if (h<24) return `${h} t siden`;
  if (d===1) return 'i går'; if (d<7) return `${d} dage siden`; return `${Math.floor(d/7)} uger siden`;
};
const ageClass = (c) => { if (!c) return ''; const d=Math.floor((Date.now()-new Date(c).getTime())/86400000); if (d<3) return ''; if (d<7) return 'pcard--recent'; if (d<21) return 'pcard--aging'; return 'pcard--old'; };
const todayDK = () => new Date().toLocaleDateString('da-DK',{day:'numeric',month:'long',year:'numeric'});
const validUntilDK = () => { const d=new Date(); d.setDate(d.getDate()+30); return d.toLocaleDateString('da-DK',{day:'numeric',month:'long',year:'numeric'}); };
const fmtNum = (n) => new Intl.NumberFormat('da-DK').format(n);
const proposalUrl = (v) => window.location.href.replace(/admin(\.html)?.*$/,'') + `?id=${v}`;

// Custom refs only (no standard material in admin library)
const allRefs = (cat, library) => library[cat] || [];

const computeInlineRefs = (p, library) => {
  const inlineRefs = { meta_ads:[], flyers:[], landing:[] };
  ['meta_ads','flyers','landing'].forEach(cat => {
    const ids = (p.selectedReferences||{})[cat]||[];
    inlineRefs[cat] = (library[cat]||[]).filter(r=>ids.includes(r.id));
  });
  return inlineRefs;
};

// ── Hero images ───────────────────────────────────────────────
const HERO_IMAGES = [
  { src:'keyo/img/property-1.jpg', label:'Villa' },
  { src:'keyo/img/property-2.jpg', label:'Penthouse' },
  { src:'keyo/img/property-3.png', label:'Rækkehus' },
  { src:'keyo/img/property-4.png', label:'Park' },
  { src:'keyo/img/property-5.png', label:'Bolig' },
  { src:'keyo/img/office-interior.png', label:'Kontor' },
];

// ── Icons ──────────────────────────────────────────────────────
const EyeIcon = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const PlusIcon = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>;
const TrashIcon = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>;
const LinkIcon = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1.5-1.5"/></svg>;
const ExternalIcon = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>;
const CheckIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 13l4 4L19 7"/></svg>;
const CopyIcon = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>;
const UploadIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>;

const KeyoWordmark = () => (
  <svg viewBox="0 0 986 293" fill="currentColor" aria-label="KEYO" style={{height:14,width:'auto'}}>
    <path d="M0 285.5c7-4.2 11.4-9.7 13.4-16.4 2-7 3-17.7 3-32.1V54.5c0-15-1-25.6-3-32.1C11.4 15.7 7 10.1 0 5.6V4.5h74.6v1.1c-7 4.5-11.4 10.1-13.4 16.8-2 6.5-3 17.2-3 32.1V143.3L157.5 39.6c9.2-10 18.5-21.7 28-35.1h47v3.4c-8.2 2.7-15.3 6-21.3 9.7-6 3.7-12 8.6-18 14.5L104.5 122 235.5 284.4v2.6h-46.7L80.6 146.7l-22.4 22.8v67.5c0 14.4 1 25.1 3 32.1 2 6.7 6.4 12.2 13.4 16.4v1.5H0v-1.5zM256.2 285.5c7-4.2 11.4-9.7 13.4-16.4 2-7 3-17.7 3-32.1V54.5c0-15-1-25.6-3-32.1-2-6.7-6.4-12.3-13.4-16.8V4.5h182.5v33.6c-21.6-5.5-39-9.3-52.2-11.6-13.2-2.5-25.1-3.7-35.8-3.7h-36.2v107.1h22.4c17.9 0 45.5-1.4 82.9-4.1v26.5c-25-2.7-52.5-4.1-82.9-4.1h-22.4v120.1H357c12.2 0 25.3-1.4 39.3-4.1 14.2-3 30.6-7.4 49.3-13.1V287H256.2v-1.5zM482.4 35.5c-4.7-8.2-9-14.4-12.7-18.7-3.7-4.2-8.6-7.9-14.6-11.2V4.5h77.3v1.1c-5.5 3.2-8.2 7.7-8.2 13.4 0 4 1.9 9.7 5.6 17.2l53.7 98.5 52.3-98.9c3.7-7.5 5.6-13.3 5.6-17.6 0-5.2-2.9-9.5-8.6-12.7V4.5H633v1.1c-5.7 3.2-10.6 7.2-14.6 12-4 4.4-8.1 10.7-12.3 18.6L594.7 159v78c0 14.4 1 25.1 3 32.1 2 6.7 6.5 12.2 13.4 16.4v1.5h-74.3v-1.5c7-4.2 11.4-9.7 13.4-16.4 2-7 3-17.7 3-32.1v-78L482.4 35.5zM833.3 0c39.4 0 71.8 13.8 97.4 41.4C956.3 69 969 104.6 969 147.8c0 41.4-12.4 75.6-37.2 102.7-25 27.1-57.7 40.6-98.2 40.6-39.5 0-72-13.5-97.4-40.6-25.4-27-38.1-61.4-38.1-103.1 0-43.2 12.8-78.9 38.5-107C762.2 13.5 794.4 0 833.3 0zm-2.2 21.3c-30.6 0-55.4 12.7-74.5 38-19.1 25.5-28.7 56.6-28.7 93.3 0 35.4 8.8 65.4 26.4 89.9 17.6 24.5 41.3 36.8 71 36.8 30.4 0 55-12.5 73.9-37.5 19-25 28.4-56.6 28.4-95 0-36.9-9.1-67-27.3-90.2C882.2 33 859.4 21.3 831.1 21.3z"/>
  </svg>
);

// ── Components ─────────────────────────────────────────────────
const Toggle = ({ on, onChange }) => (
  <button type="button" className={`toggle ${on?'toggle--on':''}`} onClick={(e)=>{e.stopPropagation();onChange(!on);}} />
);
const Toast = ({ msg }) => <div className="toast">{msg}</div>;

// ── Image upload (single, FileReader → base64) ─────────────────
const ImageUpload = ({ value, onChange }) => {
  const fileRef = useRef();
  const handleFile = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const r = new FileReader(); r.onload = (ev) => onChange(ev.target.result); r.readAsDataURL(file); e.target.value='';
  };
  const isData = value?.startsWith('data:');
  return (
    <div className="img-upload">
      <input type="file" accept="image/*" ref={fileRef} style={{display:'none'}} onChange={handleFile} />
      {value ? (
        <div className="img-upload__preview" style={{backgroundImage:`url(${value})`}}>
          <button className="img-upload__change btn btn--sm" type="button" onClick={()=>fileRef.current?.click()}><UploadIcon /> Skift</button>
          <button className="img-upload__remove" type="button" onClick={()=>onChange('')}>×</button>
        </div>
      ) : (
        <button className="img-upload__btn" type="button" onClick={()=>fileRef.current?.click()}><UploadIcon /> Upload billede</button>
      )}
      <input className="form-input" style={{marginTop:8}} value={isData?'':(value||'')}
        onChange={e=>onChange(e.target.value)} placeholder="Eller indsæt billede-URL..." />
    </div>
  );
};

// ── Multi-page image upload ────────────────────────────────────
const PagesUpload = ({ pages, onChange }) => {
  const fileRef = useRef();
  const handleFiles = (e) => {
    const files = Array.from(e.target.files||[]); if (!files.length) return;
    let done=0; const srcs=new Array(files.length);
    files.forEach((f,i)=>{ const r=new FileReader(); r.onload=(ev)=>{ srcs[i]=ev.target.result; if(++done===files.length) onChange([...pages,...srcs]); }; r.readAsDataURL(f); });
    e.target.value='';
  };
  return (
    <div className="pages-upload">
      <input type="file" accept="image/*" multiple ref={fileRef} style={{display:'none'}} onChange={handleFiles} />
      <div className="pages-upload__list">
        {pages.map((src,i)=>(
          <div key={i} className="pages-upload__thumb">
            <div className="pages-upload__thumb-img" style={{backgroundImage:`url(${src})`}}/>
            <span className="pages-upload__thumb-num">{i+1}</span>
            <button className="pages-upload__thumb-del" type="button" onClick={()=>onChange(pages.filter((_,j)=>j!==i))}>×</button>
          </div>
        ))}
        <button className="pages-upload__add btn btn--sm" type="button" onClick={()=>fileRef.current?.click()}>
          <UploadIcon /> {pages.length===0?'Upload sider':'Tilføj'}
        </button>
      </div>
    </div>
  );
};

// ── Preview components (live preview as you type) ─────────────
const AdPreview = ({ ad }) => (
  <div className="ref-preview ref-preview--ad">
    <div className="ref-preview__head">
      <div className="ref-preview__avatar" style={{background:ad.avatarColor||'#005032'}}>
        {(ad.brand||'V').split(' ').map(w=>w[0]).slice(0,2).join('')}
      </div>
      <div>
        <div className="ref-preview__brand">{ad.brand||'Virksomhedsnavn'}</div>
        <div className="ref-preview__sponsored">Sponsoreret · {ad.platform==='instagram'?'Instagram':'Facebook'}</div>
      </div>
    </div>
    {ad.copy && <div className="ref-preview__copy">{ad.copy}</div>}
    <div className="ref-preview__img" style={{backgroundImage:ad.image?`url(${ad.image})`:'none'}}>
      {!ad.image && <span>Intet billede</span>}
    </div>
    <div className="ref-preview__cta-bar">
      <div>
        <div className="ref-preview__url-line">{ad.url||'example.dk'}</div>
        <div className="ref-preview__headline">{ad.headline||'Headline'}</div>
      </div>
      <div className="ref-preview__cta-btn">{ad.cta||'Læs mere'}</div>
    </div>
  </div>
);

const FlyerPreview = ({ flyer }) => {
  const [pageIdx, setPageIdx] = useState(0);
  const pages = flyer.pages||[];
  const activeSrc = pages[pageIdx];
  return (
    <div className="ref-preview ref-preview--flyer">
      <div className="ref-preview__img" style={{backgroundImage:activeSrc?`url(${activeSrc})`:'none',height:180,position:'relative'}}>
        {!activeSrc && <span>Ingen sider uploadet</span>}
        {pages.length>1 && (
          <div className="ref-preview__page-nav">
            {pages.map((_,i)=>(
              <button key={i} className={`ref-preview__page-dot ${i===pageIdx?'ref-preview__page-dot--active':''}`}
                onClick={(e)=>{e.stopPropagation();setPageIdx(i);}} />
            ))}
          </div>
        )}
      </div>
      <div className="ref-preview__info">
        <div className="ref-preview__brand">{flyer.brand||'Virksomhedsnavn'}</div>
        <div className="ref-preview__headline">{flyer.title||'Materiale-titel'}</div>
        {flyer.description && <div className="ref-preview__copy">{flyer.description}</div>}
        {pages.length>0 && <div style={{fontSize:10,color:'var(--ink-400)',marginTop:4}}>{pages.length} side{pages.length!==1?'r':''}</div>}
      </div>
    </div>
  );
};

const LandingPreview = ({ lp }) => (
  <div className="ref-preview ref-preview--landing">
    <div className="ref-preview__browser-bar">
      <div className="ref-preview__dots"><span/><span/><span/></div>
      <div className="ref-preview__url-bar">{lp.url||'example.dk'}</div>
    </div>
    <div className="ref-preview__lp-nav">
      <div className="ref-preview__brand">{lp.brand||'Virksomhedsnavn'}</div>
    </div>
    <div className="ref-preview__img" style={{backgroundImage:lp.image?`url(${lp.image})`:'none',height:70}}>
      {!lp.image && <span>Intet billede</span>}
    </div>
    <div className="ref-preview__lp-content">
      {lp.eyebrow && <div className="ref-preview__eyebrow">{lp.eyebrow}</div>}
      <div className="ref-preview__headline">{lp.headline||'Overskrift på landingsside'}</div>
      {lp.sub && <div className="ref-preview__copy">{lp.sub}</div>}
      {lp.button && <div className="ref-preview__cta-btn" style={{display:'inline-block',marginTop:8}}>{lp.button}</div>}
    </div>
  </div>
);

const ServicePreview = ({ form, includesText }) => {
  const includes = includesText.split('\n').map(s=>s.trim()).filter(Boolean);
  return (
    <div className="ref-preview ref-preview--service">
      <div className="ref-preview__svc-head">
        <div style={{flex:1,minWidth:0}}>
          <div className="ref-preview__svc-title">{form.title||'Ydelsesnavn'}</div>
          <div className="ref-preview__svc-sub">{form.subtitle||'Kort beskrivelse'}</div>
        </div>
        <div className="ref-preview__svc-price">
          {form.monthly>0 && <div>{fmtNum(form.monthly)} kr./mnd</div>}
          {form.setup>0 && <div style={{fontSize:10,opacity:0.65}}>+ {fmtNum(form.setup)} kr. opstart</div>}
        </div>
      </div>
      {includes.length>0 && (
        <ul className="ref-preview__svc-includes">
          {includes.slice(0,4).map((item,i)=><li key={i}>{item}</li>)}
          {includes.length>4 && <li style={{opacity:0.45}}>+{includes.length-4} mere</li>}
        </ul>
      )}
      {(form.results.primary.value||form.results.secondary.value) && (
        <div className="ref-preview__svc-results">
          {form.results.primary.value && (
            <div className="ref-preview__svc-result ref-preview__svc-result--accent">
              <div className="ref-preview__svc-result-label">{form.results.primary.label||'Primært'}</div>
              <div className="ref-preview__svc-result-value">{form.results.primary.value}</div>
            </div>
          )}
          {form.results.secondary.value && (
            <div className="ref-preview__svc-result">
              <div className="ref-preview__svc-result-label">{form.results.secondary.label||'Sekundært'}</div>
              <div className="ref-preview__svc-result-value">{form.results.secondary.value}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Proposal sidebar card ──────────────────────────────────────
const ProposalCard = ({ p, isActive, onClick, views }) => {
  const info = views?.[p.viewerId], seen = info?.lastOpened;
  return (
    <div className={`pcard ${ageClass(p.createdAt)} ${isActive?'pcard--active':''}`} onClick={onClick}>
      <div className="pcard__name">{p.clientName}</div>
      <div className="pcard__id">{p.id}</div>
      <div className="pcard__footer">
        <span className="pcard__date">{fmtDateDK(p.createdAt)}</span>
        <span className={`pcard__opened ${seen?'pcard__opened--seen':''}`}><EyeIcon /> {seen?relTime(seen):'Ikke åbnet'}</span>
      </div>
    </div>
  );
};

// ── Dashboard ──────────────────────────────────────────────────
const Dashboard = ({ proposals, templates, onNew, onApplyTemplate, onDeleteTemplate }) => {
  const total = proposals.length;
  const openedToday = proposals.filter(p=>{ const i=getOpenedInfo(p.viewerId); return i?.lastOpened && Math.floor((Date.now()-new Date(i.lastOpened).getTime())/86400000)===0; }).length;
  const sentThisWeek = proposals.filter(p=>Math.floor((Date.now()-new Date(p.createdAt).getTime())/86400000)<7).length;
  return (
    <div>
      <div className="dash-header">
        <div className="dash-eyebrow">Oversigt</div>
        <h1 className="dash-title">{total===0?'Ingen tilbud endnu.':`${total} tilbud oprettet.`}</h1>
      </div>
      <div className="stats-row">
        <div className="stat-cell"><div className="stat-cell__val stat-cell__val--green">{total}</div><div className="stat-cell__label">Tilbud i alt</div></div>
        <div className="stat-cell"><div className="stat-cell__val">{sentThisWeek}</div><div className="stat-cell__label">Sendt seneste 7 dage</div></div>
        <div className="stat-cell"><div className="stat-cell__val">{openedToday}</div><div className="stat-cell__label">Åbnet i dag</div></div>
      </div>
      <div className="section-head"><h2 className="section-head__title">Templates</h2></div>
      <div className="template-grid">
        {templates.map(t=>{
          const svcNames = KEYO_DATA.STANDARD_SERVICES.filter(s=>t.selectedServices?.[s.id]).map(s=>s.title);
          const refCount = Object.values(t.selectedReferences||{}).reduce((s,a)=>s+a.length,0);
          return (
            <div key={t.id} className="tcard">
              <div className="tcard__name">{t.name}</div>
              <div className="tcard__chips">{svcNames.slice(0,4).map(n=><span key={n} className="tcard__chip">{n}</span>)}{svcNames.length>4&&<span className="tcard__chip">+{svcNames.length-4}</span>}</div>
              <div className="tcard__meta">{svcNames.length} ydelser · {refCount} referencer</div>
              <div className="tcard__actions">
                <button className="btn btn--primary btn--sm" onClick={()=>onApplyTemplate(t)}>Brug til nyt tilbud</button>
                <button className="btn btn--danger btn--sm" onClick={()=>onDeleteTemplate(t.id)}><TrashIcon /></button>
              </div>
            </div>
          );
        })}
        <button className="tcard-add" onClick={onNew}><PlusIcon /> Opret nyt tilbud</button>
      </div>
      {total===0&&<div className="empty-state"><div className="empty-state__title">Klar til det første tilbud.</div><div className="empty-state__sub">Opret et tilbud — klienten får sin egen unikke URL.</div><button className="btn btn--primary" style={{marginTop:8}} onClick={onNew}><PlusIcon /> Opret første tilbud</button></div>}
    </div>
  );
};

// ── Library forms ──────────────────────────────────────────────
const REF_CATS = [
  { id:'meta_ads', label:'Meta Ads' },
  { id:'flyers',   label:'Grafisk materiale' },
  { id:'landing',  label:'Landing pages' },
];

const blankCustomRef = (cat) => {
  if (cat==='meta_ads') return { platform:'facebook', brand:'', copy:'', image:'', headline:'', cta:'Læs mere', url:'', avatarColor:'#005032' };
  if (cat==='flyers')   return { title:'', brand:'', description:'', pages:[] };
  return { url:'', image:'', brand:'', eyebrow:'', headline:'', sub:'', button:'Kom i gang', navLinks:['Forside','Om os','Services','Kontakt'] };
};

const CustomRefForm = ({ cat, onSave, onCancel }) => {
  const [form, setForm] = useState(blankCustomRef(cat));
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const field = (label,key,placeholder='') => (
    <div className="form-field">
      <label className="form-label">{label}</label>
      <input className="form-input" value={form[key]||''} onChange={e=>set(key,e.target.value)} placeholder={placeholder} />
    </div>
  );
  const handleSave = () => {
    if (cat==='meta_ads'&&!form.brand) return;
    if (cat==='flyers'&&!form.title) return;
    if (cat==='landing'&&!form.headline) return;
    onSave({...form, id:'custom_'+genShortId(), custom:true});
  };
  const preview = cat==='meta_ads' ? <AdPreview ad={form} />
    : cat==='flyers' ? <FlyerPreview flyer={form} />
    : <LandingPreview lp={form} />;
  return (
    <div className="custom-ref-form">
      <div className="lib-form-with-preview">
        <div>
          <div className="form-grid" style={{marginBottom:20}}>
            {cat==='meta_ads'&&(<>
              <div className="form-field"><label className="form-label">Platform</label>
                <select className="form-input" value={form.platform} onChange={e=>set('platform',e.target.value)}>
                  <option value="facebook">Facebook</option><option value="instagram">Instagram</option>
                </select>
              </div>
              {field('Virksomhedsnavn *','brand','fx ACME Gruppen')}
              <div className="form-field form-field--full">{field('Annoncetekst','copy','Beskriv hvad du tilbyder...')}</div>
              <div className="form-field form-field--full"><label className="form-label">Billede</label><ImageUpload value={form.image} onChange={v=>set('image',v)}/></div>
              {field('Headline (CTA-bar)','headline','fx Din overskrift her')}
              {field('CTA-knaptekst','cta','Læs mere')}
              {field('Hjemmeside','url','fx example.dk')}
            </>)}
            {cat==='flyers'&&(<>
              <div className="form-field form-field--full">{field('Materiale-titel *','title','fx Forårskampagne 2026')}</div>
              {field('Virksomhedsnavn','brand','fx ACME Gruppen')}
              {field('Kort beskrivelse','description','fx Præsentation af vores services')}
              <div className="form-field form-field--full"><label className="form-label">Sider (upload billeder)</label><PagesUpload pages={form.pages||[]} onChange={pages=>set('pages',pages)}/></div>
            </>)}
            {cat==='landing'&&(<>
              {field('Hjemmeside','url','fx example.dk/landingsside')}
              {field('Virksomhedsnavn *','brand','fx ACME Gruppen')}
              {field('Overskrift *','headline','Hvad er din løsning?')}
              <div className="form-field form-field--full">{field('Beskrivende tekst','sub','Kort tekst under overskriften...')}</div>
              {field('Øjenbryn (eyebrow)','eyebrow','fx Gratis prøveperiode')}
              {field('CTA-knaptekst','button','Kom i gang')}
              <div className="form-field form-field--full"><label className="form-label">Billede</label><ImageUpload value={form.image} onChange={v=>set('image',v)}/></div>
            </>)}
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn" onClick={onCancel}>Annullér</button>
            <button className="btn btn--primary" onClick={handleSave}>Tilføj til bibliotek</button>
          </div>
        </div>
        <div className="lib-preview-panel">
          <div className="lib-preview-panel__label">Forhåndsvisning</div>
          {preview}
        </div>
      </div>
    </div>
  );
};

const blankCustomService = () => ({
  title:'', subtitle:'', monthly:0, setup:0,
  results:{ primary:{label:'',value:'',accent:true}, secondary:{label:'',value:''} },
});

const ServiceLibForm = ({ onSave, onCancel }) => {
  const [form, setForm] = useState(blankCustomService());
  const [includesText, setIncludesText] = useState('');
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const setResult = (which,key,val) => set('results',{...form.results,[which]:{...form.results[which],[key]:val}});
  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave({...form, id:'custom_svc_'+genShortId(), custom:true, includes:includesText.split('\n').map(s=>s.trim()).filter(Boolean)});
  };
  return (
    <div className="custom-ref-form">
      <div className="lib-form-with-preview">
        <div>
          <div className="form-grid" style={{marginBottom:20}}>
            <div className="form-field form-field--full"><label className="form-label">Titel *</label><input className="form-input" value={form.title} onChange={e=>set('title',e.target.value)} placeholder="fx E-mail automatisering"/></div>
            <div className="form-field form-field--full"><label className="form-label">Kort beskrivelse</label><input className="form-input" value={form.subtitle} onChange={e=>set('subtitle',e.target.value)} placeholder="En linje der sælger ydelsen..."/></div>
            <div className="form-field"><label className="form-label">Månedlig pris (kr.)</label><input className="form-input" type="number" min="0" value={form.monthly} onChange={e=>set('monthly',+e.target.value)}/></div>
            <div className="form-field"><label className="form-label">Opstart, engangs (kr.)</label><input className="form-input" type="number" min="0" value={form.setup} onChange={e=>set('setup',+e.target.value)}/></div>
            <div className="form-field form-field--full"><label className="form-label">Inkluderet (én pr. linje)</label><textarea className="form-textarea" rows={4} value={includesText} onChange={e=>setIncludesText(e.target.value)} placeholder={"Opsætning af flows\nLøbende optimering\nMånedlig rapport"}/></div>
            <div className="form-field"><label className="form-label">Primært resultat — label</label><input className="form-input" value={form.results.primary.label} onChange={e=>setResult('primary','label',e.target.value)} placeholder="fx Leads / mnd"/></div>
            <div className="form-field"><label className="form-label">Primært resultat — værdi</label><input className="form-input" value={form.results.primary.value} onChange={e=>setResult('primary','value',e.target.value)} placeholder="fx 80 – 120"/></div>
            <div className="form-field"><label className="form-label">Sekundært resultat — label</label><input className="form-input" value={form.results.secondary.label} onChange={e=>setResult('secondary','label',e.target.value)} placeholder="fx Snit-CPL (kr.)"/></div>
            <div className="form-field"><label className="form-label">Sekundært resultat — værdi</label><input className="form-input" value={form.results.secondary.value} onChange={e=>setResult('secondary','value',e.target.value)} placeholder="fx 55 – 75"/></div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn" onClick={onCancel}>Annullér</button>
            <button className="btn btn--primary" onClick={handleSave}>Tilføj ydelse</button>
          </div>
        </div>
        <div className="lib-preview-panel">
          <div className="lib-preview-panel__label">Forhåndsvisning</div>
          <ServicePreview form={form} includesText={includesText}/>
        </div>
      </div>
    </div>
  );
};

const ImageLibForm = ({ onSave, onCancel }) => {
  const [label, setLabel] = useState('');
  const [src, setSrc] = useState('');
  return (
    <div className="custom-ref-form">
      <div className="form-grid" style={{marginBottom:20}}>
        <div className="form-field"><label className="form-label">Titel (valgfrit)</label><input className="form-input" value={label} onChange={e=>setLabel(e.target.value)} placeholder="fx Kontor, Boligfoto"/></div>
        <div className="form-field form-field--full"><label className="form-label">Billede</label><ImageUpload value={src} onChange={setSrc}/></div>
      </div>
      <div style={{display:'flex',gap:8}}>
        <button className="btn" onClick={onCancel}>Annullér</button>
        <button className="btn btn--primary" onClick={()=>{ if(!src) return; onSave({id:'img_'+genShortId(),src,label:label||'Billede'}); }}>Tilføj til bibliotek</button>
      </div>
    </div>
  );
};

// ── Library view ───────────────────────────────────────────────
const LibraryView = ({ library, onAddCustom, onDeleteCustom, onAddService, onDeleteService, onAddImage, onDeleteImage }) => {
  const [activeTab, setActiveTab] = useState('meta_ads');
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState(null);
  const toast_ = (msg) => { setToast(msg); setTimeout(()=>setToast(null),2500); };

  const isServicesTab = activeTab==='services';
  const isImagesTab = activeTab==='images';
  const isRefTab = !isServicesTab && !isImagesTab;
  const libServices = library.services||[];
  const libImages = library.images||[];

  const handleSaveRef = (ref) => { onAddCustom(activeTab,ref); setAdding(false); toast_('Tilføjet til bibliotek'); };
  const handleSaveService = (svc) => { onAddService(svc); setAdding(false); toast_('Ydelse tilføjet'); };
  const handleSaveImage = (img) => { onAddImage(img); setAdding(false); toast_('Billede tilføjet'); };
  const switchTab = (t) => { setActiveTab(t); setAdding(false); };

  const tabCount = (id) => {
    if (id==='services') return libServices.length;
    if (id==='images') return libImages.length;
    return (library[id]||[]).length;
  };

  return (
    <div>
      {toast && <Toast msg={toast}/>}
      <div className="dash-header">
        <div className="dash-eyebrow">Indhold</div>
        <h1 className="dash-title">Bibliotek.</h1>
      </div>
      <p style={{fontSize:'var(--fs-body)',color:'var(--ink-500)',fontWeight:500,marginBottom:40,marginTop:-24,maxWidth:560,lineHeight:1.6}}>
        Alt du tilføjer her kan bruges i tilbud — referencer, ydelser og hero-billeder.
      </p>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <div className="ref-tabs">
          {REF_CATS.map(c=>(
            <button key={c.id} className={`ref-tab ${activeTab===c.id?'ref-tab--active':''}`} onClick={()=>switchTab(c.id)}>
              {c.label}<span className="ref-tab__count">{tabCount(c.id)}</span>
            </button>
          ))}
          <button className={`ref-tab ${activeTab==='services'?'ref-tab--active':''}`} onClick={()=>switchTab('services')}>
            Ydelser<span className="ref-tab__count">{tabCount('services')}</span>
          </button>
          <button className={`ref-tab ${activeTab==='images'?'ref-tab--active':''}`} onClick={()=>switchTab('images')}>
            Billeder<span className="ref-tab__count">{tabCount('images')}</span>
          </button>
        </div>
        {!adding && (
          <button className="btn btn--primary" onClick={()=>setAdding(true)}>
            <PlusIcon /> {isServicesTab?'Ny ydelse':isImagesTab?'Upload billede':'Tilføj materiale'}
          </button>
        )}
      </div>

      {adding && isRefTab && (
        <div style={{marginBottom:32}}>
          <div className="section-head" style={{marginBottom:20}}><h3 className="section-head__title">Nyt {REF_CATS.find(c=>c.id===activeTab)?.label}-materiale</h3></div>
          <CustomRefForm cat={activeTab} onSave={handleSaveRef} onCancel={()=>setAdding(false)}/>
        </div>
      )}
      {adding && isServicesTab && (
        <div style={{marginBottom:32}}>
          <div className="section-head" style={{marginBottom:20}}><h3 className="section-head__title">Ny ydelse</h3></div>
          <ServiceLibForm onSave={handleSaveService} onCancel={()=>setAdding(false)}/>
        </div>
      )}
      {adding && isImagesTab && (
        <div style={{marginBottom:32}}>
          <div className="section-head" style={{marginBottom:20}}><h3 className="section-head__title">Nyt hero-billede</h3></div>
          <ImageLibForm onSave={handleSaveImage} onCancel={()=>setAdding(false)}/>
        </div>
      )}

      {/* Refs tab */}
      {isRefTab && (
        (library[activeTab]||[]).length>0 ? (
          <div className="lib-grid" style={{marginBottom:40}}>
            {(library[activeTab]||[]).map(ref=>(
              <div key={ref.id} className="lib-card lib-card--custom">
                {ref.image && <div className="lib-card__img" style={{backgroundImage:`url(${ref.image})`}}/>}
                {(ref.pages?.length>0) && <div className="lib-card__img" style={{backgroundImage:`url(${ref.pages[0]})`}}/>}
                <div className="lib-card__body">
                  <div className="lib-card__name">{ref.brand||ref.title||ref.headline||ref.id}</div>
                  <div className="lib-card__sub">{ref.platform?(ref.platform==='instagram'?'Instagram':'Facebook'):ref.description||ref.url||''}</div>
                  <button className="lib-card__delete btn btn--danger btn--sm"
                    onClick={()=>{if(window.confirm('Slet?')) onDeleteCustom(activeTab,ref.id);}}>
                    <TrashIcon /> Slet
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__title">Ingen {REF_CATS.find(c=>c.id===activeTab)?.label.toLowerCase()} endnu.</div>
            <div className="empty-state__sub">Tilføj dit første materiale herover.</div>
          </div>
        )
      )}

      {/* Services tab */}
      {isServicesTab && (
        libServices.length>0 ? (
          <div className="lib-svc-list">
            {libServices.map(svc=>(
              <div key={svc.id} className="lib-svc-row">
                <div className="lib-svc-row__info"><div className="lib-svc-row__title">{svc.title}</div><div className="lib-svc-row__sub">{svc.subtitle}</div></div>
                <div className="lib-svc-row__pricing">
                  {svc.monthly>0&&<span>{fmtNum(svc.monthly)} kr./mnd</span>}
                  {svc.setup>0&&<span className="lib-svc-row__setup">+ {fmtNum(svc.setup)} kr. opstart</span>}
                </div>
                <button className="btn btn--danger btn--sm" onClick={()=>{if(window.confirm('Slet ydelse?')) onDeleteService(svc.id);}}><TrashIcon /> Slet</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state"><div className="empty-state__title">Ingen egne ydelser endnu.</div><div className="empty-state__sub">Tilføj en ydelse — den vises i alle tilbud.</div></div>
        )
      )}

      {/* Images tab */}
      {isImagesTab && (
        libImages.length>0 ? (
          <div className="img-lib-grid">
            {libImages.map(img=>(
              <div key={img.id} className="img-lib-thumb">
                <div className="img-lib-thumb__img" style={{backgroundImage:`url(${img.src})`}}/>
                <div className="img-lib-thumb__label">{img.label}</div>
                <button className="img-lib-thumb__del" onClick={()=>{if(window.confirm('Slet billede?')) onDeleteImage(img.id);}}>×</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state"><div className="empty-state__title">Ingen billeder endnu.</div><div className="empty-state__sub">Upload billeder her — de vises som valgmuligheder under Hero-billede i tilbud.</div></div>
        )
      )}
    </div>
  );
};

// ── Hero image picker ──────────────────────────────────────────
const HeroPicker = ({ value, onChange, libraryImages=[] }) => {
  const fileRef = useRef();
  const [customUrl, setCustomUrl] = useState('');
  const handleFile = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const r = new FileReader(); r.onload=(ev)=>onChange(ev.target.result); r.readAsDataURL(file); e.target.value='';
  };
  const allImages = [...HERO_IMAGES, ...libraryImages.map(img=>({src:img.src,label:img.label}))];
  return (
    <div>
      <input type="file" accept="image/*" ref={fileRef} style={{display:'none'}} onChange={handleFile}/>
      <div className="hero-grid">
        {allImages.map(img=>(
          <div key={img.src} className={`hero-thumb ${value===img.src?'hero-thumb--active':''}`}
            style={{backgroundImage:`url(${img.src})`}} onClick={()=>onChange(img.src)} title={img.label}>
            {value===img.src&&<div className="hero-thumb__check"><CheckIcon/></div>}
          </div>
        ))}
        <div className="hero-thumb hero-thumb--upload" onClick={()=>fileRef.current?.click()} title="Upload billede">
          <UploadIcon/><span>Upload</span>
        </div>
      </div>
      <div style={{display:'flex',gap:10,alignItems:'center',marginTop:12}}>
        <input className="form-input" style={{flex:1}} value={customUrl} onChange={e=>setCustomUrl(e.target.value)} placeholder="Eller indsæt billede-URL..."/>
        {customUrl&&<button className="btn btn--sm" onClick={()=>{onChange(customUrl);setCustomUrl('');}}>Brug</button>}
      </div>
    </div>
  );
};

// ── Proposal form ──────────────────────────────────────────────
const blankForm = (library, templateOverride=null) => {
  const base = {
    clientName:'', preparedFor:'', preparedBy:'Sofus Henningsen, KEYO',
    date:todayDK(), validUntil:validUntilDK(), greeting:'',
    heroImage:'keyo/img/property-2.jpg',
    selectedServices:{...KEYO_DATA.DEFAULT_PROPOSAL.selectedServices},
    selectedReferences:{ meta_ads:[...KEYO_DATA.DEFAULT_PROPOSAL.selectedReferences.meta_ads], flyers:[...KEYO_DATA.DEFAULT_PROPOSAL.selectedReferences.flyers], landing:[...KEYO_DATA.DEFAULT_PROPOSAL.selectedReferences.landing] },
    customServices:[], calcInputs:{...KEYO_DATA.DEFAULT_PROPOSAL.calcInputs},
  };
  if (!templateOverride) return base;
  return { ...base, selectedServices:{...base.selectedServices,...templateOverride.selectedServices},
    selectedReferences:{ meta_ads:[...new Set([...base.selectedReferences.meta_ads,...(templateOverride.selectedReferences?.meta_ads||[])])], flyers:[...new Set([...base.selectedReferences.flyers,...(templateOverride.selectedReferences?.flyers||[])])], landing:[...new Set([...base.selectedReferences.landing,...(templateOverride.selectedReferences?.landing||[])])] } };
};

const ProposalForm = ({ initial, isEdit, library, onSave, onDelete, onSaveTemplate, onDuplicate }) => {
  const [form, setForm] = useState(initial);
  const [refCat, setRefCat] = useState('meta_ads');
  const [toast, setToast] = useState(null);
  const [copied, setCopied] = useState(false);
  const stableId = useRef(genId());

  const proposalId = isEdit ? initial.id : stableId.current;
  const viewerId   = isEdit ? initial.viewerId : slugify(form.clientName)+'-'+stableId.current.slice(-4).toLowerCase();
  const url        = proposalUrl(viewerId);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const setSvc = (id,on) => set('selectedServices',{...form.selectedServices,[id]:on});
  const setRef = (cat,id,on) => {
    const cur = form.selectedReferences[cat]||[];
    set('selectedReferences',{...form.selectedReferences,[cat]:on?[...new Set([...cur,id])]:cur.filter(x=>x!==id)});
  };
  const isRefOn = (cat,id) => (form.selectedReferences[cat]||[]).includes(id);
  const toast_ = (msg) => { setToast(msg); setTimeout(()=>setToast(null),2000); };

  const libServices = library.services||[];
  const allSvcs = [...KEYO_DATA.STANDARD_SERVICES, ...libServices];
  const activeSvcs = allSvcs.filter(s=>!!form.selectedServices[s.id]);
  const monthlyTotal = activeSvcs.reduce((s,svc)=>s+(svc.monthly||0),0);
  const totalRefs = Object.values(form.selectedReferences).reduce((s,a)=>s+a.length,0);

  const handleSave = () => {
    if (!form.clientName.trim()) { toast_('Kundenavn mangler'); return; }
    const computedCustomServices = libServices.filter(s=>!!form.selectedServices[s.id]);
    onSave({...form,customServices:computedCustomServices}, proposalId, viewerId);
    toast_(isEdit?'Ændringer gemt':'Tilbud oprettet');
  };
  const handleCopyUrl = () => { navigator.clipboard?.writeText(url); setCopied(true); setTimeout(()=>setCopied(false),1600); };
  const handleSaveTemplate = () => {
    onSaveTemplate({ id:'tpl_'+genShortId(), name:form.clientName?`${form.clientName} — pakke`:'Ny template', selectedServices:{...form.selectedServices}, selectedReferences:{meta_ads:[...(form.selectedReferences.meta_ads||[])],flyers:[...(form.selectedReferences.flyers||[])],landing:[...(form.selectedReferences.landing||[])]}, calcInputs:{...form.calcInputs} });
    toast_('Gemt som template');
  };

  return (
    <div className="form">
      {toast&&<Toast msg={toast}/>}
      <div className="form-section">
        <div className="form-section__head"><h2 className="form-section__title">Kundeinformation</h2></div>
        <div className="form-grid">
          <div className="form-field form-field--full"><label className="form-label">Kundenavn *</label><input className="form-input" value={form.clientName} onChange={e=>set('clientName',e.target.value)} placeholder="fx Estate Charlottenlund"/></div>
          <div className="form-field"><label className="form-label">Forberedt for (kontaktperson)</label><input className="form-input" value={form.preparedFor} onChange={e=>set('preparedFor',e.target.value)} placeholder="fx Jakob Mørch"/></div>
          <div className="form-field"><label className="form-label">Forberedt af</label><input className="form-input" value={form.preparedBy} onChange={e=>set('preparedBy',e.target.value)}/></div>
          <div className="form-field"><label className="form-label">Dato</label><input className="form-input" value={form.date} onChange={e=>set('date',e.target.value)}/></div>
          <div className="form-field"><label className="form-label">Gyldig til</label><input className="form-input" value={form.validUntil} onChange={e=>set('validUntil',e.target.value)}/></div>
          <div className="form-field form-field--full"><label className="form-label">Personlig hilsen</label><textarea className="form-textarea" rows={4} value={form.greeting} onChange={e=>set('greeting',e.target.value)} placeholder="Skriv en kort personlig besked til kunden..."/></div>
        </div>
      </div>
      <div className="form-section">
        <div className="form-section__head"><h2 className="form-section__title">Hero-billede</h2></div>
        <HeroPicker value={form.heroImage} onChange={v=>set('heroImage',v)} libraryImages={library.images||[]}/>
      </div>
      <div className="form-section">
        <div className="form-section__head">
          <h2 className="form-section__title">Ydelser</h2>
          <span className="form-section__meta">{activeSvcs.length} aktive · {fmtNum(monthlyTotal)} kr./mnd</span>
        </div>
        <div className="svc-list">
          {allSvcs.map(svc=>{
            const on=!!form.selectedServices[svc.id];
            return (
              <div key={svc.id} className={`svc-row ${!on?'svc-row--off':''}`}>
                <Toggle on={on} onChange={v=>setSvc(svc.id,v)}/>
                <div className="svc-row__info">
                  <div className="svc-row__name">{svc.title}{svc.custom&&<span style={{fontSize:9,marginLeft:6,color:'var(--keyo-green)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.04em'}}>Eget</span>}</div>
                  <div className="svc-row__sub">{svc.subtitle}</div>
                </div>
                <div>
                  {svc.monthly>0&&<div className="svc-row__price">{fmtNum(svc.monthly)} kr./mnd</div>}
                  {svc.setup>0&&<div className="svc-row__price-setup">+ {fmtNum(svc.setup)} kr. opstart</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="form-section">
        <div className="form-section__head"><h2 className="form-section__title">Referencer</h2><span className="form-section__meta">{totalRefs} valgt</span></div>
        <div className="ref-tabs">
          {REF_CATS.map(cat=>{
            const count=(form.selectedReferences[cat.id]||[]).length;
            return <button key={cat.id} className={`ref-tab ${refCat===cat.id?'ref-tab--active':''}`} onClick={()=>setRefCat(cat.id)}>{cat.label} <span className="ref-tab__count">{count}</span></button>;
          })}
        </div>
        <div className="ref-grid">
          {allRefs(refCat,library).length===0 ? (
            <div style={{color:'var(--ink-400)',fontSize:'var(--fs-caption)',padding:'12px 0'}}>
              Ingen referencer tilføjet i biblioteket endnu. Gå til Bibliotek for at tilføje.
            </div>
          ) : allRefs(refCat,library).map(ref=>{
            const on=isRefOn(refCat,ref.id);
            const name=ref.brand||ref.title||ref.address||ref.headline||ref.id;
            const sub=ref.platform?(ref.platform==='instagram'?'Instagram · Feed':'Facebook · Feed'):ref.description||ref.city||ref.url||'';
            return (
              <div key={ref.id} className={`ref-item ${on?'ref-item--on':''}`} onClick={()=>setRef(refCat,ref.id,!on)}>
                <div style={{paddingTop:1}}><Toggle on={on} onChange={v=>setRef(refCat,ref.id,v)}/></div>
                <div>
                  <div className="ref-item__name">{name}</div>
                  <div className="ref-item__sub">{sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="form-bar">
        <div className="form-bar__url">URL: <code>?id={viewerId}</code></div>
        <button className="btn" onClick={handleSaveTemplate}>Gem som template</button>
        <button className="btn" onClick={handleCopyUrl}><LinkIcon /> {copied?'Kopieret':'Kopiér URL'}</button>
        {isEdit&&onDuplicate&&<button className="btn" onClick={onDuplicate}><CopyIcon /> Dupliker tilbud</button>}
        {isEdit&&<button className="btn btn--danger" onClick={()=>{if(window.confirm('Slet tilbud?')) onDelete();}}><TrashIcon /> Slet</button>}
        <button className="btn btn--primary" onClick={handleSave}>{isEdit?'Gem ændringer':'Opret tilbud'}</button>
      </div>
    </div>
  );
};

// ── Login screen ───────────────────────────────────────────────
const LoginScreen = ({ onLogin }) => {
  const [email,    setEmail]    = useState('');
  const [password,     setPassword]     = useState('');
  const [mode,         setMode]         = useState('login');
  const [error,        setError]        = useState('');
  const [busy,         setBusy]         = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState(false);

  const dkError = (msg) => {
    if (!msg) return 'Ukendt fejl — prøv igen';
    if (msg.includes('Email not confirmed'))       return 'Bekræft din e-mail før du logger ind. Tjek din indbakke.';
    if (msg.includes('Invalid login credentials')) return 'Forkert e-mail eller adgangskode.';
    if (msg.includes('already registered'))        return 'Denne e-mail er allerede i brug — prøv at logge ind.';
    if (msg.includes('Password should be'))        return 'Adgangskoden skal være mindst 6 tegn.';
    if (msg.includes('Unable to validate'))        return 'Ugyldigt e-mailformat.';
    return msg;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setNeedsConfirm(false); setBusy(true);
    const result = mode==='login'
      ? await DB.signIn(email, password)
      : await DB.signUp(email, password);
    if (result.error) {
      setError(dkError(result.error.message));
    } else if (mode==='signup' && !result.session) {
      // Supabase sent a confirmation email — session not active yet
      setNeedsConfirm(true);
    } else {
      onLogin(result.user);
    }
    setBusy(false);
  };

  return (
    <div style={{display:'grid',placeItems:'center',height:'100vh',background:'var(--ink-900)'}}>
      <div style={{background:'var(--canvas)',padding:40,width:360}}>
        <KeyoWordmark/>
        <h2 style={{margin:'24px 0 4px',fontSize:'var(--fs-h4)',fontWeight:'var(--fw-medium)',color:'var(--ink-900)'}}>
          {mode==='login'?'Log ind':'Opret konto'}
        </h2>
        <p style={{fontSize:'var(--fs-caption)',color:'var(--ink-500)',marginBottom:24}}>KEYO · Admin</p>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
          <div className="form-field">
            <label className="form-label">E-mail</label>
            <input className="form-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoFocus/>
          </div>
          <div className="form-field">
            <label className="form-label">Adgangskode</label>
            <input className="form-input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
          </div>
          {error && <div style={{color:'#b91c1c',fontSize:'var(--fs-caption)',fontWeight:500}}>{error}</div>}
          {needsConfirm && (
            <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',padding:'10px 14px',fontSize:'var(--fs-caption)',color:'#166534',lineHeight:1.5}}>
              Konto oprettet. Tjek din e-mail og klik på bekræftelseslinket — log derefter ind herunder.
            </div>
          )}
          <button className="btn btn--primary" type="submit" disabled={busy} style={{marginTop:4}}>
            {busy?'Vent...':(mode==='login'?'Log ind':'Opret konto')}
          </button>
          <button type="button" className="btn" onClick={()=>{setMode(m=>m==='login'?'signup':'login');setError('');setNeedsConfirm(false);}}>
            {mode==='login'?'Opret ny konto':'Jeg har allerede en konto'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ── Admin root ─────────────────────────────────────────────────
const AdminApp = () => {
  const [user,      setUser]      = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [library,   setLibrary]   = useState({meta_ads:[],flyers:[],landing:[],services:[],images:[]});
  const [views,     setViews]     = useState({});
  const [loading,   setLoading]   = useState(false);

  const [view,     setView]     = useState('dashboard');
  const [activeId, setActiveId] = useState(null);
  const [applyTpl, setApplyTpl] = useState(null);
  const [mainTab,  setMainTab]  = useState('dashboard');

  // Check auth state on mount
  useEffect(() => {
    DB.getSession().then(session => {
      setUser(session?.user || null);
      setAuthReady(true);
    });
    const { data: { subscription } } = db.auth.onAuthStateChange((_evt, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load all data once authenticated
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      DB.loadProposals(),
      DB.loadTemplates(),
      DB.loadLibrary(),
      DB.loadAllViews(),
    ]).then(([props, tmpls, lib, vws]) => {
      setProposals(props);
      setTemplates(tmpls);
      setLibrary(lib);
      setViews(vws);
      setLoading(false);
    });
  }, [user]);

  const activeProp = proposals.find(p=>p.id===activeId)||null;
  const goNew  = (tpl=null) => { setApplyTpl(tpl); setActiveId(null); setView('new'); };
  const goEdit = (id) => { setActiveId(id); setView('edit'); };
  const goDash = () => { setActiveId(null); setView(mainTab); };

  const handleSave = (form, proposalId, viewerId) => {
    const groupId = view==='edit' ? (activeProp.groupId||genShortId()) : genShortId();
    const entry = {
      id:proposalId, viewerId, clientName:form.clientName,
      preparedFor:form.preparedFor, preparedBy:form.preparedBy,
      date:form.date, validUntil:form.validUntil,
      greeting:form.greeting, heroImage:form.heroImage,
      selectedServices:form.selectedServices, selectedReferences:form.selectedReferences,
      customServices:form.customServices||[], calcInputs:form.calcInputs,
      groupId, createdAt:view==='edit'?activeProp.createdAt:nowIso(), updatedAt:nowIso(),
    };
    const next = view==='edit' ? proposals.map(p=>p.id===activeId?entry:p) : [entry,...proposals];
    setProposals(next);
    DB.saveProposal({ ...entry, inlineRefs:computeInlineRefs(entry,library) });
    setActiveId(entry.id); setView('edit');
  };

  const handleDelete = () => {
    setProposals(proposals.filter(p=>p.id!==activeId));
    DB.deleteProposal(activeId);
    goDash();
  };

  const handleDuplicate = () => {
    if (!activeProp) return;
    const newId = genId();
    const groupId = activeProp.groupId||genShortId();
    const newViewerId = slugify(activeProp.clientName.replace(/ — kopi.*$/,''))+'-'+newId.slice(-4).toLowerCase();
    const updOrig = activeProp.groupId ? activeProp : {...activeProp,groupId};
    const entry = {...activeProp,id:newId,viewerId:newViewerId,clientName:activeProp.clientName.replace(/ — kopi.*$/,'')+' — kopi',groupId,createdAt:nowIso(),updatedAt:nowIso()};
    const next = [entry,...proposals.map(p=>p.id===activeProp.id?updOrig:p)];
    setProposals(next);
    DB.saveProposal({...updOrig, inlineRefs:computeInlineRefs(updOrig,library)});
    DB.saveProposal({...entry,   inlineRefs:computeInlineRefs(entry,library)});
    setActiveId(entry.id); setView('edit');
  };

  const handleSaveTemplate   = (t)  => { setTemplates(n=>[t,...n]); DB.saveTemplate(t); };
  const handleDeleteTemplate = (id) => { setTemplates(n=>n.filter(t=>t.id!==id)); DB.deleteTemplate(id); };

  const saveLib = (next) => { setLibrary(next); DB.saveLibrary(next); };
  const handleAddToLibrary      = (cat,ref) => saveLib({...library,[cat]:[...(library[cat]||[]),ref]});
  const handleDeleteFromLibrary = (cat,id)  => saveLib({...library,[cat]:(library[cat]||[]).filter(r=>r.id!==id)});
  const handleAddService    = (svc) => saveLib({...library,services:[...(library.services||[]),svc]});
  const handleDeleteService = (id)  => saveLib({...library,services:(library.services||[]).filter(s=>s.id!==id)});
  const handleAddImage      = (img) => saveLib({...library,images:[...(library.images||[]),img]});
  const handleDeleteImage   = (id)  => saveLib({...library,images:(library.images||[]).filter(i=>i.id!==id)});

  const switchMainTab = (t) => { setMainTab(t); setView(t); setActiveId(null); };

  // ── Render states ──────────────────────────────────────────
  if (!authReady) return (
    <div style={{display:'grid',placeItems:'center',height:'100vh',background:'var(--ink-900)',color:'rgba(255,255,255,0.4)',fontSize:'var(--fs-caption)'}}>
      Indlæser...
    </div>
  );
  if (!user) return <LoginScreen onLogin={setUser} />;
  if (loading) return (
    <div style={{display:'grid',placeItems:'center',height:'100vh',color:'var(--ink-400)',fontSize:'var(--fs-body)',fontWeight:500}}>
      Henter data...
    </div>
  );

  const topbarTitle = view==='new'?'Nyt tilbud':view==='edit'&&activeProp?activeProp.clientName:view==='library'?'Bibliotek':'Dashboard';
  const formKey     = view==='edit' ? activeId : `new-${applyTpl?.id||'blank'}`;
  const formInitial = view==='edit' ? activeProp : blankForm(library, applyTpl);

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="sidebar-head">
          <div className="sidebar-brand"><KeyoWordmark/><span className="sidebar-brand-tag">Admin</span></div>
          <button className="new-btn" onClick={()=>goNew()}><PlusIcon /> Nyt tilbud</button>
        </div>
        <div className="sidebar-nav">
          <button className={`sidebar-nav__btn ${mainTab==='dashboard'&&view!=='new'&&view!=='edit'?'sidebar-nav__btn--active':''}`} onClick={()=>switchMainTab('dashboard')}>Dashboard</button>
          <button className={`sidebar-nav__btn ${view==='library'?'sidebar-nav__btn--active':''}`} onClick={()=>switchMainTab('library')}>Bibliotek</button>
        </div>
        <div className="proposals-list">
          {proposals.length===0
            ? <div className="proposals-empty">Ingen tilbud endnu.<br/>Opret dit første herover.</div>
            : proposals.map(p=><ProposalCard key={p.id} p={p} isActive={activeId===p.id} onClick={()=>goEdit(p.id)} views={views}/>)}
        </div>
      </aside>
      <div className="admin__main">
        <div className="admin-topbar">
          <span className="admin-topbar__title">{topbarTitle}</span>
          <div className="admin-topbar__actions">
            {(view==='new'||view==='edit')&&<button className="btn" onClick={goDash}>← Oversigt</button>}
            {view==='edit'&&activeProp&&<a href={proposalUrl(activeProp.viewerId)} target="_blank" rel="noopener" className="btn"><ExternalIcon /> Se tilbud</a>}
            <button className="btn" style={{marginLeft:8}} onClick={async()=>{await DB.signOut();setUser(null);setProposals([]);setTemplates([]);setLibrary({meta_ads:[],flyers:[],landing:[],services:[],images:[]});}}>Log ud</button>
          </div>
        </div>
        <div className="admin-content">
          {view==='dashboard'&&<Dashboard proposals={proposals} templates={templates} onNew={()=>goNew()} onApplyTemplate={t=>goNew(t)} onDeleteTemplate={handleDeleteTemplate}/>}
          {view==='library'&&<LibraryView library={library} onAddCustom={handleAddToLibrary} onDeleteCustom={handleDeleteFromLibrary} onAddService={handleAddService} onDeleteService={handleDeleteService} onAddImage={handleAddImage} onDeleteImage={handleDeleteImage}/>}
          {(view==='new'||view==='edit')&&formInitial&&(
            <ProposalForm key={formKey} initial={formInitial} isEdit={view==='edit'} library={library}
              onSave={handleSave} onDelete={handleDelete} onDuplicate={view==='edit'?handleDuplicate:null} onSaveTemplate={handleSaveTemplate}/>
          )}
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<AdminApp />);
