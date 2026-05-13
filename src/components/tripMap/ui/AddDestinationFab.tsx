import { Plus } from 'lucide-react';
import { Fab } from '../../shared/Fab';

type Props = {
  onClick: () => void;
};

/**
 * "הוסף יעד" — primary CTA on the trip map. Extended FAB so first-time users
 * know what the + does. Lifts above the floating tab capsule.
 */
export function AddDestinationFab({ onClick }: Props) {
  return (
    <Fab
      ariaLabel="הוסף יעד"
      extended
      icon={<Plus className="h-5 w-5" strokeWidth={2.4} />}
      onClick={onClick}
    />
  );
}
