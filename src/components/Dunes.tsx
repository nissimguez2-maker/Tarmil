import clsx from 'clsx';

type Props = {
  className?: string;
};

/**
 * Dunes — Tarmil's brand signature.
 *
 * Three layered Bézier curves, used at the foot of closing compositions and
 * as decorative full-bleed elements. Per DA v0.2:
 *   - back  : copper @ 22%, crest height 100%
 *   - mid   : rope    @ 70-85%, crest height 60%
 *   - front : cocoa   @ 75%, crest height 30%
 *
 * The seed parameters are fixed so the same dunes appear everywhere. Aspect
 * ratio adapts to the canvas; layered crest proportions stay constant.
 *
 * Hand-drawing forbidden (per DA). This is the single canonical generator.
 */
export function Dunes({ className }: Props) {
  return (
    <svg
      className={clsx('block h-full w-full', className)}
      viewBox="0 0 1000 200"
      preserveAspectRatio="none"
      aria-hidden
    >
      {/* back — copper @ 22%, tallest */}
      <path
        d="M 0 200 L 0 60
           C 120 30, 280 110, 420 70
           S 700 20, 860 50
           S 980 80, 1000 60
           L 1000 200 Z"
        fill="var(--copper)"
        opacity="0.22"
      />

      {/* mid — rope @ 78%, mid crest */}
      <path
        d="M 0 200 L 0 110
           C 140 80, 320 150, 480 120
           S 760 90, 900 110
           S 980 130, 1000 120
           L 1000 200 Z"
        fill="var(--rope)"
        opacity="0.78"
      />

      {/* front — cocoa @ 75%, lowest crest */}
      <path
        d="M 0 200 L 0 150
           C 120 130, 290 175, 450 155
           S 720 145, 880 160
           S 980 170, 1000 165
           L 1000 200 Z"
        fill="var(--cocoa)"
        opacity="0.75"
      />
    </svg>
  );
}
