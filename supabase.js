// Supabase client + all data helpers for KEYO Proposal

const SUPABASE_URL = 'https://nijupjlrsxzerpcpvri.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5panVwamxyc3h6ZXJwY2NwdnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMTg0NTEsImV4cCI6MjA5NDc5NDQ1MX0.As3YA4V8cU28v7D885swXevQAaIyOVkNh3qAPB4eJF8';

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Track current user so DB functions can include user_id without extra round-trips
let _uid = null;
db.auth.getSession().then(({ data: { session } }) => { _uid = session?.user?.id ?? null; });
db.auth.onAuthStateChange((_evt, session) => { _uid = session?.user?.id ?? null; });
const uid = () => _uid;

const DEFAULT_LIBRARY = { meta_ads: [], flyers: [], landing: [], services: [], images: [] };

const DB = {

  // ── Auth ────────────────────────────────────────────────────

  async signIn(email, password) {
    const { data, error } = await db.auth.signInWithPassword({ email, password });
    return { user: data?.user, error };
  },

  async signUp(email, password) {
    const { data, error } = await db.auth.signUp({ email, password });
    return { user: data?.user, session: data?.session, error };
  },

  async signOut() {
    await db.auth.signOut();
  },

  async getSession() {
    const { data: { session } } = await db.auth.getSession();
    return session;
  },

  // ── Proposals (admin) ───────────────────────────────────────

  async loadProposals() {
    const { data, error } = await db
      .from('proposals')
      .select('id, viewer_id, client_name, group_id, data, created_at, updated_at')
      .order('created_at', { ascending: false });
    if (error) { console.error('loadProposals', error); return []; }
    return (data || []).map(row => ({
      ...row.data,
      id:         row.id,
      viewerId:   row.viewer_id,
      clientName: row.client_name,
      groupId:    row.group_id,
      createdAt:  row.created_at,
      updatedAt:  row.updated_at,
    }));
  },

  async saveProposal(p) {
    const { error } = await db.from('proposals').upsert({
      id:          p.id,
      user_id:     uid(),
      viewer_id:   p.viewerId,
      client_name: p.clientName,
      group_id:    p.groupId || null,
      data:        p,
      updated_at:  new Date().toISOString(),
    }, { onConflict: 'id' });
    if (error) console.error('saveProposal', error);
  },

  async deleteProposal(id) {
    const { error } = await db.from('proposals').delete().eq('id', id);
    if (error) console.error('deleteProposal', error);
  },

  // ── Library ────────────────────────────────────────────────

  async loadLibrary() {
    const { data, error } = await db.from('library').select('data').eq('user_id', uid()).maybeSingle();
    if (error) { console.error('loadLibrary', error); }
    return data?.data || { ...DEFAULT_LIBRARY };
  },

  async saveLibrary(lib) {
    const { error } = await db.from('library').upsert(
      { user_id: uid(), data: lib },
      { onConflict: 'user_id' }
    );
    if (error) console.error('saveLibrary', error);
  },

  // ── Templates ──────────────────────────────────────────────

  async loadTemplates() {
    const { data, error } = await db
      .from('templates')
      .select('id, name, data')
      .order('created_at', { ascending: false });
    if (error) { console.error('loadTemplates', error); return []; }
    return (data || []).map(row => ({ ...row.data, id: row.id, name: row.name }));
  },

  async saveTemplate(t) {
    const { error } = await db.from('templates').insert({
      id: t.id, user_id: uid(), name: t.name, data: t,
    });
    if (error) console.error('saveTemplate', error);
  },

  async deleteTemplate(id) {
    const { error } = await db.from('templates').delete().eq('id', id);
    if (error) console.error('deleteTemplate', error);
  },

  // ── Proposal views (open tracking) ─────────────────────────

  async loadAllViews() {
    const { data } = await db.from('proposal_views').select('viewer_id, last_opened, open_count');
    const map = {};
    (data || []).forEach(row => {
      map[row.viewer_id] = { lastOpened: row.last_opened, count: row.open_count };
    });
    return map;
  },

  async trackView(viewerId) {
    const { data: existing } = await db
      .from('proposal_views')
      .select('open_count')
      .eq('viewer_id', viewerId)
      .maybeSingle();
    await db.from('proposal_views').upsert({
      viewer_id:   viewerId,
      last_opened: new Date().toISOString(),
      open_count:  (existing?.open_count || 0) + 1,
    }, { onConflict: 'viewer_id' });
  },

  // ── Viewer (client, anon) ──────────────────────────────────

  async loadForViewer(viewerId) {
    const { data, error } = await db
      .from('proposals')
      .select('data')
      .eq('viewer_id', viewerId)
      .maybeSingle();
    if (error) { console.error('loadForViewer', error); return null; }
    return data?.data || null;
  },

  async loadGroupData(groupId) {
    if (!groupId) return [];
    const { data } = await db
      .from('proposals')
      .select('id, viewer_id, client_name, created_at')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });
    return (data || []).map((row, i) => ({
      viewerId:   row.viewer_id,
      proposalId: row.id,
      label:      `Tilbud ${String(i + 1).padStart(2, '0')}`,
      clientName: row.client_name,
    }));
  },
};

window.DB = DB;
window.db = db;
