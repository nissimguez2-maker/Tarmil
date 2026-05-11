-- Messages, forums, DMs, activity feed, polymorphic reactions.
--
-- Adds the content surfaces the Figma structure needs: forum lists with
-- threaded discussions, group chats, 1:1 DMs, an activity feed with three
-- post kinds (trip_declaration / whos_down / overlap_notification), and a
-- polymorphic reactions table that covers every reaction surface.
--
-- DM and group_message "self" rows stay implicit: from_friend=false /
-- author_friend_id=NULL = the current user. There's no users table yet —
-- when real auth lands we'll migrate to one.
--
-- Idempotent. Pattern matches 0006: create if not exists, drop policy if
-- exists before recreate, do-block guards around publication add.

-- ============================================================================
-- FORUMS
-- ============================================================================

create table if not exists public.forums (
  id text primary key,
  slug text not null unique,
  name_he text not null,
  name_en text not null,
  city_label text,
  destination_id text,
  kind text not null check (kind in ('city', 'interest', 'region')),
  member_count int not null default 0,
  hero_blurb_he text not null,
  is_recommended boolean not null default false,
  last_activity_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists forums_destination_idx on public.forums (destination_id);
create index if not exists forums_recommended_idx on public.forums (is_recommended);

alter table public.forums enable row level security;
drop policy if exists "forums_read_all" on public.forums;
drop policy if exists "forums_insert_all" on public.forums;
drop policy if exists "forums_update_all" on public.forums;
drop policy if exists "forums_delete_all" on public.forums;
create policy "forums_read_all" on public.forums for select using (true);
create policy "forums_insert_all" on public.forums for insert with check (true);
create policy "forums_update_all" on public.forums for update using (true) with check (true);
create policy "forums_delete_all" on public.forums for delete using (true);

-- New forum content tables (parallel to legacy threads/thread_replies in 0006
-- which remain in place but UI-unused).
create table if not exists public.forum_threads (
  id text primary key,
  forum_id text not null references public.forums(id) on delete cascade,
  author_friend_id text references public.friend_overlaps(id) on delete set null,
  title text not null,
  body text not null,
  reply_count int not null default 0,
  follow_count int not null default 0,
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists forum_threads_forum_idx on public.forum_threads (forum_id, created_at desc);
create index if not exists forum_threads_author_idx on public.forum_threads (author_friend_id);

alter table public.forum_threads enable row level security;
drop policy if exists "forum_threads_read_all" on public.forum_threads;
drop policy if exists "forum_threads_insert_all" on public.forum_threads;
drop policy if exists "forum_threads_update_all" on public.forum_threads;
drop policy if exists "forum_threads_delete_all" on public.forum_threads;
create policy "forum_threads_read_all" on public.forum_threads for select using (true);
create policy "forum_threads_insert_all" on public.forum_threads for insert with check (true);
create policy "forum_threads_update_all" on public.forum_threads for update using (true) with check (true);
create policy "forum_threads_delete_all" on public.forum_threads for delete using (true);

create table if not exists public.forum_thread_replies (
  id text primary key default (gen_random_uuid())::text,
  thread_id text not null references public.forum_threads(id) on delete cascade,
  author_friend_id text references public.friend_overlaps(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists forum_thread_replies_thread_idx on public.forum_thread_replies (thread_id, created_at);
create index if not exists forum_thread_replies_author_idx on public.forum_thread_replies (author_friend_id);

alter table public.forum_thread_replies enable row level security;
drop policy if exists "forum_thread_replies_read_all" on public.forum_thread_replies;
drop policy if exists "forum_thread_replies_insert_all" on public.forum_thread_replies;
drop policy if exists "forum_thread_replies_update_all" on public.forum_thread_replies;
drop policy if exists "forum_thread_replies_delete_all" on public.forum_thread_replies;
create policy "forum_thread_replies_read_all" on public.forum_thread_replies for select using (true);
create policy "forum_thread_replies_insert_all" on public.forum_thread_replies for insert with check (true);
create policy "forum_thread_replies_update_all" on public.forum_thread_replies for update using (true) with check (true);
create policy "forum_thread_replies_delete_all" on public.forum_thread_replies for delete using (true);

-- ============================================================================
-- GROUP CHATS
-- ============================================================================

create table if not exists public.group_chats (
  id text primary key,
  name_he text not null,
  city_label text,
  destination_id text,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.group_chats enable row level security;
drop policy if exists "group_chats_read_all" on public.group_chats;
drop policy if exists "group_chats_insert_all" on public.group_chats;
drop policy if exists "group_chats_update_all" on public.group_chats;
drop policy if exists "group_chats_delete_all" on public.group_chats;
create policy "group_chats_read_all" on public.group_chats for select using (true);
create policy "group_chats_insert_all" on public.group_chats for insert with check (true);
create policy "group_chats_update_all" on public.group_chats for update using (true) with check (true);
create policy "group_chats_delete_all" on public.group_chats for delete using (true);

create table if not exists public.group_chat_members (
  chat_id text not null references public.group_chats(id) on delete cascade,
  friend_id text not null references public.friend_overlaps(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (chat_id, friend_id)
);

create index if not exists group_chat_members_friend_idx on public.group_chat_members (friend_id);

alter table public.group_chat_members enable row level security;
drop policy if exists "group_chat_members_read_all" on public.group_chat_members;
drop policy if exists "group_chat_members_insert_all" on public.group_chat_members;
drop policy if exists "group_chat_members_update_all" on public.group_chat_members;
drop policy if exists "group_chat_members_delete_all" on public.group_chat_members;
create policy "group_chat_members_read_all" on public.group_chat_members for select using (true);
create policy "group_chat_members_insert_all" on public.group_chat_members for insert with check (true);
create policy "group_chat_members_update_all" on public.group_chat_members for update using (true) with check (true);
create policy "group_chat_members_delete_all" on public.group_chat_members for delete using (true);

create table if not exists public.group_messages (
  id text primary key default (gen_random_uuid())::text,
  chat_id text not null references public.group_chats(id) on delete cascade,
  author_friend_id text references public.friend_overlaps(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists group_messages_chat_idx on public.group_messages (chat_id, created_at);
create index if not exists group_messages_author_idx on public.group_messages (author_friend_id);

alter table public.group_messages enable row level security;
drop policy if exists "group_messages_read_all" on public.group_messages;
drop policy if exists "group_messages_insert_all" on public.group_messages;
drop policy if exists "group_messages_update_all" on public.group_messages;
drop policy if exists "group_messages_delete_all" on public.group_messages;
create policy "group_messages_read_all" on public.group_messages for select using (true);
create policy "group_messages_insert_all" on public.group_messages for insert with check (true);
create policy "group_messages_update_all" on public.group_messages for update using (true) with check (true);
create policy "group_messages_delete_all" on public.group_messages for delete using (true);

-- ============================================================================
-- DIRECT MESSAGES
-- ============================================================================

create table if not exists public.dm_threads (
  id text primary key,
  friend_id text not null unique references public.friend_overlaps(id) on delete cascade,
  last_message_preview_he text not null default '',
  last_message_at timestamptz not null default now(),
  unread_count int not null default 0
);

alter table public.dm_threads enable row level security;
drop policy if exists "dm_threads_read_all" on public.dm_threads;
drop policy if exists "dm_threads_insert_all" on public.dm_threads;
drop policy if exists "dm_threads_update_all" on public.dm_threads;
drop policy if exists "dm_threads_delete_all" on public.dm_threads;
create policy "dm_threads_read_all" on public.dm_threads for select using (true);
create policy "dm_threads_insert_all" on public.dm_threads for insert with check (true);
create policy "dm_threads_update_all" on public.dm_threads for update using (true) with check (true);
create policy "dm_threads_delete_all" on public.dm_threads for delete using (true);

create table if not exists public.dm_messages (
  id text primary key default (gen_random_uuid())::text,
  dm_thread_id text not null references public.dm_threads(id) on delete cascade,
  from_friend boolean not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists dm_messages_thread_idx on public.dm_messages (dm_thread_id, created_at);

alter table public.dm_messages enable row level security;
drop policy if exists "dm_messages_read_all" on public.dm_messages;
drop policy if exists "dm_messages_insert_all" on public.dm_messages;
drop policy if exists "dm_messages_update_all" on public.dm_messages;
drop policy if exists "dm_messages_delete_all" on public.dm_messages;
create policy "dm_messages_read_all" on public.dm_messages for select using (true);
create policy "dm_messages_insert_all" on public.dm_messages for insert with check (true);
create policy "dm_messages_update_all" on public.dm_messages for update using (true) with check (true);
create policy "dm_messages_delete_all" on public.dm_messages for delete using (true);

-- ============================================================================
-- ACTIVITY FEED
-- ============================================================================

create table if not exists public.activity_posts (
  id text primary key,
  kind text not null check (kind in ('trip_declaration', 'whos_down', 'overlap_notification', 'place_review')),
  author_friend_id text references public.friend_overlaps(id) on delete set null,
  destination_id text,
  body_he text not null,
  payload jsonb not null default '{}'::jsonb,
  reply_count int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists activity_posts_created_idx on public.activity_posts (created_at desc);
create index if not exists activity_posts_kind_idx on public.activity_posts (kind);
create index if not exists activity_posts_author_idx on public.activity_posts (author_friend_id);

alter table public.activity_posts enable row level security;
drop policy if exists "activity_posts_read_all" on public.activity_posts;
drop policy if exists "activity_posts_insert_all" on public.activity_posts;
drop policy if exists "activity_posts_update_all" on public.activity_posts;
drop policy if exists "activity_posts_delete_all" on public.activity_posts;
create policy "activity_posts_read_all" on public.activity_posts for select using (true);
create policy "activity_posts_insert_all" on public.activity_posts for insert with check (true);
create policy "activity_posts_update_all" on public.activity_posts for update using (true) with check (true);
create policy "activity_posts_delete_all" on public.activity_posts for delete using (true);

-- ============================================================================
-- POLYMORPHIC REACTIONS
-- Covers forum_thread / forum_reply / group_message / dm_message / activity_post.
-- ============================================================================

create table if not exists public.reactions (
  id text primary key default (gen_random_uuid())::text,
  target_type text not null check (target_type in ('forum_thread', 'forum_reply', 'group_message', 'dm_message', 'activity_post')),
  target_id text not null,
  emoji text not null,
  actor_friend_id text references public.friend_overlaps(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (target_type, target_id, emoji, actor_friend_id)
);

create index if not exists reactions_target_idx on public.reactions (target_type, target_id);
create index if not exists reactions_actor_idx on public.reactions (actor_friend_id);

alter table public.reactions enable row level security;
drop policy if exists "reactions_read_all" on public.reactions;
drop policy if exists "reactions_insert_all" on public.reactions;
drop policy if exists "reactions_update_all" on public.reactions;
drop policy if exists "reactions_delete_all" on public.reactions;
create policy "reactions_read_all" on public.reactions for select using (true);
create policy "reactions_insert_all" on public.reactions for insert with check (true);
create policy "reactions_update_all" on public.reactions for update using (true) with check (true);
create policy "reactions_delete_all" on public.reactions for delete using (true);

-- ============================================================================
-- REALTIME PUBLICATION
-- alter publication add table errors if the table is already a member, so
-- guard each add with a pg_publication_tables lookup.
-- ============================================================================

do $$
declare
  t text;
begin
  foreach t in array array[
    'group_messages',
    'dm_messages',
    'forum_thread_replies',
    'activity_posts',
    'reactions'
  ] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end$$;
