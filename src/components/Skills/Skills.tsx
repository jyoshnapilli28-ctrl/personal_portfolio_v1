import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skillGroups } from '../../data/skills';
import SectionLabel from '../ui/SectionLabel';
import TechBadge from '../ui/TechBadge';
import GlassPanel from '../ui/GlassPanel';

gsap.registerPlugin(ScrollTrigger);

// Key tech logos with SVG icons for the Interactive Tech Grid showcase
const featuredTech = [
  { name: 'React', icon: 'react.svg', category: 'Frontend' },
  { name: 'JavaScript', icon: 'javascript.svg', category: 'Language' },
  { name: 'Python', icon: 'python.svg', category: 'AI & Data' },
  { name: 'C++', icon: 'cpp.svg', category: 'Systems' },
  { name: 'Node.js', icon: 'nodejs.svg', category: 'Backend' },
  { name: 'AWS', icon: 'aws.svg', category: 'Cloud' },
  { name: 'Git', icon: 'git.svg', category: 'Tooling' },
  { name: 'Figma', icon: 'figma.svg', category: 'Design' },
  { name: 'HTML5', icon: 'html5.svg', category: 'Web' },
  { name: 'CSS3', icon: 'css3.svg', category: 'Styling' },
  { name: 'Java', icon: 'java.svg', category: 'Core' },
  { name: 'C', icon: 'c.svg', category: 'Language' },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.skills-group-reveal', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
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
      id="skills"
      ref={sectionRef}
      className="py-32 px-6 lg:px-12 max-w-7xl mx-auto relative"
    >
      <SectionLabel number="03" title="SKILLS & TECHNOLOGIES" />

      <div className="mb-16">
        <h2 className="font-headings text-4xl lg:text-5xl text-text-ivory font-bold tracking-tight mb-4">
          Technical Arsenal & Core Stack
        </h2>
        <p className="font-body text-text-secondary text-base max-w-xl">
          A disciplined foundation encompassing systems programming, modern web frameworks, cloud workflows, and emergent computational models.
        </p>
      </div>

      {/* Interactive Tech Grid Showcase */}
      <div className="mb-20">
        <h3 className="font-labels text-xs tracking-[0.2em] text-text-muted uppercase mb-6 flex items-center gap-2">
          <span>INTERACTIVE STACK MATRIX</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {featuredTech.map((tech, idx) => {
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={tech.name}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group relative rounded-2xl p-4 bg-bg-soft/70 border border-border-cin/80 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col items-center justify-center text-center gap-3 ${
                  isHovered
                    ? 'border-accent -translate-y-1.5 shadow-[0_10px_25px_rgba(217,168,91,0.15)] bg-bg-soft'
                    : 'hover:border-border-light'
                }`}
              >
                {/* Subtle radial glow on hover */}
                <div
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    background:
                      'radial-gradient(circle at 50% 40%, rgba(217, 168, 91, 0.15) 0%, transparent 70%)',
                  }}
                />

                <div className="w-10 h-10 rounded-xl bg-bg-secondary flex items-center justify-center border border-border-cin group-hover:border-accent/40 transition-colors">
                  <img
                    src={`/assets/icons/${tech.icon}`}
                    alt={tech.name}
                    className="w-5 h-5 object-contain"
                  />
                </div>

                <div>
                  <h4 className="font-sections text-sm font-semibold text-text-ivory group-hover:text-accent transition-colors">
                    {tech.name}
                  </h4>
                  <span className="font-labels text-[9px] text-text-muted tracking-wider uppercase">
                    {tech.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Skill Categories Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillGroups.map((group) => (
          <GlassPanel
            key={group.groupName}
            className="skills-group-reveal !p-6 border border-border-cin/80 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-sections text-lg text-text-ivory font-semibold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent/80" />
                <span>{group.groupName}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <TechBadge
                    key={skill.name}
                    name={skill.name}
                    icon={skill.icon}
                  />
                ))}
              </div>
            </div>
          </GlassPanel>
        ))}
      </div>
    </section>
  );
}
