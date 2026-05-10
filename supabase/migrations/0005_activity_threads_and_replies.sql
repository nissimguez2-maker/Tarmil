-- PR4 — Activity tab feed.
-- threads: friends' new declared trips, city discussions, popular destination chats.
-- thread_replies: comments on a thread; anon CRUD enabled for live demo posting.
-- Reply count is maintained by a trigger on thread_replies.
-- Realtime is enabled on thread_replies so demos see new replies appear live.

create table if not exists public.threads (
  id text primary key,
  kind text not null check (kind in ('friend_trip', 'city', 'destination')),
  title text not null,
  body text not null,
  author_initial text not null,
  author_name text not null,
  destination_id text,
  city_label text,
  friend_id text,
  trip_season text check (trip_season in ('spring','summer','autumn','winter')),
  trip_year int,
  reply_count int not null default 0,
  follow_count int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists threads_kind_idx on public.threads (kind);
create index if not exists threads_destination_idx on public.threads (destination_id);
create index if not exists threads_created_idx on public.threads (created_at desc);

create table if not exists public.thread_replies (
  id text primary key default gen_random_uuid()::text,
  thread_id text not null references public.threads(id) on delete cascade,
  author_initial text not null,
  author_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists thread_replies_thread_idx
  on public.thread_replies (thread_id, created_at);

alter table public.threads enable row level security;
alter table public.thread_replies enable row level security;

create policy "threads_read_all" on public.threads for select using (true);
create policy "thread_replies_read_all" on public.thread_replies for select using (true);
create policy "thread_replies_insert_all" on public.thread_replies for insert with check (true);
create policy "thread_replies_delete_all" on public.thread_replies for delete using (true);

create or replace function public.increment_thread_reply_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.threads
     set reply_count = reply_count + 1
   where id = new.thread_id;
  return new;
end;
$$;

drop trigger if exists thread_replies_count_trigger on public.thread_replies;
create trigger thread_replies_count_trigger
  after insert on public.thread_replies
  for each row execute function public.increment_thread_reply_count();

alter publication supabase_realtime add table public.thread_replies;
