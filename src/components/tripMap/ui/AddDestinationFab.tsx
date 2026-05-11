import { Plus } from 'lucide-react';
import { Fab } from '../../shared/Fab';

type Props = {
  onClick: () => void;
};

/**
 * "הוסף יעד" — primary CTA on the trip map. Extended FAB so first-time users
 * know what the + does. Anchors to the map container's bottom-end (not the
 * Screen's), so it sits flush above the persistent <TabBar>.
 */
export function AddDestinationFab({ onClick }: Props) {
  return (
    <Fab
      ariaLabel="הוסף יעד"
      extended
      liftAboveTabBar={false}
      icon={<Plus className="h-5 w-5" strokeWidth={2.4} />}
      onClick={onClick}
    />
  );
}
