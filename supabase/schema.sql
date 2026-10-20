-- Shared "fastest doctors" leaderboard. Run once in the Supabase SQL editor.
-- Only the server route (service role / secret key) reads and writes this table.

create table if not exists public.leaderboard_entries (
  id uuid primary key default gen_random_uuid(),
  display_name text not null check (char_length(display_name) between 2 and 32),
  pathway text not null check (pathway in ('OPD', 'IPD')),
  completion_ms integer not null check (completion_ms between 2000 and 3600000),
  pieces_unlocked smallint not null check (pieces_unlocked between 0 and 4),
  wrong_attempts integer not null default 0 check (wrong_attempts >= 0),
  created_at timestamptz not null default now()
);

create index if not exists leaderboard_entries_rank_idx
  on public.leaderboard_entries (completion_ms, wrong_attempts, created_at);

-- RLS on with no policies: the public (anon / publishable) key cannot touch the table.
alter table public.leaderboard_entries enable row level security;
