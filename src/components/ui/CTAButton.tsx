import React from 'react';

interface CTAButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  target?: string;
  className?: string;
}

export default function CTAButton({
  variant,
  children,
  href = '#',
  icon,
  onClick,
  target,
  className = '',
}: CTAButtonProps) {
  const baseStyles =
    'relative group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-labels text-xs tracking-wider uppercase transition-all duration-300 overflow-hidden';

  const variantStyles =
    variant === 'primary'
      ? 'bg-accent text-bg-primary font-semibold shadow-[0_0_20px_rgba(217,168,91,0.25)] hover:bg-accent-light hover:shadow-[0_0_30px_rgba(217,168,91,0.45)] hover:scale-[1.02] active:scale-[0.98]'
      : 'border border-border-cin text-text-ivory bg-bg-soft/40 backdrop-blur-sm hover:border-accent hover:text-accent hover:bg-bg-soft/80 hover:scale-[1.02] active:scale-[0.98]';

  return (
    <a
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {icon && (
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            {icon}
          </span>
        )}
      </span>
    </a>
  );
}
