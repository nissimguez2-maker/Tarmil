/**
 * Default pre-trip checklist seed for the Checklist tool. Six sections,
 * ~5 items each. Item IDs are stable strings so toggling persistence in
 * localStorage survives schema additions (new items append, old ticks stay).
 */

export type ChecklistItem = {
  id: string;
  hebrewLabel: string;
};

export type ChecklistSection = {
  id: string;
  number: string;
  hebrewLabel: string;
  items: ChecklistItem[];
};

export const CHECKLIST_TEMPLATE: ChecklistSection[] = [
  {
    id: 'docs',
    number: '01',
    hebrewLabel: 'ויזה ותעודות',
    items: [
      { id: 'passport-valid', hebrewLabel: 'דרכון בתוקף לעוד 6 חודשים' },
      { id: 'visa-applied', hebrewLabel: 'הוצאתי ויזה ליעד הראשון' },
      { id: 'passport-copies', hebrewLabel: 'צילומי דרכון בתיק ובענן' },
      { id: 'driving-license', hebrewLabel: 'רישיון נהיגה בינלאומי' },
      { id: 'student-card', hebrewLabel: 'כרטיס סטודנט בינלאומי (ISIC)' },
    ],
  },
  {
    id: 'health',
    number: '02',
    hebrewLabel: 'חיסונים וביטוח',
    items: [
      { id: 'vaccines', hebrewLabel: 'חיסוני יעד (קדחת צהובה, קרישת דם)' },
      { id: 'insurance', hebrewLabel: 'ביטוח רפואי + ספורט אתגרי' },
      { id: 'prescriptions', hebrewLabel: 'מרשמים לתרופות קבועות' },
      { id: 'first-aid', hebrewLabel: 'עזרה ראשונה בסיסית' },
      { id: 'malaria', hebrewLabel: 'בדיקת מלריה לפי יעד' },
    ],
  },
  {
    id: 'money',
    number: '03',
    hebrewLabel: 'כסף וכרטיסים',
    items: [
      { id: 'cash-usd', hebrewLabel: 'מזומן USD לחלוקה במספר מקומות' },
      { id: 'credit-card', hebrewLabel: 'כרטיס אשראי ללא עמלות חו״ל' },
      { id: 'currency-app', hebrewLabel: 'אפליקציית מטבעות (Tarmil!)' },
      { id: 'emergency-card', hebrewLabel: 'כרטיס חירום מוסתר נפרד' },
      { id: 'notify-bank', hebrewLabel: 'יידוע הבנק על נסיעה לחו״ל' },
    ],
  },
  {
    id: 'tech',
    number: '04',
    hebrewLabel: 'אלקטרוניקה',
    items: [
      { id: 'chargers', hebrewLabel: 'מטענים — טלפון, סוללה, מצלמה' },
      { id: 'adapter', hebrewLabel: 'מתאם תקעים לאזור היעד' },
      { id: 'esim', hebrewLabel: 'eSIM פעיל ליעד' },
      { id: 'powerbank', hebrewLabel: 'סוללת גיבוי 10000mAh+' },
      { id: 'cloud-backup', hebrewLabel: 'גיבוי תמונות וקבצים בענן' },
    ],
  },
  {
    id: 'pack',
    number: '05',
    hebrewLabel: 'תיק וביגוד',
    items: [
      { id: 'rain-jacket', hebrewLabel: 'מעיל גשם דק' },
      { id: 'sandals', hebrewLabel: 'סנדלים סגורים לטיולים' },
      { id: 'dry-bag', hebrewLabel: 'תיק יבש לציוד אלקטרוני' },
      { id: 'lock', hebrewLabel: 'מנעול קטן להוסטלים' },
      { id: 'quick-towel', hebrewLabel: 'מגבת מהירת ייבוש' },
    ],
  },
  {
    id: 'emergency',
    number: '06',
    hebrewLabel: 'חירום וחזרה',
    items: [
      { id: 'embassy', hebrewLabel: 'פרטי שגרירות ישראל ביעד' },
      { id: 'return-ticket', hebrewLabel: 'כרטיס חזרה (גם אם פתוח)' },
      { id: 'emergency-fund', hebrewLabel: 'תקציב חירום נפרד 500$' },
      { id: 'parents-itinerary', hebrewLabel: 'מסלול ראשוני להורים' },
      { id: 'travel-warnings', hebrewLabel: 'בדיקת אזהרות מסע משרד החוץ' },
    ],
  },
];

export const TOTAL_ITEMS = CHECKLIST_TEMPLATE.reduce(
  (n, s) => n + s.items.length,
  0,
);
