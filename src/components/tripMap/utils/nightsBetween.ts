/** Whole nights between two ISO yyyy-mm-dd dates. */
export function nightsBetween(fromIso: string, toIso: string): number {
  const from = Date.parse(fromIso + 'T00:00:00Z');
  const to = Date.parse(toIso + 'T00:00:00Z');
  return Math.round((to - from) / 86_400_000);
}
