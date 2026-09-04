import { profile } from '../../data/profile';
import CTAButton from '../ui/CTAButton';
import ScrollIndicator from '../ui/ScrollIndicator';

export default function HeroText() {
  return (
    <div className="flex flex-col items-start z-10">
      {/* Intro Subtitle */}
      <p className="hello-label font-labels text-xs md:text-sm text-accent tracking-[0.2em] mb-4 uppercase">
        HELLO, I'M
      </p>

      {/* Main Name Heading (The only H1 on the page) */}
      <h1 className="hero-name font-headings text-[clamp(3rem,7.5vw,7.5rem)] leading-[0.92] text-text-ivory font-extrabold tracking-tight mb-4">
        JYOSHNA<br />
        <span className="text-text-ivory">PILLI</span>
        <span className="text-accent">.</span>
      </h1>

      {/* Decorative Gold Rule */}
      <div className="hero-separator w-16 h-[2px] bg-accent my-6" />

      {/* Title / Stance */}
      <p className="hero-title font-sections text-base md:text-xl uppercase tracking-[0.18em] text-text-warm font-semibold mb-4">
        {profile.title}
      </p>

      {/* Editorial Description */}
      <p className="hero-description font-body text-text-secondary text-sm md:text-base max-w-lg mb-8 leading-relaxed">
        {profile.heroDescription}
      </p>

      {/* Social Media Link Buttons */}
      <div className="hero-social flex items-center gap-3 mb-10">
        <a
          href={profile.social.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Profile"
          className="w-10 h-10 rounded-full border border-border-cin bg-bg-soft/50 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent hover:bg-bg-soft transition-all duration-300 shadow-sm"
        >
          <img src="/assets/icons/github.svg" alt="" className="w-4 h-4" aria-hidden="true" />
        </a>
        <a
          href={profile.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn Profile"
          className="w-10 h-10 rounded-full border border-border-cin bg-bg-soft/50 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent hover:bg-bg-soft transition-all duration-300 shadow-sm"
        >
          <img src="/assets/icons/linkedin.svg" alt="" className="w-4 h-4" aria-hidden="true" />
        </a>
        <a
          href={`mailto:${profile.social.email}`}
          aria-label="Email Jyoshna"
          className="w-10 h-10 rounded-full border border-border-cin bg-bg-soft/50 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent hover:bg-bg-soft transition-all duration-300 shadow-sm"
        >
          <img src="/assets/icons/email.svg" alt="" className="w-4 h-4" aria-hidden="true" />
        </a>

        <div className="hidden sm:flex items-center gap-2 ml-3 pl-3 border-l border-border-cin/80">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-labels text-[10px] text-text-muted tracking-wider uppercase">
            {profile.status}
          </span>
        </div>
      </div>

      {/* Call to Actions */}
      <div className="hero-ctas flex flex-wrap items-center gap-4 mb-14">
        <CTAButton
          variant="primary"
          href="#projects"
          icon={<img src="/assets/icons/arrow-right.svg" alt="" className="w-4 h-4" aria-hidden="true" />}
        >
          VIEW PROJECTS
        </CTAButton>
        <CTAButton variant="secondary" href="#contact">
          CONTACT ME
        </CTAButton>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator self-start pl-2">
        <ScrollIndicator />
      </div>
    </div>
  );
}
