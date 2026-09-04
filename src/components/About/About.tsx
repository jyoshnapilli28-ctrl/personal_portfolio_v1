import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { profile } from '../../data/profile';
import SectionLabel from '../ui/SectionLabel';
import TechBadge from '../ui/TechBadge';
import GlassPanel from '../ui/GlassPanel';
import ProfileCard3D from './ProfileCard3D';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.about-reveal', {
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      gsap.from('.about-card-reveal', {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
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
      id="about"
      ref={sectionRef}
      className="py-32 px-6 lg:px-12 max-w-7xl mx-auto relative"
    >
      <SectionLabel number="01" title="ABOUT" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left Column: Editorial Bio & Experience */}
        <div>
          <h2 className="about-reveal font-headings text-4xl lg:text-5xl text-text-ivory mb-8 leading-tight font-bold">
            CSE Student.<br />
            Frontend Developer.<br />
            <span className="text-accent font-normal">Exploring AI & Quantum.</span>
          </h2>

          <p className="about-reveal font-body text-text-warm text-base md:text-lg max-w-lg mb-8 leading-relaxed">
            {profile.about}
          </p>

          <p className="about-reveal font-body text-text-secondary text-sm max-w-lg mb-8 italic border-l-2 border-accent pl-4">
            &ldquo;{profile.longTermGoal}&rdquo;
          </p>

          {/* Identity Tag Highlights */}
          <div className="about-reveal flex flex-wrap gap-2.5 mb-12">
            {[
              'CSE @ SRM University, AP',
              'Frontend Developer',
              'AI & Quantum Research',
              'Available for Internships',
            ].map((pill) => (
              <GlassPanel
                key={pill}
                className="!p-2.5 !px-3.5 !rounded-xl border border-border-cin/80"
                hover={false}
              >
                <span className="font-labels text-[11px] text-text-muted">
                  {pill}
                </span>
              </GlassPanel>
            ))}
          </div>

          {/* Experience Timeline Records */}
          <div className="about-reveal space-y-6">
            <h3 className="font-labels text-xs tracking-[0.2em] text-text-muted uppercase mb-4">
              AFFILIATIONS & EXPERIENCE
            </h3>
            {profile.experience.map((exp) => (
              <div
                key={exp.org}
                className="border-l border-border-cin/80 pl-6 relative before:absolute before:left-[-4.5px] before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-accent"
              >
                <p className="font-labels text-[11px] text-accent tracking-wider uppercase mb-1">
                  {exp.period}
                </p>
                <h4 className="font-sections text-lg text-text-ivory font-semibold">
                  {exp.role}
                </h4>
                <p className="font-body text-sm text-text-warm mb-1">
                  {exp.org} · {exp.location}
                </p>
                <p className="font-body text-xs text-text-muted mb-3 leading-relaxed">
                  {exp.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <TechBadge key={tag} name={tag} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: 3D Developer Physical Identity Card */}
        <div className="about-card-reveal flex justify-center lg:justify-end w-full pt-4 lg:pt-0">
          <ProfileCard3D />
        </div>
      </div>
    </section>
  );
}
