import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { expertiseItems } from '../../data/expertise';
import SectionLabel from '../ui/SectionLabel';
import TechBadge from '../ui/TechBadge';

gsap.registerPlugin(ScrollTrigger);

export default function Expertise() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.expertise-row', {
        y: 40,
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
      id="expertise"
      ref={sectionRef}
      className="py-32 px-6 lg:px-12 max-w-7xl mx-auto relative"
    >
      <SectionLabel number="02" title="EXPERTISE" />

      <div className="mb-16">
        <h2 className="font-headings text-4xl lg:text-5xl text-text-ivory font-bold tracking-tight mb-4">
          Core Capabilities & Domains
        </h2>
        <p className="font-body text-text-secondary text-base max-w-xl">
          Bridging technical rigor in systems and engineering with aesthetic precision in interactive design.
        </p>
      </div>

      <div className="divide-y divide-border-cin/80">
        {expertiseItems.map((item) => (
          <div
            key={item.number}
            className="expertise-row group flex flex-col md:flex-row gap-6 md:gap-16 items-start py-10 transition-colors duration-500 cursor-default px-4 -mx-4 rounded-xl hover:bg-bg-soft/40"
          >
            {/* Number Counter */}
            <span className="font-labels text-4xl lg:text-6xl text-text-muted/50 group-hover:text-accent transition-colors duration-500 shrink-0 w-24">
              {item.number}
            </span>

            {/* Core Domain Description */}
            <div className="flex-1">
              <h3 className="font-sections text-2xl lg:text-3xl text-text-ivory font-semibold mb-3 group-hover:text-accent-light transition-colors duration-300">
                {item.title}
              </h3>
              <p className="font-body text-text-secondary text-sm md:text-base mb-5 max-w-2xl leading-relaxed">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.technologies.map((t) => (
                  <TechBadge key={t} name={t} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
