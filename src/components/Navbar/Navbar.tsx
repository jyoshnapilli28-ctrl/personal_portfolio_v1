import { useState, useEffect } from 'react';
import { navLinks } from '../../data/navigation';
import { profile } from '../../data/profile';

export default function Navbar() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Section tracking
      const sections = navLinks.map((link) => link.href.replace('#', ''));
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'backdrop-blur-xl bg-bg-primary/85 border-b border-border-cin/80 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
          : 'bg-transparent border-b border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Monogram Logo */}
        <a
          href="#home"
          className="font-headings text-2xl font-bold tracking-tight text-text-ivory hover:text-accent transition-colors flex items-center gap-1 group"
        >
          <span>JP</span>
          <span className="text-accent group-hover:scale-125 transition-transform duration-300">
            .
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const id = link.href.replace('#', '');
            const isActive = activeSection === id;

            return (
              <a
                key={link.label}
                href={link.href}
                className={`font-labels text-[11px] tracking-[0.14em] uppercase transition-colors relative py-1 ${
                  isActive
                    ? 'text-accent font-medium'
                    : 'text-text-muted hover:text-text-ivory'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent animate-pulse" />
                )}
              </a>
            );
          })}
        </div>

        {/* Action Button: LinkedIn / Resume */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={profile.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-labels text-[11px] tracking-wider uppercase border border-border-cin text-text-ivory px-4 py-2 rounded-full hover:bg-accent hover:text-bg-primary hover:border-accent transition-all duration-300 shadow-sm"
          >
            <span>CONNECT</span>
            <img
              src="/assets/icons/arrow-up-right.svg"
              alt=""
              className="w-3 h-3"
              aria-hidden="true"
            />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-text-ivory hover:text-accent transition-colors"
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
        >
          <img
            src={
              mobileMenuOpen
                ? '/assets/icons/close.svg'
                : '/assets/icons/menu.svg'
            }
            alt=""
            className="w-6 h-6"
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[70px] z-40 bg-bg-primary/95 backdrop-blur-2xl border-t border-border-cin flex flex-col justify-between p-8 min-h-[calc(100vh-70px)]">
          <div className="flex flex-col gap-6 pt-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-sections text-2xl text-text-ivory hover:text-accent transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="font-labels text-xs text-text-muted">
                  {link.href.replace('#', '')}
                </span>
              </a>
            ))}
          </div>

          <div className="pt-8 border-t border-border-cin/60 flex flex-col gap-4">
            <a
              href={profile.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3.5 rounded-full bg-accent text-bg-primary font-labels text-xs tracking-wider uppercase font-semibold"
            >
              CONNECT ON LINKEDIN
            </a>
            <p className="font-labels text-[10px] text-center text-text-muted">
              {profile.status}
            </p>
          </div>
        </div>
      )}
    </nav>
  );
}
