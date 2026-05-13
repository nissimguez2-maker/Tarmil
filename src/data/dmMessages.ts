/**
 * Direct messages — chronological per DM thread.
 *
 * SEED ONLY. Runtime data lives in `dm_messages`.
 *
 * `fromFriend: true` = sent by the friend, `false` = sent by the current
 * user. Each thread has 15–20 messages. The LAST message in each thread
 * matches the `lastMessagePreviewHe` in `dms.ts`.
 *
 * Threads ending on a friend message (fromFriend: true) keep an unread
 * indicator on the inbox row.
 */

export type DMMessage = {
  id: string;
  dmThreadId: string;
  fromFriend: boolean;
  body: string;
};

export const dmMessages: DMMessage[] = [
  // =====================================================================
  // dm-maya — meet at Posto 9 (ends on friend message → unread)
  // =====================================================================
  { id: 'dm-maya-m01', dmThreadId: 'dm-maya', fromFriend: true, body: 'Hey, you in Ipanema?' },
  { id: 'dm-maya-m02', dmThreadId: 'dm-maya', fromFriend: false, body:"I'm in Copa. Want to come to Posto?" },
  { id: 'dm-maya-m03', dmThreadId: 'dm-maya', fromFriend: true, body:"Definitely. Tuesday or Wednesday work for me." },
  { id: 'dm-maya-m04', dmThreadId: 'dm-maya', fromFriend: false, body:"Tuesday 18:00, meet at the second Posto 9 marker from the end?" },
  { id: 'dm-maya-m05', dmThreadId: 'dm-maya', fromFriend: true, body:"Cool. I'll grab beers from Pavão Azul, you on academia?" },
  { id: 'dm-maya-m06', dmThreadId: 'dm-maya', fromFriend: false, body:"Academia. I'll bring pão de queijo to share." },
  { id: 'dm-maya-m07', dmThreadId: 'dm-maya', fromFriend: true, body: '' },
  { id: 'dm-maya-m08', dmThreadId: 'dm-maya', fromFriend: true, body:"BTW — did you see Yael's post about the bloco in Lapa?" },
  { id: 'dm-maya-m09', dmThreadId: 'dm-maya', fromFriend: false, body:"Yeah, replied. You going?" },
  { id: 'dm-maya-m10', dmThreadId: 'dm-maya', fromFriend: true, body:"Coming but late, I have something till 22." },
  { id: 'dm-maya-m11', dmThreadId: 'dm-maya', fromFriend: false, body:"How's the BJJ going? Still at Gracie?" },
  { id: 'dm-maya-m12', dmThreadId: 'dm-maya', fromFriend: true, body:"Switched to Checkmat. Way better vibe for beginners. Come check it Monday?" },
  { id: 'dm-maya-m13', dmThreadId: 'dm-maya', fromFriend: false, body:"Monday 19:00? Could swing by. What's the day rate?" },
  { id: 'dm-maya-m14', dmThreadId: 'dm-maya', fromFriend: true, body:"R$ 80. Bring a white gi if you have one." },
  { id: 'dm-maya-m15', dmThreadId: 'dm-maya', fromFriend: false, body:"I do. I'll come straight from work." },
  { id: 'dm-maya-m16', dmThreadId: 'dm-maya', fromFriend: true, body: '[Voice note · 0:42]' },
  { id: 'dm-maya-m17', dmThreadId: 'dm-maya', fromFriend: false, body:"Heard it, all good. Let's pick this back up Tuesday night on the Posto." },
  { id: 'dm-maya-m18', dmThreadId: 'dm-maya', fromFriend: true, body:"Locked in then, Tuesday at Posto 9. 18:00?" },

  // =====================================================================
  // dm-yael — bar invite (ends on friend message → unread)
  // =====================================================================
  { id: 'dm-yael-m01', dmThreadId: 'dm-yael', fromFriend: false, body:"How's Botafogo going?" },
  { id: 'dm-yael-m02', dmThreadId: 'dm-yael', fromFriend: true, body:"Sitting on the balcony, eyes on the sea. My boyfriend's dad is here, very funny guy." },
  { id: 'dm-yael-m03', dmThreadId: 'dm-yael', fromFriend: false, body:"Up for a beer tonight?" },
  { id: 'dm-yael-m04', dmThreadId: 'dm-yael', fromFriend: true, body:"Always. I'm home from 20." },
  { id: 'dm-yael-m05', dmThreadId: 'dm-yael', fromFriend: false, body:"Cool. Should I bring food?" },
  { id: 'dm-yael-m06', dmThreadId: 'dm-yael', fromFriend: true, body:"I've got bread and cheese. Bring wine if you can." },
  { id: 'dm-yael-m07', dmThreadId: 'dm-yael', fromFriend: false, body:"I can. Red or white?" },
  { id: 'dm-yael-m08', dmThreadId: 'dm-yael', fromFriend: true, body:"Red always" },
  { id: 'dm-yael-m09', dmThreadId: 'dm-yael', fromFriend: false, body:"By the way are you going to the Lapa bloco Friday?" },
  { id: 'dm-yael-m10', dmThreadId: 'dm-yael', fromFriend: true, body:"I posted about it. My post? Going to be insane." },
  { id: 'dm-yael-m11', dmThreadId: 'dm-yael', fromFriend: false, body:"Saw it. You recommend?" },
  { id: 'dm-yael-m12', dmThreadId: 'dm-yael', fromFriend: true, body:"Come. Maya is also coming, we'll roll as a group." },
  { id: 'dm-yael-m13', dmThreadId: 'dm-yael', fromFriend: false, body:"Done. As long as it's not raining." },
  { id: 'dm-yael-m14', dmThreadId: 'dm-yael', fromFriend: true, body:" you say that every conversation. Brazil isn't Tel Aviv." },
  { id: 'dm-yael-m15', dmThreadId: 'dm-yael', fromFriend: false, body:"Sounds good. See you at 20:30?" },
  { id: 'dm-yael-m16', dmThreadId: 'dm-yael', fromFriend: true, body:"20:00 is better, dad goes to bed early." },
  { id: 'dm-yael-m17', dmThreadId: 'dm-yael', fromFriend: false, body:"OK 20:00. Address?" },
  { id: 'dm-yael-m18', dmThreadId: 'dm-yael', fromFriend: true, body:"Rua General Polidoro 38, 4th floor. Code 1834." },
  { id: 'dm-yael-m19', dmThreadId: 'dm-yael', fromFriend: true, body: 'Come over for a beer tonight? Door is open.' },

  // =====================================================================
  // dm-roi — Búzios logistics (ends on self → no unread)
  // =====================================================================
  { id: 'dm-roi-m01', dmThreadId: 'dm-roi', fromFriend: false, body:"When are you heading to Búzios?" },
  { id: 'dm-roi-m02', dmThreadId: 'dm-roi', fromFriend: true, body:"29th in the morning, 8:00 bus from Novo Rio." },
  { id: 'dm-roi-m03', dmThreadId: 'dm-roi', fromFriend: false, body:"I'm on the 9:00 bus. Meet there?" },
  { id: 'dm-roi-m04', dmThreadId: 'dm-roi', fromFriend: true, body:"Cool. Book 1001 Viação, don't take a sketchy transfer." },
  { id: 'dm-roi-m05', dmThreadId: 'dm-roi', fromFriend: false, body:"Already booked. R$ 89 one way." },
  { id: 'dm-roi-m06', dmThreadId: 'dm-roi', fromFriend: true, body:"All good. Where are you staying?" },
  { id: 'dm-roi-m07', dmThreadId: 'dm-roi', fromFriend: false, body:"Manguinhos hostel. You?" },
  { id: 'dm-roi-m08', dmThreadId: 'dm-roi', fromFriend: true, body:"Azeda. 30 min walk away but cheaper." },
  { id: 'dm-roi-m09', dmThreadId: 'dm-roi', fromFriend: true, body: '[Photo · Azeda beach early morning]' },
  { id: 'dm-roi-m10', dmThreadId: 'dm-roi', fromFriend: false, body:"Wow  saw on the forum there's morning snorkeling, you in?" },
  { id: 'dm-roi-m11', dmThreadId: 'dm-roi', fromFriend: true, body:"Yeah that was my post  I'll bring two pairs of goggles." },
  { id: 'dm-roi-m12', dmThreadId: 'dm-roi', fromFriend: false, body:"Legendary. Maya also said she'll come for the day, did you start a group?" },
  { id: 'dm-roi-m13', dmThreadId: 'dm-roi', fromFriend: true, body:"There is — chat-buzios-weekend in the app." },
  { id: 'dm-roi-m14', dmThreadId: 'dm-roi', fromFriend: false, body:"Joined. What about dinner one of the nights?" },
  { id: 'dm-roi-m15', dmThreadId: 'dm-roi', fromFriend: true, body:"Chez Michou. The classic. We'll lock a time in the group." },
  { id: 'dm-roi-m16', dmThreadId: 'dm-roi', fromFriend: false, body:"Done." },
  { id: 'dm-roi-m17', dmThreadId: 'dm-roi', fromFriend: true, body:"Sent you the hostel coordinates in Búzios." },
  { id: 'dm-roi-m18', dmThreadId: 'dm-roi', fromFriend: false, body: 'Got it. Thanks Roi.' },

  // =====================================================================
  // dm-shir — restaurant booking (ends on friend → unread, count=2)
  // =====================================================================
  { id: 'dm-shir-m01', dmThreadId: 'dm-shir', fromFriend: false, body:"Shir, I'm arriving in SP on Nov 3." },
  { id: 'dm-shir-m02', dmThreadId: 'dm-shir', fromFriend: true, body:"Amazing! Where are you staying, Vila?" },
  { id: 'dm-shir-m03', dmThreadId: 'dm-shir', fromFriend: false, body:"Yeah, hostel in Vila Madalena." },
  { id: 'dm-shir-m04', dmThreadId: 'dm-shir', fromFriend: true, body:"Which hostel? There are a few good ones." },
  { id: 'dm-shir-m05', dmThreadId: 'dm-shir', fromFriend: false, body:"O de Casa, R$ 120 a night, good reviews." },
  { id: 'dm-shir-m06', dmThreadId: 'dm-shir', fromFriend: true, body:"I know it. It's 4 minutes from my apartment" },
  { id: 'dm-shir-m07', dmThreadId: 'dm-shir', fromFriend: false, body:"Legendary. What's your plan for the weekend?" },
  { id: 'dm-shir-m08', dmThreadId: 'dm-shir', fromFriend: true, body:"I'm booking La Cabrera for Thursday 21:00. Want in?" },
  { id: 'dm-shir-m09', dmThreadId: 'dm-shir', fromFriend: false, body:"Definitely. Who else is coming?" },
  { id: 'dm-shir-m10', dmThreadId: 'dm-shir', fromFriend: true, body:"Yael said she's joining, Yotam maybe." },
  { id: 'dm-shir-m11', dmThreadId: 'dm-shir', fromFriend: false, body:"Perfect. Should we reserve?" },
  { id: 'dm-shir-m12', dmThreadId: 'dm-shir', fromFriend: true, body:"On Thursday yes. Without a reservation it's an hour-long line." },
  { id: 'dm-shir-m13', dmThreadId: 'dm-shir', fromFriend: false, body:"Done. What about the night before — any food idea?" },
  { id: 'dm-shir-m14', dmThreadId: 'dm-shir', fromFriend: true, body:"A Casa do Porco on the same street. Totally different, top notch." },
  { id: 'dm-shir-m15', dmThreadId: 'dm-shir', fromFriend: false, body:"Sounds good. Should I book myself or through you?" },
  { id: 'dm-shir-m16', dmThreadId: 'dm-shir', fromFriend: true, body:"Through me. I'm organizing everything" },
  { id: 'dm-shir-m17', dmThreadId: 'dm-shir', fromFriend: false, body:"Thanks. Confirmation?" },
  { id: 'dm-shir-m18', dmThreadId: 'dm-shir', fromFriend: true, body:"Confirmed for La Cabrera Thursday 21:00 for 3. If Yotam joins I'll update." },
  { id: 'dm-shir-m19', dmThreadId: 'dm-shir', fromFriend: true, body:"Confirm you're arriving the 3rd and I'll book the restaurant." },

  // =====================================================================
  // dm-yotam — kite booking (ends on self → no unread)
  // =====================================================================
  { id: 'dm-yotam-m01', dmThreadId: 'dm-yotam', fromFriend: false, body:"Yotam, did you book the 3 days at Pure Kite?" },
  { id: 'dm-yotam-m02', dmThreadId: 'dm-yotam', fromFriend: true, body:"Yeah, 11–13. Sent it to Yaakov." },
  { id: 'dm-yotam-m03', dmThreadId: 'dm-yotam', fromFriend: false, body:"Thanks bro. Update me when you get confirmation." },
  { id: 'dm-yotam-m04', dmThreadId: 'dm-yotam', fromFriend: true, body:"Yaakov confirmed. R$ 1,800 for the package, R$ 500 deposit." },
  { id: 'dm-yotam-m05', dmThreadId: 'dm-yotam', fromFriend: false, body:"How do we pay?" },
  { id: 'dm-yotam-m06', dmThreadId: 'dm-yotam', fromFriend: true, body:"PIX. I'll send you the code." },
  { id: 'dm-yotam-m07', dmThreadId: 'dm-yotam', fromFriend: false, body:"Cool. What about gear? Need to bring anything?" },
  { id: 'dm-yotam-m08', dmThreadId: 'dm-yotam', fromFriend: true, body:"They have everything. Just bring SPF 50 sunblock and a hat." },
  { id: 'dm-yotam-m09', dmThreadId: 'dm-yotam', fromFriend: false, body:"Got those. What about accommodation?" },
  { id: 'dm-yotam-m10', dmThreadId: 'dm-yotam', fromFriend: true, body:"I'm at Pousada Arca de Jeri. R$ 180 a night for a double. Want to split?" },
  { id: 'dm-yotam-m11', dmThreadId: 'dm-yotam', fromFriend: false, body:"Down. R$ 90 a head is great. Roi is also joining for 3 nights." },
  { id: 'dm-yotam-m12', dmThreadId: 'dm-yotam', fromFriend: true, body:"They have a triple, I'll check availability." },
  { id: 'dm-yotam-m13', dmThreadId: 'dm-yotam', fromFriend: true, body: '[Voice note · 0:18]' },
  { id: 'dm-yotam-m14', dmThreadId: 'dm-yotam', fromFriend: false, body:"Heard it. Sounds like there's space, legendary." },
  { id: 'dm-yotam-m15', dmThreadId: 'dm-yotam', fromFriend: true, body:"Confirmed, locked in. I'll bring arak shots for the beach." },
  { id: 'dm-yotam-m16', dmThreadId: 'dm-yotam', fromFriend: false, body:"Perfect. BTW there's no Chabad there right?" },
  { id: 'dm-yotam-m17', dmThreadId: 'dm-yotam', fromFriend: true, body:"None. But Roi is bringing wine, if you bring challot we'll do Shabbat on the beach." },
  { id: 'dm-yotam-m18', dmThreadId: 'dm-yotam', fromFriend: false, body:"Down  I'll bring challot from my aunt's place in Fortaleza. See you on the 11th." },

  // =====================================================================
  // dm-moshe — Buenos Aires apartment (ends on friend → unread)
  // =====================================================================
  { id: 'dm-moshe-m01', dmThreadId: 'dm-moshe', fromFriend: false, body:"Moshe, I'm in for the rooftop asado on Friday. Address?" },
  { id: 'dm-moshe-m02', dmThreadId: 'dm-moshe', fromFriend: true, body:"Perfect. Sending address in a minute." },
  { id: 'dm-moshe-m03', dmThreadId: 'dm-moshe', fromFriend: false, body:"Great. Need anything beforehand?" },
  { id: 'dm-moshe-m04', dmThreadId: 'dm-moshe', fromFriend: true, body:"Good malbec from Vinos Diego, and bread from Salvaje." },
  { id: 'dm-moshe-m05', dmThreadId: 'dm-moshe', fromFriend: false, body:"Done. See you at 20." },
  { id: 'dm-moshe-m06', dmThreadId: 'dm-moshe', fromFriend: true, body:"BTW — coming straight from Ezeiza? I have a couch at my place if you need it." },
  { id: 'dm-moshe-m07', dmThreadId: 'dm-moshe', fromFriend: false, body:"I have a hostel in Palermo, all good. But thanks." },
  { id: 'dm-moshe-m08', dmThreadId: 'dm-moshe', fromFriend: true, body:"Which hostel?" },
  { id: 'dm-moshe-m09', dmThreadId: 'dm-moshe', fromFriend: false, body:"America del Sur, on Honduras. AR$ 14,000 a night." },
  { id: 'dm-moshe-m10', dmThreadId: 'dm-moshe', fromFriend: true, body:"I know it. 3 minutes from me. Easy." },
  { id: 'dm-moshe-m11', dmThreadId: 'dm-moshe', fromFriend: false, body:"Legendary. How many people will be there Friday?" },
  { id: 'dm-moshe-m12', dmThreadId: 'dm-moshe', fromFriend: true, body:"Max 10. Mostly Israelis passing through. Chill vibe." },
  { id: 'dm-moshe-m13', dmThreadId: 'dm-moshe', fromFriend: false, body:"Sounds good. BTW the Brazil visa — did you do that through the embassy here?" },
  { id: 'dm-moshe-m14', dmThreadId: 'dm-moshe', fromFriend: true, body:"Yeah. Two weeks, open queue in the morning. If you want I'll come with you, I know the drill." },
  { id: 'dm-moshe-m15', dmThreadId: 'dm-moshe', fromFriend: false, body:"Down. Let's talk after the asado." },
  { id: 'dm-moshe-m16', dmThreadId: 'dm-moshe', fromFriend: true, body:"All good" },
  { id: 'dm-moshe-m17', dmThreadId: 'dm-moshe', fromFriend: true, body: '[Photo · the rooftop last night]' },
  { id: 'dm-moshe-m18', dmThreadId: 'dm-moshe', fromFriend: false, body: 'Damn. The view is sick.' },
  { id: 'dm-moshe-m19', dmThreadId: 'dm-moshe', fromFriend: true, body: 'Address: Honduras 5450. Entry code 4837.' },
];
