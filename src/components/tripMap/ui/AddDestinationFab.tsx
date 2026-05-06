import { Plus } from 'lucide-react';

type Props = {
  onClick: () => void;
};

/**
 * Floating "הוסף יעד" action — opens the destination search sheet (state #3).
 * Sits in the bottom-end corner over the travel-moment card. Hidden when any
 * sheet is open or the map is in pick mode.
 */
export function AddDestinationFab({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="הוסף יעד"
      className="absolute bottom-md end-md z-[800] inline-flex h-14 items-center gap-2 rounded-full bg-copper px-md text-ivory active:bg-copper-85"
      style={{ boxShadow: '0 6px 20px -6px rgba(199, 93, 36, 0.50)' }}
    >
      <Plus className="h-5 w-5" aria-hidden strokeWidth={2.5} />
      <span className="text-[11pt] font-medium">הוסף יעד</span>
    </button>
  );
}
