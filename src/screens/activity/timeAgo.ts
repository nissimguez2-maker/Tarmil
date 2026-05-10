/**
 * Hebrew "time ago" formatter for thread / reply createdAt timestamps.
 * Coarse buckets — feed cards never need second precision.
 */
export function timeAgoHe(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  const diffMs = now.getTime() - then;
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return 'כרגע';
  if (minutes < 60) return `לפני ${minutes} ${minutes === 1 ? 'דקה' : 'דקות'}`;
  const hours = Math.round(diffMs / 3_600_000);
  if (hours < 24) return `לפני ${hours} ${hours === 1 ? 'שעה' : 'שעות'}`;
  const days = Math.round(diffMs / 86_400_000);
  if (days === 1) return 'אתמול';
  if (days < 7) return `לפני ${days} ימים`;
  const weeks = Math.round(days / 7);
  if (weeks === 1) return 'לפני שבוע';
  if (weeks < 4) return `לפני ${weeks} שבועות`;
  const months = Math.round(days / 30);
  if (months === 1) return 'לפני חודש';
  return `לפני ${months} חודשים`;
}
