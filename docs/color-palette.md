# Color Palette — Cinematic Portfolio

## 1. Design Direction

The visual palette is based on the provided reference image: a **near-black cinematic interface with warm ivory typography and restrained champagne/gold accents**.

The palette should feel:
- Elegant
- Warm
- Premium
- Cinematic
- Minimal
- Editorial

Avoid bright neon colors and overly colorful gradients.

---

## 2. Core Colors

| Token | Hex | Usage |
|---|---|---|
| `--color-bg-primary` | `#090807` | Main page background |
| `--color-bg-secondary` | `#12100D` | Alternate sections / panels |
| `--color-bg-soft` | `#1B1712` | Cards, subtle surfaces |
| `--color-text-primary` | `#F3EEE5` | Main headings and important text |
| `--color-text-secondary` | `#C7C0B5` | Paragraphs and supporting text |
| `--color-text-muted` | `#8E887E` | Small labels / metadata |
| `--color-border` | `#3A332B` | Subtle borders |
| `--color-border-light` | `#5A4D3E` | Hover/focus borders |
| `--color-accent` | `#D9A85B` | Primary gold/champagne accent |
| `--color-accent-light` | `#E8C58F` | Accent hover/highlight |
| `--color-accent-dark` | `#9B713B` | Secondary accent |
| `--color-white` | `#FFFFFF` | High-contrast text when required |
| `--color-black` | `#000000` | Deep overlays |

> These values are implementation-ready approximations of the visual palette. They should be treated as design tokens and adjusted only if visual testing shows a better match.

---

## 3. Background System

### Primary Background

Use:

`#090807`

This should dominate the page and create the deep cinematic foundation.

### Secondary Background

Use:

`#12100D`

Use this for subtle section variation without creating obvious color blocks.

### Soft Surface

Use:

`#1B1712`

Use sparingly for:
- Cards
- Floating UI
- Form fields
- Secondary panels

---

## 4. Typography Colors

### Primary

`#F3EEE5`

Use for:
- Hero name
- Major headings
- Important navigation states
- Primary CTA text where appropriate

### Secondary

`#C7C0B5`

Use for:
- Body copy
- Descriptions
- Supporting information

### Muted

`#8E887E`

Use for:
- Metadata
- Section numbers
- Small labels
- Secondary navigation information

---

## 5. Gold / Champagne Accent

The accent must be **restrained**.

Primary:

`#D9A85B`

Use for:
- Active navigation indicator
- Important labels
- CTA highlights
- Small decorative elements
- Hover states
- Section markers

Light accent:

`#E8C58F`

Use for:
- Hover highlights
- Fine decorative lines
- Selected states

Do not use gold as the main page color.

---

## 6. Borders

Default border:

`#3A332B`

Use for:
- Navigation
- Buttons
- Cards
- Form fields
- Dividers

Hover/focus border:

`#5A4D3E`

Borders should remain subtle.

---

## 7. Gradient Guidance

Gradients should be extremely subtle.

Preferred direction:

```css
background:
  radial-gradient(
    circle at 70% 40%,
    rgba(217, 168, 91, 0.10),
    transparent 40%
  );
```

Use gradients primarily to create:
- Depth
- Warm light
- Atmospheric glow
- Separation between foreground and background

Avoid:
- Rainbow gradients
- Strong neon gradients
- Large saturated color fields

---

## 8. Image Overlay

For portrait/hero imagery, use dark warm overlays where necessary.

Example:

```css
background:
  linear-gradient(
    90deg,
    rgba(9, 8, 7, 0.95) 0%,
    rgba(9, 8, 7, 0.45) 45%,
    rgba(9, 8, 7, 0.10) 100%
  );
```

The overlay should help typography remain readable without hiding the subject.

---

## 9. Interactive States

### Default

Use neutral ivory/gray tones.

### Hover

Introduce a small amount of champagne/gold.

### Active

Use the primary accent:

`#D9A85B`

### Focus

Use a visible but restrained accent border/glow.

Accessibility must remain a priority.

---

## 10. Color Usage Ratio

Recommended visual balance:

- **70–80%** near-black / dark neutrals
- **15–25%** ivory / warm gray typography
- **5% or less** champagne/gold accents

The gold should feel like a premium detail rather than a dominant theme.

---

## 11. Tailwind Mapping

Recommended custom tokens:

```text
bg-cinematic
bg-cinematic-secondary
bg-cinematic-soft
text-ivory
text-warm-gray
text-muted
border-cinematic
accent-champagne
accent-champagne-light
accent-champagne-dark
```

Keep the color system centralized rather than scattering arbitrary hex values throughout components.

---

## 12. Visual Rule

The reference aesthetic depends on **contrast and restraint**.

The most important visual relationship is:

**Near-black background + warm ivory typography + small champagne accents + warm photographic lighting.**

Do not allow secondary colors to compete with the portrait or typography.
