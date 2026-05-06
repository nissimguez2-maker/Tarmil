import { Plus } from 'lucide-react';

type Props = {
  onClick: () => void;
};

/**
 * Floating "הוסף יעד" action — opens the destination search sheet (state #3).
 * Layout is owned by the parent; this component is just the button shape.
 */
export function AddDestinationFab({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="הוסף יעד"
      className="inline-flex h-12 items-center gap-2 rounded-full bg-copper px-md text-ivory active:bg-copper-85"
      style={{ boxShadow: '0 6px 20px -6px rgba(199, 93, 36, 0.50)' }}
    >
      <Plus className="h-5 w-5" aria-hidden strokeWidth={2.5} />
      <span className="text-body font-medium">הוסף יעד</span>
    </button>
  );
}
