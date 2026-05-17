/**
 * Pings — one-shot signal between two friends in the same city.
 *
 * Brief §04 Ping rules: "one ping per direction per co-presence event."
 * Unique (friend_id, direction) on the table enforces the rule cheaply.
 *
 * SEED ONLY. Runtime data lives in the `pings` table.
 *
 * No message body, no thread, no reply — the receiver opens whichever
 * channel they already use with the friend (WhatsApp, Instagram, phone).
 * Tarmil is the discovery, not the conversation.
 */

export type Ping = {
  id: string;
  friendId: string;
  direction: 'sent' | 'received';
  zoneLabel: string;
  createdAt: string;
};

/**
 * Three seed pings so the Ping panel isn't empty on a fresh demo —
 * one outbound (already pinged Roi in Búzios), two inbound (Shir from
 * São Paulo, Yotam from Jericoacoara). Mirrors the canonical overlap
 * windows in `reset_demo_state()`.
 */
export const pings: Ping[] = [
  {
    id: 'ping-self-roi-buzios',
    friendId: 'roi-buzios',
    direction: 'sent',
    zoneLabel: 'Búzios',
    createdAt: '2026-10-29T09:14:00.000Z',
  },
  {
    id: 'ping-shir-saopaulo-in',
    friendId: 'shir-saopaulo',
    direction: 'received',
    zoneLabel: 'São Paulo',
    createdAt: '2026-11-03T18:42:00.000Z',
  },
  {
    id: 'ping-yotam-jeri-in',
    friendId: 'yotam-jericoacoara',
    direction: 'received',
    zoneLabel: 'Jericoacoara',
    createdAt: '2026-11-09T11:02:00.000Z',
  },
];
