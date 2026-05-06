const HEBREW_MONTHS = [
  'בינואר',
  'בפברואר',
  'במרץ',
  'באפריל',
  'במאי',
  'ביוני',
  'ביולי',
  'באוגוסט',
  'בספטמבר',
  'באוקטובר',
  'בנובמבר',
  'בדצמבר',
];

/** "22–25 בנובמבר" if same month, otherwise "28 באוקטובר — 4 בנובמבר". */
export function formatDateRange(fromIso: string, toIso: string): string {
  const from = new Date(fromIso + 'T00:00:00Z');
  const to = new Date(toIso + 'T00:00:00Z');
  const fromDay = from.getUTCDate();
  const toDay = to.getUTCDate();
  const fromMonth = HEBREW_MONTHS[from.getUTCMonth()];
  const toMonth = HEBREW_MONTHS[to.getUTCMonth()];
  if (
    fromMonth === toMonth &&
    from.getUTCFullYear() === to.getUTCFullYear()
  ) {
    return `${fromDay}–${toDay} ${fromMonth}`;
  }
  return `${fromDay} ${fromMonth} — ${toDay} ${toMonth}`;
}

/** "4 בנובמבר" — single-date chip label. */
export function formatDateChip(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z');
  return `${d.getUTCDate()} ${HEBREW_MONTHS[d.getUTCMonth()]}`;
}
