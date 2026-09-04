export default function ScrollIndicator() {
  const scrollToNext = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={scrollToNext}
      aria-label="Scroll down to About section"
      className="group flex flex-col items-center gap-2 animate-bounce-slow cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
    >
      <span className="font-labels text-[10px] text-text-muted tracking-[0.25em] uppercase group-hover:text-accent transition-colors">
        SCROLL
      </span>
      <img
        src="/assets/icons/chevron-down.svg"
        alt=""
        className="w-4 h-4 brightness-75 group-hover:brightness-100 transition-all"
        aria-hidden="true"
      />
    </button>
  );
}
