import React, { useState } from 'react';
import { profile } from '../../data/profile';
import NeonBorder from '../animations/NeonBorder';

export default function ProfileCard3D() {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotX = ((y / rect.height) - 0.5) * -16;
    const rotY = ((x / rect.width) - 0.5) * 16;

    setRotate({ x: rotX, y: rotY });
    setShinePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setShinePos({ x: 50, y: 50 });
  };

  return (
    <div
      className="relative select-none w-full max-w-[400px]"
      style={{ perspective: '1200px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated Traveling Champagne Light Border */}
      <NeonBorder
        color="#D9A85B"
        rounded={24}
        thickness={3}
        borderSize={45}
        glow={65}
        speed={14}
      />

      {/* Physical Identity Card Body */}
      <div
        className="relative rounded-3xl p-7 transition-transform duration-200 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateZ(10px)`,
          background: 'linear-gradient(145deg, #1B1712, #12100D)',
          border: '1px solid rgba(58, 51, 43, 0.85)',
          boxShadow: isHovered
            ? `${-rotate.y * 2}px ${rotate.x * 2 + 15}px 35px rgba(0,0,0,0.8), 0 0 25px rgba(217,168,91,0.08)`
            : '0 15px 35px rgba(0,0,0,0.6)',
        }}
      >
        {/* Dynamic Light Reflection / Shine */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.8 : 0.25,
            background: `radial-gradient(circle at ${shinePos.x}% ${shinePos.y}%, rgba(217, 168, 91, 0.18) 0%, transparent 60%)`,
          }}
        />

        {/* Card Header: Project Series & Availability status */}
        <div className="flex items-center justify-between border-b border-border-cin/80 pb-4 mb-6">
          <span className="font-labels text-[10px] tracking-[0.2em] text-text-muted uppercase">
            PORTFOLIO / 2026
          </span>
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full bg-accent"
              style={{
                boxShadow: '0 0 10px rgba(217, 168, 91, 0.8)',
              }}
            />
            <span className="font-labels text-[9px] tracking-wider text-accent uppercase font-medium">
              AVAILABLE FOR INTERNSHIPS
            </span>
          </div>
        </div>

        {/* Card Profile Section: Monogram in lieu of portrait */}
        <div className="flex flex-col items-center text-center py-4 mb-5">
          <div className="w-24 h-24 rounded-2xl bg-bg-soft border border-border-light flex items-center justify-center mb-4 shadow-[inset_0_0_20px_rgba(217,168,91,0.1)]">
            <span className="font-headings text-4xl font-extrabold text-text-ivory tracking-tighter">
              JP<span className="text-accent">.</span>
            </span>
          </div>
          <h3 className="font-headings text-2xl font-bold text-text-ivory tracking-wide mb-1 uppercase">
            {profile.name}
          </h3>
          <p className="font-labels text-xs text-accent tracking-wider uppercase mb-3">
            {profile.title}
          </p>
          <p className="font-body text-xs text-text-warm leading-relaxed max-w-xs line-clamp-3">
            {profile.about}
          </p>
        </div>

        {/* Social Connection Pills */}
        <div className="flex items-center justify-center gap-3 py-3 border-t border-border-cin/60 mb-5">
          <a
            href={profile.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="p-2 rounded-xl bg-bg-soft/70 border border-border-cin text-text-muted hover:text-accent hover:border-accent transition-colors"
          >
            <img src="/assets/icons/linkedin.svg" alt="" className="w-4 h-4" aria-hidden="true" />
          </a>
          <a
            href={profile.social.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="p-2 rounded-xl bg-bg-soft/70 border border-border-cin text-text-muted hover:text-accent hover:border-accent transition-colors"
          >
            <img src="/assets/icons/github.svg" alt="" className="w-4 h-4" aria-hidden="true" />
          </a>
          <a
            href={`mailto:${profile.social.email}`}
            aria-label="Email Address"
            className="p-2 rounded-xl bg-bg-soft/70 border border-border-cin text-text-muted hover:text-accent hover:border-accent transition-colors"
          >
            <img src="/assets/icons/email.svg" alt="" className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>

        {/* Card Footer: Metadata serial stamps */}
        <div className="flex items-center justify-between text-[9px] font-labels text-text-muted pt-3 border-t border-border-cin/80">
          <span className="tracking-[0.18em]">DIGITAL IDENTITY</span>
          <span className="text-text-warm tracking-wider">JP — 01 / SRM-AP</span>
        </div>
      </div>
    </div>
  );
}
