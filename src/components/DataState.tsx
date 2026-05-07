import { Screen } from './Screen';

// DA Open: loading / empty / error states are unspeced. These are minimal
// placeholders — replace once the brand pass defines the vocabulary.

export function LoadingPanel() {
  return (
    <Screen>
      <div className="flex h-full items-center justify-center p-md">
        <span className="text-body text-cocoa-55">טוען…</span>
      </div>
    </Screen>
  );
}

export function ErrorPanel({ error }: { error: Error | null }) {
  return (
    <Screen>
      <div className="flex h-full flex-col items-center justify-center gap-md p-md">
        <p className="font-serif text-lede text-cocoa">לא הצלחנו להתחבר.</p>
        {error?.message && (
          <p className="max-w-body text-[10pt] text-cocoa-55">
            {error.message}
          </p>
        )}
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="meta-caps text-copper active:text-copper-70"
        >
          נסה שוב
        </button>
      </div>
    </Screen>
  );
}
