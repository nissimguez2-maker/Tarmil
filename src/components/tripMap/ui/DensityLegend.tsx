/**
 * Caption strip shown along the bottom of the trip map when density mode is on.
 * Explains the green→red gradient so a first-time viewer knows what they're
 * looking at without trial and error.
 */
export function DensityLegend() {
  return (
    <div className="pointer-events-none absolute inset-x-md bottom-md z-[750] flex flex-col gap-xs">
      <div className="pointer-events-auto flex items-center gap-sm rounded-full border border-cocoa-15 bg-ivory/95 px-md py-sm shadow-device backdrop-blur-sm">
        <span className="meta-caps shrink-0 text-copper">צפיפות תרמילים</span>
        <span
          className="h-2 flex-1 rounded-full"
          style={{
            background:
              'linear-gradient(to left, #1d7a3e 0%, #d6b423 50%, #c44321 100%)',
          }}
          aria-hidden
        />
      </div>
      <p className="pointer-events-none mx-auto text-small text-cocoa-70">
        ירוק · אזורים שקטים &nbsp;·&nbsp; אדום · תרמילים בכמות
      </p>
    </div>
  );
}
