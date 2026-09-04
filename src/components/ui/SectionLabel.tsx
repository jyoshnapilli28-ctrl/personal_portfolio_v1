interface SectionLabelProps {
  number: string;
  title: string;
}

export default function SectionLabel({ number, title }: SectionLabelProps) {
  return (
    <div className="font-labels text-text-muted text-xs tracking-[0.15em] uppercase mb-8 flex items-center gap-3">
      <span className="text-accent">{number}</span>
      <span className="w-8 h-[1px] bg-border-cin inline-block" />
      <span>{title}</span>
    </div>
  );
}
