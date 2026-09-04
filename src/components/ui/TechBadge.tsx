interface TechBadgeProps {
  name: string;
  icon?: string;
}

export default function TechBadge({ name, icon }: TechBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-soft border border-border-cin font-labels text-[11px] text-text-muted hover:border-accent hover:text-accent transition-all duration-300 select-none">
      {icon && (
        <img
          src={`/assets/icons/${icon}`}
          alt=""
          className="w-3.5 h-3.5 object-contain"
          aria-hidden="true"
        />
      )}
      <span>{name}</span>
    </span>
  );
}
