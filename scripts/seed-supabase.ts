/**
 * One-shot seeder. Imports the TS data files (single source of truth) and
 * upserts them into Supabase. Idempotent — safe to re-run.
 *
 * Run:  npx tsx --env-file=.env.local scripts/seed-supabase.ts
 *
 * Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in env. Reference
 * tables (places, friend_overlaps, trip_waypoints) became read-only to anon
 * after migration 0002 — re-seeding them now requires running this with the
 * service role key, OR via the Supabase dashboard / MCP execute_sql.
 *
 * Order matters — FK-dependent tables are upserted last. Within each group
 * (messages, replies, activity posts), we assign explicit created_at offsets
 * so the UI's `order by created_at` produces a stable, readable sequence.
 */

import { createClient } from '@supabase/supabase-js';
import { rioPlaces } from '../src/data/rioPlaces';
import { globalPlaces } from '../src/data/globalPlaces';
import { friendOverlaps, myTrip } from '../src/data/myTrip';
import { plannedStops } from '../src/data/plannedStops';
import { forums } from '../src/data/forums';
import { forumThreads } from '../src/data/forumThreads';
import { forumThreadReplies } from '../src/data/forumThreadReplies';
import { groupChats, groupChatMembers } from '../src/data/groupChats';
import { groupMessages } from '../src/data/groupMessages';
import { dms } from '../src/data/dms';
import { dmMessages } from '../src/data/dmMessages';
import { activityPosts } from '../src/data/activityPosts';
import { reactions } from '../src/data/reactions';

const url = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.');
  process.exit(1);
}

const supabase = createClient(url, anonKey);

const NOW = Date.now();

/** Assign per-row created_at in chronological order (earliest first). */
function chronological<T>(items: T[], spacingMs: number, baseOffsetMs = 0): (T & { created_at: string })[] {
  const n = items.length;
  return items.map((item, i) => ({
    ...item,
    created_at: new Date(NOW - baseOffsetMs - (n - 1 - i) * spacingMs).toISOString(),
  }));
}

async function main() {
  console.log('Seeding places...');
  const places = [...rioPlaces, ...globalPlaces].map((p) => ({
    id: p.id,
    destination_id: p.destinationId,
    hebrew_name: p.hebrewName,
    english_name: p.englishName,
    category: p.category,
    lat: p.lat,
    lng: p.lng,
    hebrew_description: p.hebrewDescription,
    english_description: p.englishDescription,
    rating: p.rating,
    friends_know: p.friendsKnow,
    tarmil_pick: p.tarmilPick ?? false,
    friend_visits: p.friendVisits ?? [],
  }));

  const { error: placesErr } = await supabase.from('places').upsert(places);
  if (placesErr) throw placesErr;
  console.log(`  ${places.length} places upserted`);

  console.log('Seeding friend_overlaps...');
  const friends = friendOverlaps.map((f) => ({
    id: f.id,
    friend_name: f.friendName,
    friend_initial: f.friendInitial,
    photo_url: f.photoUrl,
    lat: f.lat,
    lng: f.lng,
    zone_label: f.zoneLabel,
    status: f.status,
    detail: f.detail,
    destination_id: f.destinationId ?? null,
    overlap_start: f.overlapStart ?? null,
    overlap_end: f.overlapEnd ?? null,
  }));
  const { error: friendsErr } = await supabase
    .from('friend_overlaps')
    .upsert(friends);
  if (friendsErr) throw friendsErr;
  console.log(`  ${friends.length} friend overlaps upserted`);

  console.log('Seeding trip_waypoints...');
  const waypoints = [
    ...myTrip.past.map((coord, i) => ({
      id: `past-${i}`,
      lat: coord[0],
      lng: coord[1],
      kind: 'past',
      order_index: i,
    })),
    {
      id: 'present',
      lat: myTrip.present[0],
      lng: myTrip.present[1],
      kind: 'present',
      order_index: 0,
    },
  ];
  const { error: waypointsErr } = await supabase
    .from('trip_waypoints')
    .upsert(waypoints);
  if (waypointsErr) throw waypointsErr;
  console.log(`  ${waypoints.length} trip waypoints upserted`);

  console.log('Seeding planned_stops...');
  const stops = plannedStops.map((s) => ({
    id: s.id,
    name_he: s.nameHe,
    name_en: s.nameEn,
    type: s.type,
    lat: s.lat,
    lng: s.lng,
    arrival_date: s.arrivalDate,
    departure_date: s.departureDate,
    nights: s.nights,
    privacy: s.privacy,
    note: s.note ?? null,
    friend_overlap_ids: s.friendOverlapIds ?? [],
    saved_place_ids: s.savedPlaceIds ?? [],
  }));
  const { error: stopsErr } = await supabase
    .from('planned_stops')
    .upsert(stops);
  if (stopsErr) throw stopsErr;
  console.log(`  ${stops.length} planned stops upserted`);

  console.log('Seeding forums...');
  const forumRows = forums.map((f) => ({
    id: f.id,
    slug: f.slug,
    name_he: f.nameHe,
    name_en: f.nameEn,
    city_label: f.cityLabel ?? null,
    destination_id: f.destinationId ?? null,
    kind: f.kind,
    member_count: f.memberCount,
    hero_blurb_he: f.heroBlurbHe,
    is_recommended: f.isRecommended,
  }));
  const { error: forumsErr } = await supabase.from('forums').upsert(forumRows);
  if (forumsErr) throw forumsErr;
  console.log(`  ${forumRows.length} forums upserted`);

  console.log('Seeding forum_threads...');
  const threadRows = chronological(
    forumThreads.map((t) => ({
      id: t.id,
      forum_id: t.forumId,
      author_friend_id: t.authorFriendId,
      title: t.title,
      body: t.body,
      reply_count: t.replyCount,
      follow_count: t.followCount,
      pinned: t.pinned,
    })),
    /* spacingMs */ 6 * 60 * 60 * 1000, // 6 hours between threads
  );
  const { error: threadsErr } = await supabase
    .from('forum_threads')
    .upsert(threadRows);
  if (threadsErr) throw threadsErr;
  console.log(`  ${threadRows.length} forum threads upserted`);

  console.log('Seeding forum_thread_replies...');
  const replyRows = chronological(
    forumThreadReplies.map((r) => ({
      id: r.id,
      thread_id: r.threadId,
      author_friend_id: r.authorFriendId,
      body: r.body,
    })),
    /* spacingMs */ 15 * 60 * 1000, // 15 min between replies
  );
  const { error: repliesErr } = await supabase
    .from('forum_thread_replies')
    .upsert(replyRows);
  if (repliesErr) throw repliesErr;
  console.log(`  ${replyRows.length} forum thread replies upserted`);

  console.log('Seeding group_chats...');
  const chatRows = groupChats.map((c) => ({
    id: c.id,
    name_he: c.nameHe,
    city_label: c.cityLabel ?? null,
    destination_id: c.destinationId ?? null,
    last_message_at: new Date(NOW).toISOString(),
  }));
  const { error: chatsErr } = await supabase.from('group_chats').upsert(chatRows);
  if (chatsErr) throw chatsErr;
  console.log(`  ${chatRows.length} group chats upserted`);

  console.log('Seeding group_chat_members...');
  const memberRows = groupChatMembers.map((m) => ({
    chat_id: m.chatId,
    friend_id: m.friendId,
  }));
  const { error: membersErr } = await supabase
    .from('group_chat_members')
    .upsert(memberRows);
  if (membersErr) throw membersErr;
  console.log(`  ${memberRows.length} group chat members upserted`);

  console.log('Seeding group_messages...');
  const groupMessageRows = chronological(
    groupMessages.map((m) => ({
      id: m.id,
      chat_id: m.chatId,
      author_friend_id: m.authorFriendId,
      body: m.body,
    })),
    /* spacingMs */ 5 * 60 * 1000, // 5 min between messages
  );
  const { error: groupMsgErr } = await supabase
    .from('group_messages')
    .upsert(groupMessageRows);
  if (groupMsgErr) throw groupMsgErr;
  console.log(`  ${groupMessageRows.length} group messages upserted`);

  console.log('Seeding dm_threads...');
  const dmRows = dms.map((d) => ({
    id: d.id,
    friend_id: d.friendId,
    last_message_preview_he: d.lastMessagePreviewHe,
    last_message_at: new Date(NOW).toISOString(),
    unread_count: d.unreadCount,
  }));
  const { error: dmThreadsErr } = await supabase.from('dm_threads').upsert(dmRows);
  if (dmThreadsErr) throw dmThreadsErr;
  console.log(`  ${dmRows.length} DM threads upserted`);

  console.log('Seeding dm_messages...');
  const dmMessageRows = chronological(
    dmMessages.map((m) => ({
      id: m.id,
      dm_thread_id: m.dmThreadId,
      from_friend: m.fromFriend,
      body: m.body,
    })),
    /* spacingMs */ 10 * 60 * 1000, // 10 min between DMs
  );
  const { error: dmMsgErr } = await supabase
    .from('dm_messages')
    .upsert(dmMessageRows);
  if (dmMsgErr) throw dmMsgErr;
  console.log(`  ${dmMessageRows.length} DM messages upserted`);

  console.log('Seeding activity_posts...');
  const activityRows = chronological(
    activityPosts.map((p) => ({
      id: p.id,
      kind: p.kind,
      author_friend_id: p.authorFriendId,
      destination_id: p.destinationId ?? null,
      body_he: p.bodyHe,
      payload: p.payload,
      reply_count: p.replyCount,
    })),
    /* spacingMs */ 4 * 60 * 60 * 1000, // 4 hours between activity posts
  );
  const { error: activityErr } = await supabase
    .from('activity_posts')
    .upsert(activityRows);
  if (activityErr) throw activityErr;
  console.log(`  ${activityRows.length} activity posts upserted`);

  console.log('Seeding reactions...');
  const reactionRows = reactions.map((r) => ({
    id: r.id,
    target_type: r.targetType,
    target_id: r.targetId,
    emoji: r.emoji,
    actor_friend_id: r.actorFriendId,
  }));
  const { error: reactionsErr } = await supabase
    .from('reactions')
    .upsert(reactionRows);
  if (reactionsErr) throw reactionsErr;
  console.log(`  ${reactionRows.length} reactions upserted`);

  console.log('\nSeed complete.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
