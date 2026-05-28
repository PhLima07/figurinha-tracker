-- FigurinhaTracker · Schema Supabase
-- Execute no SQL Editor do Supabase

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null default '',
  is_premium  boolean not null default false,
  scan_count  integer not null default 0,
  scan_limit  integer not null default 50,
  joined_at   timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.user_stickers (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  sticker_id  text not null,
  quantity    integer not null default 1,
  pasted      boolean not null default false,
  added_at    timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique(user_id, sticker_id)
);

-- RLS (DevMax - obrigatorio)
alter table public.profiles      enable row level security;
alter table public.user_stickers enable row level security;

create policy "profiles_own"      on public.profiles      for all using (auth.uid() = id);
create policy "stickers_own"      on public.user_stickers for all using (auth.uid() = user_id);

-- Auto-cria perfil no cadastro
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles(id, name)
  values(new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-atualiza updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger set_profiles_updated_at      before update on public.profiles      for each row execute procedure public.set_updated_at();
create trigger set_user_stickers_updated_at before update on public.user_stickers for each row execute procedure public.set_updated_at();

-- Incrementa scan_count com segurança
create or replace function public.increment_scan_count(uid uuid)
returns void language sql security definer as $$
  update public.profiles set scan_count = scan_count + 1 where id = uid;
$$;
