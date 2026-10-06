-- OCEY P. X — Supabase setup
-- Run this in Supabase SQL Editor.
-- Then create a Storage bucket named: ocey-media
-- Make the bucket PUBLIC for the simplest shared gallery viewing experience.
-- Use Supabase Auth (email/password) for uploads/edits/deletes.

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  file_name text not null,
  media_type text not null check (media_type in ('image','video')),
  mime_type text,
  size_bytes bigint default 0,
  title text default '',
  description text default '',
  tags text[] default '{}',
  favorite boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  uploaded_by uuid references auth.users(id) on delete set null
);

alter table public.media enable row level security;

drop policy if exists "public can view media rows" on public.media;
create policy "public can view media rows"
on public.media for select
to anon, authenticated
using (true);

drop policy if exists "signed users can insert media rows" on public.media;
create policy "signed users can insert media rows"
on public.media for insert
to authenticated
with check (auth.uid() = uploaded_by);

drop policy if exists "signed users can update media rows" on public.media;
create policy "signed users can update media rows"
on public.media for update
to authenticated
using (true)
with check (true);

drop policy if exists "signed users can delete media rows" on public.media;
create policy "signed users can delete media rows"
on public.media for delete
to authenticated
using (true);

-- Storage policies.
-- These allow everyone to read public gallery files, while only authenticated
-- users can upload/delete.
drop policy if exists "public can view ocey media" on storage.objects;
create policy "public can view ocey media"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'ocey-media');

drop policy if exists "signed users can upload ocey media" on storage.objects;
create policy "signed users can upload ocey media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'ocey-media');

drop policy if exists "signed users can delete ocey media" on storage.objects;
create policy "signed users can delete ocey media"
on storage.objects for delete
to authenticated
using (bucket_id = 'ocey-media');

-- Helpful index
create index if not exists media_created_at_idx on public.media(created_at desc);
create index if not exists media_type_idx on public.media(media_type);
