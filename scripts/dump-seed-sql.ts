/**
 * Reads the TS seed files for forums + threads + messages, prints a SQL block
 * that replaces those tables wholesale. Pipe the output into Supabase MCP
 * `execute_sql` (or paste into the SQL editor) when re-running this seed in
 * an env that doesn't have .env.local credentials handy.
 *
 * Run:  npx tsx scripts/dump-seed-sql.ts > /tmp/seed.sql
 */

import { forums } from '../src/data/forums';
import { forumThreads } from '../src/data/forumThreads';
import { forumThreadReplies } from '../src/data/forumThreadReplies';
import { dms } from '../src/data/dms';
import { dmMessages } from '../src/data/dmMessages';
import { groupMessages } from '../src/data/groupMessages';
import { groupChats } from '../src/data/groupChats';
import { friendOverlaps } from '../src/data/myTrip';
import { plannedStops } from '../src/data/plannedStops';
import { activityPosts } from '../src/data/activityPosts';
import { rioPlaces } from '../src/data/rioPlaces';
import { globalPlaces } from '../src/data/globalPlaces';

const NOW = Date.now();

function ts(offsetMinutes: number): string {
  return new Date(NOW - offsetMinutes * 60_000).toISOString();
}

function esc(s: string): string {
  return s.replace(/'/g, "''");
}

function nullable<T>(v: T | null | undefined): string {
  if (v === null || v === undefined) return 'null';
  return `'${esc(String(v))}'`;
}

const lines: string[] = [];

lines.push('BEGIN;');
lines.push('');

// --- Places (UPDATE only — schema is read-only for anon, but execute_sql
// runs as service role, so direct UPDATEs by id are fine) ---
lines.push(`-- places: update Hebrew/English text columns on ${rioPlaces.length + globalPlaces.length} rows`);
for (const p of [...rioPlaces, ...globalPlaces]) {
  lines.push(
    `UPDATE places SET ` +
      `hebrew_name = '${esc(p.hebrewName)}', ` +
      `english_name = '${esc(p.englishName)}', ` +
      `hebrew_description = '${esc(p.hebrewDescription)}', ` +
      `english_description = '${esc(p.englishDescription)}', ` +
      `friend_visits = '${esc(JSON.stringify(p.friendVisits ?? []))}'::jsonb ` +
      `WHERE id = '${esc(p.id)}';`,
  );
}
lines.push('');

// --- Friend overlaps (UPDATE text columns) ---
lines.push(`-- friend_overlaps: update text columns on ${friendOverlaps.length} rows`);
for (const f of friendOverlaps) {
  lines.push(
    `UPDATE friend_overlaps SET ` +
      `friend_name = '${esc(f.friendName)}', ` +
      `friend_initial = '${esc(f.friendInitial)}', ` +
      `zone_label = '${esc(f.zoneLabel)}', ` +
      `detail = '${esc(f.detail)}' ` +
      `WHERE id = '${esc(f.id)}';`,
  );
}
lines.push('');

// --- Planned stops (UPDATE text columns; rows seeded by reset_demo_state RPC) ---
lines.push(`-- planned_stops: update text columns on ${plannedStops.length} rows`);
for (const s of plannedStops) {
  lines.push(
    `UPDATE planned_stops SET ` +
      `name_he = '${esc(s.nameHe)}', ` +
      `name_en = '${esc(s.nameEn)}', ` +
      `note = ${nullable(s.note)} ` +
      `WHERE id = '${esc(s.id)}';`,
  );
}
lines.push('');

// --- Group chats (UPDATE name_he + city_label) ---
lines.push(`-- group_chats: update text columns on ${groupChats.length} rows`);
for (const c of groupChats) {
  lines.push(
    `UPDATE group_chats SET ` +
      `name_he = '${esc(c.nameHe)}', ` +
      `city_label = ${nullable(c.cityLabel)} ` +
      `WHERE id = '${esc(c.id)}';`,
  );
}
lines.push('');

// --- Activity posts (UPDATE body_he + payload) ---
lines.push(`-- activity_posts: replace ${activityPosts.length} rows wholesale`);
lines.push('DELETE FROM activity_posts;');
activityPosts.forEach((p, i) => {
  const offset = (activityPosts.length - i) * 60 * 4; // 4-hour spacing
  lines.push(
    `INSERT INTO activity_posts (id, kind, author_friend_id, destination_id, body_he, payload, reply_count, created_at) VALUES (` +
      `'${esc(p.id)}', '${esc(p.kind)}', ${nullable(p.authorFriendId)}, ${nullable(p.destinationId)}, ` +
      `'${esc(p.bodyHe)}', '${esc(JSON.stringify(p.payload))}'::jsonb, ${p.replyCount}, '${ts(offset)}');`,
  );
});
lines.push('');

// --- Forums ---
lines.push('-- forums: replace wholesale (drops the latam-israelis interest forum)');
lines.push('DELETE FROM forum_thread_replies;');
lines.push('DELETE FROM forum_threads;');
lines.push('DELETE FROM forums;');
lines.push('');
for (const f of forums) {
  lines.push(
    `INSERT INTO forums (id, slug, name_he, name_en, city_label, destination_id, kind, member_count, hero_blurb_he, is_recommended) VALUES (` +
      `'${esc(f.id)}', '${esc(f.slug)}', '${esc(f.nameHe)}', '${esc(f.nameEn)}', ` +
      `${nullable(f.cityLabel)}, ${nullable(f.destinationId)}, '${esc(f.kind)}', ${f.memberCount}, '${esc(f.heroBlurbHe)}', ${f.isRecommended});`,
  );
}
lines.push('');

// --- Forum threads ---
lines.push(`-- forum_threads: ${forumThreads.length} rows`);
forumThreads.forEach((t, i) => {
  const offset = (forumThreads.length - i) * 17; // pseudo-chronology
  lines.push(
    `INSERT INTO forum_threads (id, forum_id, author_friend_id, title, body, reply_count, follow_count, pinned, subject, created_at) VALUES (` +
      `'${esc(t.id)}', '${esc(t.forumId)}', ${nullable(t.authorFriendId)}, '${esc(t.title)}', '${esc(t.body)}', ` +
      `${t.replyCount}, ${t.followCount}, ${t.pinned}, '${esc(t.subject)}', '${ts(offset)}');`,
  );
});
lines.push('');

// --- Forum thread replies ---
lines.push(`-- forum_thread_replies: ${forumThreadReplies.length} rows`);
forumThreadReplies.forEach((r, i) => {
  const offset = (forumThreadReplies.length - i) * 3;
  lines.push(
    `INSERT INTO forum_thread_replies (id, thread_id, author_friend_id, body, created_at) VALUES (` +
      `'${esc(r.id)}', '${esc(r.threadId)}', ${nullable(r.authorFriendId)}, '${esc(r.body)}', '${ts(offset)}');`,
  );
});
lines.push('');

// --- DM threads + messages ---
lines.push('-- dm_threads + dm_messages: replace wholesale');
lines.push('DELETE FROM dm_messages;');
lines.push('DELETE FROM dm_threads;');
lines.push('');
for (const d of dms) {
  lines.push(
    `INSERT INTO dm_threads (id, friend_id, last_message_preview_he, unread_count) VALUES (` +
      `'${esc(d.id)}', '${esc(d.friendId)}', '${esc(d.lastMessagePreviewHe)}', ${d.unreadCount});`,
  );
}
lines.push('');
dmMessages.forEach((m, i) => {
  const offset = (dmMessages.length - i) * 2;
  lines.push(
    `INSERT INTO dm_messages (id, dm_thread_id, from_friend, body, created_at) VALUES (` +
      `'${esc(m.id)}', '${esc(m.dmThreadId)}', ${m.fromFriend}, '${esc(m.body)}', '${ts(offset)}');`,
  );
});
lines.push('');

// --- Group messages ---
lines.push('-- group_messages: replace wholesale (keep group_chats intact)');
lines.push('DELETE FROM group_messages;');
lines.push('');
groupMessages.forEach((m, i) => {
  const offset = (groupMessages.length - i) * 2;
  lines.push(
    `INSERT INTO group_messages (id, chat_id, author_friend_id, body, created_at) VALUES (` +
      `'${esc(m.id)}', '${esc(m.chatId)}', ${nullable(m.authorFriendId)}, '${esc(m.body)}', '${ts(offset)}');`,
  );
});
lines.push('');

lines.push('COMMIT;');

console.log(lines.join('\n'));
