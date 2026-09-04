import React, { useState, useEffect } from 'react';

export default function HeroVisual3D() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 28;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -28;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Cube dimensions: 240px wide cube (half is 120px)
  const size = 240;
  const half = size / 2;

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{
        width: '100%',
        maxWidth: '520px',
        height: '460px',
        perspective: '1200px',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Deep ambient glow layer */}
      <div
        className="absolute w-72 h-72 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(217, 168, 91, 0.16) 0%, rgba(217, 168, 91, 0.03) 50%, transparent 70%)',
          filter: 'blur(35px)',
        }}
      />

      {/* Orbital Ring 1 */}
      <div
        className="absolute w-[360px] h-[360px] rounded-full border border-border-cin/50 pointer-events-none"
        style={{
          transform: `rotateX(65deg) rotateZ(${tilt.x * 0.8}deg)`,
          transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_#D9A85B]" />
      </div>

      {/* Orbital Ring 2 */}
      <div
        className="absolute w-[420px] h-[420px] rounded-full border border-accent/20 pointer-events-none"
        style={{
          transform: `rotateY(60deg) rotateX(${tilt.y * 0.8}deg)`,
          transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      />

      {/* 3D Geometric Floating Core */}
      <div
        className="relative"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tilt.y + 15}deg) rotateY(${tilt.x + 25}deg)`,
          transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        <div
          className="w-full h-full animate-spin-slow"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Face: Front */}
          <div
            className="absolute inset-0 rounded-2xl border border-border-light/70 bg-bg-soft/75 backdrop-blur-md flex flex-col justify-between p-5"
            style={{
              transform: `translateZ(${half}px)`,
              backgroundImage:
                'radial-gradient(circle at 35% 35%, rgba(217, 168, 91, 0.2) 0%, transparent 65%)',
              boxShadow: 'inset 0 0 30px rgba(217, 168, 91, 0.08), 0 10px 40px rgba(0,0,0,0.6)',
            }}
          >
            <div className="flex justify-between items-center">
              <span className="font-labels text-[9px] text-accent tracking-[0.2em]">01 / QUANTUM</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            </div>
            <div className="text-center font-headings text-3xl font-extrabold text-text-ivory tracking-tighter">
              JP<span className="text-accent">.</span>
            </div>
            <div className="font-labels text-[8px] text-text-muted tracking-widest uppercase">
              SRM-AP · CSE
            </div>
          </div>

          {/* Face: Back */}
          <div
            className="absolute inset-0 rounded-2xl border border-border-cin/80 bg-bg-secondary/85 backdrop-blur-md flex flex-col justify-between p-5"
            style={{
              transform: `rotateY(180deg) translateZ(${half}px)`,
              backgroundImage:
                'radial-gradient(circle at 65% 65%, rgba(217, 168, 91, 0.15) 0%, transparent 65%)',
              boxShadow: 'inset 0 0 30px rgba(217, 168, 91, 0.06)',
            }}
          >
            <span className="font-labels text-[9px] text-text-muted tracking-[0.2em]">02 / SYSTEMS</span>
            <div className="font-labels text-xs text-text-warm/80 text-center tracking-wider">
              AI · RESEARCH
            </div>
            <span className="font-labels text-[8px] text-accent/80 text-right">2026</span>
          </div>

          {/* Face: Right */}
          <div
            className="absolute inset-0 rounded-2xl border border-border-light/60 bg-bg-soft/75 backdrop-blur-md flex flex-col justify-between p-5"
            style={{
              transform: `rotateY(90deg) translateZ(${half}px)`,
              backgroundImage:
                'radial-gradient(circle at 30% 70%, rgba(217, 168, 91, 0.18) 0%, transparent 60%)',
              boxShadow: 'inset 0 0 30px rgba(217, 168, 91, 0.08)',
            }}
          >
            <span className="font-labels text-[9px] text-accent tracking-wider">FRONTEND</span>
            <div className="font-headings text-xl text-text-ivory text-center">REACT + GSAP</div>
            <span className="font-labels text-[8px] text-text-muted">EXP. 03</span>
          </div>

          {/* Face: Left */}
          <div
            className="absolute inset-0 rounded-2xl border border-border-cin/80 bg-bg-secondary/85 backdrop-blur-md flex flex-col justify-between p-5"
            style={{
              transform: `rotateY(-90deg) translateZ(${half}px)`,
              backgroundImage:
                'radial-gradient(circle at 70% 30%, rgba(217, 168, 91, 0.15) 0%, transparent 60%)',
              boxShadow: 'inset 0 0 30px rgba(217, 168, 91, 0.06)',
            }}
          >
            <span className="font-labels text-[9px] text-text-muted tracking-wider">CLOUD</span>
            <div className="font-sections text-lg text-text-ivory text-center">AWS BUILDER</div>
            <span className="font-labels text-[8px] text-accent">ACTIVE</span>
          </div>

          {/* Face: Top */}
          <div
            className="absolute inset-0 rounded-2xl border border-border-light/50 bg-bg-soft/70 backdrop-blur-md flex items-center justify-center"
            style={{
              transform: `rotateX(90deg) translateZ(${half}px)`,
              backgroundImage:
                'radial-gradient(circle at 50% 50%, rgba(217, 168, 91, 0.25) 0%, transparent 60%)',
            }}
          >
            <div className="w-16 h-16 rounded-full border border-accent/40 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-accent/20" />
            </div>
          </div>

          {/* Face: Bottom */}
          <div
            className="absolute inset-0 rounded-2xl border border-border-cin/60 bg-bg-secondary/90 backdrop-blur-md flex items-center justify-center"
            style={{
              transform: `rotateX(-90deg) translateZ(${half}px)`,
            }}
          >
            <div className="font-labels text-[10px] text-text-muted tracking-[0.3em]">IMMERSIVE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
