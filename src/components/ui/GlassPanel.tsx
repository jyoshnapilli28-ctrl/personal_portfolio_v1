import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
}

export default function GlassPanel({
  children,
  className = '',
  hover = true,
  style,
}: GlassPanelProps) {
  return (
    <div
      style={style}
      className={`glass-panel rounded-2xl p-6 transition-all duration-300 ${
        hover ? 'hover:border-border-light hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
