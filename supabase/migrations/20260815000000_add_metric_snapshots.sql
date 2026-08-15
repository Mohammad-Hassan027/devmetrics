create table if not exists public.metric_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  github_username text,
  leetcode_username text,
  gfg_username text,
  github_score integer not null default 0,
  leetcode_score integer not null default 0,
  gfg_score integer not null default 0,
  total_score integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists metric_snapshots_total_score_idx
  on public.metric_snapshots (total_score desc, updated_at desc);

alter table public.metric_snapshots enable row level security;

drop policy if exists "Public leaderboard can read metric snapshots"
  on public.metric_snapshots;
create policy "Public leaderboard can read metric snapshots"
  on public.metric_snapshots
  for select
  using (true);

drop policy if exists "Users can insert their own metric snapshot"
  on public.metric_snapshots;
create policy "Users can insert their own metric snapshot"
  on public.metric_snapshots
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own metric snapshot"
  on public.metric_snapshots;
create policy "Users can update their own metric snapshot"
  on public.metric_snapshots
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own metric snapshot"
  on public.metric_snapshots;
create policy "Users can delete their own metric snapshot"
  on public.metric_snapshots
  for delete
  to authenticated
  using (auth.uid() = user_id);
