import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { profile } from '../../data/profile';
import SectionLabel from '../ui/SectionLabel';
import GlassPanel from '../ui/GlassPanel';
import AsciiWave from '../animations/AsciiWave';
import CTAButton from '../ui/CTAButton';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.contact-reveal', {
        y: 40,
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const mailto = `mailto:${profile.social.email}?subject=${encodeURIComponent(
      formData.subject || 'Portfolio Inquiry'
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    )}`;
    window.location.href = mailto;
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-32 px-6 lg:px-12 max-w-7xl mx-auto relative overflow-hidden"
    >
      {/* Background Interactive Fluid Character Wave */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <AsciiWave
          ink="#3A332B"
          cell={9}
          fill={6}
          speed={6}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="relative z-10">
        <SectionLabel number="06" title="CONNECT & COLLABORATE" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Editorial Contact Details */}
          <div className="lg:col-span-6">
            <h2 className="contact-reveal font-headings text-4xl lg:text-6xl text-text-ivory font-bold mb-6 leading-tight">
              LET'S BUILD<br />
              <span className="text-accent">SOMETHING EXCEPTIONAL</span>.
            </h2>

            <p className="contact-reveal font-body text-text-secondary text-base md:text-lg mb-8 max-w-lg leading-relaxed">
              Actively seeking forward-looking software engineering internships, research collaborations in quantum/AI, and hackathon project partnerships.
            </p>

            {/* Quick Links List */}
            <div className="contact-reveal flex flex-wrap gap-3 mb-10">
              <a
                href={profile.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border-cin bg-bg-soft/50 font-labels text-xs text-text-ivory hover:border-accent hover:text-accent transition-all duration-300"
              >
                <img
                  src="/assets/icons/linkedin.svg"
                  alt=""
                  className="w-4 h-4"
                  aria-hidden="true"
                />
                <span>LinkedIn</span>
              </a>

              <a
                href={profile.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border-cin bg-bg-soft/50 font-labels text-xs text-text-ivory hover:border-accent hover:text-accent transition-all duration-300"
              >
                <img
                  src="/assets/icons/github.svg"
                  alt=""
                  className="w-4 h-4"
                  aria-hidden="true"
                />
                <span>GitHub</span>
              </a>

              <a
                href={`mailto:${profile.social.email}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border-cin bg-bg-soft/50 font-labels text-xs text-text-ivory hover:border-accent hover:text-accent transition-all duration-300"
              >
                <img
                  src="/assets/icons/email.svg"
                  alt=""
                  className="w-4 h-4"
                  aria-hidden="true"
                />
                <span>{profile.social.email}</span>
              </a>
            </div>

            {/* Location & University metadata */}
            <div className="contact-reveal border-t border-border-cin/80 pt-6 space-y-2 font-labels text-xs text-text-muted">
              <div className="flex items-center gap-2">
                <span className="text-accent">LOCATION:</span>
                <span className="text-text-warm">{profile.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent">INSTITUTION:</span>
                <span className="text-text-warm">{profile.university}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-6 contact-reveal">
            <GlassPanel className="!p-8 border border-border-cin/80">
              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent flex items-center justify-center mb-4">
                    <img
                      src="/assets/icons/check.svg"
                      alt=""
                      className="w-6 h-6 text-accent"
                    />
                  </div>
                  <h3 className="font-headings text-2xl text-text-ivory font-bold mb-2">
                    Message Dispatched
                  </h3>
                  <p className="font-body text-sm text-text-warm max-w-sm">
                    Opening your default email client to finalize communication with Jyoshna.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="font-labels text-xs text-accent mt-6 hover:underline"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block font-labels text-[10px] uppercase text-text-muted tracking-wider mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-bg-soft/70 border border-border-cin rounded-xl px-4 py-3 text-text-ivory font-body placeholder:text-text-muted/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block font-labels text-[10px] uppercase text-text-muted tracking-wider mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-bg-soft/70 border border-border-cin rounded-xl px-4 py-3 text-text-ivory font-body placeholder:text-text-muted/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block font-labels text-[10px] uppercase text-text-muted tracking-wider mb-2"
                    >
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      required
                      placeholder="Internship / Project Opportunity"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full bg-bg-soft/70 border border-border-cin rounded-xl px-4 py-3 text-text-ivory font-body placeholder:text-text-muted/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block font-labels text-[10px] uppercase text-text-muted tracking-wider mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      placeholder="Describe the opportunity or collaboration..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full bg-bg-soft/70 border border-border-cin rounded-xl px-4 py-3 text-text-ivory font-body placeholder:text-text-muted/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full relative group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-labels text-xs tracking-wider uppercase bg-accent text-bg-primary font-semibold shadow-[0_0_20px_rgba(217,168,91,0.25)] hover:bg-accent-light hover:shadow-[0_0_30px_rgba(217,168,91,0.45)] transition-all duration-300"
                  >
                    <span>SEND MESSAGE</span>
                    <img
                      src="/assets/icons/arrow-right.svg"
                      alt=""
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </button>
                </form>
              )}
            </GlassPanel>
          </div>
        </div>
      </div>
    </section>
  );
}
