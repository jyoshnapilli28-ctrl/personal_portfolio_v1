import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import HeroText from './HeroText';
import HeroVisual3D from './HeroVisual3D';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.from('.hero-background-layer', {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      })
        .from(
          '.hello-label',
          { y: 25, opacity: 0, duration: 0.4, ease: 'power2.out' },
          '-=0.3'
        )
        .from(
          '.hero-name',
          { y: 35, opacity: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.2'
        )
        .from(
          '.hero-separator',
          {
            scaleX: 0,
            transformOrigin: 'left',
            duration: 0.4,
            ease: 'power2.out',
          },
          '-=0.3'
        )
        .from(
          '.hero-title',
          { opacity: 0, y: 15, duration: 0.4, ease: 'power2.out' },
          '-=0.2'
        )
        .from(
          '.hero-description',
          { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.2'
        )
        .from(
          '.hero-social > *',
          { y: 15, opacity: 0, stagger: 0.08, duration: 0.35, ease: 'power2.out' },
          '-=0.2'
        )
        .from(
          '.hero-ctas > *',
          { y: 15, opacity: 0, stagger: 0.12, duration: 0.4, ease: 'power2.out' },
          '-=0.2'
        )
        .from(
          '.hero-visual-wrapper',
          {
            scale: 0.85,
            opacity: 0,
            x: 35,
            duration: 0.9,
            ease: 'power3.out',
          },
          '-=0.6'
        )
        .from(
          '.scroll-indicator',
          { opacity: 0, y: 10, duration: 0.4, ease: 'power2.out' },
          '-=0.2'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16 lg:py-0"
    >
      {/* Background visual layers from backgrounds.css */}
      <div className="hero-background-layer" />
      <div className="bg-tech-grid" />

      {/* Main hero grid container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Left Column: Typography & CTAs */}
        <HeroText />

        {/* Right Column: 3D Spatial Visual & Aura Glow */}
        <div className="hero-visual-wrapper relative flex items-center justify-center w-full">
          <div className="portrait-aura-glow absolute" />
          <HeroVisual3D />
        </div>
      </div>
    </section>
  );
}
