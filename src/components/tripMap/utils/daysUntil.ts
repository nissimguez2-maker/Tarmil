/**
 * Whole days from today (local midnight) to an ISO yyyy-mm-dd target. Negative
 * if the target is in the past. UTC anchoring keeps DST drift out of the math.
 */
export function daysUntil(targetIso: string, now: Date = new Date()): number {
  const target = new Date(targetIso + 'T00:00:00Z').getTime();
  const today = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  return Math.round((target - today) / 86_400_000);
}
