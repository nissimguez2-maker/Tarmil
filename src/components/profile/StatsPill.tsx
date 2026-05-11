type Props = {
  label: string;
  value: string | number;
};

/**
 * Small stat chip used in the Profile header row.
 * Sand fill, cocoa text, body size, rounded-full.
 */
export function StatsPill({ label, value }: Props) {
  return (
    <div className="inline-flex items-baseline gap-1 rounded-full bg-sand ps-md pe-md py-1">
      <span className="font-serif text-lede italic leading-none text-cocoa tabular-nums">
        {value}
      </span>
      <span className="text-small leading-none text-cocoa-70">{label}</span>
    </div>
  );
}
