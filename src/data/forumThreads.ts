/**
 * Forum threads — original posts inside each forum.
 *
 * SEED ONLY. Runtime data lives in `forum_threads`.
 *
 * Authors reference existing `friend_overlaps.id` values. Some threads are
 * authored by"self" (current user) via `authorFriendId: null` — the UI
 * renders these with the user's own avatar/name placeholder until auth lands.
 *
 * Replies are seeded in `forumThreadReplies.ts`; `replyCount` here is set to
 * match the row count there to avoid the UI showing a stale number.
 */

export type ForumSubject =
  | 'accommodation'
  | 'transits'
  | 'scams_danger'
  | 'food'
  | 'activities_treks'
  | 'nightlife_parties'
  | 'money_visas'
  | 'meetups';

export type ForumThread = {
  id: string;
  forumId: string;
  /** null = self (current user). FK to friend_overlaps when present. */
  authorFriendId: string | null;
  title: string;
  body: string;
  replyCount: number;
  followCount: number;
  pinned: boolean;
  subject: ForumSubject;
};

export const forumThreads: ForumThread[] = [
  // =====================================================================
  // RIO — forum-rio (10 threads, 2 per subject)
  // =====================================================================

  // -- nightlife_parties --
  {
    id: 'thread-rio-003',
    forumId: 'forum-rio-nightlife-parties',
    authorFriendId: 'yael-botafogo',
    title: 'Street bloco in Lapa this Friday',
    body: 'Heading out for a street bloco from Largo do Boticário at 22:00. Free entry, BYOB. Who is coming?',
    replyCount: 3,
    followCount: 16,
    pinned: false,
    subject: 'nightlife_parties',
  },
  {
    id: 'thread-rio-004',
    forumId: 'forum-rio-nightlife-parties',
    authorFriendId: 'maya-ipanema',
    title: 'Rio Scenarium — worth the R$ 60 cover?',
    body: 'Heard it has gone fully touristy. Anywhere more authentic for samba around Lapa? Probably Wednesday night.',
    replyCount: 2,
    followCount: 11,
    pinned: false,
    subject: 'nightlife_parties',
  },

  // -- activities_treks --
  {
    id: 'thread-rio-005',
    forumId: 'forum-rio-activities-treks',
    authorFriendId: null,
    title: 'Anyone climbing Pedra da Gávea this week?',
    body: 'Planning Monday morning, leaving at 5:00 from Barra. Need at least one more person, more is safer. Medium difficulty, there is a scramble at the top.',
    replyCount: 3,
    followCount: 13,
    pinned: false,
    subject: 'activities_treks',
  },
  {
    id: 'thread-rio-006',
    forumId: 'forum-rio-activities-treks',
    authorFriendId: 'maya-ipanema',
    title: 'Gracie Humaitá — drop-in training?',
    body: 'I train at Gracie Humaitá twice a week, can you come as a guest? What is the day rate?',
    replyCount: 2,
    followCount: 9,
    pinned: false,
    subject: 'activities_treks',
  },

  // -- food --
  {
    id: 'thread-rio-007',
    forumId: 'forum-rio-food',
    authorFriendId: 'yael-botafogo',
    title: 'Aconchego Carioca — worth the trip to Praça da Bandeira?',
    body: 'Heard their bolinhos are insane. Is it worth crossing half the city on a Friday night?',
    replyCount: 3,
    followCount: 12,
    pinned: false,
    subject: 'food',
  },
  {
    id: 'thread-rio-008',
    forumId: 'forum-rio-food',
    authorFriendId: null,
    title: 'Where do you get real açaí in Copa?',
    body: 'Not the frozen cups with granola — real açaí from the Amazon. Heard about a small place on Rua Constante Ramos. Right call?',
    replyCount: 2,
    followCount: 10,
    pinned: false,
    subject: 'food',
  },

  // -- meetups --
  {
    id: 'thread-rio-009',
    forumId: 'forum-rio-meetups',
    authorFriendId: 'yael-botafogo',
    title: 'Who is in Copacabana this week?',
    body: 'I am in Botafogo until Friday, then moving to Copa. Anyone want to meet at Posto 9 and do BJJ in the evening?',
    replyCount: 3,
    followCount: 15,
    pinned: false,
    subject: 'meetups',
  },
  {
    id: 'thread-rio-010',
    forumId: 'forum-rio-meetups',
    authorFriendId: null,
    title: 'Israeli meetup, Tuesday 7pm at Pavão Azul',
    body: 'Trying to set up a regular meetup every two weeks. Pavão Azul in Copa — simple, cheap beer. Who is in?',
    replyCount: 3,
    followCount: 17,
    pinned: true,
    subject: 'meetups',
  },

  // =====================================================================
  // BÚZIOS — forum-buzios (10 threads, 2 per subject)
  // =====================================================================

  // -- nightlife_parties --
  {
    id: 'thread-buzios-003',
    forumId: 'forum-buzios-nightlife-parties',
    authorFriendId: 'roi-buzios',
    title: 'Rua das Pedras — which bar do you start at?',
    body:"Hitting town the last weekend of October. Heard Pacha is dead now, is there one bar where everyone starts? Need some recs before I just wing it.",
    replyCount: 3,
    followCount: 13,
    pinned: false,
    subject: 'nightlife_parties',
  },
  {
    id: 'thread-buzios-004',
    forumId: 'forum-buzios-nightlife-parties',
    authorFriendId: null,
    title: 'Full moon party on Praia da Ferradura',
    body: 'Heard about an unofficial beach party on full-moon nights. Anyone know if this is still happening in 2026?',
    replyCount: 2,
    followCount: 9,
    pinned: false,
    subject: 'nightlife_parties',
  },

  // -- activities_treks --
  {
    id: 'thread-buzios-005',
    forumId: 'forum-buzios-activities-treks',
    authorFriendId: 'roi-buzios',
    title: 'Snorkeling at Praia Azeda — conditions this month',
    body: 'Was there last week — calm in the morning, choppy in the afternoon. Anyone arriving Oct 29–31, want to go together?',
    replyCount: 3,
    followCount: 14,
    pinned: true,
    subject: 'activities_treks',
  },
  {
    id: 'thread-buzios-006',
    forumId: 'forum-buzios-activities-treks',
    authorFriendId: null,
    title: 'Boat tour around the islands — which company?',
    body: 'There are at least 4 companies running the 12-beach tour. Price range R$ 80 to R$ 200. Is the difference real?',
    replyCount: 2,
    followCount: 8,
    pinned: false,
    subject: 'activities_treks',
  },

  // -- food --
  {
    id: 'thread-buzios-007',
    forumId: 'forum-buzios-food',
    authorFriendId: 'maya-ipanema',
    title: 'Chez Michou — legit crêpes or tourist trap?',
    body:"Every Búzios blog mentions Chez Michou. I went a while back and it was fine but not amazing. Recent takes?",
    replyCount: 3,
    followCount: 11,
    pinned: false,
    subject: 'food',
  },
  {
    id: 'thread-buzios-008',
    forumId: 'forum-buzios-food',
    authorFriendId: 'roi-buzios',
    title: 'Where do you find real seafood in Búzios?',
    body:"Looking for a fisherman's spot, not a place with paper placemats and an English menu. Simple chiringuito on the beach. Ideas?",
    replyCount: 2,
    followCount: 9,
    pinned: false,
    subject: 'food',
  },

  // -- meetups --
  {
    id: 'thread-buzios-009',
    forumId: 'forum-buzios-meetups',
    authorFriendId: null,
    title: 'Who is in Búzios end of October?',
    body:"I'm there 29–31, staying in Manguinhos. Roi is coming too. Anyone else? Let's do a group dinner.",
    replyCount: 3,
    followCount: 12,
    pinned: false,
    subject: 'meetups',
  },
  {
    id: 'thread-buzios-010',
    forumId: 'forum-buzios-meetups',
    authorFriendId: 'maya-ipanema',
    title: 'Day trip to Búzios from Rio — who is coming?',
    body:"Thinking of the 7:00 bus up, back in the evening. Want company for morning snorkeling and lunch at Praia João Fernandes.",
    replyCount: 2,
    followCount: 10,
    pinned: false,
    subject: 'meetups',
  },

  // =====================================================================
  // SÃO PAULO — forum-sao-paulo (10 threads, 2 per subject)
  // =====================================================================

  // -- nightlife_parties --
  {
    id: 'thread-sao-paulo-003',
    forumId: 'forum-sao-paulo-nightlife-parties',
    authorFriendId: 'moshe-buenosaires',
    title: 'Mellow first-night bar in Vila Madalena?',
    body:"Coming up from Buenos for the weekend, want something that doesn't need a reservation. Priority: good beer, not a DJ.",
    replyCount: 3,
    followCount: 10,
    pinned: false,
    subject: 'nightlife_parties',
  },
  {
    id: 'thread-sao-paulo-004',
    forumId: 'forum-sao-paulo-nightlife-parties',
    authorFriendId: 'shir-saopaulo',
    title: 'D-Edge on Friday night — price warning',
    body: 'Went last Thursday. R$ 120 cover, R$ 25 a beer, sea of people. Sound is unreal but the price is wild. Anyone going this week?',
    replyCount: 2,
    followCount: 13,
    pinned: false,
    subject: 'nightlife_parties',
  },

  // -- activities_treks --
  {
    id: 'thread-sao-paulo-005',
    forumId: 'forum-sao-paulo-activities-treks',
    authorFriendId: null,
    title: 'Ibirapuera park — morning run?',
    body:"Staying near the park for two weeks. Looking for run buddies at 6:30. 8–10 km, easy pace.",
    replyCount: 2,
    followCount: 8,
    pinned: false,
    subject: 'activities_treks',
  },
  {
    id: 'thread-sao-paulo-006',
    forumId: 'forum-sao-paulo-activities-treks',
    authorFriendId: 'shir-saopaulo',
    title: 'Day hike to Pedra Grande',
    body: 'Leaving Saturday at 6:30 from Vila Madalena, 2-hour drive. Closed shoes, water, a sandwich. 4 seats in the car.',
    replyCount: 3,
    followCount: 12,
    pinned: false,
    subject: 'activities_treks',
  },

  // -- food --
  {
    id: 'thread-sao-paulo-007',
    forumId: 'forum-sao-paulo-food',
    authorFriendId: 'shir-saopaulo',
    title: 'Asado at La Cabrera — worth the queue?',
    body:"Heard mixed takes. Is it worth waiting an hour+ with no reservation, or is there a spot at the same level without the line?",
    replyCount: 3,
    followCount: 14,
    pinned: false,
    subject: 'food',
  },
  {
    id: 'thread-sao-paulo-008',
    forumId: 'forum-sao-paulo-food',
    authorFriendId: null,
    title: 'Mercadão Municipal — what is the must-eat?',
    body: 'Going for the first time on Friday. Heard about the mortadella sandwich and the pastel de bacalhau. What else can I not skip?',
    replyCount: 2,
    followCount: 9,
    pinned: false,
    subject: 'food',
  },

  // -- meetups --
  {
    id: 'thread-sao-paulo-009',
    forumId: 'forum-sao-paulo-meetups',
    authorFriendId: 'shir-saopaulo',
    title: 'Who is in São Paulo Nov 3–8?',
    body:"Hosting an open evening at my place in Vila Madalena Friday the 7th. Who's around then? Max 8 people.",
    replyCount: 3,
    followCount: 13,
    pinned: false,
    subject: 'meetups',
  },
  {
    id: 'thread-sao-paulo-010',
    forumId: 'forum-sao-paulo-meetups',
    authorFriendId: null,
    title: 'Looking for trip buddies for Santos day trip',
    body: 'Planning a day in Santos, bus from Tietê at 8:00, back in the evening. Want company. Anyone free this Saturday?',
    replyCount: 2,
    followCount: 7,
    pinned: false,
    subject: 'meetups',
  },

  // =====================================================================
  // JERICOACOARA — forum-jericoacoara (10 threads, 2 per subject)
  // =====================================================================

  // -- nightlife_parties --
  {
    id: 'thread-jericoacoara-003',
    forumId: 'forum-jericoacoara-nightlife-parties',
    authorFriendId: 'yotam-jericoacoara',
    title: 'Forró on the beach — which night is best?',
    body: 'There is forró every night at Restaurante Tamandaré, but I heard Monday and Wednesday have the best local musicians. When is it actually worth it?',
    replyCount: 3,
    followCount: 11,
    pinned: false,
    subject: 'nightlife_parties',
  },
  {
    id: 'thread-jericoacoara-004',
    forumId: 'forum-jericoacoara-nightlife-parties',
    authorFriendId: null,
    title: 'After-sunset party on the dunes',
    body: 'Heard that after the dune sunset there is an unofficial after-party on the beach. Real or legend?',
    replyCount: 2,
    followCount: 8,
    pinned: false,
    subject: 'nightlife_parties',
  },

  // -- activities_treks --
  {
    id: 'thread-jericoacoara-005',
    forumId: 'forum-jericoacoara-activities-treks',
    authorFriendId: 'yotam-jericoacoara',
    title: 'Pure Kite — lessons, prices, days',
    body: 'Private lesson R$ 350 / hour, 3-day package R$ 1,800. Yaakov is the head instructor, Israeli, excellent with beginners. Book through WhatsApp.',
    replyCount: 3,
    followCount: 18,
    pinned: true,
    subject: 'activities_treks',
  },
  {
    id: 'thread-jericoacoara-006',
    forumId: 'forum-jericoacoara-activities-treks',
    authorFriendId: 'roi-buzios',
    title: 'Sunset on the dune — what is the classic move?',
    body: 'Was there last year. Pôr-do-Sol dune in the evening — get there early, it fills up.',
    replyCount: 2,
    followCount: 13,
    pinned: false,
    subject: 'activities_treks',
  },

  // -- food --
  {
    id: 'thread-jericoacoara-007',
    forumId: 'forum-jericoacoara-food',
    authorFriendId: null,
    title: 'Where do you get fresh fish?',
    body: 'Was at Tamandaré and Espaço Aberto. Both fine but not amazing. Is there a secret fishermen spot in Jeri?',
    replyCount: 2,
    followCount: 9,
    pinned: false,
    subject: 'food',
  },
  {
    id: 'thread-jericoacoara-008',
    forumId: 'forum-jericoacoara-food',
    authorFriendId: 'yotam-jericoacoara',
    title: 'Breakfast in Jeri — Cantinho do Jeri is gold',
    body: 'Tapioca with tropical fruit R$ 18, acerola juice R$ 12. Opens 7:00, nice wood-floor space. Best option before heading out for kite.',
    replyCount: 2,
    followCount: 10,
    pinned: false,
    subject: 'food',
  },

  // -- meetups --
  {
    id: 'thread-jericoacoara-009',
    forumId: 'forum-jericoacoara-meetups',
    authorFriendId: null,
    title: 'How do you get to Jeri without blowing the budget?',
    body: 'Flight to Fortaleza and then shared jeep? Or is there a cheaper way? Big backpack and under 200 reais.',
    replyCount: 3,
    followCount: 11,
    pinned: false,
    subject: 'meetups',
  },
  {
    id: 'thread-jericoacoara-010',
    forumId: 'forum-jericoacoara-meetups',
    authorFriendId: 'yotam-jericoacoara',
    title: 'Kite crew Nov 10–13 — who is in?',
    body: 'In for 3 days of lessons at Pure Kite. Roi is coming up after Búzios. Other beginners / intermediates joining? Group dinner the first night.',
    replyCount: 3,
    followCount: 14,
    pinned: false,
    subject: 'meetups',
  },

  // =====================================================================
  // BUENOS AIRES — forum-buenos-aires (10 threads, 2 per subject)
  // =====================================================================

  // -- nightlife_parties --
  {
    id: 'thread-buenos-aires-003',
    forumId: 'forum-buenos-aires-meetups',
    authorFriendId: 'moshe-buenosaires',
    title: 'Milonga at La Catedral this Friday',
    body: 'Class at 22:00, dancing till 4:00. Cover AR$ 12,000. Beginner-friendly vibe. I\'m there every Friday, who is coming?',
    replyCount: 3,
    followCount: 15,
    pinned: false,
    subject: 'nightlife_parties',
  },
  {
    id: 'thread-buenos-aires-004',
    forumId: 'forum-buenos-aires-meetups',
    authorFriendId: null,
    title: 'Niceto Club — Thursday Carnaval',
    body: 'First time going. Heard there is a Carnaval night on Thursdays with a live orchestra. Cover? Dress code?',
    replyCount: 2,
    followCount: 11,
    pinned: false,
    subject: 'nightlife_parties',
  },

  // -- activities_treks --
  {
    id: 'thread-buenos-aires-005',
    forumId: 'forum-buenos-aires-meetups',
    authorFriendId: null,
    title: 'Bikes in the ecological reserve — where do you rent?',
    body: 'Want a morning ride in the reserve. Saw EcoBici is free with registration, and Rent a Bike near the port. What is the difference?',
    replyCount: 2,
    followCount: 7,
    pinned: false,
    subject: 'activities_treks',
  },
  {
    id: 'thread-buenos-aires-006',
    forumId: 'forum-buenos-aires-meetups',
    authorFriendId: 'neta-mendoza',
    title: 'Day in Mendoza from Buenos — worth the 12-hour bus?',
    body:"Coming up from Buenos for 3 days, there are amazing wineries here. Once you arrive there are organized tours, but the trip is long.",
    replyCount: 3,
    followCount: 10,
    pinned: false,
    subject: 'activities_treks',
  },

  // -- food --
  {
    id: 'thread-buenos-aires-007',
    forumId: 'forum-buenos-aires-meetups',
    authorFriendId: 'moshe-buenosaires',
    title: 'Don Julio or La Cabrera — which asado?',
    body: 'Family coming for one meal, they keep asking me. Both spots are famous, both in Palermo. What is the real difference?',
    replyCount: 3,
    followCount: 16,
    pinned: false,
    subject: 'food',
  },
  {
    id: 'thread-buenos-aires-008',
    forumId: 'forum-buenos-aires-meetups',
    authorFriendId: null,
    title: 'Empanadas — where is best?',
    body: 'There are 800 places selling empanadas in Buenos. I want one great one, not 6 mediocre ones. Defensa? Palermo? San Telmo?',
    replyCount: 2,
    followCount: 12,
    pinned: false,
    subject: 'food',
  },

  // -- meetups --
  {
    id: 'thread-buenos-aires-009',
    forumId: 'forum-buenos-aires-meetups',
    authorFriendId: 'moshe-buenosaires',
    title: 'Living in Palermo for a month — come hang at my place',
    body: 'I have an apartment in Palermo Soho until December. Hosting people for coffee / rooftop asado. DM me.',
    replyCount: 3,
    followCount: 17,
    pinned: false,
    subject: 'meetups',
  },
  {
    id: 'thread-buenos-aires-010',
    forumId: 'forum-buenos-aires-meetups',
    authorFriendId: 'uri-bariloche',
    title: 'Anyone passing through Bariloche before Buenos?',
    body:"I'm in Bariloche until mid-November. Strong recommend: if you're hitting Argentina, stop 3 days down south before Buenos. Anyone passing through — the Seven Lakes route is also safe and beautiful.",
    replyCount: 2,
    followCount: 9,
    pinned: false,
    subject: 'meetups',
  },
];
