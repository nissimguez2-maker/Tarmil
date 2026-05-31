import clsx from 'clsx';
import { Bus, Car, Plane, Ship, Train } from 'lucide-react';
import type { TransportOffer } from '../data/mockTransport';
import { resolveOperatorBrand } from '../data/operatorBrand';

type Props = {
  provider: string;
  mode: TransportOffer['mode'];
  size?: 'sm' | 'md' | 'lg';
};

/**
 * Renders an operator's brand wordmark (LATAM red, Copa blue, Lufthansa
 * yellow, …) on a cream tile when we have the slug registered in
 * `operatorBrand.ts`. Falls through to a tasteful generic mode glyph
 * (Plane / Bus / Ferry / Train / Car) on the same tile when we don't
 * — so unknown operators still read as polished booking rows.
 *
 * Stamped square chip rather than a free-standing wordmark: a Skyscanner
 * / Hopper / Polarsteps-style frame normalises visual weight across
 * logos with very different aspect ratios.
 */

const SIZES = {
  sm: { box: 'h-7 w-7', svg: 'h-4 w-4', icon: 14 },
  md: { box: 'h-9 w-9', svg: 'h-5 w-5', icon: 18 },
  lg: { box: 'h-11 w-11', svg: 'h-6 w-6', icon: 22 },
} as const;

function modeIcon(mode: TransportOffer['mode']) {
  if (mode === 'flight') return Plane;
  if (mode === 'train') return Train;
  if (mode === 'bus') return Bus;
  if (mode === 'ferry') return Ship;
  return Car;
}

export function OperatorMark({ provider, mode, size = 'md' }: Props) {
  const brand = resolveOperatorBrand(provider);
  const { box, svg, icon } = SIZES[size];

  if (brand) {
    return (
      <span
        className={clsx(
          'shrink-0 inline-flex items-center justify-center rounded-xl bg-cream border border-charcoal-15',
          box,
        )}
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className={svg}
        >
          <title>{brand.title}</title>
          <path d={brand.path} fill={brand.hex} />
        </svg>
      </span>
    );
  }

  const Icon = modeIcon(mode);
  return (
    <span
      className={clsx(
        'shrink-0 inline-flex items-center justify-center rounded-xl bg-cream border border-charcoal-15 text-charcoal-70',
        box,
      )}
      aria-hidden
    >
      <Icon size={icon} strokeWidth={1.75} />
    </span>
  );
}
