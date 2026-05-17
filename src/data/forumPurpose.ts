/**
 * Forum-thread purpose tag: Question / Tip / Warning. Encoded as a body
 * prefix so we don't need a schema migration for the demo: a thread
 * posted with purpose "question" has body `[QUESTION] …` in the DB.
 *
 * Display helpers strip the prefix from rendered bodies and surface the
 * tag as a separate pill. Threads predating this feature have no prefix
 * and render as untagged (no pill, no styling change).
 */

export type ForumPurpose = 'question' | 'tip' | 'warning';

export const PURPOSE_LABEL: Record<ForumPurpose, string> = {
  question: 'Question',
  tip: 'Tip',
  warning: 'Warning',
};

/** Pill colour vocabulary — pulled from the brand token set. */
export const PURPOSE_TONE: Record<ForumPurpose, string> = {
  question: 'bg-cocoa-08 text-cocoa',
  tip: 'bg-copper text-ivory',
  warning: 'bg-cocoa text-ivory',
};

const PREFIX_TO_PURPOSE: Record<string, ForumPurpose> = {
  '[QUESTION]': 'question',
  '[TIP]': 'tip',
  '[WARNING]': 'warning',
};

export function encodePurposeBody(purpose: ForumPurpose, body: string): string {
  return `[${purpose.toUpperCase()}] ${body.trim()}`;
}

export function parsePurposeFromBody(body: string): {
  purpose: ForumPurpose | null;
  cleaned: string;
} {
  for (const [prefix, purpose] of Object.entries(PREFIX_TO_PURPOSE)) {
    if (body.startsWith(prefix)) {
      return { purpose, cleaned: body.slice(prefix.length).trim() };
    }
  }
  return { purpose: null, cleaned: body };
}
