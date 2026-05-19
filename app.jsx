// Main app shell — sidebar nav, sticky-glass topbar, mode + URL persistence.

const { useState, useEffect, useRef } = React;

const getViewerId = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || "estate-charlottenlund";
};

// ----- KEYO wordmark inline SVG -----
const KeyoWordmark = () => (
  <svg viewBox="0 0 986 293" fill="currentColor" aria-label="KEYO" style={{ height: 16 }}>
    <path d="M0 285.5c7-4.2 11.4-9.7 13.4-16.4 2-7 3-17.7 3-32.1V54.5c0-15-1-25.6-3-32.1C11.4 15.7 7 10.1 0 5.6V4.5h74.6v1.1c-7 4.5-11.4 10.1-13.4 16.8-2 6.5-3 17.2-3 32.1V143.3L157.5 39.6c9.2-10 18.5-21.7 28-35.1h47v3.4c-8.2 2.7-15.3 6-21.3 9.7-6 3.7-12 8.6-18 14.5L104.5 122 235.5 284.4v2.6h-46.7L80.6 146.7l-22.4 22.8v67.5c0 14.4 1 25.1 3 32.1 2 6.7 6.4 12.2 13.4 16.4v1.5H0v-1.5zM256.2 285.5c7-4.2 11.4-9.7 13.4-16.4 2-7 3-17.7 3-32.1V54.5c0-15-1-25.6-3-32.1-2-6.7-6.4-12.3-13.4-16.8V4.5h182.5v33.6c-21.6-5.5-39-9.3-52.2-11.6-13.2-2.5-25.1-3.7-35.8-3.7h-36.2v107.1h22.4c17.9 0 45.5-1.4 82.9-4.1v26.5c-25-2.7-52.5-4.1-82.9-4.1h-22.4v120.1H357c12.2 0 25.3-1.4 39.3-4.1 14.2-3 30.6-7.4 49.3-13.1V287H256.2v-1.5zM482.4 35.5c-4.7-8.2-9-14.4-12.7-18.7-3.7-4.2-8.6-7.9-14.6-11.2V4.5h77.3v1.1c-5.5 3.2-8.2 7.7-8.2 13.4 0 4 1.9 9.7 5.6 17.2l53.7 98.5 52.3-98.9c3.7-7.5 5.6-13.3 5.6-17.6 0-5.2-2.9-9.5-8.6-12.7V4.5H633v1.1c-5.7 3.2-10.6 7.2-14.6 12-4 4.4-8.1 10.7-12.3 18.6L594.7 159v78c0 14.4 1 25.1 3 32.1 2 6.7 6.5 12.2 13.4 16.4v1.5h-74.3v-1.5c7-4.2 11.4-9.7 13.4-16.4 2-7 3-17.7 3-32.1v-78L482.4 35.5zM833.3 0c39.4 0 71.8 13.8 97.4 41.4C956.3 69 969 104.6 969 147.8c0 41.4-12.4 75.6-37.2 102.7-25 27.1-57.7 40.6-98.2 40.6-39.5 0-72-13.5-97.4-40.6-25.4-27-38.1-61.4-38.1-103.1 0-43.2 12.8-78.9 38.5-107C762.2 13.5 794.4 0 833.3 0zm-2.2 21.3c-30.6 0-55.4 12.7-74.5 38-19.1 25.5-28.7 56.6-28.7 93.3 0 35.4 8.8 65.4 26.4 89.9 17.6 24.5 41.3 36.8 71 36.8 30.4 0 55-12.5 73.9-37.5 19-25 28.4-56.6 28.4-95 0-36.9-9.1-67-27.3-90.2C882.2 33 859.4 21.3 831.1 21.3z"/>
  </svg>
);

// ----- Sidebar — client view only, no admin controls -----
const Sidebar = ({ tab, setTab, state, groupData, activeViewerId, onSwitchProposal }) => {
  const allSvcs = [...KEYO_DATA.STANDARD_SERVICES, ...(state.customServices || [])];
  const activeServicesCount = allSvcs.filter(s =>
    s.custom ? state.selectedServices[s.id] !== false : !!state.selectedServices[s.id]
  ).length;
  const activeRefsCount = Object.values(state.selectedReferences).reduce((s, arr) => s + arr.length, 0);
  const hasMultiple = groupData && groupData.length > 1;

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <KeyoWordmark />
        <span className="sidebar__brand-tag">Proposal</span>
      </div>

      {hasMultiple && (
        <div className="sidebar__proposals">
          <div className="sidebar__section-label">Versioner</div>
          <div className="sidebar__proposal-tabs">
            {groupData.map(g => (
              <button
                key={g.viewerId}
                className={`sidebar__proposal-tab ${activeViewerId === g.viewerId ? 'sidebar__proposal-tab--active' : ''}`}
                onClick={() => onSwitchProposal(g.viewerId)}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="sidebar__section-label">Indhold</div>
        <div className="sidebar__tabs">
          <button
            className={`sidebar__tab ${tab === "offer" ? "sidebar__tab--active" : ""}`}
            onClick={() => setTab("offer")}
          >
            <span className="sidebar__tab-index">01</span>
            Tilbud
            <span className="sidebar__tab-count">{activeServicesCount}</span>
          </button>
          <button
            className={`sidebar__tab ${tab === "references" ? "sidebar__tab--active" : ""}`}
            onClick={() => setTab("references")}
          >
            <span className="sidebar__tab-index">02</span>
            Referencer
            <span className="sidebar__tab-count">{activeRefsCount}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

// ----- Top bar -----
// Becomes glass-solid when user has scrolled past hero (>200px), or always-paper on References tab.
const TopBar = ({ tab, mode, proposalId, state, scrollRef }) => {
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const url = `${window.location.origin}${window.location.pathname}?id=${proposalId}`;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 240);
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollRef, tab]);

  useEffect(() => { setScrolled(false); }, [tab]);

  const copyUrl = () => {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  const handlePrint = () => window.print();

  const tabLabel = tab === "offer" ? "Tilbud" : "Referencer";
  // References tab has no photo hero — topbar should be paper from the start.
  const onPaper = tab === "references";
  const cls = onPaper
    ? "topbar topbar--paper"
    : (scrolled ? "topbar topbar--solid" : "topbar");

  return (
    <div className={cls}>
      <div className="topbar__right">
        <button className="topbar__btn" onClick={handlePrint}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6z"/>
          </svg>
          Print / PDF
        </button>
      </div>
    </div>
  );
};

// ----- App root -----
const App = () => {
  const [activeViewerId, setActiveViewerId] = useState(getViewerId);
  const [state,     setStateRaw] = useState(null);
  const [groupData, setGroupData] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState("offer");
  const scrollRef = useRef(null);
  const isAdmin = false;

  const loadAndSet = async (viewerId) => {
    setLoading(true);
    const data = await DB.loadForViewer(viewerId);
    const base = { ...KEYO_DATA.DEFAULT_PROPOSAL };
    if (data) {
      const gd = data.groupId ? await DB.loadGroupData(data.groupId) : [];
      setStateRaw({ ...base, ...data });
      setGroupData(gd);
    } else {
      setStateRaw(base);
      setGroupData([]);
    }
    setLoading(false);
  };

  useEffect(() => { loadAndSet(activeViewerId); }, []);

  // Track opens so admin can see last-seen time
  useEffect(() => {
    if (activeViewerId) DB.trackView(activeViewerId).catch(() => {});
  }, [activeViewerId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [tab]);

  const setState = (patch) => setStateRaw(s => ({ ...s, ...patch }));

  const switchProposal = async (viewerId) => {
    setActiveViewerId(viewerId);
    setTab('offer');
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    await loadAndSet(viewerId);
  };

  if (loading || !state) return (
    <div style={{display:'grid',placeItems:'center',height:'100vh',background:'var(--ink-900)'}}>
      <div style={{textAlign:'center',color:'rgba(255,255,255,0.5)'}}>
        <KeyoWordmark/>
        <div style={{marginTop:14,fontSize:'var(--fs-caption)',fontWeight:500}}>Indlæser tilbud...</div>
      </div>
    </div>
  );

  return (
    <div className="app">
      <Sidebar tab={tab} setTab={setTab} state={state}
        groupData={groupData} activeViewerId={activeViewerId} onSwitchProposal={switchProposal} />
      <div className="app__main">
        <TopBar tab={tab} mode="client" proposalId={activeViewerId} state={state} scrollRef={scrollRef} />
        <div className="scroll" ref={scrollRef}>
          {tab === "offer"
            ? <TabOffer state={state} setState={setState} isAdmin={isAdmin} />
            : <TabReferences state={state} setState={setState} isAdmin={isAdmin} />
          }
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
