import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../../data/projects';
import SectionLabel from '../ui/SectionLabel';
import TechBadge from '../ui/TechBadge';
import GlassPanel from '../ui/GlassPanel';
import NeonBorder from '../animations/NeonBorder';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.project-row', {
        y: 45,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-32 px-6 lg:px-12 max-w-7xl mx-auto relative"
    >
      <SectionLabel number="04" title="FEATURED PROJECTS" />

      <div className="mb-20">
        <h2 className="font-headings text-4xl lg:text-5xl text-text-ivory font-bold tracking-tight mb-4">
          Engineered Artifacts & Systems
        </h2>
        <p className="font-body text-text-secondary text-base max-w-xl">
          Selected technical explorations spanning advanced frontend motion architectures, quantum computing state interfaces, and decoupled cloud pipelines.
        </p>
      </div>

      <div className="space-y-28">
        {projects.map((project, i) => {
          const isFlipped = i % 2 !== 0;
          const isHovered = hoveredProject === project.number;

          return (
            <div
              key={project.number}
              onMouseEnter={() => setHoveredProject(project.number)}
              onMouseLeave={() => setHoveredProject(null)}
              className="project-row grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* Project Preview Card with Interactive NeonBorder on hover */}
              <div
                className={`lg:col-span-7 relative ${
                  isFlipped ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <div className="relative rounded-3xl overflow-hidden p-[1px]">
                  {isHovered && (
                    <NeonBorder
                      color="#D9A85B"
                      rounded={24}
                      thickness={3}
                      borderSize={45}
                      glow={60}
                      speed={15}
                    />
                  )}

                  <GlassPanel
                    className={`aspect-video w-full flex flex-col justify-between !p-8 relative overflow-hidden transition-transform duration-500 ${
                      isHovered ? 'scale-[1.01]' : ''
                    }`}
                  >
                    {/* Atmospheric background art */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-40"
                      style={{
                        backgroundImage:
                          i === 0
                            ? 'radial-gradient(ellipse at top right, rgba(217, 168, 91, 0.25) 0%, transparent 70%)'
                            : i === 1
                            ? 'radial-gradient(ellipse at bottom left, rgba(217, 168, 91, 0.2) 0%, transparent 65%)'
                            : 'radial-gradient(ellipse at center, rgba(217, 168, 91, 0.18) 0%, transparent 70%)',
                      }}
                    />

                    {/* Top card bar */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="font-labels text-[10px] text-accent tracking-[0.2em] uppercase">
                        RELEASE · 2026
                      </span>
                      <span className="font-labels text-xs text-text-muted">
                        SYS / {project.number}
                      </span>
                    </div>

                    {/* Center graphic preview */}
                    <div className="relative z-10 flex flex-col items-center justify-center my-4">
                      <div className="w-16 h-16 rounded-2xl bg-bg-secondary/90 border border-border-light flex items-center justify-center shadow-lg mb-3">
                        <span className="font-headings text-xl font-bold text-text-ivory">
                          {project.number}
                        </span>
                      </div>
                      <span className="font-sections text-xl text-text-ivory font-semibold text-center tracking-tight">
                        {project.name}
                      </span>
                      <span className="font-labels text-[10px] text-accent mt-1 tracking-wider uppercase">
                        {project.category}
                      </span>
                    </div>

                    {/* Bottom card bar */}
                    <div className="relative z-10 flex items-center justify-between font-labels text-[10px] text-text-muted pt-4 border-t border-border-cin/50">
                      <span>STATUS: OPERATIONAL</span>
                      <span className="text-text-warm">SRM-AP LABS</span>
                    </div>
                  </GlassPanel>
                </div>
              </div>

              {/* Project Editorial Information */}
              <div
                className={`lg:col-span-5 flex flex-col justify-center ${
                  isFlipped ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <span className="font-labels text-5xl lg:text-6xl text-text-muted/20 font-extrabold mb-3">
                  0{i + 1}
                </span>

                <p className="font-labels text-xs text-accent tracking-[0.15em] uppercase mb-2">
                  {project.category}
                </p>

                <h3 className="font-headings text-3xl lg:text-4xl text-text-ivory font-bold mb-4">
                  {project.name}
                </h3>

                <p className="font-body text-text-secondary text-sm md:text-base leading-relaxed mb-6">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {project.technologies.map((t) => (
                    <TechBadge key={t} name={t} />
                  ))}
                </div>

                <div className="flex items-center gap-6">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-labels text-xs tracking-wider uppercase text-text-ivory hover:text-accent transition-colors"
                  >
                    <span>SOURCE CODE</span>
                    <img
                      src="/assets/icons/arrow-up-right.svg"
                      alt=""
                      className="w-3.5 h-3.5"
                    />
                  </a>

                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-labels text-xs tracking-wider uppercase text-text-ivory hover:text-accent transition-colors"
                    >
                      <span>LIVE DEMO</span>
                      <img
                        src="/assets/icons/external-link.svg"
                        alt=""
                        className="w-3.5 h-3.5"
                      />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
