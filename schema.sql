-- KEYO Proposal — Supabase schema (multi-user)
-- Run once in: supabase.com → your project → SQL Editor → New query

-- ── Tables ────────────────────────────────────────────────────

create table if not exists proposals (
  id          text primary key,
  user_id     uuid not null references auth.users on delete cascade,
  viewer_id   text unique not null,
  client_name text,
  group_id    text,
  data        jsonb not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- One library row per user (keyed by user_id)
create table if not exists library (
  user_id uuid primary key references auth.users on delete cascade,
  data    jsonb not null default '{}'
);

create table if not exists templates (
  id         text primary key,
  user_id    uuid not null references auth.users on delete cascade,
  name       text,
  data       jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- Tracks when clients open proposals (no auth needed from viewer side)
create table if not exists proposal_views (
  viewer_id   text primary key,
  last_opened timestamptz,
  open_count  int not null default 0
);

-- ── Row Level Security ────────────────────────────────────────

alter table proposals      enable row level security;
alter table library        enable row level security;
alter table templates      enable row level security;
alter table proposal_views enable row level security;

-- Proposals: each user sees/edits only their own
create policy "owner_all" on proposals
  for all to authenticated
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Proposals: clients can read any proposal via its viewer_id (no login)
create policy "public_read" on proposals
  for select to anon
  using (true);

-- Library: each user owns their own library row
create policy "owner_all" on library
  for all to authenticated
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Templates: each user owns their own templates
create policy "owner_all" on templates
  for all to authenticated
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Proposal views: client can record opens (anon), admin can read all
create policy "anon_track" on proposal_views
  for all to anon
  using (true) with check (true);

create policy "auth_read" on proposal_views
  for select to authenticated
  using (true);
