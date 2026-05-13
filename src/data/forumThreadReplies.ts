/**
 * Forum thread replies — seeded responses on the threads in `forumThreads.ts`.
 *
 * SEED ONLY. Runtime data lives in `forum_thread_replies`.
 *
 * Distribution is uneven — busy threads get 3 replies, sleeper threads get
 * 1–2. Authors mix friend personas and self (`authorFriendId: null`). Copy is
 * idiomatic backpacker English.
 *
 * Reply IDs use the parent thread id + `-r{N}` so they're stable across reseeds.
 */

export type ForumThreadReply = {
  id: string;
  threadId: string;
  /** null = self. FK to friend_overlaps when present. */
  authorFriendId: string | null;
  body: string;
};

export const forumThreadReplies: ForumThreadReply[] = [
  // =====================================================================
  // RIO
  // =====================================================================

  // thread-rio-001 — Chabad Copa Shabbat (3 replies)
  {
    id: 'thread-rio-001-r1',
    threadId: 'thread-rio-001',
    authorFriendId: null,
    body: 'Thanks Maya. Registered through the link. You staying for dinner?',
  },
  {
    id: 'thread-rio-001-r2',
    threadId: 'thread-rio-001',
    authorFriendId: 'yael-botafogo',
    body:"I'm coming. Cool to pick you up from Posto 6 at 18:30?",
  },
  {
    id: 'thread-rio-001-r3',
    threadId: 'thread-rio-001',
    authorFriendId: 'maya-ipanema',
    body:"Yael, perfect  see you there. Nissim, you should come too if you're still in town.",
  },

  // thread-rio-002 — kosher meat in Rio (2 replies)
  {
    id: 'thread-rio-002-r1',
    threadId: 'thread-rio-002',
    authorFriendId: 'maya-ipanema',
    body:"Kosher Rio is open 9:00–18:00 except Shabbat. Rua Anita Garibaldi 49. They also have frozen burgers, don't sleep on those.",
  },
  {
    id: 'thread-rio-002-r2',
    threadId: 'thread-rio-002',
    authorFriendId: 'yael-botafogo',
    body: 'Talmud Torah is farther but prices are reasonable. If you call ahead they organize delivery to Copa.',
  },

  // thread-rio-003 — street bloco (3 replies)
  {
    id: 'thread-rio-003-r1',
    threadId: 'thread-rio-003',
    authorFriendId: 'maya-ipanema',
    body:"I'm coming! But not till 23:00, got something earlier. Wait for me?",
  },
  {
    id: 'thread-rio-003-r2',
    threadId: 'thread-rio-003',
    authorFriendId: null,
    body:"Damn, down. Bring anything specific or just beer?",
  },
  {
    id: 'thread-rio-003-r3',
    threadId: 'thread-rio-003',
    authorFriendId: 'yael-botafogo',
    body:"Maya, I'm there till 1:00 max, training in the morning. Nissim, beer and a lighter, water if you remember",
  },

  // thread-rio-004 — Rio Scenarium (2 replies)
  {
    id: 'thread-rio-004-r1',
    threadId: 'thread-rio-004',
    authorFriendId: 'roi-buzios',
    body: 'Try Pedra do Sal on Monday night, real samba, free, locals only. Rio Scenarium is not what it was.',
  },
  {
    id: 'thread-rio-004-r2',
    threadId: 'thread-rio-004',
    authorFriendId: 'yael-botafogo',
    body:"Also Carioca da Gema on Rua Mem de Sá. R$ 30 cover, samba all night, most Lapa vibe you'll find.",
  },

  // thread-rio-005 — Pedra da Gávea (3 replies)
  {
    id: 'thread-rio-005-r1',
    threadId: 'thread-rio-005',
    authorFriendId: 'maya-ipanema',
    body:"I'm in. Aggressive hour but worth it. Do we need a guide for the scramble at the end?",
  },
  {
    id: 'thread-rio-005-r2',
    threadId: 'thread-rio-005',
    authorFriendId: null,
    body:"Maya, last time I went up without a guide, there are fixed ropes. But if you're not sure, I have a local guide's number — R$ 80.",
  },
  {
    id: 'thread-rio-005-r3',
    threadId: 'thread-rio-005',
    authorFriendId: 'roi-buzios',
    body: 'Bro, wear real hiking shoes, not running shoes. The rocks are slippery in the morning.',
  },

  // thread-rio-006 — Gracie Humaitá (2 replies)
  {
    id: 'thread-rio-006-r1',
    threadId: 'thread-rio-006',
    authorFriendId: null,
    body: 'Been there twice. R$ 90 a day, white gi required and a waiver. Better to call a day ahead.',
  },
  {
    id: 'thread-rio-006-r2',
    threadId: 'thread-rio-006',
    authorFriendId: 'roi-buzios',
    body: 'If you want something less formal try Checkmat in Ipanema. Israeli vibe, instructors speak Hebrew, less judgement.',
  },

  // thread-rio-007 — Aconchego Carioca (3 replies)
  {
    id: 'thread-rio-007-r1',
    threadId: 'thread-rio-007',
    authorFriendId: 'maya-ipanema',
    body: 'Worth every minute of the trip  the half-portion bolinhos at R$ 35 are huge. Reserve ahead for Friday.',
  },
  {
    id: 'thread-rio-007-r2',
    threadId: 'thread-rio-007',
    authorFriendId: null,
    body:"I'm in! When are you thinking?",
  },
  {
    id: 'thread-rio-007-r3',
    threadId: 'thread-rio-007',
    authorFriendId: 'yael-botafogo',
    body: 'Book through OpenTable, they don\'t answer WhatsApp. Friday 20:00 is the best slot.',
  },

  // thread-rio-008 — real açaí (2 replies)
  {
    id: 'thread-rio-008-r1',
    threadId: 'thread-rio-008',
    authorFriendId: 'maya-ipanema',
    body:"BB Lanches on Rainha Elizabeth, corner of R. Almirante Gonçalves. R$ 18 a bowl. Real, thick, no sugar if you ask.",
  },
  {
    id: 'thread-rio-008-r2',
    threadId: 'thread-rio-008',
    authorFriendId: 'yael-botafogo',
    body:"Agreed with Maya. Polis Sucos in Botafogo is also great if you're passing ⭐",
  },

  // thread-rio-009 — who is in Copa (3 replies)
  {
    id: 'thread-rio-009-r1',
    threadId: 'thread-rio-009',
    authorFriendId: 'maya-ipanema',
    body:"I'm in Ipanema, coming to Posto 9 Wednesday night. See you there.",
  },
  {
    id: 'thread-rio-009-r2',
    threadId: 'thread-rio-009',
    authorFriendId: null,
    body:"If it's not raining, I'm down. Drop in the WhatsApp group.",
  },
  {
    id: 'thread-rio-009-r3',
    threadId: 'thread-rio-009',
    authorFriendId: 'roi-buzios',
    body:"I'm leaving for Búzios at the weekend, but if it's Mon or Tue I'm in.",
  },

  // thread-rio-010 — Pavão Azul meetup (3 replies)
  {
    id: 'thread-rio-010-r1',
    threadId: 'thread-rio-010',
    authorFriendId: 'maya-ipanema',
    body:"No way, great idea  I'm in. Also: let's add a WhatsApp group for coordination.",
  },
  {
    id: 'thread-rio-010-r2',
    threadId: 'thread-rio-010',
    authorFriendId: 'yael-botafogo',
    body:"Honestly 19:00 on a Tuesday is early, people are still working. 20:30 is more realistic. But I'm coming either way.",
  },
  {
    id: 'thread-rio-010-r3',
    threadId: 'thread-rio-010',
    authorFriendId: 'roi-buzios',
    body:"I'll swing by when I'm back from Búzios. Save me a seat.",
  },

  // =====================================================================
  // BÚZIOS
  // =====================================================================

  // thread-buzios-001 — Chabad in Búzios (2 replies)
  {
    id: 'thread-buzios-001-r1',
    threadId: 'thread-buzios-001',
    authorFriendId: 'roi-buzios',
    body:"No Chabad in Búzios. Nearest one is in Niterói, two hours away. If Shabbat matters to you, better head back.",
  },
  {
    id: 'thread-buzios-001-r2',
    threadId: 'thread-buzios-001',
    authorFriendId: 'maya-ipanema',
    body:"Option: make Shabbat in Búzios yourself, bring challot from Kosher Rio. Different vibe but if it's just 24 hours, doable.",
  },

  // thread-buzios-002 — kosher meat (1 reply)
  {
    id: 'thread-buzios-002-r1',
    threadId: 'thread-buzios-002',
    authorFriendId: null,
    body:"Bro I'm in. I'll bring veggies, wine and pita. Let's sort it in DM.",
  },

  // thread-buzios-003 — Rua das Pedras (3 replies)
  {
    id: 'thread-buzios-003-r1',
    threadId: 'thread-buzios-003',
    authorFriendId: 'maya-ipanema',
    body: 'Start at Privilege on the strip, right by the water. Most people flow in after 23:00. Cover R$ 50, fair.',
  },
  {
    id: 'thread-buzios-003-r2',
    threadId: 'thread-buzios-003',
    authorFriendId: null,
    body:"I'll be there 29–31, let's go together? Down for Privilege as the opener.",
  },
  {
    id: 'thread-buzios-003-r3',
    threadId: 'thread-buzios-003',
    authorFriendId: 'roi-buzios',
    body:"Cool. Anexo Bar is also good — more chill, cheaper. Start there, move to Privilege around midnight.",
  },

  // thread-buzios-004 — full moon party (2 replies)
  {
    id: 'thread-buzios-004-r1',
    threadId: 'thread-buzios-004',
    authorFriendId: 'roi-buzios',
    body: 'Still happens but less interesting, more tourists. If it lines up with the 30th of the month, that\'s the busy night. Bring a speaker and beer.',
  },
  {
    id: 'thread-buzios-004-r2',
    threadId: 'thread-buzios-004',
    authorFriendId: 'maya-ipanema',
    body: 'I was there two years ago, it was legendary. Less authentic now but the walk down to the beach is still worth it.',
  },

  // thread-buzios-005 — Praia Azeda snorkeling (3 replies)
  {
    id: 'thread-buzios-005-r1',
    threadId: 'thread-buzios-005',
    authorFriendId: null,
    body:"I'm there 29–31, joining. Got an extra pair of goggles? Forgot mine in Rio.",
  },
  {
    id: 'thread-buzios-005-r2',
    threadId: 'thread-buzios-005',
    authorFriendId: 'shir-saopaulo',
    body: 'If the water is calm in the morning, Praia João Fernandes is also gorgeous. Worth checking.',
  },
  {
    id: 'thread-buzios-005-r3',
    threadId: 'thread-buzios-005',
    authorFriendId: 'roi-buzios',
    body:"I have two pairs of goggles. Sort the rest in DM",
  },

  // thread-buzios-006 — boat tour (2 replies)
  {
    id: 'thread-buzios-006-r1',
    threadId: 'thread-buzios-006',
    authorFriendId: 'roi-buzios',
    body:"R$ 80 is the giant schooner with 80 people on it. R$ 200 is a small private lancha. Difference is real. Split it across 4–6 people.",
  },
  {
    id: 'thread-buzios-006-r2',
    threadId: 'thread-buzios-006',
    authorFriendId: null,
    body: 'Thanks. Looking for a crew to share a lancha. Morning of the 29th. DM me if you\'re down.',
  },

  // thread-buzios-007 — Chez Michou (3 replies)
  {
    id: 'thread-buzios-007-r1',
    threadId: 'thread-buzios-007',
    authorFriendId: 'roi-buzios',
    body:"Honestly still worth it — but go after 23:00. In the daytime the queue is crazy, after midnight it's chill and better.",
  },
  {
    id: 'thread-buzios-007-r2',
    threadId: 'thread-buzios-007',
    authorFriendId: null,
    body:"Maya, give me your latest take? I'm thinking of swapping to Bananaland or something else.",
  },
  {
    id: 'thread-buzios-007-r3',
    threadId: 'thread-buzios-007',
    authorFriendId: 'maya-ipanema',
    body: 'I was there in summer, it was fine. But Bananaland is better for breakfast. Chez Michou only at night.',
  },

  // thread-buzios-008 — seafood (2 replies)
  {
    id: 'thread-buzios-008-r1',
    threadId: 'thread-buzios-008',
    authorFriendId: 'maya-ipanema',
    body: 'Cigalon at Ferradurinha. Tables on the sand, meal R$ 90 a person, fishermen bring in the catch every morning. Heads up: closed Mondays.',
  },
  {
    id: 'thread-buzios-008-r2',
    threadId: 'thread-buzios-008',
    authorFriendId: 'roi-buzios',
    body:"Sawasdee is also strong. Both not touristy. Book ahead for the weekend.",
  },

  // thread-buzios-009 — who is in Búzios (3 replies)
  {
    id: 'thread-buzios-009-r1',
    threadId: 'thread-buzios-009',
    authorFriendId: 'roi-buzios',
    body:"I'm there, Nissim. Let's lock in dinner at Chez Michou for one of the nights. Down?",
  },
  {
    id: 'thread-buzios-009-r2',
    threadId: 'thread-buzios-009',
    authorFriendId: 'maya-ipanema',
    body:"Coming up for one day on Saturday, after morning snorkeling. I'll join the meal if it's lunch.",
  },
  {
    id: 'thread-buzios-009-r3',
    threadId: 'thread-buzios-009',
    authorFriendId: 'shir-saopaulo',
    body:"Jealous. Have fun  send pics.",
  },

  // thread-buzios-010 — day trip Búzios from Rio (2 replies)
  {
    id: 'thread-buzios-010-r1',
    threadId: 'thread-buzios-010',
    authorFriendId: 'yael-botafogo',
    body:"I'm in. Morning snorkeling sounds perfect. I'll pick you up at Novo Rio at 6:45?",
  },
  {
    id: 'thread-buzios-010-r2',
    threadId: 'thread-buzios-010',
    authorFriendId: 'maya-ipanema',
    body:"Yael, perfect. Let's get a small WhatsApp group going? I'll DM you the link.",
  },

  // =====================================================================
  // SÃO PAULO
  // =====================================================================

  // thread-sao-paulo-001 — Chabad Jardins (3 replies)
  {
    id: 'thread-sao-paulo-001-r1',
    threadId: 'thread-sao-paulo-001',
    authorFriendId: 'shir-saopaulo',
    body: 'Chabad Jardins runs open tables. Confirm ahead through their site. Rabbi Meir hosts, Israeli vibe.',
  },
  {
    id: 'thread-sao-paulo-001-r2',
    threadId: 'thread-sao-paulo-001',
    authorFriendId: null,
    body:"Thanks Shir. I'll email next week.",
  },
  {
    id: 'thread-sao-paulo-001-r3',
    threadId: 'thread-sao-paulo-001',
    authorFriendId: 'moshe-buenosaires',
    body:"If you miss a table, the Cong. Israelita synagogue also hosts for Shabbat. Less Chabad, more traditional.",
  },

  // thread-sao-paulo-002 — Kosher Delícia (2 replies)
  {
    id: 'thread-sao-paulo-002-r1',
    threadId: 'thread-sao-paulo-002',
    authorFriendId: null,
    body:"Been there twice — worth the trip. Their ribs are great, R$ 95 a person with sides.",
  },
  {
    id: 'thread-sao-paulo-002-r2',
    threadId: 'thread-sao-paulo-002',
    authorFriendId: 'moshe-buenosaires',
    body:"There's also Kosher Express in Jardins closer to you. Less impressive but convenient.",
  },

  // thread-sao-paulo-003 — Vila bar (3 replies)
  {
    id: 'thread-sao-paulo-003-r1',
    threadId: 'thread-sao-paulo-003',
    authorFriendId: 'shir-saopaulo',
    body: 'Coisa Linda in Vila. Local beer, simple food, no DJ. Thursday-Friday nights it fills up.',
  },
  {
    id: 'thread-sao-paulo-003-r2',
    threadId: 'thread-sao-paulo-003',
    authorFriendId: null,
    body:"Veloso is also good — but busier. Depends if you want to meet locals or chill.",
  },
  {
    id: 'thread-sao-paulo-003-r3',
    threadId: 'thread-sao-paulo-003',
    authorFriendId: 'yael-botafogo',
    body:"Coisa Linda. I go back there every single time",
  },

  // thread-sao-paulo-004 — D-Edge (2 replies)
  {
    id: 'thread-sao-paulo-004-r1',
    threadId: 'thread-sao-paulo-004',
    authorFriendId: 'moshe-buenosaires',
    body:"Bro R$ 120 cover is highway robbery  but the sound there is the best in the city. If it's a DJ you actually like, worth it. Otherwise — Mirante 9 de Julho is free.",
  },
  {
    id: 'thread-sao-paulo-004-r2',
    threadId: 'thread-sao-paulo-004',
    authorFriendId: 'yael-botafogo',
    body:"I'm going Friday. Want to come along? Split a taxi, way cheaper.",
  },

  // thread-sao-paulo-005 — Ibirapuera run (2 replies)
  {
    id: 'thread-sao-paulo-005-r1',
    threadId: 'thread-sao-paulo-005',
    authorFriendId: 'shir-saopaulo',
    body:"I run there every Mon and Thu at 7:00. Push it 30 min and we can run together. Meet at Portão 7?",
  },
  {
    id: 'thread-sao-paulo-005-r2',
    threadId: 'thread-sao-paulo-005',
    authorFriendId: null,
    body:"Shir, perfect. Monday 7:00 at Portão 7. I'll bring extra water.",
  },

  // thread-sao-paulo-006 — Pedra Grande (3 replies)
  {
    id: 'thread-sao-paulo-006-r1',
    threadId: 'thread-sao-paulo-006',
    authorFriendId: null,
    body:"I'm in! Got a daypack and a big water bottle. Need to bring anything for the car?",
  },
  {
    id: 'thread-sao-paulo-006-r2',
    threadId: 'thread-sao-paulo-006',
    authorFriendId: 'yael-botafogo',
    body:"I'm coming. Shir, if there are still 4 seats, count me as two — bringing my friend Tal.",
  },
  {
    id: 'thread-sao-paulo-006-r3',
    threadId: 'thread-sao-paulo-006',
    authorFriendId: 'shir-saopaulo',
    body:"Perfect, both of you. One seat left. Split is 70 reais a head for gas. I'll DM the address Thursday.",
  },

  // thread-sao-paulo-007 — La Cabrera (3 replies)
  {
    id: 'thread-sao-paulo-007-r1',
    threadId: 'thread-sao-paulo-007',
    authorFriendId: 'shir-saopaulo',
    body:"Worth it — but only if you love Bife de chorizo. I got there at 18:30 with no reservation, in within 20 min.",
  },
  {
    id: 'thread-sao-paulo-007-r2',
    threadId: 'thread-sao-paulo-007',
    authorFriendId: 'moshe-buenosaires',
    body:"Honestly Don Julio (if you make it to Buenos) is more impressive. But in São Paulo, La Cabrera is good.",
  },
  {
    id: 'thread-sao-paulo-007-r3',
    threadId: 'thread-sao-paulo-007',
    authorFriendId: 'yotam-jericoacoara',
    body:"Also try A Casa do Porco on the same street. Different but next level",
  },

  // thread-sao-paulo-008 — Mercadão (2 replies)
  {
    id: 'thread-sao-paulo-008-r1',
    threadId: 'thread-sao-paulo-008',
    authorFriendId: 'shir-saopaulo',
    body: 'Mortadella sandwich at Hocca Bar (R$ 65 huge), pastel de bacalhau at Bar do Mané. The two classics.',
  },
  {
    id: 'thread-sao-paulo-008-r2',
    threadId: 'thread-sao-paulo-008',
    authorFriendId: 'moshe-buenosaires',
    body:"Also exotic fruits on the ground floor. Ask to taste the cupuaçu before you buy — not for everyone.",
  },

  // thread-sao-paulo-009 — open evening (3 replies)
  {
    id: 'thread-sao-paulo-009-r1',
    threadId: 'thread-sao-paulo-009',
    authorFriendId: null,
    body:"I'm in town 3–5. Down for Friday the 7th. Should I bring anything?",
  },
  {
    id: 'thread-sao-paulo-009-r2',
    threadId: 'thread-sao-paulo-009',
    authorFriendId: 'yael-botafogo',
    body:"Me too! When are you all arriving? I'll bring caipirinhas pre-made from home.",
  },
  {
    id: 'thread-sao-paulo-009-r3',
    threadId: 'thread-sao-paulo-009',
    authorFriendId: 'shir-saopaulo',
    body:"Perfect, both of you. Nissim, if you can bring red wine and cheese that'd round it out. Yael, caipirinhas are very welcome",
  },

  // thread-sao-paulo-010 — Santos (2 replies)
  {
    id: 'thread-sao-paulo-010-r1',
    threadId: 'thread-sao-paulo-010',
    authorFriendId: 'shir-saopaulo',
    body:"Went there once, the aquarium is great, the beach is meh. If you like football there's a Pelé museum. Full day.",
  },
  {
    id: 'thread-sao-paulo-010-r2',
    threadId: 'thread-sao-paulo-010',
    authorFriendId: 'moshe-buenosaires',
    body:"I'm in if I'm still around on Saturday. Send the times, I'll confirm later.",
  },

  // =====================================================================
  // JERICOACOARA
  // =====================================================================

  // thread-jericoacoara-001 — no Chabad (3 replies)
  {
    id: 'thread-jericoacoara-001-r1',
    threadId: 'thread-jericoacoara-001',
    authorFriendId: null,
    body:"Yotam, I can bring challot if I arrive on the 9th. Confirm a date and I'll sort it.",
  },
  {
    id: 'thread-jericoacoara-001-r2',
    threadId: 'thread-jericoacoara-001',
    authorFriendId: 'roi-buzios',
    body:"Arriving Nov 11 after Búzios. Bringing wine and a white tablecloth. We'll do kiddush on the beach, it'll be a beautiful mess.",
  },
  {
    id: 'thread-jericoacoara-001-r3',
    threadId: 'thread-jericoacoara-001',
    authorFriendId: 'yotam-jericoacoara',
    body:"Legendary  Nissim brings challot, Roi wine and the cloth, I'll do fish and rice on the fire. Shabbat in Jeri.",
  },

  // thread-jericoacoara-002 — kosher food (2 replies)
  {
    id: 'thread-jericoacoara-002-r1',
    threadId: 'thread-jericoacoara-002',
    authorFriendId: 'yotam-jericoacoara',
    body:"I manage with fresh fish from the fishermen (kosher after checking), veggies, eggs, and pita I bake in a mini oven. It works.",
  },
  {
    id: 'thread-jericoacoara-002-r2',
    threadId: 'thread-jericoacoara-002',
    authorFriendId: null,
    body:"Thanks. I think I'll grab supplies in Fortaleza and bring them with me. The fish idea is solid.",
  },

  // thread-jericoacoara-003 — forró (3 replies)
  {
    id: 'thread-jericoacoara-003-r1',
    threadId: 'thread-jericoacoara-003',
    authorFriendId: null,
    body:"Was there last month on a Monday night — wild. Wednesday is also good, fewer people.",
  },
  {
    id: 'thread-jericoacoara-003-r2',
    threadId: 'thread-jericoacoara-003',
    authorFriendId: 'roi-buzios',
    body:"Tuesday is the old-timer local night. Real musicians, fewer tourists. Best in my opinion.",
  },
  {
    id: 'thread-jericoacoara-003-r3',
    threadId: 'thread-jericoacoara-003',
    authorFriendId: 'yotam-jericoacoara',
    body:"Agreed with Roi. Tuesday is also open till 2:00 without messing up the morning kite session.",
  },

  // thread-jericoacoara-004 — sunset party (2 replies)
  {
    id: 'thread-jericoacoara-004-r1',
    threadId: 'thread-jericoacoara-004',
    authorFriendId: 'yotam-jericoacoara',
    body:"Totally real. After everyone clears off the dune, about 40 people stay behind, someone pulls out a speaker. Goes till maybe 22:00.",
  },
  {
    id: 'thread-jericoacoara-004-r2',
    threadId: 'thread-jericoacoara-004',
    authorFriendId: 'maya-ipanema',
    body: 'Was there half a year ago, legendary. Bring your own beers, no shops nearby.',
  },

  // thread-jericoacoara-005 — Pure Kite (3 replies)
  {
    id: 'thread-jericoacoara-005-r1',
    threadId: 'thread-jericoacoara-005',
    authorFriendId: 'roi-buzios',
    body:"Lock in the dates in advance, in peak season he books out. I already reserved for Nov 11.",
  },
  {
    id: 'thread-jericoacoara-005-r2',
    threadId: 'thread-jericoacoara-005',
    authorFriendId: null,
    body:"I'll email him tonight. Thanks Yotam",
  },
  {
    id: 'thread-jericoacoara-005-r3',
    threadId: 'thread-jericoacoara-005',
    authorFriendId: 'shir-saopaulo',
    body: 'Jealous. Hitting Jeri in 3 months, signing up with you ',
  },

  // thread-jericoacoara-006 — dune sunset (2 replies)
  {
    id: 'thread-jericoacoara-006-r1',
    threadId: 'thread-jericoacoara-006',
    authorFriendId: 'yotam-jericoacoara',
    body: 'Get there 40 min before, grab a caipirinha from the bar at the base of the dune. Best moment of the whole trip.',
  },
  {
    id: 'thread-jericoacoara-006-r2',
    threadId: 'thread-jericoacoara-006',
    authorFriendId: null,
    body:"Sounds amazing. Thanks Roi",
  },

  // thread-jericoacoara-007 — fresh fish (2 replies)
  {
    id: 'thread-jericoacoara-007-r1',
    threadId: 'thread-jericoacoara-007',
    authorFriendId: 'yotam-jericoacoara',
    body:"Head to the fishermen's beach at 17:00 when the boats come back. A woman named Dona Zelmira cooks at her place — R$ 45 a head, book a day ahead.",
  },
  {
    id: 'thread-jericoacoara-007-r2',
    threadId: 'thread-jericoacoara-007',
    authorFriendId: 'roi-buzios',
    body:"Confirmed  Dona Zelmira is the best in Jeri. Drop Yotam's name, she'll know.",
  },

  // thread-jericoacoara-008 — breakfast (2 replies)
  {
    id: 'thread-jericoacoara-008-r1',
    threadId: 'thread-jericoacoara-008',
    authorFriendId: null,
    body:"Yotam, thanks — noted. Also heard about Camões, what do you think?",
  },
  {
    id: 'thread-jericoacoara-008-r2',
    threadId: 'thread-jericoacoara-008',
    authorFriendId: 'yotam-jericoacoara',
    body:"Camões is pricier, food is fine. If you're actually hungry, go to Cantinho. If you want extra treats, Camões.",
  },

  // thread-jericoacoara-009 — how to get there (3 replies)
  {
    id: 'thread-jericoacoara-009-r1',
    threadId: 'thread-jericoacoara-009',
    authorFriendId: 'yotam-jericoacoara',
    body:"Fly to Fortaleza then shared jeep to Jijoca and another jeep to Jeri. About 180 reais all-in if you book solo.",
  },
  {
    id: 'thread-jericoacoara-009-r2',
    threadId: 'thread-jericoacoara-009',
    authorFriendId: 'shir-saopaulo',
    body: 'Cheaper option: night bus from Fortaleza to Jijoca, then jeep. Long but under 100 reais.',
  },
  {
    id: 'thread-jericoacoara-009-r3',
    threadId: 'thread-jericoacoara-009',
    authorFriendId: null,
    body:"Going with the shared jeep, I don't want to risk a night bus with a big pack.",
  },

  // thread-jericoacoara-010 — kite crew (3 replies)
  {
    id: 'thread-jericoacoara-010-r1',
    threadId: 'thread-jericoacoara-010',
    authorFriendId: 'roi-buzios',
    body:"100% in. Landing Nov 11 at 14:00. Let's lock in dinner that night at Tamandaré? 20:30?",
  },
  {
    id: 'thread-jericoacoara-010-r2',
    threadId: 'thread-jericoacoara-010',
    authorFriendId: null,
    body:"I'm coming. Another beginner. Locking in Tamandaré 20:30 on Nov 11. Shir and more coming next November",
  },
  {
    id: 'thread-jericoacoara-010-r3',
    threadId: 'thread-jericoacoara-010',
    authorFriendId: 'yotam-jericoacoara',
    body:"Perfect. I'll book a table for 3 at Tamandaré. If anyone else joins, message the day before.",
  },

  // =====================================================================
  // BUENOS AIRES
  // =====================================================================

  // thread-buenos-aires-001 — Chabad Abasto (3 replies)
  {
    id: 'thread-buenos-aires-001-r1',
    threadId: 'thread-buenos-aires-001',
    authorFriendId: null,
    body:"Moshe, thanks. Registered for Shabbat Nov 21. You'll meet me there?",
  },
  {
    id: 'thread-buenos-aires-001-r2',
    threadId: 'thread-buenos-aires-001',
    authorFriendId: 'yael-botafogo',
    body:"I'm also coming that Shabbat. Nissim, I can pick you up from the hostel if you want?",
  },
  {
    id: 'thread-buenos-aires-001-r3',
    threadId: 'thread-buenos-aires-001',
    authorFriendId: 'moshe-buenosaires',
    body:"Perfect, both of you. Dinner at 20:30, people start arriving from 19:30. Come with a small bag, they don't allow big ones inside.",
  },

  // thread-buenos-aires-002 — kosher meat (2 replies)
  {
    id: 'thread-buenos-aires-002-r1',
    threadId: 'thread-buenos-aires-002',
    authorFriendId: 'moshe-buenosaires',
    body:"Al Galope. Their chorizo and picaña are on another level. R$ a bit more but worth it. Levi is fine but less variety.",
  },
  {
    id: 'thread-buenos-aires-002-r2',
    threadId: 'thread-buenos-aires-002',
    authorFriendId: 'dana-punta',
    body:"Thanks Moshe. I'll swing by tomorrow. Already a fan of their chorizo",
  },

  // thread-buenos-aires-003 — La Catedral milonga (3 replies)
  {
    id: 'thread-buenos-aires-003-r1',
    threadId: 'thread-buenos-aires-003',
    authorFriendId: null,
    body:"Moshe, I'm in town till the 25th. Coming this Friday. Are special shoes required or just smooth soles?",
  },
  {
    id: 'thread-buenos-aires-003-r2',
    threadId: 'thread-buenos-aires-003',
    authorFriendId: 'moshe-buenosaires',
    body:"Smooth soles are enough for beginners. Don't come in trainers, they'll let you dance but it's not nice.",
  },
  {
    id: 'thread-buenos-aires-003-r3',
    threadId: 'thread-buenos-aires-003',
    authorFriendId: 'yael-botafogo',
    body:"I'm coming too ‍️ first time at a milonga, a little scared. But I'm down.",
  },

  // thread-buenos-aires-004 — Niceto (2 replies)
  {
    id: 'thread-buenos-aires-004-r1',
    threadId: 'thread-buenos-aires-004',
    authorFriendId: 'moshe-buenosaires',
    body:"Club 69 Carnaval at Niceto, Wednesday night. Cover AR$ 15,000, opens 1:00. Dress: black, looser the better",
  },
  {
    id: 'thread-buenos-aires-004-r2',
    threadId: 'thread-buenos-aires-004',
    authorFriendId: null,
    body:"Moshe, how do I get in without them giving me a hard time? Is there a list?",
  },

  // thread-buenos-aires-005 — bikes (2 replies)
  {
    id: 'thread-buenos-aires-005-r1',
    threadId: 'thread-buenos-aires-005',
    authorFriendId: 'moshe-buenosaires',
    body:"EcoBici is free but registration is a pain for tourists, you need a local document. Rent a Bike is AR$ 8,000 a day, worth the lack of headache.",
  },
  {
    id: 'thread-buenos-aires-005-r2',
    threadId: 'thread-buenos-aires-005',
    authorFriendId: 'dana-punta',
    body: 'Also BA Bikes on Sarmiento. AR$ 6,000 a day, cheaper and less busy.',
  },

  // thread-buenos-aires-006 — Mendoza (3 replies)
  {
    id: 'thread-buenos-aires-006-r1',
    threadId: 'thread-buenos-aires-006',
    authorFriendId: null,
    body:"Neta, how are the tours? Any specific one you'd recommend? Which wineries?",
  },
  {
    id: 'thread-buenos-aires-006-r2',
    threadId: 'thread-buenos-aires-006',
    authorFriendId: 'neta-mendoza',
    body:"Trout & Wine's day tour is great. 4 wineries, lunch included, AR$ 35,000. Catena Zapata is a must, Bodega Lagarde is more personal.",
  },
  {
    id: 'thread-buenos-aires-006-r3',
    threadId: 'thread-buenos-aires-006',
    authorFriendId: 'moshe-buenosaires',
    body:"If it's only 3 days — fly, don't bus. Flight is AR$ 60,000, the 12-hour bus is not worth it.",
  },

  // thread-buenos-aires-007 — Don Julio vs La Cabrera (3 replies)
  {
    id: 'thread-buenos-aires-007-r1',
    threadId: 'thread-buenos-aires-007',
    authorFriendId: 'moshe-buenosaires',
    body: 'Don Julio. Full stop. La Cabrera is nice but Don Julio is real asado. Book through CoverManager 3 weeks ahead.',
  },
  {
    id: 'thread-buenos-aires-007-r2',
    threadId: 'thread-buenos-aires-007',
    authorFriendId: null,
    body: 'Thanks. What if there is no slot? La Cabrera as a backup, or anything else?',
  },
  {
    id: 'thread-buenos-aires-007-r3',
    threadId: 'thread-buenos-aires-007',
    authorFriendId: 'dana-punta',
    body:"If Don Julio is full, El Pobre Luis. Less famous, more local, top-tier meat. I lived in Argentina and was there 5 times.",
  },

  // thread-buenos-aires-008 — empanadas (2 replies)
  {
    id: 'thread-buenos-aires-008-r1',
    threadId: 'thread-buenos-aires-008',
    authorFriendId: 'moshe-buenosaires',
    body:"La Cocina on Pueyrredón. Real salteña empanadas, R$ 2,800 each. Worth the trip.",
  },
  {
    id: 'thread-buenos-aires-008-r2',
    threadId: 'thread-buenos-aires-008',
    authorFriendId: 'neta-mendoza',
    body:"Bro trust me — La Mexicana in San Telmo, R$ 1,200 each, fried in-house. I go every Friday",
  },

  // thread-buenos-aires-009 — Palermo asado (3 replies)
  {
    id: 'thread-buenos-aires-009-r1',
    threadId: 'thread-buenos-aires-009',
    authorFriendId: 'yael-botafogo',
    body:"I land on the 18th. Will swing by for a coffee.",
  },
  {
    id: 'thread-buenos-aires-009-r2',
    threadId: 'thread-buenos-aires-009',
    authorFriendId: null,
    body:"Also there 16–25. We'll definitely lock in one asado.",
  },
  {
    id: 'thread-buenos-aires-009-r3',
    threadId: 'thread-buenos-aires-009',
    authorFriendId: 'moshe-buenosaires',
    body:"Perfect. I'll DM a WhatsApp group link to everyone who posted.",
  },

  // thread-buenos-aires-010 — Bariloche (2 replies)
  {
    id: 'thread-buenos-aires-010-r1',
    threadId: 'thread-buenos-aires-010',
    authorFriendId: null,
    body:"Uri, you're calling it 'just 3 extra days', but it's a third domestic flight. Budget gets wild.",
  },
  {
    id: 'thread-buenos-aires-010-r2',
    threadId: 'thread-buenos-aires-010',
    authorFriendId: 'uri-bariloche',
    body:"Bro, night bus from Retiro AR$ 45,000, 22 hours but actually pleasant. Do it once in your life. Seven Lakes is insane.",
  },
];
