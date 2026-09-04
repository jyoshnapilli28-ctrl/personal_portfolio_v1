import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { certifications } from '../../data/certifications';
import SectionLabel from '../ui/SectionLabel';
import GlassPanel from '../ui/GlassPanel';

gsap.registerPlugin(ScrollTrigger);

export default function Certifications() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.cert-card', {
        y: 35,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="py-32 px-6 lg:px-12 max-w-7xl mx-auto relative"
    >
      <SectionLabel number="05" title="CREDENTIALS & LAB MEMBERSHIPS" />

      <div className="mb-16">
        <h2 className="font-headings text-4xl lg:text-5xl text-text-ivory font-bold tracking-tight mb-4">
          Academic Honors & Research Labs
        </h2>
        <p className="font-body text-text-secondary text-base max-w-xl">
          Continuous engagement with developer research clusters, competitive technical platforms, and forward-looking computing initiatives.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {certifications.map((cert, i) => (
          <GlassPanel
            key={i}
            className="cert-card !p-8 border border-border-cin/80 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-labels text-xs text-accent tracking-widest uppercase">
                  {cert.year}
                </span>
                <span className="w-2 h-2 rounded-full bg-border-cin" />
              </div>

              <h3 className="font-sections text-xl text-text-ivory font-semibold mb-2">
                {cert.title}
              </h3>

              <p className="font-labels text-xs text-text-muted mb-4 uppercase tracking-wide">
                {cert.organization}
              </p>

              <p className="font-body text-sm text-text-warm leading-relaxed">
                {cert.description}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-border-cin/50 flex items-center justify-between font-labels text-[10px] text-text-muted">
              <span>STATUS: VERIFIED</span>
              <span className="text-accent">● ACTIVE</span>
            </div>
          </GlassPanel>
        ))}
      </div>
    </section>
  );
}
