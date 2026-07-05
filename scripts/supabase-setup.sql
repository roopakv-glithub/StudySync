-- StudySync landing page: Supabase setup
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard -> SQL Editor)

-- =========================================================
-- 1. FEEDBACK TABLE
-- =========================================================
-- Create the table if it doesn't exist yet.
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  name text,                       -- null / empty => anonymous
  message text not null,
  rating int,
  created_at timestamptz not null default now()
);

-- Upgrade an existing feedback table (from the original landing page) so it
-- has the columns this UI needs and no longer requires the removed fields.
alter table public.feedback add column if not exists rating int;
alter table public.feedback add column if not exists created_at timestamptz not null default now();
alter table public.feedback alter column message set not null;

-- Make the legacy `email` column optional if it exists (the new form omits it).
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'feedback' and column_name = 'email'
  ) then
    alter table public.feedback alter column email drop not null;
  end if;
end $$;

-- Constrain rating to 1..5 (drop first so re-running is safe).
alter table public.feedback drop constraint if exists feedback_rating_check;
alter table public.feedback add constraint feedback_rating_check
  check (rating is null or rating between 1 and 5);

alter table public.feedback enable row level security;

-- Anyone (anon) may read approved-style feedback
drop policy if exists "feedback_select_public" on public.feedback;
create policy "feedback_select_public"
  on public.feedback for select
  to anon, authenticated
  using (true);

-- Anyone (anon) may submit feedback
drop policy if exists "feedback_insert_public" on public.feedback;
create policy "feedback_insert_public"
  on public.feedback for insert
  to anon, authenticated
  with check (char_length(message) between 1 and 2000);

-- =========================================================
-- 2. APP STATS (downloads / active students counter)
-- =========================================================
create table if not exists public.app_stats (
  id int primary key default 1,
  downloads bigint not null default 0,
  constraint single_row check (id = 1)
);

insert into public.app_stats (id, downloads)
values (1, 0)
on conflict (id) do nothing;

alter table public.app_stats enable row level security;

-- Anyone may read the counter
drop policy if exists "app_stats_select_public" on public.app_stats;
create policy "app_stats_select_public"
  on public.app_stats for select
  to anon, authenticated
  using (true);

-- Atomic increment via RPC (security definer bypasses RLS safely)
create or replace function public.increment_downloads()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count bigint;
begin
  update public.app_stats
    set downloads = downloads + 1
    where id = 1
    returning downloads into new_count;
  return new_count;
end;
$$;

grant execute on function public.increment_downloads() to anon, authenticated;
