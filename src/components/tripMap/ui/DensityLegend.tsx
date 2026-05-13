/**
 * Caption shown along the bottom of the trip map when density mode is on.
 * Floats above the tab capsule with a clean horizontal gradient bar matching
 * the 13-stop green→red heat scale.
 */
export function DensityLegend() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[88px] z-[750] flex justify-center px-md">
      <div className="pointer-events-auto flex max-w-[300px] flex-col items-center gap-1.5 rounded-full bg-ivory/95 px-md py-2 shadow-card backdrop-blur">
        <div className="flex w-full items-center gap-sm">
          <span className="meta-caps shrink-0 text-cocoa-55">שקט</span>
          <span
            className="h-1.5 flex-1 rounded-full"
            style={{
              background:
                'linear-gradient(to left, #0d6e2e 0%, #5fa53e 18%, #b8c734 35%, #d6c92e 50%, #dfa01f 65%, #d36316 80%, #8e2018 100%)',
            }}
            aria-hidden
          />
          <span className="meta-caps shrink-0 text-cocoa">צפוף</span>
        </div>
        <span className="text-meta normal-case tracking-normal text-cocoa-55">
          צפיפות תרמילים גלובלית
        </span>
      </div>
    </div>
  );
}
