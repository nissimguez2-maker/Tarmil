const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** "Nov 22–25" if same month, otherwise "Oct 28 — Nov 4". */
export function formatDateRange(fromIso: string, toIso: string): string {
  const from = new Date(fromIso + 'T00:00:00Z');
  const to = new Date(toIso + 'T00:00:00Z');
  const fromDay = from.getUTCDate();
  const toDay = to.getUTCDate();
  const fromMonth = MONTHS[from.getUTCMonth()];
  const toMonth = MONTHS[to.getUTCMonth()];
  if (
    fromMonth === toMonth &&
    from.getUTCFullYear() === to.getUTCFullYear()
  ) {
    return `${fromMonth} ${fromDay}–${toDay}`;
  }
  return `${fromMonth} ${fromDay} — ${toMonth} ${toDay}`;
}

/** "Nov 4" — single-date chip label. */
export function formatDateChip(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z');
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}
