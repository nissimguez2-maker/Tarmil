/**
 * Group chat messages — conversational copy tied to each chat's destination.
 *
 * SEED ONLY. Runtime data lives in `group_messages`.
 *
 * `authorFriendId: null` = sent by the current user (self). Otherwise FK to
 * `friend_overlaps.id`. Messages are listed in chronological order; the
 * seed script inserts them without explicit created_at so Postgres assigns
 * sequential timestamps (close enough for demo).
 *
 * Each chat has 15–25 messages, mix of self and friend authors, ending on a
 * friend message so the chat list shows the latest sender as"not self".
 */

export type GroupMessage = {
  id: string;
  chatId: string;
  /** null = self. FK to friend_overlaps when present. */
  authorFriendId: string | null;
  body: string;
};

export const groupMessages: GroupMessage[] = [
  // =====================================================================
  // chat-buzios-weekend (Roi + Maya + self)
  // =====================================================================
  {
    id: 'chat-buzios-weekend-m01',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'roi-buzios',
    body:"Heading out the 29th to Búzios. Who is in for the weekend?",
  },
  {
    id: 'chat-buzios-weekend-m02',
    chatId: 'chat-buzios-weekend',
    authorFriendId: null,
    body:"I'm there 28–31. Locked in a hostel in Manguinhos. You?",
  },
  {
    id: 'chat-buzios-weekend-m03',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'roi-buzios',
    body:"I'm at Azeda. 30 min walk away but cheaper.",
  },
  {
    id: 'chat-buzios-weekend-m04',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'maya-ipanema',
    body:"Trying to come up Saturday morning just for the day. Snorkel + lunch, back to Rio at night.",
  },
  {
    id: 'chat-buzios-weekend-m05',
    chatId: 'chat-buzios-weekend',
    authorFriendId: null,
    body:"Maya, if you get there 10:00 at Praia João Fernandes, the water is calm there in the morning.",
  },
  {
    id: 'chat-buzios-weekend-m06',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'maya-ipanema',
    body:"Perfect. Roi, can you find a lunch spot for the three of us?",
  },
  {
    id: 'chat-buzios-weekend-m07',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'roi-buzios',
    body:"Chez Michou on Rua das Pedras. The classic, open all day, worth it.",
  },
  {
    id: 'chat-buzios-weekend-m08',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'maya-ipanema',
    body:"BTW Yael said she might come up Saturday too. Add her to the group?",
  },
  {
    id: 'chat-buzios-weekend-m09',
    chatId: 'chat-buzios-weekend',
    authorFriendId: null,
    body:"Add her. More the merrier.",
  },
  {
    id: 'chat-buzios-weekend-m10',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'roi-buzios',
    body: '',
  },
  {
    id: 'chat-buzios-weekend-m11',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'roi-buzios',
    body:"BTW who's bringing goggles? I've got two pairs.",
  },
  {
    id: 'chat-buzios-weekend-m12',
    chatId: 'chat-buzios-weekend',
    authorFriendId: null,
    body:"Sweet I'll take one of yours. Maya you?",
  },
  {
    id: 'chat-buzios-weekend-m13',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'maya-ipanema',
    body:"I have my own. I'll bring a snorkel too if we need a third set.",
  },
  {
    id: 'chat-buzios-weekend-m14',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'roi-buzios',
    body:"Legendary. So Saturday 10:00 at João Fernandes. I'll bring beer.",
  },
  {
    id: 'chat-buzios-weekend-m15',
    chatId: 'chat-buzios-weekend',
    authorFriendId: null,
    body:"Beer at 10 in the morning bro?",
  },
  {
    id: 'chat-buzios-weekend-m16',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'roi-buzios',
    body:"We're on holiday. Anything goes. Brazil is morally exempt.",
  },
  {
    id: 'chat-buzios-weekend-m17',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'maya-ipanema',
    body:"Joining  BTW Chez Michou for lunch — book for 14?",
  },
  {
    id: 'chat-buzios-weekend-m18',
    chatId: 'chat-buzios-weekend',
    authorFriendId: null,
    body:"Book it. R$ 150 a head roughly, just so we know.",
  },
  {
    id: 'chat-buzios-weekend-m19',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'maya-ipanema',
    body:"Booked for 14:30 for three. If Yael joins I'll update.",
  },
  {
    id: 'chat-buzios-weekend-m20',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'roi-buzios',
    body: '[Voice note · 0:23]',
  },
  {
    id: 'chat-buzios-weekend-m21',
    chatId: 'chat-buzios-weekend',
    authorFriendId: null,
    body:"Heard it. Sounds like you're already in the zone. Enjoy!",
  },
  {
    id: 'chat-buzios-weekend-m22',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'roi-buzios',
    body:"BTW the hostel asked for a deposit. Bring some cash.",
  },

  // =====================================================================
  // chat-sao-paulo-asado (Shir + Yael + self)
  // =====================================================================
  {
    id: 'chat-sao-paulo-asado-m01',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'shir-saopaulo',
    body:"Booked La Cabrera for 21:00 Thursday. All three of you in?",
  },
  {
    id: 'chat-sao-paulo-asado-m02',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: null,
    body:"Confirming. Coming straight from the airport, sandals and zombie eyes.",
  },
  {
    id: 'chat-sao-paulo-asado-m03',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'yael-botafogo',
    body:"I'm coming, but probably 15 minutes late. Order without me if you're starving.",
  },
  {
    id: 'chat-sao-paulo-asado-m04',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'shir-saopaulo',
    body:"Yael, no worries. We'll wait. I'll preorder Bife de chorizo and malbec.",
  },
  {
    id: 'chat-sao-paulo-asado-m05',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: null,
    body:"Sounds great. After, anywhere chill open for a beer in Vila?",
  },
  {
    id: 'chat-sao-paulo-asado-m06',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'shir-saopaulo',
    body:"Coisa Linda — Thursday evening it's easy to grab a table till 23. We'll head there from dinner.",
  },
  {
    id: 'chat-sao-paulo-asado-m07',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'yael-botafogo',
    body:"I heard there's a music festival in Vila that night. Anyone see it?",
  },
  {
    id: 'chat-sao-paulo-asado-m08',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'shir-saopaulo',
    body:"Yeah at SESC Pompeia. But it's 20 minutes by Uber.",
  },
  {
    id: 'chat-sao-paulo-asado-m09',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: null,
    body:"Let's save that for another day. After La Cabrera it's better to stay in the neighborhood.",
  },
  {
    id: 'chat-sao-paulo-asado-m10',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'yael-botafogo',
    body:"Agreed. BTW dress code? I'm having a meltdown about what to pack for SP.",
  },
  {
    id: 'chat-sao-paulo-asado-m11',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'shir-saopaulo',
    body:"La Cabrera is smart casual. Jeans and a nice top is fine. You don't need chinos.",
  },
  {
    id: 'chat-sao-paulo-asado-m12',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: null,
    body:"Thanks. We got here with one backpack, I have nothing fancy",
  },
  {
    id: 'chat-sao-paulo-asado-m13',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'yael-botafogo',
    body:"[Photo · my haul for the SP weekend]",
  },
  {
    id: 'chat-sao-paulo-asado-m14',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'shir-saopaulo',
    body:"Yael that's way too much. You're not going to a wedding.",
  },
  {
    id: 'chat-sao-paulo-asado-m15',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'yael-botafogo',
    body: ' always better to overpack.',
  },
  {
    id: 'chat-sao-paulo-asado-m16',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: null,
    body:"Shir, BTW — Thursday morning I'm free. Want to show me something before dinner?",
  },
  {
    id: 'chat-sao-paulo-asado-m17',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'shir-saopaulo',
    body:"Ibirapuera run at 7? Then Mercadão for breakfast.",
  },
  {
    id: 'chat-sao-paulo-asado-m18',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: null,
    body:"Down. Let's go together.",
  },
  {
    id: 'chat-sao-paulo-asado-m19',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'yael-botafogo',
    body:"I'll come straight from the festival if it works out. But confirming — 21:00 for 3.",
  },
  {
    id: 'chat-sao-paulo-asado-m20',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'shir-saopaulo',
    body:"Locked in. If Yotam joins I'll update the group.",
  },
  {
    id: 'chat-sao-paulo-asado-m21',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'yael-botafogo',
    body:"So hyped  see you Thursday.",
  },

  // =====================================================================
  // chat-jeri-kite (Yotam + Roi + self)
  // =====================================================================
  {
    id: 'chat-jeri-kite-m01',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'yotam-jericoacoara',
    body:"Landed in Fortaleza. Jeep to Jeri leaves tomorrow at 7. Who is with me?",
  },
  {
    id: 'chat-jeri-kite-m02',
    chatId: 'chat-jeri-kite',
    authorFriendId: null,
    body:"I'm arriving at 10, I'll catch the afternoon jeep. See you at the place.",
  },
  {
    id: 'chat-jeri-kite-m03',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'roi-buzios',
    body:"Heading up from Búzios this weekend, arriving the 11th. You all signed up at Pure Kite?",
  },
  {
    id: 'chat-jeri-kite-m04',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'yotam-jericoacoara',
    body:"Yeah, 3 days in a row from the 11th. Yaakov the instructor responds fast on DM.",
  },
  {
    id: 'chat-jeri-kite-m05',
    chatId: 'chat-jeri-kite',
    authorFriendId: null,
    body:"I'm a beginner so I'll do a private lesson first. I'll join you from day 12.",
  },
  {
    id: 'chat-jeri-kite-m06',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'roi-buzios',
    body:"Cool. Book with Renana if she's free — she's the best with beginners.",
  },
  {
    id: 'chat-jeri-kite-m07',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'yotam-jericoacoara',
    body:"BTW — dinner that same night at Tamandaré 20:30?",
  },
  {
    id: 'chat-jeri-kite-m08',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'roi-buzios',
    body:"Down. Forró spot after?",
  },
  {
    id: 'chat-jeri-kite-m09',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'yotam-jericoacoara',
    body:"Tuesday night is the best for forró. We'll see who's playing.",
  },
  {
    id: 'chat-jeri-kite-m10',
    chatId: 'chat-jeri-kite',
    authorFriendId: null,
    body:"Cool. BTW no Chabad there right?",
  },
  {
    id: 'chat-jeri-kite-m11',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'yotam-jericoacoara',
    body:"None. I proposed in the forum that we do Shabbat on the beach. You bringing challot?",
  },
  {
    id: 'chat-jeri-kite-m12',
    chatId: 'chat-jeri-kite',
    authorFriendId: null,
    body:"I'll bring them from my aunt's place in Fortaleza. Local tradition.",
  },
  {
    id: 'chat-jeri-kite-m13',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'roi-buzios',
    body:"I'll bring wine and a white tablecloth. Fish and rice on the fire — who's on it?",
  },
  {
    id: 'chat-jeri-kite-m14',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'yotam-jericoacoara',
    body:"Me. Dona Zelmira cooks for us if we order ahead.",
  },
  {
    id: 'chat-jeri-kite-m15',
    chatId: 'chat-jeri-kite',
    authorFriendId: null,
    body:"Legendary  Shabbat in Jeri. Who would have thought.",
  },
  {
    id: 'chat-jeri-kite-m16',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'roi-buzios',
    body:"BTW my bus from Búzios to Fortaleza is 18 hours. Disaster.",
  },
  {
    id: 'chat-jeri-kite-m17',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'yotam-jericoacoara',
    body:" bring a pillow. BTW I have a spot in the room at Pousada Arca.",
  },
  {
    id: 'chat-jeri-kite-m18',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'roi-buzios',
    body:"Taking it. R$ 90 a night per person? Nissim too?",
  },
  {
    id: 'chat-jeri-kite-m19',
    chatId: 'chat-jeri-kite',
    authorFriendId: null,
    body:"Me too. 3 in a room, cheaper and more social.",
  },
  {
    id: 'chat-jeri-kite-m20',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'yotam-jericoacoara',
    body:"Confirmed with the owner. Three in a room with 3 beds. Nissim, paying via PIX?",
  },
  {
    id: 'chat-jeri-kite-m21',
    chatId: 'chat-jeri-kite',
    authorFriendId: null,
    body:"Paying on arrival. R$ 90 × 3 nights = R$ 270.",
  },
  {
    id: 'chat-jeri-kite-m22',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'roi-buzios',
    body: '[Photo · the sea in Búzios at dawn]',
  },
  {
    id: 'chat-jeri-kite-m23',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'yotam-jericoacoara',
    body:"Jealous. Wind here is wild since yesterday ️",
  },

  // =====================================================================
  // chat-buenos-palermo (Moshe + Yael + self)
  // =====================================================================
  {
    id: 'chat-buenos-palermo-m01',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'moshe-buenosaires',
    body:"My place in Palermo Soho is open for a rooftop asado Friday at 20. You coming?",
  },
  {
    id: 'chat-buenos-palermo-m02',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'yael-botafogo',
    body:"Landing on the 18th. Coming. Should I bring wine?",
  },
  {
    id: 'chat-buenos-palermo-m03',
    chatId: 'chat-buenos-palermo',
    authorFriendId: null,
    body:"I'm there too. Moshe, what do you need — meat, charcoal, wine?",
  },
  {
    id: 'chat-buenos-palermo-m04',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'moshe-buenosaires',
    body:"I've got meat and veggies on the grill. Bring malbec and bread from Salvaje.",
  },
  {
    id: 'chat-buenos-palermo-m05',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'yael-botafogo',
    body:"Done. I'll grab something sweet for dessert.",
  },
  {
    id: 'chat-buenos-palermo-m06',
    chatId: 'chat-buenos-palermo',
    authorFriendId: null,
    body:"I'll bring a solid malbec. Address in DM?",
  },
  {
    id: 'chat-buenos-palermo-m07',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'moshe-buenosaires',
    body:"Sending the address and code in DM.",
  },
  {
    id: 'chat-buenos-palermo-m08',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'yael-botafogo',
    body:"BTW — milonga at La Catedral after? If we still have the energy.",
  },
  {
    id: 'chat-buenos-palermo-m09',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'moshe-buenosaires',
    body:"Yes! I'm there every Friday. Opens 22:30, people show up from 23.",
  },
  {
    id: 'chat-buenos-palermo-m10',
    chatId: 'chat-buenos-palermo',
    authorFriendId: null,
    body:"I'm coming. Need special shoes?",
  },
  {
    id: 'chat-buenos-palermo-m11',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'moshe-buenosaires',
    body:"Smooth soles are enough. Don't show up in trainers.",
  },
  {
    id: 'chat-buenos-palermo-m12',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'yael-botafogo',
    body:"I'm bringing both closed shoes and heels, we'll see how I feel.",
  },
  {
    id: 'chat-buenos-palermo-m13',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'moshe-buenosaires',
    body: '',
  },
  {
    id: 'chat-buenos-palermo-m14',
    chatId: 'chat-buenos-palermo',
    authorFriendId: null,
    body:"Moshe — is asado a mellow gathering or more wild?",
  },
  {
    id: 'chat-buenos-palermo-m15',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'moshe-buenosaires',
    body:"Starts mellow, around 23 people loosen up. Depends who shows. This week is 8 people.",
  },
  {
    id: 'chat-buenos-palermo-m16',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'yael-botafogo',
    body:"Cool. BTW Chabad Abasto — are you guys going Shabbat after?",
  },
  {
    id: 'chat-buenos-palermo-m17',
    chatId: 'chat-buenos-palermo',
    authorFriendId: null,
    body:"I signed up for Shabbat the 21st. You?",
  },
  {
    id: 'chat-buenos-palermo-m18',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'yael-botafogo',
    body:"Me too. Moshe joining?",
  },
  {
    id: 'chat-buenos-palermo-m19',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'moshe-buenosaires',
    body:"Yeah. I'll pick you up on the way, I live 8 min from there.",
  },
  {
    id: 'chat-buenos-palermo-m20',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'yael-botafogo',
    body: '[Photo · view from the balcony in Rio before the flight]',
  },
  {
    id: 'chat-buenos-palermo-m21',
    chatId: 'chat-buenos-palermo',
    authorFriendId: null,
    body:"Damn ️ safe flight.",
  },
  {
    id: 'chat-buenos-palermo-m22',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'yael-botafogo',
    body:"Thanks. See you in Buenos",
  },
  {
    id: 'chat-buenos-palermo-m23',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'moshe-buenosaires',
    body:"BTW — Don Julio if you want one proper sit-down meal. Tables 3 weeks ahead.",
  },
  {
    id: 'chat-buenos-palermo-m24',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'moshe-buenosaires',
    body:"I'll book for the 19th. Want me to add another seat?",
  },
];
