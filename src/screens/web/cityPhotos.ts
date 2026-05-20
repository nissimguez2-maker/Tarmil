function unsplash(id: string, w: number): string {
  return `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
}

export const CITY_PHOTOS: Record<string, string[]> = {
  buzios: [
    unsplash('1508272319511-badf90d1cf27', 600),
    unsplash('1461598198498-686a2c168484', 600),
    unsplash('1508272961731-dc692d634a79', 600),
  ],
  'sao-paulo': [
    unsplash('1551736947-ca1f44a894e2', 600),
    unsplash('1579996887346-e2990cd8e033', 600),
    unsplash('1561592390-42c07289e9cb', 600),
  ],
  jericoacoara: [
    unsplash('1641517827875-2bb2f73339d4', 600),
    unsplash('1661692612848-37801f680815', 600),
    unsplash('1636651746051-d8dfe189d618', 600),
  ],
  'buenos-aires': [
    unsplash('1616959313137-186688889054', 600),
    unsplash('1537157377554-6ca66509503a', 600),
    unsplash('1525121970541-215e0e301bc2', 600),
  ],
  'punta-del-este': [
    unsplash('1764066531610-5457f1bc5419', 600),
    unsplash('1653918488348-17d2a707012f', 600),
    unsplash('1653898968886-a14171069047', 600),
  ],
};

export function cityPhotos(stopId: string): string[] {
  return CITY_PHOTOS[stopId] ?? [];
}
