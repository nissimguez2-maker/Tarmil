import { Link } from 'react-router-dom';
import { Smartphone, Monitor, ArrowRight } from 'lucide-react';

export function ModeToggleScreen() {
  return (
    <div className="h-dvh w-full bg-cream flex items-center justify-center p-xl">
      <div className="w-full max-w-3xl flex flex-col items-center gap-xl">
        <div className="text-center">
          <p className="meta-caps text-amber">Tarmil</p>
          <h1 className="font-serif text-display text-charcoal mt-sm">
            Choose your view
          </h1>
          <p className="font-sans text-body text-charcoal-70 mt-sm max-w-md mx-auto">
            The same trip, two ways to plan it.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md w-full">
          <ModeCard
            to="/trip"
            icon={<Smartphone size={28} strokeWidth={1.5} />}
            eyebrow="On your phone"
            title="Mobile App"
            description="The full Tarmil app — trip, social, forums, tools."
          />
          <ModeCard
            to="/web"
            icon={<Monitor size={28} strokeWidth={1.5} />}
            eyebrow="On desktop"
            title="Desktop Planner"
            description="Map, stops and transport options side by side."
          />
        </div>
      </div>
    </div>
  );
}

type ModeCardProps = {
  to: string;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
};

function ModeCard({ to, icon, eyebrow, title, description }: ModeCardProps) {
  return (
    <Link
      to={to}
      className="group bg-sand border border-charcoal-15 rounded-3xl p-xl flex flex-col gap-md hover:border-amber transition-[border-color,box-shadow] duration-instant ease-out-quart motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    >
      <div className="text-amber">{icon}</div>
      <div className="flex flex-col gap-xs">
        <p className="meta-caps text-charcoal-70">{eyebrow}</p>
        <h2 className="font-serif text-sub text-charcoal">{title}</h2>
        <p className="font-sans text-body text-charcoal-70">{description}</p>
      </div>
      <div className="mt-auto flex items-center gap-xs text-small text-amber group-hover:gap-sm transition-[gap] duration-instant ease-out-quart motion-reduce:transition-none">
        Open
        <ArrowRight size={14} strokeWidth={2} />
      </div>
    </Link>
  );
}
