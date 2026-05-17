-- v0.8c — Source hero images for the ten Plan-seeded places. The DA still
-- flags photography rule as an open brand item, so these are placeholders
-- pulled from Unsplash — same pattern the existing `biz-*` seed already
-- uses. Vibe-matched (beach, mountain, market, dunes) rather than
-- venue-accurate; treat as scaffolding until the brand pass curates a
-- real photo library.

update public.places set image_url = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80'
 where id = 'buzios-geriba-hostel' and image_url is null;

update public.places set image_url = 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80'
 where id = 'buzios-ferradura' and image_url is null;

update public.places set image_url = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'
 where id = 'o-de-casa-hostel' and image_url is null;

update public.places set image_url = 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80'
 where id = 'municipal-market' and image_url is null;

update public.places set image_url = 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80'
 where id = 'duna-por-do-sol' and image_url is null;

update public.places set image_url = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'
 where id = 'bariloche-cerro-catedral' and image_url is null;

update public.places set image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
 where id = 'bariloche-circuito-chico' and image_url is null;
