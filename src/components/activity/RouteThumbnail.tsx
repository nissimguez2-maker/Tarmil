import clsx from 'clsx';

type Props = {
  /** Number of dots along the line (cities) — 3–5 looks best. */
  cities?: number;
  className?: string;
};

/**
 * Stylized 80px-tall route thumbnail. SVG-only: cocoa polyline through 3–5
 * copper dots over an ivory background with a faint cocoa-08 dotted texture.
 *
 * Used in Activity feed trip-declaration cards as a visual hint of "a trip
 * with cities" — not a real route. Cheap to render, never blocks on a tile
 * fetch.
 */
export function RouteThumbnail({ cities = 4, className }: Props) {
  const n = Math.max(2, Math.min(cities, 6));
  const padX = 12;
  const width = 320;
  const height = 80;
  const stepX = (width - padX * 2) / (n - 1);
  const points = Array.from({ length: n }, (_, i) => {
    const x = padX + stepX * i;
    // gentle sine-wave y so the line feels like a route, not a ruler
    const y = height / 2 + Math.sin(i * 1.3) * 14;
    return { x, y };
  });

  return (
    <div
      className={clsx(
        'relative h-20 w-full overflow-hidden rounded-md bg-ivory',
        className,
      )}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {/* sandy-dot texture */}
        <defs>
          <pattern
            id="route-dots"
            width="9"
            height="9"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="0.5" cy="0.5" r="0.55" fill="rgba(53,40,24,0.08)" />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#route-dots)" />
        {/* polyline */}
        <polyline
          points={points.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="var(--cocoa)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* city dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="var(--copper)" />
        ))}
      </svg>
    </div>
  );
}
