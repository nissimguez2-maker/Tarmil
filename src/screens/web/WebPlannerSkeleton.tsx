export function WebPlannerSkeleton() {
  return (
    <div className="hidden lg:flex h-dvh flex-col bg-ivory">
      <header className="h-14 shrink-0 bg-ivory border-b border-cocoa-15 flex items-center px-md gap-md">
        <span className="font-serif text-lede text-cocoa">Tarmil</span>
        <div className="flex-1 flex flex-col items-center gap-xs">
          <div className="h-2 w-20 rounded-full bg-cocoa-8 animate-pulse" />
          <div className="h-3 w-48 rounded-full bg-sand animate-pulse" />
        </div>
        <div className="flex items-center gap-md">
          <div className="h-3 w-12 rounded-full bg-sand animate-pulse" />
          <div className="h-3 w-16 rounded-full bg-sand animate-pulse" />
          <div className="h-8 w-8 rounded-full bg-sand animate-pulse" />
        </div>
      </header>
      <div className="flex-1 flex min-h-0">
        <aside className="w-96 shrink-0 border-e border-cocoa-15 bg-ivory p-md flex flex-col gap-md">
          <div className="h-36 rounded-2xl bg-sand animate-pulse" />
          <div className="h-3 w-20 rounded-full bg-cocoa-8 animate-pulse" />
          <div className="flex flex-col gap-md">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-sm">
                <div className="h-8 w-8 rounded-full bg-rope animate-pulse shrink-0" />
                <div className="flex-1 flex flex-col gap-xs">
                  <div className="h-3 w-32 rounded-full bg-sand animate-pulse" />
                  <div className="h-2 w-24 rounded-full bg-sand animate-pulse" />
                  <div className="h-2 w-40 rounded-full bg-sand animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </aside>
        <div className="flex-1 bg-gradient-to-br from-rope to-sand animate-pulse" />
      </div>
    </div>
  );
}
