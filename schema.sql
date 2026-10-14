-- Run once in Supabase Dashboard > SQL Editor
create table if not exists public.profiles(
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (char_length(display_name) <= 40),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now());
create table if not exists public.game_saves(
  user_id uuid primary key references auth.users(id) on delete cascade,
  schema_version int not null default 1,
  coins int not null default 100 check (coins >= 0),
  cafe_level int not null default 1 check (cafe_level >= 1),
  save_data jsonb not null default '{}' check (pg_column_size(save_data) < 100000),
  updated_at timestamptz not null default now());
alter table public.profiles enable row level security;
alter table public.game_saves enable row level security;
do $$ declare t text; begin
 foreach t in array array['profiles','game_saves'] loop
  execute format('drop policy if exists "own select" on public.%I', t);
  execute format('drop policy if exists "own insert" on public.%I', t);
  execute format('drop policy if exists "own update" on public.%I', t);
  execute format('drop policy if exists "own delete" on public.%I', t);
  execute format('create policy "own select" on public.%I for select to authenticated using ((select auth.uid()) = user_id)', t);
  execute format('create policy "own insert" on public.%I for insert to authenticated with check ((select auth.uid()) = user_id)', t);
  execute format('create policy "own update" on public.%I for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)', t);
  execute format('create policy "own delete" on public.%I for delete to authenticated using ((select auth.uid()) = user_id)', t);
 end loop; end $$;
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(user_id, display_name) values (new.id, split_part(new.email,'@',1)) on conflict do nothing;
  return new;
end $$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
