# Cinematic Portfolio Background System

This folder defines the background architecture and visual assets for the portfolio, matching the dark, editorial, futuristic, and cinematic design specifications.

---

## 1. Visual Composition & Layers

The background is constructed as a non-intrusive, high-depth environment that never competes with typography, portrait imagery, or interactive 3D elements:

| Layer | Type | Implementation | Visual Purpose |
|---|---|---|---|
| **Layer 1: Base Dark Space** | CSS Color & Radials | `#090807`, `#12100D` | Prevents flat black; creates deep obsidian foundation |
| **Layer 2: Ambient Glow & Falloff** | CSS Radial Gradients | `rgba(217, 168, 91, 0.08)` | Soft, diffused warm champagne light around key focal areas |
| **Layer 3: Subtle Technical Grid** | CSS/SVG Pattern | 80px masked linear grid | Conveys technical precision without overt cyberpunk styling |
| **Layer 4: Organic Texture** | SVG Noise Overlay | Data-URI `feTurbulence` (opacity 0.028) | Eliminates color banding on high-res monitors |
| **Layer 5: Edge Vignette** | Radial Vignette | `rgba(0, 0, 0, 0.5 - 0.85)` | Frames content and directs eye focus towards center |
| **Layer 6: Portrait Aura** | Diffused Glow Orb | 500x600px blur(40px) | Creates natural separation behind 3D avatar / portrait |
| **Layer 7: Glass Surface Layer** | Backdrop Blur Card | `rgba(27, 23, 18, 0.65)` + `blur(14px)` | Elevated floating panels with subtle champagne hover reflection |

---

## 2. Generated Background Image Assets

Located in `assets/images/` and `assets/backgrounds/`:

1. **`cinematic_dark_bg.jpg`**: 
   - General cinematic technology background.
   - Deep obsidian shadows with subtle champagne ambient falloff and dark edge vignette.
   - 100% abstract: zero text, zero UI elements, zero distracting artifacts.

2. **`hero_cinematic_bg.jpg`**: 
   - Dramatic Hero section background.
   - Clear negative space on the left for large hero typography.
   - Warm diffused lighting on the right third to naturally backlight the portrait/3D avatar.

---

## 3. Usage & Classes

### In HTML / React Components:

```html
<!-- Whole page root background -->
<body class="cinematic-environment">
  <!-- Subtle tactile grain overlay -->
  <div class="bg-noise-overlay" aria-hidden="true"></div>

  <!-- Hero Section -->
  <section class="relative min-h-screen">
    <!-- Atmospheric hero background -->
    <div class="hero-background-layer" aria-hidden="true"></div>
    <div class="bg-tech-grid" aria-hidden="true"></div>
    
    <!-- Hero content -->
    <div class="relative z-10">
      <h1 class="font-headings text-ivory">Creative Technologist</h1>
      <!-- Floating Glass Card -->
      <div class="glass-panel p-6 rounded-xl">
        <p class="font-body text-warm-gray">Building cinematic digital experiences.</p>
      </div>
    </div>
  </section>
</body>
```

---

## 4. Performance & Mobile Considerations

- **Ultra-lightweight:** The primary atmosphere runs on pure CSS gradients and an SVG data-URI texture (~200 bytes).
- **Mobile optimization:** At `<= 768px`, blur filters are reduced from 14px to 8px and heavy shadows are streamlined to ensure steady 60fps scrolling.
- **Accessibility:** Fully supports `prefers-reduced-motion: reduce`.
