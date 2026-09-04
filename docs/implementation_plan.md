# Premium Cinematic Portfolio — Implementation Plan (Final)

> **Source of Truth**: `docs/project-spec.md`, `docs/designchatgpt.md`, `docs/color-palette.md`, `docs/jyoshnalinkedin.md`, all `docs/*.md` files.
> **Completed Assets**: `assets/fonts/fonts.css`, `assets/colors/colors.css`, `assets/backgrounds/backgrounds.css`, `assets/icons/` (26 SVG icons), `assets/theme.css`.
> **Animation Catalogue**: `assets/animations.md` — 5 ready-to-use animation components catalogued below.
> **User Decision**: No personal portrait. Hero visual = premium 3D abstract object.

---

## Real Profile Data (from `docs/jyoshnalinkedin.md`)

| Field | Real Data |
|---|---|
| **Name** | Jyoshna Pilli |
| **Monogram** | `JP.` |
| **University** | SRM University, Andhra Pradesh |
| **Degree** | Computer Science and Engineering (CSE) |
| **Headline** | AI & Technology · Quantum Computing · CSE @ SRM-AP |
| **Location** | Srikakulam, Andhra Pradesh, India |
| **LinkedIn** | linkedin.com/in/jyoshna-pilli-694aa23a9 |
| **Status** | AVAILABLE FOR INTERNSHIPS |
| **Long-term Goal** | Quantum Researcher at a top MNC |
| **GitHub** | `[YOUR GITHUB URL]` — placeholder |
| **Email** | `[YOUR EMAIL]` — placeholder |

---

## Animation Components Catalogue (from `assets/animations.md`)

Five ready-to-integrate animation components are available in `assets/animations.md`. Each must be extracted into its own file in `src/components/animations/` during Phase 3.

---

### 1. `NeonBorder` — Lines 1–380

**What it does:**
An animated champagne/gold neon light arc that continuously travels around the border of any wrapped component. Uses conic-gradient arcs computed at 60fps via `requestAnimationFrame`. Includes multi-layer glow blur halos.

**Key props:**
```ts
color?: string        // Default: "#CC9149" (matches --color-accent)
rounded?: number      // Border radius %
thickness?: number    // Arc thickness in px
borderSize?: number   // Arc length as % of perimeter
glow?: number         // Glow intensity (0-100)
movement?: "continuous" | "step"
speed?: number        // 1-20
```

**Where to use in this portfolio:**
- `GlassPanel` wrapper on the About identity card — wraps the card with a traveling champagne border
- `ProjectCard` on hover — NeonBorder activates on card hover
- `CTAButton` primary variant — thin traveling border on the primary CTA
- Skills group cards on hover

**Integration note:** Uses `ResizeObserver` + `requestAnimationFrame`, no external deps. Self-contained React component. Use `color="#D9A85B"` to match `--color-accent`.

---

### 2. `AsciiWave` — Lines 381–1472

**What it does:**
A full FLIP fluid simulation rendered as monospace ASCII characters. The pool of "water" responds to mouse movement (velocity brush), touch, and click (radial outward splash). The ASCII characters spell `F L U I D` along diagonal bands. Runs at 60fps via fixed-step physics solver.

**Key props:**
```ts
ink?: string          // Character color (use "--color-text-muted" value)
cell?: number         // Character size in px (default 9)
fill?: number         // Water level 1-20
ripple?: number       // Brush radius 1-20
push?: number         // Push strength 1-20
speed?: number        // Physics speed 1-20
slosh?: number        // Fluid memory (FLIP ratio) 1-20
clickIntensity?: number // Click splash force
```

**Where to use in this portfolio:**
- **Hero section background** — subtle ASCII wave as a textural atmospheric layer behind the hero text (low opacity, muted color `#3A332B` to stay dark)
- **Contact section background** — more visible wave creating an interactive ambient backdrop to the form

**Integration note:** Heavy CPU component. Wrap in `React.lazy()` + `Suspense`. On mobile: skip rendering entirely (check `window.matchMedia("(pointer: coarse)")`). Use `ink` color from `--color-text-muted` (`#8E887E`) or `--color-border` (`#3A332B`) for subtlety.

---

### 3. `PathGallery` — Lines 1473–2321

**What it does:**
A WebGL2-powered 3D scene where many small image planes are scattered along one of five closed 3D curves (Knot, Teardrop, Tangle, Figure Eight, Coil — exported from Blender). The camera rides the curve automatically or on scroll. Planes near the camera swell to fill the frame, then shrink back as the camera passes. One instanced WebGL2 draw call for all planes.

**Key props:**
```ts
images?: string[]     // Array of image URLs to display on planes
path?: number         // 0-4 (which of the 5 Blender curves)
count?: number        // Number of image planes
speed?: number        // Auto-advance speed
damping?: number      // Camera smoothing
zoom?: number         // Max scale when in focus
focus?: number        // Focus distance
scatter?: number      // How far planes spread from the curve
```

**Where to use in this portfolio:**
- **Projects section** — Place project screenshots/mockups as the `images` array. Camera flies through the project images in a 3D curve, creating a cinematic gallery experience. Acts as the top-of-section hero before the detailed project list.
- **Optional: Skills section gallery** — Use tech logo SVGs rasterised as images, flying through a Knot path

**Integration note:** Requires `images` prop (URL strings). For the Projects section, use generated project mockup images or dark placeholder tiles. `minWidth: 1200` and `minHeight: 800` are hardcoded. Wrap in a `min-h-[500px]` container. Disable on mobile (`pointer: coarse` check) and show a static fallback grid.

---

### 4. `InteractiveGrid` — Lines 2326–2417 (described, implementation inline)

**What it does:**
A hover-reactive logo grid. Hovering any card lifts it (CSS 3D `rotateX/Y`) and ripples the lift into its 4 neighbours, creating a "fabric pull" feel. Optional breathing glow pulse on hovered and neighbouring cards. Configurable columns, rows, gap, perspective, tilt, card fill, and shadow.

**Key config:**
```ts
images: string[]      // Logo URLs (tech stack SVGs)
columns: number       // Default 7
rows: number          // Default 6
cardFill: string      // "#1B1712" (--color-bg-soft)
cardBorder: string    // "#3A332B" (--color-border)
glow: boolean         // true
glowStart: string     // "rgba(217, 168, 91, 0.3)" (champagne)
glowEnd: string       // "#D9A85B" (--color-accent)
glowIntensity: number // 40
perspective: number   // 1600
```

**Where to use in this portfolio:**
- **Skills section** — Use this grid to display all tech stack SVG icons in an interactive hoverable grid. Each card shows one `TechBadge` icon. On hover, the card lifts + champagne glow pulses. This replaces the static tag list in the skills section with something far more premium.

**Integration note:** Implement as `src/components/Skills/SkillsGrid.tsx`. Pass the 26 tech SVG icons from `assets/icons/` as the `images` array (rendered inline as `<img src>` tags). On mobile: render static flat grid, no 3D transforms. Colors adapted to match `--color-bg-soft` and `--color-accent`.

---

### 5. `3D Profile Card` — Lines 2419–3060

**What it does:**
A premium physical-style developer identity card. CSS 3D hover with 8-directional tilt using an invisible 3×3 hover grid. Includes:
- Cursor-responsive 3D rotation (10deg max)
- Radial shine/highlight that follows cursor position
- Drop shadow that offsets in the tilt direction
- Card structure: header (label + availability status), profile area (avatar/name/role/bio), social links, footer (DIGITAL IDENTITY label + serial number)
- Spring-physics easing via `linear()` CSS function

**Where to use in this portfolio:**
- **About section** — This becomes the **abstract identity card** replacing the personal portrait. Customize with:
  - Remove `<img>` profile-image → replace with `JP.` monogram in Syne font (massive, ivory, centered)
  - Header: `PORTFOLIO / 2026` + `● AVAILABLE FOR INTERNSHIPS`
  - Name: `JYOSHNA PILLI`
  - Role: `Frontend Developer · CS Student · Quantum Explorer`
  - Bio: real LinkedIn bio text
  - Links: LinkedIn, GitHub, Email
  - Footer: `DIGITAL IDENTITY` + `JP — 01`
  - **Apply NeonBorder around this card** for the traveling champagne border effect
  - Use palette colors: card bg `#1B1712`, border `rgba(58, 51, 43, 0.8)`, shine `rgba(217, 168, 91, 0.15)`

**Integration note:** Convert from standalone HTML/CSS to `src/components/About/ProfileCard3D.tsx`. Adapt `.hover-3d` container to React `useRef` + inline styles or a single `ProfileCard.module.css`. Port the 8-direction `:has()` CSS selectors. Wrap with `NeonBorder` component.

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| UI Framework | React 18 | Component-based architecture |
| Language | TypeScript | Type safety & maintainability |
| Styling | Tailwind CSS v3 | Responsive utility system |
| Animation | GSAP + ScrollTrigger | Hero, scroll, micro-interactions |
| Custom Animations | `NeonBorder`, `AsciiWave`, `PathGallery`, `InteractiveGrid`, `3DProfileCard` | Premium interactive effects |
| 3D Visual | CSS 3D (primary) / Three.js (optional) | Hero immersive object |
| Build Tool | Vite | Fast dev server + bundler |
| Fonts | Google Fonts (via CSS import) | Syne, Outfit, Space Mono, Inter |
| Icons | Custom SVG set (`assets/icons/`) | No external icon library |

---

## Project File Structure

```
d:\Projects\portfolio_p1\
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── animations/               <- Extracted from assets/animations.md
│   │   │   ├── NeonBorder.tsx        <- Lines 1-380
│   │   │   ├── AsciiWave.tsx         <- Lines 381-1472
│   │   │   ├── PathGallery.tsx       <- Lines 1473-2321
│   │   │   └── InteractiveGrid.tsx   <- Adapted from lines 2326-2417
│   │   ├── Preloader/
│   │   │   └── Preloader.tsx
│   │   ├── Navbar/
│   │   │   └── Navbar.tsx
│   │   ├── Hero/
│   │   │   ├── Hero.tsx
│   │   │   ├── HeroText.tsx
│   │   │   └── HeroVisual3D.tsx      <- CSS 3D object (no portrait)
│   │   ├── About/
│   │   │   ├── About.tsx
│   │   │   └── ProfileCard3D.tsx     <- Adapted 3D Profile Card (lines 2419-3060)
│   │   ├── Expertise/
│   │   │   └── Expertise.tsx
│   │   ├── Skills/
│   │   │   ├── Skills.tsx
│   │   │   └── SkillsGrid.tsx        <- InteractiveGrid with tech SVG icons
│   │   ├── Projects/
│   │   │   ├── Projects.tsx
│   │   │   ├── ProjectCard.tsx       <- With NeonBorder on hover
│   │   │   └── ProjectsGallery.tsx   <- PathGallery with project images
│   │   ├── Certifications/
│   │   │   └── Certifications.tsx
│   │   ├── Contact/
│   │   │   └── Contact.tsx           <- AsciiWave as background
│   │   ├── Footer/
│   │   │   └── Footer.tsx
│   │   └── ui/
│   │       ├── SectionLabel.tsx
│   │       ├── TechBadge.tsx
│   │       ├── GlassPanel.tsx
│   │       ├── CTAButton.tsx         <- NeonBorder on primary variant
│   │       └── ScrollIndicator.tsx
│   ├── data/
│   │   ├── profile.ts                <- Real data from jyoshnalinkedin.md
│   │   ├── navigation.ts
│   │   ├── skills.ts
│   │   ├── projects.ts
│   │   ├── expertise.ts
│   │   └── certifications.ts
│   ├── hooks/
│   │   ├── useGSAP.ts
│   │   └── useScrollTrigger.ts
│   ├── utils/
│   │   └── animations.ts
│   └── styles/
│       └── globals.css
├── assets/                           <- ALREADY COMPLETE
│   ├── fonts/fonts.css
│   ├── colors/colors.css
│   ├── backgrounds/backgrounds.css
│   ├── icons/ (26 SVGs)
│   ├── animations.md                 <- Source for animation components
│   └── theme.css
└── docs/                             <- REFERENCE ONLY
```

---

## Real Content Data (`src/data/profile.ts`)

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
  about: `Pursuing Computer Science at SRM University–AP, exploring Quantum
    Computing, Full Stack Development, and Web Development, while strengthening
    problem-solving skills through Data Structures and Algorithms.`,
  longTermGoal: "Become a Quantum Researcher and contribute to a top MNC.",
  openTo: ["Collaboration", "Hackathons", "Team Projects", "Internship Opportunities"],
  social: {
    linkedin: "https://www.linkedin.com/in/jyoshna-pilli-694aa23a9",
    github: "[YOUR GITHUB URL]",
    email: "[YOUR EMAIL]",
  },
  experience: [
    {
      role: "Student Member",
      organization: "AWS Student Builder Club, SRM|RMP",
      location: "Vijayawada, Andhra Pradesh",
      period: "Aug 2026 – Present",
      tags: ["AWS", "Cloud Computing", "Community"],
    },
    {
      role: "Member",
      organization: "Singularity Student Lab",
      location: "Vijayawada, Andhra Pradesh",
      period: "Jul 2026 – Present",
      tags: ["Python", "AI & Technology", "Quantum Computing", "Research"],
    },
  ],
};
```

---

## Real Skills Data (`src/data/skills.ts`)

**7 groups — real LinkedIn data + full-stack web dev skills used in this project:**

| Group | Skills | Icons |
|---|---|---|
| Programming Languages | C, C++, Java, Python, JavaScript, TypeScript | `c.svg`, `cpp.svg`, `java.svg`, `python.svg`, `javascript.svg` |
| Frontend Development | HTML5, CSS3, React, TypeScript, Tailwind CSS | `html5.svg`, `css3.svg`, `react.svg` |
| Full Stack & Backend | Node.js, REST APIs, Full Stack Development | `nodejs.svg` |
| Motion & Interaction | GSAP, ScrollTrigger, CSS Animations, 3D Web | *(text tags, champagne highlight)* |
| CS Core | Data Structures, Algorithms, Problem Solving | *(text tags)* |
| Tools & Platforms | Git, GitHub, Figma, VS Code, AWS | `git.svg`, `github.svg`, `figma.svg`, `aws.svg` |
| Emerging Technologies | Quantum Computing, AI & Technology, Cloud Computing | *(champagne-highlighted text tags)* |

**`SkillsGrid` component** uses `InteractiveGrid` with all 26 SVG icons from `assets/icons/` as the card images — giving the skills section a premium interactive 3D grid feel.

---

## Expertise Data (`src/data/expertise.ts`)

| # | Title | Description | Technologies |
|---|---|---|---|
| 01 | Frontend Engineering | Building premium interactive web interfaces using React and modern CSS systems. | React, TypeScript, HTML5, CSS3, Tailwind CSS |
| 02 | Full Stack Development | Developing end-to-end web applications from UI to backend logic and APIs. | Node.js, JavaScript, REST APIs |
| 03 | Motion & Immersive Design | Creating scroll-driven, GSAP-animated, and 3D web experiences. | GSAP, ScrollTrigger, CSS 3D |
| 04 | AI & Quantum Computing | Exploring AI and quantum computing research at the Singularity Lab. | Python, AI, Quantum Computing |
| 05 | Problem Solving & CS Core | Strengthening algorithmic thinking through DSA and competitive problem solving. | C, C++, Java, Data Structures, Algorithms |
| 06 | Cloud & Emerging Tech | Learning AWS cloud infrastructure as an AWS Student Builder member. | AWS, Cloud Computing, Python |

---

## Section-by-Section Animation Assignments

| Section | GSAP | Custom Animation |
|---|---|---|
| Preloader | Curtain exit timeline | — |
| Navbar | Reveal on load, hide/show on scroll | — |
| Hero | 11-step entrance sequence | AsciiWave (subtle bg layer, low opacity) |
| About | Clip-reveal text | **ProfileCard3D** + **NeonBorder** |
| Expertise | Stagger reveal, hover slide-in | — |
| Skills | Stagger tag reveal | **InteractiveGrid** (SkillsGrid) |
| Projects | ScrollTrigger per-card | **PathGallery** (gallery flythrough), **NeonBorder** on hover |
| Certifications | Stagger from left | — |
| Contact | Fade in form | **AsciiWave** (bg) |
| Footer | Gentle fade up | — |

---

## Proposed Changes — Phase by Phase

---

### Phase 1 — Foundation Setup

#### [NEW] `index.html`
```html
<title>Jyoshna Pilli — Frontend Developer & CS Student</title>
<meta name="description" content="Portfolio of Jyoshna Pilli, CSE student at SRM University AP exploring AI, Quantum Computing and building interactive web experiences." />
<meta property="og:title" content="Jyoshna Pilli — Frontend Developer" />
<meta property="og:type" content="website" />
```

#### [NEW] `vite.config.ts` — Vite + React + TS

#### [NEW] `tailwind.config.ts`
```ts
extend: {
  colors: {
    'bg-primary': '#090807', 'bg-secondary': '#12100D', 'bg-soft': '#1B1712',
    'text-ivory': '#F3EEE5', 'text-warm': '#C7C0B5', 'text-muted': '#8E887E',
    'border-cin': '#3A332B', 'accent': '#D9A85B', 'accent-light': '#E8C58F', 'accent-dark': '#9B713B',
  },
  fontFamily: {
    headings: ['Syne', 'sans-serif'],
    sections: ['Outfit', 'sans-serif'],
    labels: ['Space Mono', 'monospace'],
    body: ['Inter', 'sans-serif'],
  }
}
```

#### [NEW] `src/styles/globals.css` — imports `assets/theme.css`

---

### Phase 2 — Extract Animation Components

> [!IMPORTANT]
> Extract all 5 animations from `assets/animations.md` into `src/components/animations/` before building any section components. Other components depend on them.

#### [NEW] `src/components/animations/NeonBorder.tsx`
- Extract lines 1–380 from `animations.md`
- Change default `color` to `"#D9A85B"` to match `--color-accent`
- Export as default `NeonBorder`

#### [NEW] `src/components/animations/AsciiWave.tsx`
- Extract lines 381–1472 from `animations.md`
- Add mobile guard: `if (window.matchMedia("(pointer: coarse)").matches) return null`
- Wrap in `React.lazy()` call-site for performance
- Default `ink` color: `"#3A332B"` (--color-border) for subtle hero bg use

#### [NEW] `src/components/animations/PathGallery.tsx`
- Extract lines 1473–2321 from `animations.md`
- Default `background` to `"#090807"` (--color-bg-primary)
- Mobile guard: `if (pointer: coarse) return <StaticProjectGrid />`

#### [NEW] `src/components/animations/InteractiveGrid.tsx`
- Implement the Interactive Grid concept (lines 2326–2417)
- Props: `items: { icon: string; label: string }[]`, `columns: number`, `glowColor: string`
- Default: `cardFill="#1B1712"`, `cardBorder="#3A332B"`, `glowStart="rgba(217,168,91,0.3)"`, `glowEnd="#D9A85B"`

#### [NEW] `src/components/About/ProfileCard3D.tsx`
- Port the 3D Profile Card (lines 2419–3060) to React
- Replace `<img>` profile photo → `JP.` monogram (Syne, ivory, large)
- Header: `PORTFOLIO / 2026` + `● AVAILABLE FOR INTERNSHIPS`
- Footer: `DIGITAL IDENTITY` + `JP — 01`
- Card colors: `background: linear-gradient(145deg, #1B1712, #12100D)`
- Shine: `rgba(217, 168, 91, 0.15)` (champagne, not white)
- Wrap with `<NeonBorder color="#D9A85B" rounded={28} speed={10} glow={80} />`

---

### Phase 3 — Shared UI Components

#### [NEW] `src/components/ui/SectionLabel.tsx` — `"01 / ABOUT"` Space Mono, muted
#### [NEW] `src/components/ui/TechBadge.tsx` — pill with SVG icon + label
#### [NEW] `src/components/ui/GlassPanel.tsx` — `.glass-panel` styles, accepts NeonBorder
#### [NEW] `src/components/ui/CTAButton.tsx` — primary: `NeonBorder` + filled champagne | secondary: outlined
#### [NEW] `src/components/ui/ScrollIndicator.tsx` — bouncing chevron + "SCROLL"

---

### Phase 4 — Data Files

#### [NEW] `src/data/profile.ts` — Real data from `jyoshnalinkedin.md` (see above)
#### [NEW] `src/data/navigation.ts` — `{ label, href }[]`
#### [NEW] `src/data/expertise.ts` — 6 real expertise items
#### [NEW] `src/data/skills.ts` — 7 skill groups with icon paths
#### [NEW] `src/data/projects.ts` — 3 placeholder projects
#### [NEW] `src/data/certifications.ts` — 2 real memberships + placeholder certs

---

### Phase 5 — Preloader

#### [NEW] `src/components/Preloader/Preloader.tsx`
- `JP.` centered, Syne, ivory
- Thin champagne progress line
- GSAP exit: curtain lifts → Hero fades in, ~1.5s

---

### Phase 6 — Navbar

#### [NEW] `src/components/Navbar/Navbar.tsx`
- Desktop: fixed top, `backdrop-filter: blur(12px)`, `JP.` | links | `RESUME ↗`
- Mobile: hamburger → full-screen overlay with GSAP stagger link reveal
- Active link: champagne gold + dot indicator

---

### Phase 7 — Hero

#### [NEW] `src/components/Hero/HeroText.tsx`
Real content:
- `HELLO, I'M` (Space Mono, champagne, muted)
- `JYOSHNA` (Syne, display clamp 4rem→9rem, ivory)
- `PILLI` (same)
- Separator line (champagne, 60px)
- `FRONTEND DEVELOPER` (Outfit, uppercase, warm-gray)
- Description: real LinkedIn bio summary
- Social: github, linkedin (real URL), email icons
- CTAs: `VIEW PROJECTS` + `CONTACT ME`
- Scroll indicator

#### [NEW] `src/components/Hero/HeroVisual3D.tsx`
- CSS 3D dark geometric object (perspective, GSAP rotation)
- `mousemove` parallax (desktop only)
- Champagne highlight edge + `.portrait-aura-glow`
- Mobile: static animation fallback

#### [NEW] `src/components/Hero/Hero.tsx`
- Assembles HeroText + HeroVisual3D
- Background: `hero_cinematic_bg.jpg` + CSS overlays + `.bg-tech-grid` + `.bg-noise-overlay`
- Lazy-loads `AsciiWave` at very low opacity (`ink="#3A332B"`, `fill=5`) as subtle textural layer
- Full GSAP 11-step entrance sequence

---

### Phase 8 — About (with ProfileCard3D + NeonBorder)

#### [NEW] `src/components/About/About.tsx`
Layout: Left large editorial statement / Right ProfileCard3D

**Left:**
- Section label: `01 / ABOUT`
- Large editorial statement (Syne, ivory):
  > *"CSE Student. Frontend Developer. Exploring AI & Quantum Computing."*
- Real bio paragraph (Inter, warm-gray)
- 4 identity pills: `CSE @ SRM University, AP` · `Frontend Developer` · `AI & Quantum Computing` · `Open to Internships`
- Experience timeline: AWS Student Builder Club + Singularity Lab

**Right:**
- `ProfileCard3D` — the JP. identity card with NeonBorder
- No portrait image used

---

### Phase 9 — Expertise

#### [NEW] `src/components/Expertise/Expertise.tsx`
6 real items (numbered, stacked, hover slide-in bg, number → champagne)

---

### Phase 10 — Skills (with InteractiveGrid)

#### [NEW] `src/components/Skills/Skills.tsx`
- Section label: `03 / SKILLS`
- Group labels + `SkillsGrid` component per group OR unified grid

#### [NEW] `src/components/Skills/SkillsGrid.tsx`
- Uses `InteractiveGrid` with the 26 tech SVG icons from `assets/icons/`
- Props: `cardFill="#1B1712"`, `cardBorder="#3A332B"`, champagne glow
- Desktop: interactive 3D hover lift grid
- Mobile: static flat grid, no 3D

---

### Phase 11 — Projects (with PathGallery + NeonBorder)

#### [NEW] `src/components/Projects/ProjectsGallery.tsx`
- `PathGallery` component at section top
- `images` prop: dark placeholder tiles (CSS-generated, no random stock photos)
- 3D flythrough of project preview images before the detailed list
- Mobile: hidden, static placeholder shown instead

#### [NEW] `src/components/Projects/ProjectCard.tsx`
- Alternating editorial layout (image left/right)
- `NeonBorder` activates on card hover
- GSAP hover: image scale 1.03, arrow +4px, text shift

#### [NEW] `src/components/Projects/Projects.tsx`
- Section label: `04 / PROJECTS`
- Renders `ProjectsGallery` then 3 `ProjectCard` entries
- 3 placeholder projects: Web App, Frontend/UI, AI/ML/Quantum

---

### Phase 12 — Certifications

#### [NEW] `src/components/Certifications/Certifications.tsx`
- Section label: `05 / CERTIFICATIONS & ACHIEVEMENTS`
- Vertical timeline: AWS Builder Club (Aug 2026), Singularity Lab (Jul 2026), + placeholder certs
- ScrollTrigger stagger-reveal from left

---

### Phase 13 — Contact (with AsciiWave)

#### [NEW] `src/components/Contact/Contact.tsx`
- Section label: `06 / CONTACT`
- Heading: `LET'S BUILD SOMETHING TOGETHER` (Syne, very large)
- Real links: LinkedIn (`linkedin.com/in/jyoshna-pilli-694aa23a9`), GitHub (placeholder), Email (placeholder)
- Contact form in `GlassPanel`: Name, Email, Subject, Message, Send button
- `AsciiWave` as background layer (`ink="#3A332B"`, subtle, low fill)
- Mobile: AsciiWave hidden

---

### Phase 14 — Footer

#### [NEW] `src/components/Footer/Footer.tsx`
- `JP.` monogram + tagline: `CSE @ SRM-AP · Building Interactive Digital Experiences`
- Social icons, copyright, back-to-top

---

### Phase 15 — Animation Utilities

#### [NEW] `src/utils/animations.ts` — GSAP utility functions
- `fadeInUp`, `clipReveal`, `staggerReveal`, `drawLine`, `microHover`

#### [NEW] `src/hooks/useGSAP.ts` — context + unmount cleanup
#### [NEW] `src/hooks/useScrollTrigger.ts` — reusable per-section trigger

---

## Responsive Strategy

| Breakpoint | Behavior |
|---|---|
| `xl` 1280px+ | Full layout, PathGallery, AsciiWave, InteractiveGrid |
| `lg` 1024px | Same layout, reduced type scale |
| `md` 768px | Hero stacks, nav → hamburger |
| `sm` 640px | Vertical, mobile-first. PathGallery hidden. InteractiveGrid → static. AsciiWave hidden. |
| `<375px` | Minimum readable, no complex effects |

**Performance guards for animations:**
- `AsciiWave` — `React.lazy` + `pointer: coarse` check (skip on touch)
- `PathGallery` — `pointer: coarse` check (skip on touch)
- `InteractiveGrid` 3D hover — disabled on touch, flat grid shown
- `NeonBorder` — lightweight RAF loop, fine on mobile
- `ProfileCard3D` — CSS-only, fine on mobile (disable hover 3D tilt via media query)

---

## Accessibility Checklist

- [ ] Single `<h1>` — `Jyoshna Pilli`
- [ ] Proper heading hierarchy: `h2` per section, `h3` per subsection
- [ ] All SVG icons: `aria-hidden="true"` or `aria-label`
- [ ] All interactive elements keyboard-focusable with champagne focus outline
- [ ] `prefers-reduced-motion: reduce` disables GSAP + NeonBorder animation
- [ ] `AsciiWave` and `PathGallery` hidden when `prefers-reduced-motion` is set
- [ ] Form inputs have `<label>` or `aria-label`
- [ ] Color contrast meets WCAG AA

---

## Implementation Order (Strict Sequence — 20 Phases)

1. `[ ]` Vite + React + TS + Tailwind project setup
2. `[ ]` `index.html` SEO + meta tags
3. `[ ]` `globals.css` imports `assets/theme.css`
4. `[ ]` `tailwind.config.ts` with color + font tokens
5. `[ ]` **Extract animations**: `NeonBorder.tsx`, `AsciiWave.tsx`, `PathGallery.tsx`, `InteractiveGrid.tsx`
6. `[ ]` All `src/data/` files — real data from `jyoshnalinkedin.md` + placeholders
7. `[ ]` Shared UI components (`SectionLabel`, `TechBadge`, `GlassPanel`, `CTAButton` with NeonBorder, `ScrollIndicator`)
8. `[ ]` `Preloader`
9. `[ ]` `Navbar` (desktop + mobile hamburger)
10. `[ ]` `HeroText` + `HeroVisual3D`
11. `[ ]` `Hero` (full section: bg layers + AsciiWave + GSAP entrance)
12. `[ ]` `ProfileCard3D` (port from animations.md 3D card + wrap with NeonBorder)
13. `[ ]` `About` (editorial left + ProfileCard3D right + experience entries)
14. `[ ]` `Expertise`
15. `[ ]` `SkillsGrid` + `Skills`
16. `[ ]` `ProjectsGallery` (PathGallery) + `ProjectCard` (NeonBorder hover) + `Projects`
17. `[ ]` `Certifications`
18. `[ ]` `Contact` (AsciiWave bg) + form
19. `[ ]` `Footer`
20. `[ ]` GSAP timelines + ScrollTrigger all sections + micro-interactions + responsive polish + a11y audit + `npm run build` check

---

## Content Status Table

| Field | Status | Value |
|---|---|---|
| Full Name | REAL | `Jyoshna Pilli` |
| Monogram | REAL | `JP.` |
| University | REAL | `SRM University, Andhra Pradesh` |
| Degree | REAL | `Computer Science and Engineering (CSE)` |
| LinkedIn URL | REAL | `linkedin.com/in/jyoshna-pilli-694aa23a9` |
| Experience 1 | REAL | AWS Student Builder Club (Aug 2026 – Present) |
| Experience 2 | REAL | Singularity Student Lab (Jul 2026 – Present) |
| Skills | REAL + EXPANDED | 7 groups including full-stack web dev |
| GitHub URL | PLACEHOLDER | `https://github.com/jyoshnapilli28-ctrl` |
| Email | PLACEHOLDER | `jyoshnapilli28@gmail.com` |
| Projects | PLACEHOLDER | `Portfolio_P1` |
| Experience | PLACEHOLDER | `Singularity Student Lab, AWS Student Builder Club` |
| Resume PDF | PLACEHOLDER | `#` (disabled until PDF provided) |

