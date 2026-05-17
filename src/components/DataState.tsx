import { Screen } from './Screen';

// DA Open: loading / empty / error states are unspeced. These are minimal
// placeholders — replace once the brand pass defines the vocabulary.

export function LoadingPanel() {
  return (
    <Screen>
      <div className="flex h-full items-center justify-center p-md">
        <span className="text-body text-cocoa-55">Loading…</span>
      </div>
    </Screen>
  );
}

export function ErrorPanel({ error }: { error: Error | null }) {
  return (
    <Screen>
      <div className="flex h-full flex-col items-center justify-center gap-md p-md">
        <p className="font-serif text-lede text-cocoa">We couldn't connect.</p>
        {error?.message && (
          <p className="max-w-body text-small text-cocoa-55">
            {error.message}
          </p>
        )}
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="meta-caps rounded-full px-md py-2 text-copper transition-colors duration-instant ease-out-quart hover:text-copper-85 active:text-copper-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        >
          Try again
        </button>
      </div>
    </Screen>
  );
}
