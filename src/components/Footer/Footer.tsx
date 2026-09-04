import { profile } from '../../data/profile';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border-cin/80 py-16 px-6 lg:px-12 bg-bg-secondary/40 backdrop-blur-md relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left: Branding & Tagline */}
        <div className="text-center md:text-left">
          <p className="font-headings text-2xl font-bold text-text-ivory mb-2">
            JP<span className="text-accent">.</span>
          </p>
          <p className="font-body text-xs md:text-sm text-text-muted max-w-sm">
            {profile.university} · {profile.degree}
          </p>
          <p className="font-labels text-[10px] text-text-muted/60 mt-1 uppercase tracking-wider">
            {profile.headline}
          </p>
        </div>

        {/* Center: Social Icons */}
        <div className="flex items-center gap-3">
          <a
            href={profile.social.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="w-10 h-10 rounded-full border border-border-cin bg-bg-soft/60 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent hover:bg-bg-soft transition-all"
          >
            <img
              src="/assets/icons/github.svg"
              alt=""
              className="w-4 h-4"
              aria-hidden="true"
            />
          </a>
          <a
            href={profile.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="w-10 h-10 rounded-full border border-border-cin bg-bg-soft/60 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent hover:bg-bg-soft transition-all"
          >
            <img
              src="/assets/icons/linkedin.svg"
              alt=""
              className="w-4 h-4"
              aria-hidden="true"
            />
          </a>
          <a
            href={`mailto:${profile.social.email}`}
            aria-label="Email Jyoshna"
            className="w-10 h-10 rounded-full border border-border-cin bg-bg-soft/60 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent hover:bg-bg-soft transition-all"
          >
            <img
              src="/assets/icons/email.svg"
              alt=""
              className="w-4 h-4"
              aria-hidden="true"
            />
          </a>
        </div>

        {/* Right: Copyright & Back to Top */}
        <div className="text-center md:text-right flex flex-col items-center md:items-end">
          <p className="font-body text-xs text-text-muted">
            © 2026 {profile.name}. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="font-labels text-[10px] tracking-widest text-text-muted hover:text-accent mt-3 uppercase transition-colors inline-flex items-center gap-1.5 group cursor-pointer"
          >
            <span>BACK TO TOP</span>
            <span className="transition-transform group-hover:-translate-y-0.5">
              ↑
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
