# Coding Guide — Premium Cinematic Portfolio

> **Read this file + `implementation_plan.md`. You need nothing else to build the entire site.**

---

## RULE 0 — WHAT YOU ARE BUILDING

A single-page React + TypeScript portfolio for **Jyoshna Pilli (JP)**.
Visual style: near-black cinematic environment, warm ivory editorial typography, champagne/gold accents, GSAP animations, interactive 3D visual, immersive scroll experience.

**No personal portrait photo.** The hero uses a CSS 3D abstract object. The About section uses a 3D hover profile card with `JP.` monogram.

---

## SECTION A — REAL DATA (USE EXACTLY AS WRITTEN)

```
NAME:           Jyoshna Pilli
MONOGRAM:       JP.
TITLE:          Frontend Developer & CS Student
UNIVERSITY:     SRM University, Andhra Pradesh
DEGREE:         Computer Science and Engineering (CSE)
LOCATION:       Srikakulam, Andhra Pradesh, India
LINKEDIN:       https://www.linkedin.com/in/jyoshna-pilli-694aa23a9
GITHUB:         https://github.com/jyoshnapilli28-ctrl
EMAIL:          jyoshnapilli28@gmail.com
STATUS:         AVAILABLE FOR INTERNSHIPS
PROJECT:        Portfolio_P1
LONG-TERM GOAL: Become a Quantum Researcher and contribute to a top MNC

EXPERIENCE 1:
  role:         Student Member
  org:          AWS Student Builder Club, SRM|RMP
  location:     Vijayawada, Andhra Pradesh
  period:       Aug 2026 – Present
  tags:         AWS, Cloud Computing, Community

EXPERIENCE 2:
  role:         Member
  org:          Singularity Student Lab
  location:     Vijayawada, Andhra Pradesh
  period:       Jul 2026 – Present
  tags:         Python, AI & Technology, Quantum Computing, Research

ABOUT BIO:
  Pursuing Computer Science at SRM University–AP, exploring Quantum Computing,
  Full Stack Development, and Web Development, while strengthening
  problem-solving skills through Data Structures and Algorithms.

HERO DESCRIPTION:
  Building interactive and immersive web experiences with clean code,
  creative design and modern technologies.

OPEN TO:
  Collaboration, Hackathons, Team Projects, Internship Opportunities
```

---

## SECTION B — EXACT COLOR TOKENS

These CSS custom properties are already defined in `assets/colors/colors.css`. Use them everywhere.

```
--color-bg-primary:      #090807     (main page background, 70-80% coverage)
--color-bg-secondary:    #12100D     (alternate sections, panels)
--color-bg-soft:         #1B1712     (cards, subtle surfaces, floating UI)

--color-text-primary:    #F3EEE5     (warm ivory: hero name, headings)
--color-text-secondary:  #C7C0B5     (warm gray: body copy, descriptions)
--color-text-muted:      #8E887E     (metadata, section numbers, labels)

--color-border:          #3A332B     (subtle structural borders)
--color-border-light:    #5A4D3E     (hover & focus borders)

--color-accent:          #D9A85B     (primary champagne/gold accent, ≤5% usage)
--color-accent-light:    #E8C58F     (accent hover, fine decorative lines)
--color-accent-dark:     #9B713B     (secondary deeper accent)

--color-white:           #FFFFFF
--color-black:           #000000
```

**Tailwind equivalents** (put these in `tailwind.config.ts`):

```ts
colors: {
  'bg-primary':   '#090807',
  'bg-secondary': '#12100D',
  'bg-soft':      '#1B1712',
  'text-ivory':   '#F3EEE5',
  'text-warm':    '#C7C0B5',
  'text-muted':   '#8E887E',
  'border-cin':   '#3A332B',
  'border-light': '#5A4D3E',
  'accent':       '#D9A85B',
  'accent-light': '#E8C58F',
  'accent-dark':  '#9B713B',
}
```

---

## SECTION C — EXACT FONT SYSTEM

Four Google Fonts. Already imported in `assets/fonts/fonts.css`.

| Role | Font Family | CSS Variable | Tailwind Class | Weight | Usage |
|---|---|---|---|---|---|
| **Headings** | Syne | `--font-headings` | `font-headings` | 700-800 | Hero name, h1, h2 |
| **Sections** | Outfit | `--font-sections` | `font-sections` | 500-700 | Section titles, expertise |
| **Labels** | Space Mono | `--font-labels` | `font-labels` | 400 | Tags, numbers, metadata, nav |
| **Body** | Inter | `--font-body` | `font-body` | 400 | Paragraphs, descriptions |

**Tailwind config:**

```ts
fontFamily: {
  headings: ['Syne', 'sans-serif'],
  sections: ['Outfit', 'sans-serif'],
  labels:   ['Space Mono', 'monospace'],
  body:     ['Inter', 'sans-serif'],
}
```

**CSS utility classes already available:**

```
.font-headings  → Syne, 700, letter-spacing: -0.035em, line-height: 1.05
.font-sections  → Outfit, 600, letter-spacing: -0.02em, line-height: 1.2
.font-labels    → Space Mono, 400, uppercase, letter-spacing: 0.12em, 0.75rem
.font-body      → Inter, 400, line-height: 1.65, letter-spacing: -0.01em
```

---

## SECTION D — EXACT BACKGROUND SYSTEM

Already defined in `assets/backgrounds/backgrounds.css`. Apply these classes directly.

| CSS Class | Purpose | Where to Use |
|---|---|---|
| `.cinematic-bg-root` OR `body.cinematic-environment` | Master page bg: vignette + ambient glows + fixed position | Root `<body>` or App wrapper |
| `.hero-background-layer` | Hero section bg: champagne glow + gradient fade | Absolute-positioned div inside Hero |
| `.hero-background-photo` | Hero bg with image: overlays + `hero_cinematic_bg.jpg` | Absolute-positioned div inside Hero |
| `.bg-noise-overlay` | Fine-grain noise texture (fixed, pointer-events:none) | One instance at root level |
| `.bg-tech-grid` | Faint 80×80px grid lines (masked radial fade) | Inside Hero or any section |
| `.portrait-aura-glow` | Champagne radial glow blob behind 3D visual | Behind HeroVisual3D |
| `.glass-panel` | Glassmorphic card: blur(14px), dark bg, border, shadow | Cards, panels, form containers |
| `.glass-card-subtle` | Lighter glass card | Secondary cards |

**Important CSS vars in backgrounds.css:**

```
--glow-hero           radial champagne glow (right-biased)
--glow-section        radial champagne glow (left-biased)
--vignette-cinematic  edge darkening vignette
--tech-grid           faint line grid pattern
```

**Mobile optimizations (already in the file):**
- At ≤768px: reduced blur on `.glass-panel`, smaller `.portrait-aura-glow`, lighter noise
- `prefers-reduced-motion`: transitions disabled on `.glass-panel`

---

## SECTION E — ICON INVENTORY

All icons are in `assets/icons/`. Format: SVG, viewBox `0 0 24 24`, `fill="currentColor"`, 24×24px.
They inherit text color — just set the parent's CSS `color` property.

### Social Icons
| File | Use |
|---|---|
| `github.svg` | GitHub profile link |
| `linkedin.svg` | LinkedIn profile link |
| `email.svg` | Email contact |
| `mail.svg` | Alternative email icon (same as email.svg) |

### Technology Icons
| File | Skill |
|---|---|
| `c.svg` | C Programming |
| `cpp.svg` | C++ |
| `java.svg` | Java |
| `python.svg` | Python |
| `javascript.svg` | JavaScript |
| `html5.svg` | HTML5 |
| `css3.svg` | CSS3 |
| `react.svg` | React |
| `nodejs.svg` | Node.js |
| `figma.svg` | Figma |
| `git.svg` | Git |
| `aws.svg` | AWS |

### UI Navigation Icons
| File | Use |
|---|---|
| `arrow-right.svg` | CTA buttons, "next" actions |
| `arrow-up-right.svg` | External links |
| `external-link.svg` | "Open in new tab" links |
| `download.svg` | Resume download |
| `menu.svg` | Mobile hamburger menu (3 lines) |
| `close.svg` | Close mobile menu (X) |
| `chevron-down.svg` | Scroll indicator, dropdowns |
| `chevron-right.svg` | List indicators |
| `plus.svg` | Expand/add actions |
| `check.svg` | Completed/verified states |

**How to use in React:**

```tsx
// Option 1: Import as component (with vite-plugin-svgr)
import GitHubIcon from '../../assets/icons/github.svg?react';
<GitHubIcon className="w-5 h-5 text-text-muted hover:text-accent" />

// Option 2: Import as URL
import githubUrl from '../../assets/icons/github.svg';
<img src={githubUrl} alt="" className="w-5 h-5" aria-hidden="true" />

// Option 3: Inline SVG (copy the SVG content into JSX)
```

---

## SECTION F — MASTER IMPORT (theme.css)

`assets/theme.css` imports everything:

```css
@import url('./fonts/fonts.css');       /* Google Fonts + CSS variables */
@import url('./colors/colors.css');     /* Color tokens + utility classes */
@import url('./backgrounds/backgrounds.css'); /* Bg layers + glass panels */
```

**In your project's `src/styles/globals.css`, import it:**

```css
@import '../../assets/theme.css';
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Selection color */
::selection {
  background-color: rgba(217, 168, 91, 0.3);
  color: #F3EEE5;
}

html {
  scroll-behavior: smooth;
}

* {
  box-sizing: border-box;
}
```

---

## SECTION G — VITE + REACT + TAILWIND SETUP

### Step 1: Create the project

```bash
npm create vite@latest ./ -- --template react-ts
npm install
npm install -D tailwindcss @tailwindcss/vite
npm install gsap
```

### Step 2: `vite.config.ts`

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### Step 3: `tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary':   '#090807',
        'bg-secondary': '#12100D',
        'bg-soft':      '#1B1712',
        'text-ivory':   '#F3EEE5',
        'text-warm':    '#C7C0B5',
        'text-muted':   '#8E887E',
        'border-cin':   '#3A332B',
        'border-light': '#5A4D3E',
        'accent':       '#D9A85B',
        'accent-light': '#E8C58F',
        'accent-dark':  '#9B713B',
      },
      fontFamily: {
        headings: ['Syne', 'sans-serif'],
        sections: ['Outfit', 'sans-serif'],
        labels:   ['Space Mono', 'monospace'],
        body:     ['Inter', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
```

### Step 4: `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Jyoshna Pilli — Frontend Developer & CS Student</title>
    <meta name="description" content="Portfolio of Jyoshna Pilli, CSE student at SRM University AP exploring AI, Quantum Computing and building interactive web experiences." />
    <meta property="og:title" content="Jyoshna Pilli — Frontend Developer" />
    <meta property="og:description" content="Premium cinematic portfolio showcasing frontend engineering, AI exploration, and interactive web experiences." />
    <meta property="og:type" content="website" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body class="cinematic-environment">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## SECTION H — DATA FILES (COPY EXACTLY)

### `src/data/profile.ts`

```ts
export const profile = {
  name: "Jyoshna Pilli",
  firstName: "Jyoshna",
  lastName: "Pilli",
  monogram: "JP.",
  title: "Frontend Developer & CS Student",
  headline: "AI & Technology · Quantum Computing · CSE @ SRM-AP",
  university: "SRM University, Andhra Pradesh",
  degree: "Computer Science and Engineering (CSE)",
  location: "Srikakulam, Andhra Pradesh, India",
  status: "AVAILABLE FOR INTERNSHIPS",
  about: "Pursuing Computer Science at SRM University–AP, exploring Quantum Computing, Full Stack Development, and Web Development, while strengthening problem-solving skills through Data Structures and Algorithms.",
  heroDescription: "Building interactive and immersive web experiences with clean code, creative design and modern technologies.",
  longTermGoal: "Become a Quantum Researcher and contribute to a top MNC through impactful, technology-driven work.",
  openTo: ["Collaboration", "Hackathons", "Team Projects", "Internship Opportunities"],
  social: {
    linkedin: "https://www.linkedin.com/in/jyoshna-pilli-694aa23a9",
    github: "https://github.com/jyoshnapilli28-ctrl",
    email: "jyoshnapilli28@gmail.com",
  },
  experience: [
    {
      role: "Student Member",
      org: "AWS Student Builder Club, SRM|RMP",
      location: "Vijayawada, Andhra Pradesh",
      period: "Aug 2026 – Present",
      description: "Learning cloud infrastructure, building practical AWS projects, and connecting with a student technology community.",
      tags: ["AWS", "Cloud Computing", "Community"],
    },
    {
      role: "Member",
      org: "Singularity Student Lab",
      location: "Vijayawada, Andhra Pradesh",
      period: "Jul 2026 – Present",
      description: "Exploring AI, quantum computing, and technology research at the Singularity Advanced Research Lab.",
      tags: ["Python", "AI & Technology", "Quantum Computing", "Research"],
    },
  ],
} as const;
```

### `src/data/navigation.ts`

```ts
export const navLinks = [
  { label: "HOME", href: "#home" },
  { label: "ABOUT", href: "#about" },
  { label: "EXPERTISE", href: "#expertise" },
  { label: "SKILLS", href: "#skills" },
  { label: "PROJECTS", href: "#projects" },
  { label: "CERTIFICATIONS", href: "#certifications" },
  { label: "CONTACT", href: "#contact" },
] as const;
```

### `src/data/expertise.ts`

```ts
export const expertiseItems = [
  {
    number: "01",
    title: "Frontend Engineering",
    description: "Building premium interactive web interfaces using React and modern CSS systems. Crafting pixel-perfect, responsive layouts with clean component architecture.",
    technologies: ["React", "TypeScript", "HTML5", "CSS3", "Tailwind CSS"],
  },
  {
    number: "02",
    title: "Full Stack Development",
    description: "Developing end-to-end web applications from UI to backend logic and APIs. Understanding the full request lifecycle.",
    technologies: ["Node.js", "JavaScript", "REST APIs", "Web Development"],
  },
  {
    number: "03",
    title: "Motion & Immersive Design",
    description: "Creating scroll-driven, GSAP-animated, and 3D web experiences that feel cinematic and responsive to user interaction.",
    technologies: ["GSAP", "ScrollTrigger", "CSS 3D", "Micro-interactions"],
  },
  {
    number: "04",
    title: "AI & Quantum Computing",
    description: "Exploring artificial intelligence and quantum computing research at the Singularity Lab. Building intelligent systems with Python.",
    technologies: ["Python", "AI & Technology", "Quantum Computing"],
  },
  {
    number: "05",
    title: "Problem Solving & CS Core",
    description: "Strengthening algorithmic thinking through DSA and competitive problem solving. Developing efficient, scalable solutions.",
    technologies: ["C", "C++", "Java", "Data Structures", "Algorithms"],
  },
  {
    number: "06",
    title: "Cloud & Emerging Tech",
    description: "Learning AWS cloud infrastructure and emerging technology ecosystems as an AWS Student Builder member.",
    technologies: ["AWS", "Cloud Computing", "Python"],
  },
] as const;
```

### `src/data/skills.ts`

```ts
export interface Skill {
  name: string;
  icon?: string; // filename from assets/icons/ e.g. "react.svg"
}

export interface SkillGroup {
  groupName: string;
  skills: Skill[];
}

export const skillGroups: SkillGroup[] = [
  {
    groupName: "Programming Languages",
    skills: [
      { name: "C", icon: "c.svg" },
      { name: "C++", icon: "cpp.svg" },
      { name: "Java", icon: "java.svg" },
      { name: "Python", icon: "python.svg" },
      { name: "JavaScript", icon: "javascript.svg" },
      { name: "TypeScript" },
    ],
  },
  {
    groupName: "Frontend Development",
    skills: [
      { name: "HTML5", icon: "html5.svg" },
      { name: "CSS3", icon: "css3.svg" },
      { name: "React", icon: "react.svg" },
      { name: "Tailwind CSS" },
      { name: "Responsive Design" },
    ],
  },
  {
    groupName: "Full Stack & Backend",
    skills: [
      { name: "Node.js", icon: "nodejs.svg" },
      { name: "REST APIs" },
      { name: "Full Stack Development" },
    ],
  },
  {
    groupName: "Motion & Interaction",
    skills: [
      { name: "GSAP" },
      { name: "ScrollTrigger" },
      { name: "CSS Animations" },
      { name: "3D Web" },
      { name: "Micro-interactions" },
    ],
  },
  {
    groupName: "Computer Science Core",
    skills: [
      { name: "Data Structures" },
      { name: "Algorithms" },
      { name: "Problem Solving" },
      { name: "Logical Thinking" },
    ],
  },
  {
    groupName: "Tools & Platforms",
    skills: [
      { name: "Git", icon: "git.svg" },
      { name: "GitHub", icon: "github.svg" },
      { name: "Figma", icon: "figma.svg" },
      { name: "VS Code" },
      { name: "AWS", icon: "aws.svg" },
    ],
  },
  {
    groupName: "Emerging Technologies",
    skills: [
      { name: "Quantum Computing" },
      { name: "Artificial Intelligence" },
      { name: "Machine Learning" },
      { name: "Cloud Computing" },
    ],
  },
];
```

### `src/data/projects.ts`

```ts
export const projects = [
  {
    number: "01",
    name: "Portfolio_P1",
    category: "Frontend / Full Stack",
    description: "A premium cinematic developer portfolio built with React, TypeScript, Tailwind CSS, GSAP, and interactive 3D visuals. Designed to demonstrate frontend engineering through design, motion, and interaction.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "GSAP", "CSS 3D"],
    githubUrl: "https://github.com/jyoshnapilli28-ctrl",
    liveUrl: "#",
  },
  {
    number: "02",
    name: "[PROJECT NAME]",
    category: "Web Application",
    description: "[PROJECT DESCRIPTION — to be filled]",
    technologies: ["React", "Node.js", "JavaScript"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    number: "03",
    name: "[PROJECT NAME]",
    category: "AI / ML / Quantum",
    description: "[PROJECT DESCRIPTION — to be filled]",
    technologies: ["Python", "Machine Learning", "AI"],
    githubUrl: "#",
    liveUrl: "#",
  },
] as const;
```

### `src/data/certifications.ts`

```ts
export const certifications = [
  {
    year: "2026",
    title: "AWS Student Builder Club Membership",
    organization: "AWS Student Builder Club, SRM|RMP",
    description: "Active member exploring cloud computing, building AWS projects, and participating in student technology community.",
  },
  {
    year: "2026",
    title: "Singularity Student Lab Membership",
    organization: "Singularity Advanced Research Lab",
    description: "Member exploring AI, quantum computing, and cutting-edge technology research.",
  },
  {
    year: "[YEAR]",
    title: "[CERTIFICATION NAME]",
    organization: "[ORGANIZATION]",
    description: "[DESCRIPTION — to be filled]",
  },
] as const;
```

---

## SECTION I — COMPONENT BLUEPRINTS

Every component follows this pattern:

```
1. Import React + hooks
2. Import data from src/data/
3. Import icons from assets/icons/
4. Use Tailwind classes with the custom color/font tokens
5. Use CSS classes from backgrounds.css where applicable
6. Add GSAP animation via useEffect + useRef
```

---

### I-1. `SectionLabel` — Reusable section marker

```tsx
// src/components/ui/SectionLabel.tsx
interface Props { number: string; title: string; }

export default function SectionLabel({ number, title }: Props) {
  return (
    <div className="font-labels text-text-muted text-xs tracking-[0.12em] uppercase mb-8">
      {number} / {title}
    </div>
  );
}
```

Use: `<SectionLabel number="01" title="ABOUT" />`

---

### I-2. `TechBadge` — Skill pill/tag

```tsx
// src/components/ui/TechBadge.tsx
interface Props { name: string; icon?: string; }

export default function TechBadge({ name, icon }: Props) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
      bg-bg-soft border border-border-cin font-labels text-[11px] text-text-muted
      hover:border-accent hover:text-accent transition-colors duration-300">
      {icon && (
        <img src={`/assets/icons/${icon}`} alt="" className="w-3.5 h-3.5" aria-hidden="true" />
      )}
      {name}
    </span>
  );
}
```

---

### I-3. `GlassPanel` — Glassmorphic card wrapper

```tsx
// src/components/ui/GlassPanel.tsx
interface Props { children: React.ReactNode; className?: string; hover?: boolean; }

export default function GlassPanel({ children, className = '', hover = true }: Props) {
  return (
    <div className={`glass-panel rounded-2xl p-6 ${hover ? '' : 'hover:border-border-cin'} ${className}`}>
      {children}
    </div>
  );
}
```

The `glass-panel` class is already defined in `backgrounds.css` (blur, border, shadow, hover states).

---

### I-4. `CTAButton`

```tsx
// src/components/ui/CTAButton.tsx
interface Props {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
}

export default function CTAButton({ variant, children, href = '#', icon }: Props) {
  const base = "inline-flex items-center gap-2 px-6 py-3 rounded-full font-labels text-xs tracking-wider uppercase transition-all duration-300";
  const styles = variant === 'primary'
    ? "bg-accent text-bg-primary hover:bg-accent-light"
    : "border border-border-cin text-text-ivory hover:border-accent hover:text-accent";

  return (
    <a href={href} className={`${base} ${styles}`}>
      {children}
      {icon}
    </a>
  );
}
```

---

### I-5. `ScrollIndicator`

```tsx
// src/components/ui/ScrollIndicator.tsx
export default function ScrollIndicator() {
  return (
    <div className="flex flex-col items-center gap-2 animate-bounce-slow">
      <span className="font-labels text-[10px] text-text-muted tracking-[0.2em]">SCROLL</span>
      <img src="/assets/icons/chevron-down.svg" alt="" className="w-4 h-4 text-text-muted" aria-hidden="true" />
    </div>
  );
}
```

---

## SECTION J — SECTION COMPONENT PATTERNS

### J-1. Navbar

**Desktop layout (fixed, top):**
```
[JP.]                    [HOME · ABOUT · ... · CONTACT]                    [RESUME ↗]
```

Key styles:
```tsx
// Container
className="fixed top-0 w-full z-50 backdrop-blur-xl bg-bg-primary/80 border-b border-border-cin"

// Logo
className="font-headings text-xl text-text-ivory"  // Renders: JP.

// Nav links
className="font-labels text-[11px] text-text-muted hover:text-accent transition-colors"

// Active link
className="text-accent relative after:absolute after:bottom-[-4px] after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-accent"

// Resume button
className="font-labels text-[11px] border border-border-cin text-text-ivory px-4 py-2 rounded-full hover:bg-accent hover:text-bg-primary hover:border-accent transition-all"
```

**Mobile:** Show `menu.svg` icon → full-screen overlay from right. Use GSAP stagger to reveal links.

---

### J-2. Preloader

Full-screen dark overlay with centered `JP.` monogram. GSAP timeline:
1. `JP.` fades in from opacity 0 (0.4s)
2. Thin progress line (champagne, 2px height, 80px width) scales from 0→1 horizontally (1s)
3. Entire preloader slides up + fades out (0.6s)
4. Set `display: none` on completion

```tsx
// Key styles
className="fixed inset-0 z-[100] bg-bg-primary flex flex-col items-center justify-center"
// Monogram
className="font-headings text-4xl text-text-ivory"
// Progress line
className="w-20 h-[2px] bg-accent mt-4 origin-left scale-x-0"  // GSAP animates scaleX to 1
```

---

### J-3. Hero Section

**Two-column layout:** left = text content, right = 3D visual.

```tsx
<section id="home" className="relative min-h-screen flex items-center overflow-hidden">
  {/* Background layers */}
  <div className="hero-background-layer" />
  <div className="bg-tech-grid" />
  <div className="bg-noise-overlay" />

  {/* Content container */}
  <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    {/* LEFT: Text */}
    <div>
      {/* "HELLO, I'M" */}
      <p className="font-labels text-sm text-accent mb-4">HELLO, I'M</p>

      {/* Name */}
      <h1 className="font-headings text-[clamp(3rem,8vw,9rem)] leading-[0.95] text-text-ivory">
        JYOSHNA<br />PILLI
      </h1>

      {/* Separator */}
      <div className="w-16 h-[1px] bg-accent my-6" />

      {/* Title */}
      <p className="font-sections text-lg uppercase tracking-[0.15em] text-text-warm mb-4">
        FRONTEND DEVELOPER
      </p>

      {/* Description */}
      <p className="font-body text-text-warm max-w-md mb-8">
        Building interactive and immersive web experiences with clean code,
        creative design and modern technologies.
      </p>

      {/* Social icons row */}
      <div className="flex gap-4 mb-8">
        {/* Each: 40×40 rounded-full border border-border-cin, icon inside, hover:border-accent hover:text-accent */}
      </div>

      {/* CTAs */}
      <div className="flex gap-4 mb-12">
        <CTAButton variant="primary" href="#projects" icon={<ArrowRightIcon />}>VIEW PROJECTS</CTAButton>
        <CTAButton variant="secondary" href="#contact">CONTACT ME</CTAButton>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </div>

    {/* RIGHT: 3D Visual */}
    <div className="relative flex items-center justify-center">
      <div className="portrait-aura-glow absolute" />
      <HeroVisual3D />
    </div>
  </div>
</section>
```

**GSAP entrance sequence** (in `useEffect` on mount):

```ts
const tl = gsap.timeline({ delay: 1.5 }); // after preloader
tl.from('.hero-background-layer', { opacity: 0, duration: 0.6 })
  .from('.hello-label', { y: 30, opacity: 0, duration: 0.4 })
  .from('.hero-name', { y: 40, opacity: 0, duration: 0.5 })
  .from('.hero-separator', { scaleX: 0, transformOrigin: 'left', duration: 0.3 })
  .from('.hero-title', { opacity: 0, duration: 0.3 })
  .from('.hero-description', { y: 20, opacity: 0, duration: 0.4 })
  .from('.hero-social > *', { y: 15, opacity: 0, stagger: 0.1, duration: 0.3 })
  .from('.hero-ctas > *', { y: 15, opacity: 0, stagger: 0.15, duration: 0.4 })
  .from('.hero-visual', { scale: 0.8, opacity: 0, x: 40, duration: 0.8, ease: 'power3.out' })
  .from('.scroll-indicator', { opacity: 0, duration: 0.3 });
```

---

### J-4. HeroVisual3D (CSS 3D Abstract Object)

A rotating dark geometric shape with champagne highlights. No Three.js needed.

```tsx
// src/components/Hero/HeroVisual3D.tsx
export default function HeroVisual3D() {
  // mousemove handler for parallax tilt
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setTilt({ x, y });
  };

  return (
    <div
      className="w-[400px] h-[400px] lg:w-[500px] lg:h-[500px]"
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div
        className="w-full h-full animate-spin-slow"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* 6 faces of a cube */}
        {/* Each face: absolute, w-full h-full, bg-bg-soft, border border-border-cin,
            with a radial-gradient champagne highlight */}
      </div>
    </div>
  );
}
```

The faces of the cube use:
- Background: `bg-bg-soft` (`#1B1712`)
- Border: `1px solid` `--color-border` (`#3A332B`)
- Highlight: `radial-gradient(circle at 30% 30%, rgba(217,168,91,0.15) 0%, transparent 60%)`
- box-shadow: `inset 0 0 40px rgba(217,168,91,0.05)`

Mobile: Disable `onMouseMove`, use slow CSS rotation only.

---

### J-5. About Section

```tsx
<section id="about" className="py-32 px-6 lg:px-12 max-w-7xl mx-auto">
  <SectionLabel number="01" title="ABOUT" />

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
    {/* LEFT: Editorial text */}
    <div>
      <h2 className="font-headings text-4xl lg:text-5xl text-text-ivory mb-8 leading-tight">
        CSE Student.<br />Frontend Developer.<br />Exploring AI & Quantum Computing.
      </h2>
      <p className="font-body text-text-warm max-w-lg mb-8">{profile.about}</p>

      {/* Identity pills */}
      <div className="flex flex-wrap gap-3 mb-12">
        {["CSE @ SRM University, AP", "Frontend Developer", "AI & Quantum Computing", "Open to Internships"].map(pill => (
          <GlassPanel key={pill} className="!p-3 !rounded-xl" hover={false}>
            <span className="font-labels text-[11px] text-text-muted">{pill}</span>
          </GlassPanel>
        ))}
      </div>

      {/* Experience timeline */}
      {profile.experience.map(exp => (
        <div key={exp.org} className="mb-6 border-l border-border-cin pl-6">
          <p className="font-labels text-[11px] text-accent">{exp.period}</p>
          <h3 className="font-sections text-lg text-text-ivory">{exp.role}</h3>
          <p className="font-body text-sm text-text-warm">{exp.org}</p>
          <div className="flex gap-2 mt-2">
            {exp.tags.map(tag => <TechBadge key={tag} name={tag} />)}
          </div>
        </div>
      ))}
    </div>

    {/* RIGHT: 3D Profile Card */}
    <div className="flex justify-center lg:justify-end">
      <ProfileCard3D />
    </div>
  </div>
</section>
```

---

### J-6. ProfileCard3D (About Section Identity Card)

Port the 3D Profile Card from `assets/animations.md` lines 2419–3060.

**Structure:**
```
┌─────────────────────────────┐
│ PORTFOLIO / 2026    ● AVAIL │  ← header
│                             │
│          JP.                │  ← monogram (instead of portrait)
│     JYOSHNA PILLI           │
│  Frontend Developer · CS    │
│                             │
│    [bio paragraph]          │
│                             │
│ [LinkedIn] [GitHub] [Email] │  ← social links
│                             │
│ DIGITAL IDENTITY    JP — 01 │  ← footer
└─────────────────────────────┘
```

**CSS 3D hover:** Uses an invisible 3×3 grid overlaying the card. Hovering each of the 8 edge/corner cells tilts the card in that direction via CSS `rotate3d()`. A radial shine follows the cursor. Drop shadow offsets in the tilt direction. Uses CSS `:has()` selector for each of the 8 zones.

Key colors:
- Card bg: `linear-gradient(145deg, #1B1712, #12100D)`
- Border: `1px solid rgba(58, 51, 43, 0.8)`
- Shine: `radial-gradient(circle at 50%, rgba(217, 168, 91, 0.15) 10%, transparent 50%)`
- Status dot: `bg-accent` with `box-shadow: 0 0 10px rgba(217, 168, 91, 0.7)`

---

### J-7. Expertise Section

```tsx
<section id="expertise" className="py-32 px-6 lg:px-12 max-w-7xl mx-auto">
  <SectionLabel number="02" title="EXPERTISE" />

  <div className="space-y-0">
    {expertiseItems.map(item => (
      <div key={item.number}
        className="group flex gap-8 lg:gap-16 items-start py-8 border-b border-border-cin
          hover:bg-bg-soft/50 transition-colors duration-500 cursor-default px-4 -mx-4 rounded-lg">

        {/* Number */}
        <span className="font-labels text-4xl lg:text-6xl text-text-muted
          group-hover:text-accent transition-colors duration-500 shrink-0 w-20">
          {item.number}
        </span>

        {/* Content */}
        <div>
          <h3 className="font-sections text-2xl lg:text-3xl text-text-ivory mb-3">{item.title}</h3>
          <p className="font-body text-text-warm mb-4 max-w-lg">{item.description}</p>
          <div className="flex flex-wrap gap-2">
            {item.technologies.map(t => <TechBadge key={t} name={t} />)}
          </div>
        </div>
      </div>
    ))}
  </div>
</section>
```

---

### J-8. Skills Section

```tsx
<section id="skills" className="py-32 px-6 lg:px-12 max-w-7xl mx-auto">
  <SectionLabel number="03" title="SKILLS" />

  <div className="space-y-12">
    {skillGroups.map(group => (
      <div key={group.groupName}>
        <h3 className="font-sections text-xl text-text-ivory mb-4">{group.groupName}</h3>
        <div className="flex flex-wrap gap-3">
          {group.skills.map(skill => (
            <TechBadge key={skill.name} name={skill.name} icon={skill.icon} />
          ))}
        </div>
      </div>
    ))}
  </div>
</section>
```

---

### J-9. Projects Section

**Alternating editorial layout** (odd = image left / text right, even = flipped).

```tsx
<section id="projects" className="py-32 px-6 lg:px-12 max-w-7xl mx-auto">
  <SectionLabel number="04" title="PROJECTS" />

  <div className="space-y-24">
    {projects.map((project, i) => (
      <div key={project.number}
        className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 !== 0 ? 'lg:direction-rtl' : ''}`}>

        {/* Image placeholder */}
        <GlassPanel className={`aspect-video flex items-center justify-center ${i % 2 !== 0 ? 'lg:order-2' : ''}`}>
          <span className="font-labels text-text-muted text-sm">PROJECT PREVIEW</span>
        </GlassPanel>

        {/* Text */}
        <div className={i % 2 !== 0 ? 'lg:order-1' : ''}>
          <p className="font-labels text-5xl text-text-muted/30 mb-4">PROJECT {project.number}</p>
          <p className="font-labels text-sm text-accent mb-2">{project.category}</p>
          <h3 className="font-headings text-3xl text-text-ivory mb-4">{project.name}</h3>
          <p className="font-body text-text-warm mb-6">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map(t => <TechBadge key={t} name={t} />)}
          </div>
          <div className="flex gap-6">
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="font-labels text-xs text-text-ivory hover:text-accent transition-colors inline-flex items-center gap-1">
              GitHub <img src="/assets/icons/arrow-up-right.svg" alt="" className="w-3 h-3" />
            </a>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="font-labels text-xs text-text-ivory hover:text-accent transition-colors inline-flex items-center gap-1">
              Live Demo <img src="/assets/icons/external-link.svg" alt="" className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>
```

---

### J-10. Certifications Section

```tsx
<section id="certifications" className="py-32 px-6 lg:px-12 max-w-7xl mx-auto">
  <SectionLabel number="05" title="CERTIFICATIONS & ACHIEVEMENTS" />

  <div className="space-y-8">
    {certifications.map((cert, i) => (
      <div key={i} className="flex gap-8 items-start">
        <span className="font-labels text-sm text-text-muted shrink-0 w-16">{cert.year}</span>
        <div className="border-l border-border-cin pl-8 pb-2">
          <h3 className="font-sections text-xl text-text-ivory">{cert.title}</h3>
          <p className="font-labels text-xs text-accent mt-1">{cert.organization}</p>
          <p className="font-body text-sm text-text-warm mt-2">{cert.description}</p>
        </div>
      </div>
    ))}
  </div>
</section>
```

---

### J-11. Contact Section

```tsx
<section id="contact" className="py-32 px-6 lg:px-12 max-w-7xl mx-auto">
  <SectionLabel number="06" title="CONTACT" />

  <h2 className="font-headings text-4xl lg:text-6xl text-text-ivory mb-6 leading-tight">
    LET'S BUILD<br />SOMETHING TOGETHER
  </h2>

  <p className="font-body text-text-warm max-w-lg mb-12">
    Open to collaboration, internships, hackathons, and technology-driven projects.
    Let's connect and create something exceptional.
  </p>

  {/* Contact links */}
  <div className="flex flex-wrap gap-4 mb-12">
    <a href="https://www.linkedin.com/in/jyoshna-pilli-694aa23a9" target="_blank"
      className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border-cin
        font-labels text-xs text-text-ivory hover:border-accent hover:text-accent transition-all">
      <img src="/assets/icons/linkedin.svg" alt="" className="w-4 h-4" /> LinkedIn
    </a>
    <a href="https://github.com/jyoshnapilli28-ctrl" target="_blank"
      className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border-cin
        font-labels text-xs text-text-ivory hover:border-accent hover:text-accent transition-all">
      <img src="/assets/icons/github.svg" alt="" className="w-4 h-4" /> GitHub
    </a>
    <a href="mailto:jyoshnapilli28@gmail.com"
      className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border-cin
        font-labels text-xs text-text-ivory hover:border-accent hover:text-accent transition-all">
      <img src="/assets/icons/email.svg" alt="" className="w-4 h-4" /> Email
    </a>
  </div>

  {/* Contact form */}
  <GlassPanel className="max-w-2xl !p-8">
    <form className="space-y-6">
      {/* Each input: bg-bg-soft border border-border-cin rounded-xl px-4 py-3
          text-text-ivory font-body focus:border-accent focus:outline-none
          focus:ring-1 focus:ring-accent/30 transition-colors */}
      <input type="text" placeholder="Your Name" ... />
      <input type="email" placeholder="Your Email" ... />
      <input type="text" placeholder="Subject" ... />
      <textarea placeholder="Your Message" rows={5} ... />
      <CTAButton variant="primary" icon={<ArrowRightIcon />}>SEND MESSAGE</CTAButton>
    </form>
  </GlassPanel>
</section>
```

Input styling pattern:
```
className="w-full bg-bg-soft border border-border-cin rounded-xl px-4 py-3
  text-text-ivory font-body placeholder:text-text-muted/50
  focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30
  transition-colors duration-300"
```

---

### J-12. Footer

```tsx
<footer className="border-t border-border-cin py-16 px-6 lg:px-12">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
    <div className="text-center md:text-left">
      <p className="font-headings text-2xl text-text-ivory mb-2">JP.</p>
      <p className="font-body text-sm text-text-muted">
        CSE @ SRM-AP · Building Interactive Digital Experiences
      </p>
    </div>

    <div className="flex gap-4">
      {/* Social icons: 40×40 rounded-full border border-border-cin, centered icon */}
    </div>

    <div className="text-center md:text-right">
      <p className="font-body text-xs text-text-muted">
        © 2025 Jyoshna Pilli. All rights reserved.
      </p>
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="font-labels text-[10px] text-text-muted hover:text-accent mt-2 transition-colors">
        BACK TO TOP ↑
      </button>
    </div>
  </div>
</footer>
```

---

## SECTION K — GSAP ANIMATION PATTERNS

### Install

```bash
npm install gsap
```

### Import in any component

```ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

### Custom hook: `useGSAP`

```ts
// src/hooks/useGSAP.ts
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function useGSAP(callback: (ctx: gsap.Context) => void, deps: any[] = []) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => callback(ctx), ref.current!);
    return () => ctx.revert();
  }, deps);
  return ref;
}
```

### ScrollTrigger per-section pattern

```ts
// Inside any section component
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.from('.my-element', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
      },
    });
  }, sectionRef.current!);
  return () => ctx.revert();
}, []);
```

### Reduced motion check

```ts
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) return; // skip GSAP animations
```

---

## SECTION L — ANIMATION COMPONENTS (from assets/animations.md)

Five pre-built animation components are available in `assets/animations.md`. Extract them into `src/components/animations/`.

### L-1. NeonBorder (lines 1–380)

**Extract to:** `src/components/animations/NeonBorder.tsx`

**Change:** Default `color` from `"#CC9149"` to `"#D9A85B"` (matches `--color-accent`).

**Usage:**
```tsx
import NeonBorder from '../animations/NeonBorder';

// Wrap any element
<div style={{ position: 'relative' }}>
  <NeonBorder color="#D9A85B" rounded={24} thickness={4} glow={70} speed={12} />
  {/* Your content goes here */}
</div>
```

**Use on:** ProfileCard3D, ProjectCard hover, CTAButton primary

### L-2. AsciiWave (lines 381–1472)

**Extract to:** `src/components/animations/AsciiWave.tsx`

**Usage:**
```tsx
import AsciiWave from '../animations/AsciiWave';

<div style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
  <AsciiWave ink="#3A332B" cell={9} fill={5} speed={6} style={{ width: '100%', height: '100%' }} />
</div>
```

**Use in:** Hero bg (very low opacity), Contact bg (slightly higher opacity)

**Guard:** Skip on mobile with `pointer: coarse` media query check.

### L-3. PathGallery (lines 1473–2321)

**Extract to:** `src/components/animations/PathGallery.tsx`

**Use in:** Projects section (3D image flythrough). Pass project images as `images` prop.

**Guard:** Skip on mobile. Show static grid fallback.

### L-4. InteractiveGrid (concept from lines 2326–2417)

**Implement as:** `src/components/animations/InteractiveGrid.tsx`

Grid of technology icon cards with hover 3D lift + champagne glow. Use in Skills section.

### L-5. ProfileCard3D (lines 2419–3060)

**Port to:** `src/components/About/ProfileCard3D.tsx`

See Section J-6 for the card structure.

---

## SECTION M — APP ASSEMBLY

### `src/App.tsx`

```tsx
import { useState, useEffect } from 'react';
import Preloader from './components/Preloader/Preloader';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Expertise from './components/Expertise/Expertise';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import Certifications from './components/Certifications/Certifications';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <div className={loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
        <Navbar />
        <main>
          <Hero />
          <About />
          <Expertise />
          <Skills />
          <Projects />
          <Certifications />
          <Contact />
        </main>
        <Footer />
      </div>
      <div className="bg-noise-overlay" />
    </>
  );
}
```

### `src/main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

---

## SECTION N — RESPONSIVE RULES

| Breakpoint | CSS | Behavior |
|---|---|---|
| Desktop XL | `xl:` (1280px+) | Full cinematic layout |
| Desktop | `lg:` (1024px) | Slightly reduced type scale |
| Tablet | `md:` (768px) | Hero stacks, nav → hamburger |
| Mobile | `sm:` (640px) | Vertical, simplified 3D, AsciiWave hidden |

**Mobile-first stack order for Hero:**
```
Navbar → "HELLO, I'M" → Name → Title → Description → CTAs → Social → 3D Visual → Scroll
```

**Disable on mobile:**
- AsciiWave (`pointer: coarse` check)
- PathGallery (show static grid)
- InteractiveGrid 3D hover (show flat grid)
- HeroVisual3D mouse parallax (static rotation only)

---

## SECTION O — ACCESSIBILITY CHECKLIST

- `<h1>` = hero name only. One per page.
- `<h2>` = each section heading.
- All `<img>` icons: `aria-hidden="true"` (they are decorative).
- All links/buttons: keyboard-focusable with `focus:ring-accent` outline.
- `prefers-reduced-motion: reduce` → disable GSAP, NeonBorder animation, AsciiWave.
- All form inputs: visible `<label>` or `aria-label`.
- Color contrast: ivory text (#F3EEE5) on dark bg (#090807) = ratio ~18:1 ✓.

---

## SECTION P — VERIFICATION

After coding each section, run:

```bash
npm run dev      # dev server — check visually at localhost:5173
npx tsc --noEmit # type check — must pass with 0 errors
npm run build    # production build — must complete without errors
```

Visual checks:
1. Background is NOT flat black — must show subtle gradients, glow, noise
2. Syne font renders on hero name (check Network tab → Google Fonts loaded)
3. Champagne accent (#D9A85B) appears ≤5% of visual area
4. All 26 SVG icons render at the correct size with `currentColor` inheritance
5. Glass panels have visible blur effect + subtle border
6. Hero GSAP sequence plays: staggered, cinematic, ~4s total
7. Scroll sections reveal with animation (ScrollTrigger)
8. No horizontal overflow at any breakpoint (375px → 1440px)

---

## SECTION Q — FILES TO CREATE (IN ORDER)

```
 1. src/styles/globals.css
 2. tailwind.config.ts
 3. vite.config.ts
 4. index.html (update)
 5. src/data/profile.ts
 6. src/data/navigation.ts
 7. src/data/expertise.ts
 8. src/data/skills.ts
 9. src/data/projects.ts
10. src/data/certifications.ts
11. src/components/animations/NeonBorder.tsx
12. src/components/animations/AsciiWave.tsx
13. src/components/ui/SectionLabel.tsx
14. src/components/ui/TechBadge.tsx
15. src/components/ui/GlassPanel.tsx
16. src/components/ui/CTAButton.tsx
17. src/components/ui/ScrollIndicator.tsx
18. src/components/Preloader/Preloader.tsx
19. src/components/Navbar/Navbar.tsx
20. src/components/Hero/HeroVisual3D.tsx
21. src/components/Hero/HeroText.tsx
22. src/components/Hero/Hero.tsx
23. src/components/About/ProfileCard3D.tsx
24. src/components/About/About.tsx
25. src/components/Expertise/Expertise.tsx
26. src/components/Skills/Skills.tsx
27. src/components/Projects/Projects.tsx
28. src/components/Certifications/Certifications.tsx
29. src/components/Contact/Contact.tsx
30. src/components/Footer/Footer.tsx
31. src/hooks/useGSAP.ts
32. src/App.tsx
33. src/main.tsx
```

**Do NOT skip any file. Do NOT change the order.**
