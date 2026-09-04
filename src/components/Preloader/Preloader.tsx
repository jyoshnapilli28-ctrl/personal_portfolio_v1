import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const monogramRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        },
      });

      tl.fromTo(
        monogramRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
      )
        .fromTo(
          statusRef.current,
          { opacity: 0 },
          { opacity: 0.7, duration: 0.4 },
          '-=0.2'
        )
        .fromTo(
          lineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.0, ease: 'power2.inOut' },
          '-=0.2'
        )
        .to(
          [monogramRef.current, statusRef.current, lineRef.current],
          { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' }
        )
        .to(
          containerRef.current,
          {
            yPercent: -100,
            duration: 0.7,
            ease: 'power4.inOut',
          },
          '-=0.1'
        );
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-bg-primary flex flex-col items-center justify-center select-none"
    >
      <div className="flex flex-col items-center">
        <h1
          ref={monogramRef}
          className="font-headings text-5xl md:text-6xl tracking-tight text-text-ivory font-extrabold"
        >
          JP<span className="text-accent">.</span>
        </h1>
        <p
          ref={statusRef}
          className="font-labels text-[10px] tracking-[0.25em] text-text-muted mt-3 uppercase"
        >
          CINEMATIC PORTFOLIO · 2026
        </p>
        <div
          ref={lineRef}
          className="w-24 h-[2px] bg-accent mt-5 origin-left"
        />
      </div>
    </div>
  );
}
