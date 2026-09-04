// Neon Border — Originkit
// Using component defaults.

"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";

type Movement = "continuous" | "step";

type Props = {
    color?: string;
    rounded?: number;
    thickness?: number;
    borderSize?: number;
    glow?: number;
    movement?: Movement;
    speed?: number;
    style?: React.CSSProperties;
};

const DEFAULTS = {
    color: "#CC9149",
    rounded: 24,
    thickness: 6,
    borderSize: 50,
    glow: 100,
    movement: "continuous" as const,
    speed: 16,
};

const EDGE_COPIES = 2;
const GLOW_LAYERS = [
    { blur: 8, opacity: 0.5, reach: 0.3 },
    { blur: 15, opacity: 0.3, reach: 0.6 },
    { blur: 57, opacity: 0.18, reach: 1 },
];
const MAX_GLOW_BLUR = Math.max(...GLOW_LAYERS.map((l) => l.blur));
const MAX_GLOW_REACH = 36;

function withAlpha(input: string, alpha: number) {
    const a = Math.max(0, Math.min(1, alpha));
    if (typeof input !== "string") return `rgba(0,0,0,${a})`;
    const s = input.trim();

    const hex = s.match(/^#([0-9a-f]{3,8})$/i);
    if (hex) {
        let h = hex[1];
        if (h.length === 3 || h.length === 4) {
            h = h
                .split("")
                .map((c) => c + c)
                .join("");
        }
        const n = parseInt(h.slice(0, 6), 16);
        if (!Number.isFinite(n)) return `rgba(0,0,0,${a})`;
        return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
    }

    const rgb = s.match(/^rgba?\(([^)]+)\)/i);
    if (rgb) {
        const parts = rgb[1].split(",").map((v) => parseFloat(v));
        if (parts.length >= 3 && parts.slice(0, 3).every(Number.isFinite)) {
            return `rgba(${parts[0]},${parts[1]},${parts[2]},${a})`;
        }
    }
    return `rgba(0,0,0,${a})`;
}

function perimeterPoint(u: number, w: number, h: number): [number, number] {
    const d = (((u % 1) + 1) % 1) * 2 * (w + h);
    if (d < w) return [d, 0];
    if (d < w + h) return [w, d - w];
    if (d < w * 2 + h) return [w - (d - w - h), h];
    return [0, h - (d - w * 2 - h)];
}

function cornerLap(k: number, w: number, h: number) {
    const p = 2 * (w + h);
    const at = [0, w / p, (w + h) / p, (w * 2 + h) / p];
    return Math.floor(k / 4) + at[((k % 4) + 4) % 4];
}

function perimeterAngle(u: number, w: number, h: number) {
    const [x, y] = perimeterPoint(u, w, h);
    return (Math.atan2(x - w / 2, h / 2 - y) * 180) / Math.PI;
}

const ARC_SAMPLES = 24;
const MIN_ARC = 0.015;

function buildArc(
    lap: number,
    lengthPct: number,
    w: number,
    h: number,
    color: string
) {
    const fw = w > 0 ? w : 100;
    const fh = h > 0 ? h : 100;

    const len = Math.max(0, Math.min(100, lengthPct));
    const span = Math.max(MIN_ARC, (len / 100) * 0.5);
    const solidT = len / 100;

    const stops: string[] = [];
    let base = 0;
    let prev = 0;
    let acc = 0;

    for (let i = 0; i <= ARC_SAMPLES; i++) {
        const f = i / ARC_SAMPLES;
        const angle = perimeterAngle(lap + (f - 0.5) * span, fw, fh);
        if (i === 0) {
            base = angle;
        } else {
            let d = angle - prev;
            while (d > 180) d -= 360;
            while (d < -180) d += 360;
            acc += d;
        }
        prev = angle;

        const t = Math.abs(f - 0.5) * 2;
        const k =
            solidT >= 1 ? 1 : t <= solidT ? 1 : 1 - (t - solidT) / (1 - solidT);
        stops.push(
            `${withAlpha(color, k * k * (3 - 2 * k))} ${acc.toFixed(2)}deg`
        );
    }

    const end = acc.toFixed(2);
    stops.push(`${withAlpha(color, 0)} ${end}deg`);
    stops.push(`${withAlpha(color, 0)} 360deg`);

    return `conic-gradient(from ${base.toFixed(2)}deg at 50% 50%, ${stops.join(
        ", "
    )})`;
}

const SLOWEST_CYCLE = 30;
const FASTEST_CYCLE = 4;
const SLOWEST_STEP = 3;
const FASTEST_STEP = 0.35;
const STEP_EASE = [0.72, 0.16, 0.18, 1.05];
const GLIDE_EASE = [0.65, 0, 0.35, 1];

function makeEaseFn(pts: number[]) {
    const [x1, y1, x2, y2] = pts;
    if (x1 === y1 && x2 === y2) return (t: number) => t;
    const bez = (a: number, b: number, t: number) => {
        const u = 1 - t;
        return 3 * u * u * t * a + 3 * u * t * t * b + t * t * t;
    };
    return (t: number) => {
        const x = Math.max(0, Math.min(1, t));
        let s = x;
        for (let i = 0; i < 8; i++) {
            const cx = bez(x1, x2, s) - x;
            const u = 1 - s;
            const dx =
                3 * u * u * x1 + 6 * u * s * (x2 - x1) + 3 * s * s * (1 - x2);
            if (Math.abs(dx) < 1e-6) break;
            s -= cx / dx;
            s = Math.max(0, Math.min(1, s));
        }
        return bez(y1, y2, s);
    };
}

const stepEase = makeEaseFn(STEP_EASE);
const glideEase = makeEaseFn(GLIDE_EASE);

const BAND_MASK: React.CSSProperties = {
    WebkitMaskImage: "linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)",
    WebkitMaskClip: "content-box, border-box",
    WebkitMaskComposite: "xor",
    maskImage: "linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)",
    maskClip: "content-box, border-box",
    maskComposite: "exclude",
};

export default function NeonBorder(props: Props) {
    const {
        color = DEFAULTS.color,
        rounded = DEFAULTS.rounded,
        thickness = DEFAULTS.thickness,
        borderSize = DEFAULTS.borderSize,
        glow = DEFAULTS.glow,
        movement = DEFAULTS.movement,
        speed = DEFAULTS.speed,
        style,
    } = props;

    const groupARef = useRef<HTMLDivElement>(null);
    const groupBRef = useRef<HTMLDivElement>(null);

    const live = useRef({ speed, movement, borderSize, color });
    live.current = { speed, movement, borderSize, color };

    const rootRef = useRef<HTMLDivElement>(null);
    const sizeRef = useRef({ w: 0, h: 0 });
    const [size, setSize] = useState({ w: 0, h: 0 });

    useEffect(() => {
        const el = rootRef.current;
        if (!el || typeof ResizeObserver === "undefined") return;
        const ro = new ResizeObserver(() => {
            const r = el.getBoundingClientRect();
            if (r.width === sizeRef.current.w && r.height === sizeRef.current.h)
                return;
            sizeRef.current = { w: r.width, h: r.height };
            setSize(sizeRef.current);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        let raf = 0;
        let last = performance.now();
        let lap = 0;
        let corner = 0;
        let stepT = 0;

        const frame = (now: number) => {
            const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
            last = now;
            const p = live.current;
            const s = Math.max(0, Math.min(20, p.speed));

            if (s > 0) {
                const step = p.movement === "step";
                const beat = step
                    ? SLOWEST_STEP +
                      ((FASTEST_STEP - SLOWEST_STEP) * (s - 1)) / 19
                    : (SLOWEST_CYCLE +
                          ((FASTEST_CYCLE - SLOWEST_CYCLE) * (s - 1)) / 19) /
                      4;

                stepT += dt / beat;
                while (stepT >= 1) {
                    stepT -= 1;
                    corner += 1;
                }
                const eased = step
                    ? stepEase(Math.min(1, stepT * 2))
                    : glideEase(stepT);

                const { w, h } = sizeRef.current;
                const fw = w > 0 ? w : 100;
                const fh = h > 0 ? h : 100;
                const from = cornerLap(corner, fw, fh);
                const to = cornerLap(corner + 1, fw, fh);
                lap = from + (to - from) * eased;

                const a = groupARef.current;
                if (a) {
                    a.style.setProperty(
                        "--arc",
                        buildArc(lap, p.borderSize, w, h, p.color)
                    );
                }
                const b = groupBRef.current;
                if (b) {
                    b.style.setProperty(
                        "--arc",
                        buildArc(lap + 0.5, p.borderSize, w, h, p.color)
                    );
                }
            }

            raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);

        return () => cancelAnimationFrame(raf);
    }, []);

    const thick = Math.max(1, Math.min(10, thickness));

    const radius =
        (Math.max(0, Math.min(100, rounded)) / 100) *
        (Math.min(size.w, size.h) / 2);

    const amount = Math.max(0, Math.min(100, glow)) / 100;

    const ringAt = (share: number) => thick + amount * MAX_GLOW_REACH * share;
    const glowOuter = 10 + MAX_GLOW_REACH + MAX_GLOW_BLUR * 2;

    const band = (r: number, offset = 0) => (
        <div
            style={{
                position: "absolute",
                inset: offset - r,
                boxSizing: "border-box",
                padding: r,
                borderRadius: radius > 0 ? radius + r : 0,
                background: "var(--arc)",
                ...BAND_MASK,
            }}
        />
    );

    const glowLayer = (
        key: string,
        r: number,
        blurPx: number,
        opacity: number
    ) => (
        <div
            key={key}
            style={{
                position: "absolute",
                inset: -glowOuter,
                boxSizing: "border-box",
                padding: glowOuter,
                borderRadius: radius > 0 ? radius + glowOuter : 0,
                opacity,
                mixBlendMode: "plus-lighter",
                filter: blurPx ? `blur(${blurPx.toFixed(1)}px)` : "none",
                WebkitFilter: blurPx ? `blur(${blurPx.toFixed(1)}px)` : "none",
                ...BAND_MASK,
            }}
        >
            {band(r, glowOuter)}
        </div>
    );

    const glowGroup = (start: number, ref: React.Ref<HTMLDivElement>) => (
        <div
            ref={ref}
            style={
                {
                    position: "absolute",
                    inset: 0,
                    overflow: "visible",
                    pointerEvents: "none",
                    "--arc": buildArc(start, borderSize, size.w, size.h, color),
                } as React.CSSProperties
            }
        >
            {amount > 0 &&
                GLOW_LAYERS.map((l, i) =>
                    glowLayer(`glow-${i}`, ringAt(l.reach), l.blur, l.opacity)
                )}
            {Array.from({ length: EDGE_COPIES }).map((_, i) => (
                <div
                    key={`edge-${i}`}
                    style={{
                        position: "absolute",
                        inset: 0,
                        mixBlendMode: "plus-lighter",
                    }}
                >
                    {band(thick)}
                </div>
            ))}
        </div>
    );

    return (
        <div
            ref={rootRef}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                flexShrink: 0,
                borderRadius: radius,
                ...style,
            }}
        >
            {glowGroup(0, groupARef)}
            {glowGroup(0.5, groupBRef)}
        </div>
    );
}


// Ascii Water — Originkit
// Using component defaults.

"use client"

import * as React from "react"
import { useEffect, useRef } from "react"

/**
 * Ascii Wave — a pool of water seen as monospace type, stirred by the cursor.
 *
 * The fluid is a FLIP simulation (particles carry the velocity, a staggered
 * grid makes it incompressible) after Matthias Müller's ten-minute-physics
 * solver, by way of javierbyte/fluid-triangle, which is where the ASCII readout
 * comes from: each cell picks a glyph from a ramp chosen by (row + column), so
 * five ramps interleave and the surface spells FLUID along its diagonals.
 *
 * The source hangs a solid triangle off the pointer and ploughs it through the
 * water. That triangle is gone here. Dragging a solid body does work, but it
 * punches a hole the shape of itself into the type — which is the shape we were
 * asked to remove. So the pointer is a velocity brush instead: particles it
 * passes over are blended toward the cursor's own velocity, which pushes waves
 * without occupying any cells, and the field of characters stays unbroken.
 *
 * Why a grid this coarse is fine: nothing is ever drawn smaller than one
 * character, so simulating below the character cell would be invisible work.
 */

const GRAVITY = -9.81

// One character of margin sideways and two top and bottom sit outside the
// readout, so the tank walls — which the solver pins to zero velocity — never
// show up as a stalled band of glyphs along the edge.
const CROP_X = 1
const CROP_Y = 2

// The tank is always two units tall; every other length derives from that.
const SIM_HEIGHT = 2.0

// Tank units per second. Below the minimum the cursor counts as parked and the
// brush is off entirely; the maximum is what one violent flick is allowed to
// hand the water, which is already several tank-heights a second.
const STIR_MIN_SPEED = 0.15
const STIR_MAX_SPEED = 15

// Tank units per second handed to a click's outward splash at 100% Click
// Intensity — roughly what a firm flick already does via the hover brush.
const CLICK_BASE_STRENGTH = 6

const PRESSURE_ITERS = 30
const PARTICLE_ITERS = 2
const OVER_RELAXATION = 1.9

const FONT_STACK =
    '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'

// Glyph, and how many lit pixels it shows at a fixed size — the ramps are
// ordered by that measured weight rather than by eye, so density reads evenly.
type Glyph = [string, number]

const BASE: Glyph[] = [
    ["~", 12198],
    [":", 6921],
    ["-", 5589],
    ["·", 3267],
    [" ", 0],
    [" ", 0],
]

const RAMPS: Glyph[][] = [
    [["F", 26574], ["F", 26574], ["f", 17490], ...BASE],
    [["L", 21327], ["L", 21327], ["l", 14019], ...BASE],
    [["U", 32973], ["U", 32973], ["u", 24093], ...BASE],
    [["I", 14883], ["I", 14883], ["i", 13638], ...BASE],
    [["D", 36198], ["D", 36198], ["d", 30762], ...BASE],
]

// Sorted once here. The original sorted inside the render loop, which re-sorted
// five arrays for every cell of every frame.
const DICTS = RAMPS.map((ramp) =>
    [...ramp]
        .sort((a, b) => a[1] - b[1])
        .map(([char]) => char)
        .join("")
)

const DEFAULTS = {
    ink: "#00E8FF",
    cell: 9,
    fill: 10,
    ripple: 20,
    push: 20,
    speed: 8,
    slosh: 16,
    clickIntensity: 58,
}

type Config = typeof DEFAULTS

function clamp(v: number, lo: number, hi: number, fallback: number): number {
    const n = typeof v === "number" && isFinite(v) ? v : fallback
    return Math.max(lo, Math.min(hi, n))
}

/** Panel values are whole numbers; the solver wants the real ones. */
function settingsFor(cfg: Config) {
    return {
        cell: clamp(cfg.cell, 4, 24, DEFAULTS.cell),
        // Fraction of the tank that holds water at rest.
        waterLevel: 0.15 + clamp(cfg.fill, 1, 20, DEFAULTS.fill) * 0.04,
        // Fixed timestep — see the note in step().
        dt: (1 / 60) * (0.05 + clamp(cfg.speed, 1, 20, DEFAULTS.speed) * 0.04),
        // How much of each particle's own velocity survives the grid solve. Low
        // is syrup that forgets its motion; high keeps the small swirls alive,
        // and past about 0.95 the surface never settles at all.
        flipRatio: 0.6 + clamp(cfg.slosh, 1, 20, DEFAULTS.slosh) * 0.018,
        // Brush radius in tank units, and the tank is 2 units tall.
        radius: 0.05 + clamp(cfg.ripple, 1, 20, DEFAULTS.ripple) * 0.02,
        push: clamp(cfg.push, 0, 20, DEFAULTS.push) * 0.05,
        // A click's outward splash, as a fraction of the base strength.
        clickPush:
            CLICK_BASE_STRENGTH *
            (clamp(cfg.clickIntensity, 0, 200, DEFAULTS.clickIntensity) *
                0.01),
    }
}

const U_FIELD = 0
const FLUID_CELL = 0
const AIR_CELL = 1
const SOLID_CELL = 2

type Stir = {
    x: number
    y: number
    r: number
    vx: number
    vy: number
    strength: number
}

class FlipFluid {
    density: number
    fNumX: number
    fNumY: number
    h: number
    fInvSpacing: number
    fNumCells: number
    u: Float32Array
    v: Float32Array
    du: Float32Array
    dv: Float32Array
    prevU: Float32Array
    prevV: Float32Array
    p: Float32Array
    s: Float32Array
    cellType: Int32Array
    cellColor: Float32Array
    maxParticles: number
    particlePos: Float32Array
    particleVel: Float32Array
    particleDensity: Float32Array
    particleRestDensity = 0
    particleRadius: number
    pInvSpacing: number
    pNumX: number
    pNumY: number
    pNumCells: number
    numCellParticles: Int32Array
    firstCellParticle: Int32Array
    cellParticleIds: Int32Array
    numParticles = 0

    constructor(
        density: number,
        width: number,
        height: number,
        spacing: number,
        particleRadius: number,
        maxParticles: number
    ) {
        this.density = density
        this.fNumX = Math.floor(width / spacing)
        this.fNumY = Math.floor(height / spacing)
        this.h = Math.max(width / this.fNumX, height / this.fNumY)
        this.fInvSpacing = 1.0 / this.h
        this.fNumCells = this.fNumX * this.fNumY

        this.u = new Float32Array(this.fNumCells)
        this.v = new Float32Array(this.fNumCells)
        this.du = new Float32Array(this.fNumCells)
        this.dv = new Float32Array(this.fNumCells)
        this.prevU = new Float32Array(this.fNumCells)
        this.prevV = new Float32Array(this.fNumCells)
        this.p = new Float32Array(this.fNumCells)
        this.s = new Float32Array(this.fNumCells)
        this.cellType = new Int32Array(this.fNumCells)
        this.cellColor = new Float32Array(3 * this.fNumCells)

        this.maxParticles = maxParticles
        this.particlePos = new Float32Array(2 * maxParticles)
        this.particleVel = new Float32Array(2 * maxParticles)
        this.particleDensity = new Float32Array(this.fNumCells)

        this.particleRadius = particleRadius
        this.pInvSpacing = 1.0 / (2.2 * particleRadius)
        this.pNumX = Math.floor(width * this.pInvSpacing) + 1
        this.pNumY = Math.floor(height * this.pInvSpacing) + 1
        this.pNumCells = this.pNumX * this.pNumY

        this.numCellParticles = new Int32Array(this.pNumCells)
        this.firstCellParticle = new Int32Array(this.pNumCells + 1)
        this.cellParticleIds = new Int32Array(maxParticles)
    }

    integrateParticles(dt: number, gravity: number) {
        for (let i = 0; i < this.numParticles; i++) {
            this.particleVel[2 * i + 1] += dt * gravity
            this.particlePos[2 * i] += this.particleVel[2 * i] * dt
            this.particlePos[2 * i + 1] += this.particleVel[2 * i + 1] * dt
        }
    }

    /**
     * The pointer, as a brush on particle velocity.
     *
     * Blending toward the cursor velocity rather than adding to it keeps a fast
     * flick from launching the water off the top of the frame: the fastest a
     * particle can end up moving is exactly as fast as the cursor did.
     */
    stirParticles(stir: Stir) {
        const r2 = stir.r * stir.r
        for (let i = 0; i < this.numParticles; i++) {
            const dx = this.particlePos[2 * i] - stir.x
            const dy = this.particlePos[2 * i + 1] - stir.y
            const d2 = dx * dx + dy * dy
            if (d2 > r2) continue
            const w = (1 - Math.sqrt(d2) / stir.r) * stir.strength
            this.particleVel[2 * i] += (stir.vx - this.particleVel[2 * i]) * w
            this.particleVel[2 * i + 1] +=
                (stir.vy - this.particleVel[2 * i + 1]) * w
        }
    }

    /**
     * A click, as a radial outward + upward kick — distinct from the hover
     * brush, which only ever blends particles toward the cursor's own
     * velocity. The upward bias is what makes it read as a splash: gravity
     * and the incompressible solve pull the kicked water back down and out
     * across the surface on their own, rather than it just shoving sideways.
     */
    splashParticles(x: number, y: number, r: number, strength: number) {
        const r2 = r * r
        for (let i = 0; i < this.numParticles; i++) {
            const dx = this.particlePos[2 * i] - x
            const dy = this.particlePos[2 * i + 1] - y
            const d2 = dx * dx + dy * dy
            if (d2 > r2 || d2 === 0) continue
            const d = Math.sqrt(d2)
            const w = (1 - d / r) * strength
            this.particleVel[2 * i] += (dx / d) * w
            this.particleVel[2 * i + 1] += (dy / d) * w + w * 0.5
        }
    }

    pushParticlesApart(numIters: number) {
        this.numCellParticles.fill(0)

        for (let i = 0; i < this.numParticles; i++) {
            const xi = clamp(
                Math.floor(this.particlePos[2 * i] * this.pInvSpacing),
                0,
                this.pNumX - 1,
                0
            )
            const yi = clamp(
                Math.floor(this.particlePos[2 * i + 1] * this.pInvSpacing),
                0,
                this.pNumY - 1,
                0
            )
            this.numCellParticles[xi * this.pNumY + yi]++
        }

        let first = 0
        for (let i = 0; i < this.pNumCells; i++) {
            first += this.numCellParticles[i]
            this.firstCellParticle[i] = first
        }
        this.firstCellParticle[this.pNumCells] = first

        for (let i = 0; i < this.numParticles; i++) {
            const xi = clamp(
                Math.floor(this.particlePos[2 * i] * this.pInvSpacing),
                0,
                this.pNumX - 1,
                0
            )
            const yi = clamp(
                Math.floor(this.particlePos[2 * i + 1] * this.pInvSpacing),
                0,
                this.pNumY - 1,
                0
            )
            const cellNr = xi * this.pNumY + yi
            this.firstCellParticle[cellNr]--
            this.cellParticleIds[this.firstCellParticle[cellNr]] = i
        }

        const minDist = 2.0 * this.particleRadius
        const minDist2 = minDist * minDist

        for (let iter = 0; iter < numIters; iter++) {
            for (let i = 0; i < this.numParticles; i++) {
                const px = this.particlePos[2 * i]
                const py = this.particlePos[2 * i + 1]

                const pxi = Math.floor(px * this.pInvSpacing)
                const pyi = Math.floor(py * this.pInvSpacing)
                const x0 = Math.max(pxi - 1, 0)
                const y0 = Math.max(pyi - 1, 0)
                const x1 = Math.min(pxi + 1, this.pNumX - 1)
                const y1 = Math.min(pyi + 1, this.pNumY - 1)

                for (let xi = x0; xi <= x1; xi++) {
                    for (let yi = y0; yi <= y1; yi++) {
                        const cellNr = xi * this.pNumY + yi
                        const start = this.firstCellParticle[cellNr]
                        const last = this.firstCellParticle[cellNr + 1]
                        for (let j = start; j < last; j++) {
                            const id = this.cellParticleIds[j]
                            if (id === i) continue
                            let dx = this.particlePos[2 * id] - px
                            let dy = this.particlePos[2 * id + 1] - py
                            const d2 = dx * dx + dy * dy
                            if (d2 > minDist2 || d2 === 0.0) continue
                            const d = Math.sqrt(d2)
                            const s = (0.5 * (minDist - d)) / d
                            dx *= s
                            dy *= s
                            this.particlePos[2 * i] -= dx
                            this.particlePos[2 * i + 1] -= dy
                            this.particlePos[2 * id] += dx
                            this.particlePos[2 * id + 1] += dy
                        }
                    }
                }
            }
        }
    }

    handleWallCollisions() {
        const h = 1.0 / this.fInvSpacing
        const r = this.particleRadius
        const minX = h + r
        const maxX = (this.fNumX - 1) * h - r
        const minY = h + r
        const maxY = (this.fNumY - 1) * h - r

        for (let i = 0; i < this.numParticles; i++) {
            let x = this.particlePos[2 * i]
            let y = this.particlePos[2 * i + 1]

            if (x < minX) {
                x = minX
                this.particleVel[2 * i] = 0.0
            }
            if (x > maxX) {
                x = maxX
                this.particleVel[2 * i] = 0.0
            }
            if (y < minY) {
                y = minY
                this.particleVel[2 * i + 1] = 0.0
            }
            if (y > maxY) {
                y = maxY
                this.particleVel[2 * i + 1] = 0.0
            }
            this.particlePos[2 * i] = x
            this.particlePos[2 * i + 1] = y
        }
    }

    updateParticleDensity() {
        const n = this.fNumY
        const h = this.h
        const h1 = this.fInvSpacing
        const h2 = 0.5 * h
        const d = this.particleDensity
        d.fill(0.0)

        for (let i = 0; i < this.numParticles; i++) {
            const x = clamp(this.particlePos[2 * i], h, (this.fNumX - 1) * h, h)
            const y = clamp(
                this.particlePos[2 * i + 1],
                h,
                (this.fNumY - 1) * h,
                h
            )

            const x0 = Math.floor((x - h2) * h1)
            const tx = (x - h2 - x0 * h) * h1
            const x1 = Math.min(x0 + 1, this.fNumX - 2)

            const y0 = Math.floor((y - h2) * h1)
            const ty = (y - h2 - y0 * h) * h1
            const y1 = Math.min(y0 + 1, this.fNumY - 2)

            const sx = 1.0 - tx
            const sy = 1.0 - ty

            if (x0 < this.fNumX && y0 < this.fNumY) d[x0 * n + y0] += sx * sy
            if (x1 < this.fNumX && y0 < this.fNumY) d[x1 * n + y0] += tx * sy
            if (x1 < this.fNumX && y1 < this.fNumY) d[x1 * n + y1] += tx * ty
            if (x0 < this.fNumX && y1 < this.fNumY) d[x0 * n + y1] += sx * ty
        }

        // Measured once, off the first settled frame — every later frame is
        // compared against it to decide what counts as compressed.
        if (this.particleRestDensity === 0.0) {
            let sum = 0.0
            let numFluidCells = 0
            for (let i = 0; i < this.fNumCells; i++) {
                if (this.cellType[i] === FLUID_CELL) {
                    sum += d[i]
                    numFluidCells++
                }
            }
            if (numFluidCells > 0)
                this.particleRestDensity = sum / numFluidCells
        }
    }

    transferVelocities(toGrid: boolean, flipRatio = 0) {
        const n = this.fNumY
        const h = this.h
        const h1 = this.fInvSpacing
        const h2 = 0.5 * h

        if (toGrid) {
            this.prevU.set(this.u)
            this.prevV.set(this.v)
            this.du.fill(0.0)
            this.dv.fill(0.0)
            this.u.fill(0.0)
            this.v.fill(0.0)

            for (let i = 0; i < this.fNumCells; i++)
                this.cellType[i] = this.s[i] === 0.0 ? SOLID_CELL : AIR_CELL

            for (let i = 0; i < this.numParticles; i++) {
                const xi = clamp(
                    Math.floor(this.particlePos[2 * i] * h1),
                    0,
                    this.fNumX - 1,
                    0
                )
                const yi = clamp(
                    Math.floor(this.particlePos[2 * i + 1] * h1),
                    0,
                    this.fNumY - 1,
                    0
                )
                const cellNr = xi * n + yi
                if (this.cellType[cellNr] === AIR_CELL)
                    this.cellType[cellNr] = FLUID_CELL
            }
        }

        for (let component = 0; component < 2; component++) {
            const dx = component === U_FIELD ? 0.0 : h2
            const dy = component === U_FIELD ? h2 : 0.0

            const f = component === U_FIELD ? this.u : this.v
            const prevF = component === U_FIELD ? this.prevU : this.prevV
            const acc = component === U_FIELD ? this.du : this.dv

            for (let i = 0; i < this.numParticles; i++) {
                const x = clamp(
                    this.particlePos[2 * i],
                    h,
                    (this.fNumX - 1) * h,
                    h
                )
                const y = clamp(
                    this.particlePos[2 * i + 1],
                    h,
                    (this.fNumY - 1) * h,
                    h
                )

                const x0 = Math.min(Math.floor((x - dx) * h1), this.fNumX - 2)
                const tx = (x - dx - x0 * h) * h1
                const x1 = Math.min(x0 + 1, this.fNumX - 2)

                const y0 = Math.min(Math.floor((y - dy) * h1), this.fNumY - 2)
                const ty = (y - dy - y0 * h) * h1
                const y1 = Math.min(y0 + 1, this.fNumY - 2)

                const sx = 1.0 - tx
                const sy = 1.0 - ty

                const d0 = sx * sy
                const d1 = tx * sy
                const d2 = tx * ty
                const d3 = sx * ty

                const nr0 = x0 * n + y0
                const nr1 = x1 * n + y0
                const nr2 = x1 * n + y1
                const nr3 = x0 * n + y1

                if (toGrid) {
                    const pv = this.particleVel[2 * i + component]
                    f[nr0] += pv * d0
                    acc[nr0] += d0
                    f[nr1] += pv * d1
                    acc[nr1] += d1
                    f[nr2] += pv * d2
                    acc[nr2] += d2
                    f[nr3] += pv * d3
                    acc[nr3] += d3
                } else {
                    // A face only carries usable velocity if a cell on one side
                    // of it holds fluid; sampling an all-air face drags the
                    // particle toward a number nothing ever wrote.
                    const offset = component === U_FIELD ? n : 1
                    const valid0 =
                        this.cellType[nr0] !== AIR_CELL ||
                        this.cellType[nr0 - offset] !== AIR_CELL
                            ? 1.0
                            : 0.0
                    const valid1 =
                        this.cellType[nr1] !== AIR_CELL ||
                        this.cellType[nr1 - offset] !== AIR_CELL
                            ? 1.0
                            : 0.0
                    const valid2 =
                        this.cellType[nr2] !== AIR_CELL ||
                        this.cellType[nr2 - offset] !== AIR_CELL
                            ? 1.0
                            : 0.0
                    const valid3 =
                        this.cellType[nr3] !== AIR_CELL ||
                        this.cellType[nr3 - offset] !== AIR_CELL
                            ? 1.0
                            : 0.0

                    const vOld = this.particleVel[2 * i + component]
                    const d =
                        valid0 * d0 + valid1 * d1 + valid2 * d2 + valid3 * d3

                    if (d > 0.0) {
                        const picV =
                            (valid0 * d0 * f[nr0] +
                                valid1 * d1 * f[nr1] +
                                valid2 * d2 * f[nr2] +
                                valid3 * d3 * f[nr3]) /
                            d
                        const corr =
                            (valid0 * d0 * (f[nr0] - prevF[nr0]) +
                                valid1 * d1 * (f[nr1] - prevF[nr1]) +
                                valid2 * d2 * (f[nr2] - prevF[nr2]) +
                                valid3 * d3 * (f[nr3] - prevF[nr3])) /
                            d
                        const flipV = vOld + corr
                        this.particleVel[2 * i + component] =
                            (1.0 - flipRatio) * picV + flipRatio * flipV
                    }
                }
            }

            if (toGrid) {
                for (let i = 0; i < f.length; i++) {
                    if (acc[i] > 0.0) f[i] /= acc[i]
                }

                for (let i = 0; i < this.fNumX; i++) {
                    for (let j = 0; j < this.fNumY; j++) {
                        const solid = this.cellType[i * n + j] === SOLID_CELL
                        if (
                            solid ||
                            (i > 0 &&
                                this.cellType[(i - 1) * n + j] === SOLID_CELL)
                        )
                            this.u[i * n + j] = this.prevU[i * n + j]
                        if (
                            solid ||
                            (j > 0 &&
                                this.cellType[i * n + j - 1] === SOLID_CELL)
                        )
                            this.v[i * n + j] = this.prevV[i * n + j]
                    }
                }
            }
        }
    }

    solveIncompressibility(
        numIters: number,
        dt: number,
        overRelaxation: number
    ) {
        this.p.fill(0.0)
        this.prevU.set(this.u)
        this.prevV.set(this.v)

        const n = this.fNumY
        const cp = (this.density * this.h) / dt

        for (let iter = 0; iter < numIters; iter++) {
            for (let i = 1; i < this.fNumX - 1; i++) {
                for (let j = 1; j < this.fNumY - 1; j++) {
                    if (this.cellType[i * n + j] !== FLUID_CELL) continue

                    const center = i * n + j
                    const left = (i - 1) * n + j
                    const right = (i + 1) * n + j
                    const bottom = i * n + j - 1
                    const top = i * n + j + 1

                    const sx0 = this.s[left]
                    const sx1 = this.s[right]
                    const sy0 = this.s[bottom]
                    const sy1 = this.s[top]
                    const s = sx0 + sx1 + sy0 + sy1
                    if (s === 0.0) continue

                    let div =
                        this.u[right] -
                        this.u[center] +
                        this.v[top] -
                        this.v[center]

                    // Particles clump slightly on every step; without pushing
                    // back on cells denser than rest, the pool slowly collapses
                    // into one thin dark band along the floor.
                    if (this.particleRestDensity > 0.0) {
                        const compression =
                            this.particleDensity[center] -
                            this.particleRestDensity
                        if (compression > 0.0) div -= compression
                    }

                    let p = -div / s
                    p *= overRelaxation
                    this.p[center] += cp * p

                    this.u[center] -= sx0 * p
                    this.u[right] += sx1 * p
                    this.v[center] -= sy0 * p
                    this.v[top] += sy1 * p
                }
            }
        }
    }

    /**
     * Density to brightness, as a fourfold triangle wave rather than a ramp.
     * A plain ramp gives an even grey sheet; folding it four times draws the
     * contour bands that make the surface read as moving water in type.
     */
    private setBandedColor(cellNr: number, val: number, maxVal: number) {
        const v = Math.min(Math.max(val, 0), maxVal - 0.0001) / maxVal
        const m = 0.25
        const num = Math.floor(v / m)
        const s = (v - num * m) / m
        this.cellColor[3 * cellNr] = num === 0 || num === 2 ? s : 1.0 - s
    }

    updateCellColors() {
        this.cellColor.fill(0.0)
        for (let i = 0; i < this.fNumCells; i++) {
            if (this.cellType[i] === FLUID_CELL) {
                let d = this.particleDensity[i]
                if (this.particleRestDensity > 0.0)
                    d /= this.particleRestDensity
                this.setBandedColor(i, d, 2.0)
            }
        }
    }

    simulate(
        dt: number,
        gravity: number,
        flipRatio: number,
        stir: Stir | null
    ) {
        this.integrateParticles(dt, gravity)
        if (stir) this.stirParticles(stir)
        this.pushParticlesApart(PARTICLE_ITERS)
        this.handleWallCollisions()
        this.transferVelocities(true)
        this.updateParticleDensity()
        this.solveIncompressibility(PRESSURE_ITERS, dt, OVER_RELAXATION)
        this.transferVelocities(false, flipRatio)
        this.updateCellColors()
    }
}

// One shared 2D context, only ever asked how wide a character is.
let metricCtx: CanvasRenderingContext2D | null = null
function measureAdvance(size: number): number {
    if (!metricCtx)
        metricCtx = document.createElement("canvas").getContext("2d")
    if (!metricCtx) return size * 0.6
    metricCtx.font = `700 ${size}px ${FONT_STACK}`
    return metricCtx.measureText("M").width || size * 0.6
}

class AsciiWaveScene {
    private container: HTMLElement
    private pre: HTMLPreElement
    private cfg: Config
    private fluid: FlipFluid | null = null
    private width = 0
    private height = 0
    private cell = 0
    private frameId = 0
    private lastT = 0
    private disposed = false

    // Pointer state, in tank units.
    private stirX = 0
    private stirY = 0
    private stirVX = 0
    private stirVY = 0
    private stirOn = false
    private lastPointerT = 0

    // Click state, in tank units — a single-frame splash flag.
    private clickX = 0
    private clickY = 0
    private clickPending = false

    constructor(container: HTMLElement, cfg: Config) {
        this.container = container
        this.cfg = cfg

        this.pre = document.createElement("pre")
        Object.assign(this.pre.style, {
            position: "absolute",
            inset: "0",
            margin: "0",
            padding: "0",
            overflow: "hidden",
            whiteSpace: "pre",
            fontFamily: FONT_STACK,
            fontWeight: "700",
            pointerEvents: "none",
            userSelect: "none",
            color: cfg.ink,
        })
        container.appendChild(this.pre)

        container.addEventListener("pointerenter", this.onEnter)
        container.addEventListener("pointermove", this.onMove)
        container.addEventListener("pointerleave", this.onLeave)
        container.addEventListener("pointercancel", this.onLeave)
        container.addEventListener("pointerdown", this.onDown)
    }

    private toTank(e: PointerEvent) {
        const f = this.fluid
        if (!f || this.cell <= 0) return null
        const rect = this.container.getBoundingClientRect()
        // The readout is the tank minus its crop, so pixel (0,0) is the cell at
        // column CROP_X, row fNumY - CROP_Y; tank rows run up, pixels run down.
        const col = CROP_X + (e.clientX - rect.left) / this.cell
        const row = f.fNumY - CROP_Y - (e.clientY - rect.top) / this.cell
        return { x: col * f.h, y: row * f.h }
    }

    private onEnter = (e: PointerEvent) => {
        const p = this.toTank(e)
        if (!p) return
        // Entering is a jump, not a stroke — take the position but no velocity,
        // or the water gets kicked by however far away the pointer last was.
        this.stirX = p.x
        this.stirY = p.y
        this.stirVX = 0
        this.stirVY = 0
        this.stirOn = true
        this.lastPointerT = performance.now()
    }

    private onMove = (e: PointerEvent) => {
        if (!this.stirOn) {
            this.onEnter(e)
            return
        }
        const p = this.toTank(e)
        if (!p) return
        const now = performance.now()
        // Floored, because two moves inside the same millisecond would divide
        // by nearly zero and hand the brush an enormous velocity.
        const elapsed = Math.max((now - this.lastPointerT) / 1000, 0.008)
        this.lastPointerT = now
        this.stirVX = clamp(
            (p.x - this.stirX) / elapsed,
            -STIR_MAX_SPEED,
            STIR_MAX_SPEED,
            0
        )
        this.stirVY = clamp(
            (p.y - this.stirY) / elapsed,
            -STIR_MAX_SPEED,
            STIR_MAX_SPEED,
            0
        )
        this.stirX = p.x
        this.stirY = p.y
    }

    private onLeave = () => {
        this.stirOn = false
        this.stirVX = 0
        this.stirVY = 0
    }

    private onDown = (e: PointerEvent) => {
        const p = this.toTank(e)
        if (!p) return
        this.clickX = p.x
        this.clickY = p.y
        this.clickPending = true
    }

    setSize(width: number, height: number) {
        if (this.disposed) return
        if (width === this.width && height === this.height) return
        this.width = width
        this.height = height
        this.build()
    }

    updateConfig(cfg: Config) {
        if (this.disposed) return
        const prev = this.cfg
        this.cfg = cfg
        this.pre.style.color = cfg.ink
        // Only the two controls deciding how much water there is and how finely
        // it is diced own buffers; the rest are read fresh every frame.
        if (cfg.cell !== prev.cell || cfg.fill !== prev.fill) this.build()
    }

    private build() {
        if (this.width <= 0 || this.height <= 0) return
        const S = settingsFor(this.cfg)

        this.cell = S.cell
        this.pre.style.fontSize = `${S.cell}px`
        this.pre.style.lineHeight = `${S.cell}px`
        // Measure the real advance and pad it out to a full cell, so the grid
        // stays square whichever monospace face actually resolves.
        this.pre.style.letterSpacing = `${S.cell - measureAdvance(S.cell)}px`

        const cols = Math.ceil(this.width / S.cell) + CROP_X * 2
        const rows = Math.ceil(this.height / S.cell) + CROP_Y * 2

        const h = SIM_HEIGHT / rows
        const tankWidth = h * cols

        const r = 0.3 * h
        const dx = 2.0 * r
        const dy = (Math.sqrt(3.0) / 2.0) * dx

        const numX = Math.floor((tankWidth - 2.0 * h - 2.0 * r) / dx)
        const numY = Math.floor(
            (S.waterLevel * SIM_HEIGHT - 2.0 * h - 2.0 * r) / dy
        )
        if (numX <= 0 || numY <= 0) return

        const f = new FlipFluid(1000.0, tankWidth, SIM_HEIGHT, h, r, numX * numY)
        f.numParticles = numX * numY

        let p = 0
        const xOffset = (tankWidth - numX * dx) / 2
        for (let i = 0; i < numX; i++) {
            for (let j = 0; j < numY; j++) {
                // Rows staggered by half a spacing: a square lattice settles
                // into visible columns and the surface reads as corduroy.
                f.particlePos[p++] =
                    h + r + dx * i + (j % 2 === 0 ? 0.0 : r) + xOffset
                f.particlePos[p++] = h + r + dy * j
            }
        }

        const n = f.fNumY
        for (let i = 0; i < f.fNumX; i++) {
            for (let j = 0; j < f.fNumY; j++) {
                f.s[i * n + j] =
                    i === 0 || i === f.fNumX - 1 || j === 0 ? 0.0 : 1.0
            }
        }

        this.fluid = f
    }

    start() {
        this.lastT = performance.now()
        const loop = () => {
            if (this.disposed) return
            this.step()
            this.frameId = requestAnimationFrame(loop)
        }
        this.frameId = requestAnimationFrame(loop)
    }

    private step() {
        const f = this.fluid
        if (!f) return
        const S = settingsFor(this.cfg)

        const now = performance.now()
        let wall = (now - this.lastT) / 1000
        this.lastT = now
        if (!isFinite(wall) || wall < 0) wall = 0
        if (wall > 0.05) wall = 0.05

        // Fixed step, deliberately: FLIP has a stability limit, and scaling the
        // step by frame time lets one long frame push the solve past it — the
        // pool then blows apart and never recovers. Wall time is used only for
        // the brush decay below, which has no such limit.
        /*
         * The brush only exists while the cursor is actually travelling.
         *
         * It blends particle velocity toward the cursor's, and a cursor that is
         * merely sitting there has a velocity of zero — so leaving it switched
         * on turned it into a patch of infinite drag that cancelled gravity for
         * every particle under it. Water dragged upward stopped dead at the
         * pointer and hung there in mid-air instead of falling back. Below this
         * threshold there is no brush at all, and gravity has the water to
         * itself again.
         */
        if (this.clickPending) {
            if (S.clickPush > 0) {
                f.splashParticles(
                    this.clickX,
                    this.clickY,
                    S.radius * 1.6,
                    S.clickPush
                )
            }
            this.clickPending = false
        }

        const stirring =
            Math.hypot(this.stirVX, this.stirVY) > STIR_MIN_SPEED

        f.simulate(
            S.dt,
            GRAVITY,
            S.flipRatio,
            stirring && S.push > 0
                ? {
                      x: this.stirX,
                      y: this.stirY,
                      r: S.radius,
                      vx: this.stirVX,
                      vy: this.stirVY,
                      strength: S.push,
                  }
                : null
        )

        // A pointer that stops moving stops fanning the water; without this the
        // last move event keeps pushing forever.
        const decay = Math.exp(-wall * 10)
        this.stirVX *= decay
        this.stirVY *= decay

        this.render()
    }

    private render() {
        const f = this.fluid
        if (!f) return
        const rows: string[] = []
        for (let i = f.fNumY - CROP_Y; i > CROP_Y; i--) {
            let row = ""
            for (let j = CROP_X; j < f.fNumX - CROP_X; j++) {
                const dict = DICTS[(i + j + 1) % DICTS.length]
                const c = f.cellColor[3 * (j * f.fNumY + i)]
                const k = Math.floor(c * dict.length)
                row += dict[Math.min(dict.length - 1, Math.max(0, k))]
            }
            rows.push(row)
        }
        this.pre.textContent = rows.join("\n")
    }

    dispose() {
        this.disposed = true
        cancelAnimationFrame(this.frameId)
        this.container.removeEventListener("pointerenter", this.onEnter)
        this.container.removeEventListener("pointermove", this.onMove)
        this.container.removeEventListener("pointerleave", this.onLeave)
        this.container.removeEventListener("pointercancel", this.onLeave)
        this.container.removeEventListener("pointerdown", this.onDown)
        this.pre.remove()
        this.fluid = null
    }
}

export interface AsciiWaveProps {
    ink?: string
    cell?: number
    fill?: number
    ripple?: number
    push?: number
    speed?: number
    slosh?: number
    clickIntensity?: number
    style?: React.CSSProperties
}

export default function AsciiWave(props: AsciiWaveProps) {
    const {
        ink = DEFAULTS.ink,
        cell = DEFAULTS.cell,
        fill = DEFAULTS.fill,
        ripple = DEFAULTS.ripple,
        push = DEFAULTS.push,
        speed = DEFAULTS.speed,
        slosh = DEFAULTS.slosh,
        clickIntensity = DEFAULTS.clickIntensity,
        style,
    } = props

    const containerRef = useRef<HTMLDivElement>(null)
    const sceneRef = useRef<AsciiWaveScene | null>(null)
    const cfgRef = useRef<Config>(null as any)
    cfgRef.current = {
        ink,
        cell,
        fill,
        ripple,
        push,
        speed,
        slosh,
        clickIntensity,
    }

    useEffect(() => {
        const container = containerRef.current
        if (!container) return
        const scene = new AsciiWaveScene(container, cfgRef.current)
        sceneRef.current = scene
        scene.setSize(container.clientWidth, container.clientHeight)
        scene.start()

        const ro = new ResizeObserver(() => {
            scene.setSize(container.clientWidth, container.clientHeight)
        })
        ro.observe(container)
        return () => {
            ro.disconnect()
            scene.dispose()
            sceneRef.current = null
        }
    }, [])

    useEffect(() => {
        sceneRef.current?.updateConfig(cfgRef.current)
    }, [ink, cell, fill, ripple, push, speed, slosh, clickIntensity])

    return (
        <div
            ref={containerRef}
            role="img"
            aria-label="A pool of water drawn in monospace characters, stirred by the pointer"
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                minWidth: 120,
                minHeight: 120,
                overflow: "hidden",
                ...style,
            }}
        />
    )
}

AsciiWave.displayName = "Ascii Wave"
AsciiWave.defaultProps = { ...DEFAULTS }




// Path Gallery — Originkit
// Using component defaults.

"use client"

import * as React from "react"
import { useEffect, useMemo, useRef } from "react"

/**
 * CURVE GALLERY — a few hundred small images scattered along a closed 3D curve
 * exported from Blender. The camera flies the curve on scroll, and whatever it
 * passes swells to fill the frame before shrinking back into the crowd.
 *
 * Ported from gaspoorf/curve-gallery (three + GSAP + Vite, Codrops tutorial).
 * The motion is the source's, term for term (rule 8): the same five Blender
 * curves at the same SCALE of 16, the same closed uniform Catmull-Rom with
 * tension 0.5, the same camera that NEVER rotates — it rides the curve at a
 * fixed +Z offset looking straight down -Z, which is what makes every plane
 * face it for free — the same focus test (a t-window AND a depth gate AND an
 * XY radius) and the same 1 + f^3 blow-up curve, the same linear white fog
 * from 10 to 40, and the same inverted, wrapped scroll mapping.
 *
 * WHAT IS NOT THE SOURCE'S: the machinery. No three, no GSAP, no npm at all
 * (rule 10, self-contained). WebGL2 throughout: one instanced draw of one quad
 * against a TEXTURE_2D_ARRAY, so a thousand planes cost one call.
 *
 * PORT DECISIONS, SAID PLAINLY
 *
 *  - THE FIVE PATHS ARE EMBEDDED, DECIMATED. The source fetches five JSON files
 *    of 714 Blender points each at runtime; a Framer code component has no
 *    server to fetch from. Every twelfth point is kept (every second for the
 *    84-point third path), which is 60 control points per curve instead of 714
 *    and 6KB of source instead of 90KB. Measured, not assumed: the decimated
 *    curve never leaves the original by more than 0.093 world units on curves
 *    123 to 236 units long, and the arc length changes by under 0.2%.
 *
 *  - THE PATH SWITCHER IS A PROPERTY, NOT A ROW OF BUTTONS. The demo's five
 *    DOM buttons, and the 1.4s tween that flew the planes to their new homes,
 *    are page chrome around the canvas rather than part of the component. Here
 *    Path is an enum and changing it rebuilds the instance buffer. The tween
 *    goes with the buttons; nothing else about switching changes.
 *
 *  - AUTO-SCROLL BECOMES Speed, AND IT IS ON BY DEFAULT. The demo ships a
 *    Scroll/Auto toggle, defaulting to scroll-only. A scroll-only component is
 *    dead on the Framer canvas, where there is no scroll (rule 5), so the
 *    source's auto rate — one lap in 10 seconds — is the default and 0 turns it
 *    off. Wheel and drag add on top of it, exactly as they do in the demo.
 *
 *  - THE SCATTER IS SEEDED. The source calls Math.random three times per plane,
 *    so its layout reshuffles on every reload. A fixed seed keeps one
 *    composition across re-renders, which is what a design tool needs.
 *
 *  - WHEEL IS SWALLOWED. The source runs full-screen and its Observer eats the
 *    page scroll; that is the interaction, so it is kept. A component dropped
 *    into a taller page will stop the page scrolling while the pointer is over
 *    it. Deliberate, and flagged here rather than discovered.
 *
 * GSAP'S TWO EASES BECOME TWO EXPONENTIAL DECAYS. quickTo re-targets a running
 * tween on every input event, which is a relaxation toward a moving goal, so
 * `x += (target - x) * (1 - exp(-k*dt))` is the same shape and is frame-rate
 * correct where the source's fixed durations are not. The camera's k is the
 * Damping dial; the per-plane scale keeps its own constant (the source's 0.4s
 * power3.out) because nothing about it is a design decision.
 *
 * KEY CHANGES FROM THE SOURCE (clean break, rule 11c — these are staged ports,
 * so no `?? oldKey` chains):
 *   TOTAL -> count · MAX_SCALE -> zoom (now a percent) · FOCUS_DIST -> focus
 *   (now a percent of the shipped 5.5) · SIZE_RANGE -> size (percent) ·
 *   LATERAL/DEPTH_OFFSET_RANGE -> scatter (one percent for both) · CAM_Z ->
 *   distance · camera fov -> perspective · AUTO_SCROLL_DURATION -> speed ·
 *   quickTo duration -> damping. Nothing carries an old key because nothing
 *   shipped in Framer under one.
 *
 * CUT, AND FROZEN IN A CONSTANT (rule 11b — the render path is unchanged):
 *   Z_GATE, the fog's near/far, the scroll sensitivity, the per-plane scale
 *   rate, the focus t-window's 1.5 factor, the plane size RANGE (only its
 *   scale is a dial), and the pixel-ratio cap.
 *
 * Rule 6 recipe: ONE GL context built in useEffect([]); every live input read
 * from a ref inside a raw rAF loop (raw rAF ticks on the Framer canvas, unlike
 * IntersectionObserver / framer-motion appear props). Never calls
 * loseContext() — getContext() hands back the SAME force-lost context on the
 * next StrictMode mount and renders black. Path / Count / Size / Scatter
 * rebuild the instance buffers; images re-upload the texture array; neither
 * touches the context.
 */

/* ---------------------------------------------------------------- constants */

// The curve is authored in Blender units; the source multiplies by 16 to get a
// usable scene scale.
const SCALE = 16

// Frozen from the source. None of these is a design decision.
const Z_GATE = 11 // depth gate on the focus test
const FOG_NEAR = 10
const FOG_FAR = 40
const FOCUS_T_FACTOR = 1.5 // focusTGate = FOCUS_DIST * 1.5 / curveLength
const SIZE_RANGE: [number, number] = [0.18, 0.4]
const LATERAL_RANGE: [number, number] = [-1, 1]
const DEPTH_RANGE: [number, number] = [-0.75, 0.75]
const SHIPPED_FOCUS = 5.5 // Focus 100% is this many world units
const SHIPPED_LAP = 10 // seconds per lap at Speed 50
const SCALE_K = 8.3 // per-plane scale decay; the source's 0.4s power3.out
const SENSITIVITY = 0.8 / 4 // divided by the host height, as the source does
const MAX_DPR = 2
const CELL = 512 // texture-array cell, square, cover-cropped
const MAX_LAYERS = 24

// The source's path1..path5, in order. Every twelfth Blender point (every
// second for path3, which ships only 84). Blender units — SCALE is applied
// when the curve is built.
const PATHS: number[][][] = [
    // path1: 714 Blender points decimated to 60
    [[-27.559,0,0],[-27.591,0.211,-0.231],[-27.707,0.411,-0.446],[-27.857,0.559,-0.601],[-28.065,0.661,-0.71],[-28.264,0.694,-0.752],[-28.469,0.655,-0.747],[-28.634,0.553,-0.703],[-28.78,0.393,-0.643],[-28.903,0.193,-0.575],[-29.005,-0.014,-0.517],[-29.121,-0.234,-0.449],[-29.232,-0.419,-0.38],[-29.361,-0.573,-0.279],[-29.481,-0.666,-0.146],[-29.581,-0.693,0.027],[-29.638,-0.647,0.239],[-29.636,-0.541,0.455],[-29.562,-0.373,0.685],[-29.43,-0.184,0.864],[-29.235,0.038,1.011],[-29.006,0.25,1.079],[-28.782,0.434,1.083],[-28.553,0.584,1.004],[-28.383,0.671,0.889],[-28.24,0.691,0.717],[-28.163,0.644,0.55],[-28.114,0.527,0.375],[-28.103,0.365,0.231],[-28.099,0.163,0.095],[-28.1,-0.058,-0.036],[-28.098,-0.261,-0.154],[-28.108,-0.453,-0.305],[-28.13,-0.59,-0.455],[-28.197,-0.676,-0.636],[-28.301,-0.69,-0.8],[-28.463,-0.635,-0.953],[-28.668,-0.513,-1.053],[-28.889,-0.35,-1.09],[-29.132,-0.139,-1.053],[-29.333,0.068,-0.948],[-29.505,0.282,-0.78],[-29.608,0.467,-0.563],[-29.646,0.601,-0.352],[-29.614,0.679,-0.12],[-29.537,0.69,0.058],[-29.42,0.626,0.224],[-29.3,0.506,0.327],[-29.174,0.328,0.42],[-29.063,0.127,0.481],[-28.957,-0.088,0.545],[-28.836,-0.302,0.611],[-28.719,-0.474,0.674],[-28.551,-0.612,0.728],[-28.377,-0.682,0.756],[-28.16,-0.687,0.737],[-27.968,-0.62,0.667],[-27.775,-0.491,0.53],[-27.639,-0.31,0.339],[-27.566,-0.113,0.123]],
    // path2: 714 Blender points decimated to 60
    [[-24.623,0,0],[-24.646,0.14,0.204],[-24.731,0.276,0.408],[-24.85,0.386,0.58],[-25.025,0.479,0.746],[-25.214,0.533,0.868],[-25.438,0.559,0.969],[-25.664,0.543,1.028],[-25.884,0.496,1.056],[-26.1,0.407,1.046],[-26.275,0.302,1.01],[-26.434,0.161,0.941],[-26.541,0.018,0.858],[-26.616,-0.144,0.754],[-26.642,-0.301,0.642],[-26.631,-0.447,0.531],[-26.576,-0.585,0.413],[-26.497,-0.693,0.313],[-26.379,-0.785,0.213],[-26.254,-0.842,0.134],[-26.106,-0.876,0.062],[-25.956,-0.876,0.01],[-25.81,-0.851,-0.029],[-25.664,-0.795,-0.056],[-25.54,-0.724,-0.068],[-25.42,-0.623,-0.072],[-25.33,-0.515,-0.066],[-25.251,-0.385,-0.053],[-25.201,-0.25,-0.036],[-25.17,-0.11,-0.016],[-25.165,0.04,0.006],[-25.181,0.176,0.026],[-25.225,0.323,0.046],[-25.286,0.447,0.06],[-25.373,0.572,0.07],[-25.478,0.675,0.071],[-25.599,0.762,0.064],[-25.74,0.828,0.043],[-25.879,0.866,0.013],[-26.036,0.88,-0.036],[-26.176,0.863,-0.094],[-26.321,0.817,-0.173],[-26.439,0.742,-0.261],[-26.54,0.643,-0.362],[-26.609,0.514,-0.475],[-26.642,0.379,-0.583],[-26.634,0.218,-0.703],[-26.586,0.068,-0.804],[-26.492,-0.093,-0.904],[-26.36,-0.232,-0.977],[-26.193,-0.358,-1.032],[-25.988,-0.458,-1.054],[-25.781,-0.522,-1.047],[-25.543,-0.556,-1.001],[-25.332,-0.551,-0.926],[-25.113,-0.51,-0.81],[-24.934,-0.435,-0.666],[-24.785,-0.335,-0.498],[-24.68,-0.206,-0.301],[-24.629,-0.075,-0.109]],
    // path3: 84 Blender points decimated to 42
    [[0.483,0.385,-5.705],[0.461,0.351,-5.562],[0.412,0.297,-5.395],[0.339,0.226,-5.224],[0.248,0.136,-5.074],[0.144,0.03,-4.966],[0.03,-0.093,-4.923],[-0.079,-0.177,-4.92],[-0.226,-0.237,-4.916],[-0.392,-0.267,-4.913],[-0.558,-0.26,-4.911],[-0.704,-0.209,-4.911],[-0.812,-0.106,-4.914],[-0.866,0.054,-4.951],[-0.842,0.202,-5.039],[-0.765,0.315,-5.157],[-0.658,0.371,-5.284],[-0.546,0.348,-5.402],[-0.45,0.224,-5.491],[-0.425,0.104,-5.545],[-0.444,-0.027,-5.621],[-0.509,-0.143,-5.706],[-0.623,-0.225,-5.788],[-0.788,-0.248,-5.855],[-1.007,-0.192,-5.897],[-1.175,-0.079,-5.93],[-1.249,0.057,-5.983],[-1.252,0.193,-6.055],[-1.207,0.308,-6.143],[-1.134,0.38,-6.245],[-1.057,0.387,-6.36],[-0.94,0.315,-6.52],[-0.814,0.219,-6.622],[-0.673,0.115,-6.679],[-0.509,0.019,-6.703],[-0.317,-0.05,-6.708],[-0.088,-0.077,-6.707],[0.143,-0.038,-6.657],[0.304,0.058,-6.524],[0.407,0.18,-6.336],[0.463,0.296,-6.119],[0.485,0.375,-5.9]],
    // path4: 714 Blender points decimated to 60
    [[-21.914,0,0],[-21.924,0.143,-0.117],[-21.963,0.286,-0.235],[-22.016,0.405,-0.334],[-22.096,0.518,-0.43],[-22.183,0.6,-0.502],[-22.285,0.661,-0.562],[-22.393,0.69,-0.602],[-22.497,0.689,-0.626],[-22.604,0.654,-0.637],[-22.695,0.594,-0.635],[-22.787,0.501,-0.628],[-22.86,0.396,-0.617],[-22.935,0.264,-0.607],[-22.998,0.127,-0.601],[-23.061,-0.017,-0.599],[-23.127,-0.165,-0.602],[-23.189,-0.295,-0.61],[-23.266,-0.425,-0.62],[-23.343,-0.526,-0.63],[-23.434,-0.611,-0.637],[-23.533,-0.666,-0.635],[-23.636,-0.692,-0.622],[-23.746,-0.685,-0.592],[-23.847,-0.649,-0.55],[-23.951,-0.581,-0.484],[-24.031,-0.494,-0.409],[-24.108,-0.376,-0.31],[-24.156,-0.25,-0.206],[-24.189,-0.11,-0.09],[-24.193,0.04,0.033],[-24.177,0.176,0.145],[-24.133,0.318,0.262],[-24.073,0.435,0.359],[-23.993,0.54,0.449],[-23.896,0.62,0.521],[-23.799,0.671,0.572],[-23.687,0.692,0.61],[-23.587,0.684,0.629],[-23.479,0.641,0.637],[-23.392,0.575,0.634],[-23.301,0.477,0.625],[-23.229,0.365,0.615],[-23.158,0.232,0.605],[-23.091,0.087,0.6],[-23.033,-0.051,0.599],[-22.965,-0.2,0.603],[-22.901,-0.329,0.612],[-22.825,-0.451,0.623],[-22.739,-0.553,0.632],[-22.652,-0.627,0.637],[-22.547,-0.676,0.632],[-22.448,-0.693,0.617],[-22.334,-0.679,0.583],[-22.238,-0.636,0.536],[-22.135,-0.561,0.466],[-22.057,-0.467,0.386],[-21.987,-0.348,0.287],[-21.94,-0.212,0.174],[-21.916,-0.076,0.062]],
    // path5: 714 Blender points decimated to 60
    [[4.095,0,0],[4.08,0.21,-0.115],[4.019,0.409,-0.227],[3.943,0.556,-0.312],[3.825,0.658,-0.388],[3.708,0.693,-0.434],[3.578,0.652,-0.465],[3.477,0.553,-0.476],[3.379,0.39,-0.485],[3.306,0.192,-0.497],[3.252,-0.014,-0.519],[3.2,-0.233,-0.563],[3.156,-0.417,-0.621],[3.102,-0.57,-0.698],[3.029,-0.666,-0.792],[2.942,-0.69,-0.88],[2.832,-0.647,-0.963],[2.72,-0.538,-1.015],[2.591,-0.37,-1.04],[2.479,-0.183,-1.026],[2.366,0.038,-0.979],[2.279,0.25,-0.895],[2.219,0.431,-0.799],[2.188,0.582,-0.665],[2.185,0.67,-0.546],[2.209,0.689,-0.405],[2.247,0.641,-0.297],[2.293,0.523,-0.188],[2.327,0.365,-0.117],[2.352,0.161,-0.046],[2.356,-0.058,0.018],[2.343,-0.258,0.076],[2.311,-0.45,0.153],[2.27,-0.589,0.236],[2.227,-0.673,0.35],[2.195,-0.69,0.471],[2.183,-0.633,0.608],[2.2,-0.511,0.736],[2.245,-0.347,0.847],[2.323,-0.138,0.945],[2.418,0.068,1.005],[2.533,0.28,1.038],[2.663,0.467,1.028],[2.772,0.598,0.995],[2.895,0.678,0.92],[2.985,0.687,0.838],[3.073,0.624,0.739],[3.125,0.504,0.662],[3.181,0.325,0.587],[3.224,0.127,0.54],[3.276,-0.087,0.507],[3.346,-0.3,0.488],[3.418,-0.471,0.482],[3.527,-0.609,0.47],[3.637,-0.681,0.454],[3.77,-0.684,0.412],[3.878,-0.62,0.358],[3.986,-0.488,0.271],[4.055,-0.309,0.17],[4.092,-0.112,0.061]],
]

const PATH_NAMES = ["Knot", "Teardrop", "Tangle", "Figure Eight", "Coil"]

/* ------------------------------------------------------------------ shaders */

const VERT = `#version 300 es
precision highp float;

layout(location=0) in vec2 aCorner;   // quad corner, -0.5 .. 0.5
layout(location=1) in vec3 aPos;      // world position on the curve
layout(location=2) in vec2 aMeta;     // x = base size, y = texture layer
layout(location=3) in float aScale;   // live focus scale

uniform mat4 uProj;
uniform vec3 uCam;
uniform float uAspect;   // plane height / plane width

out vec2 vUv;
out float vLayer;
out float vFogDepth;

void main(){
    vUv = aCorner + 0.5;
    vLayer = aMeta.y;

    float w = aMeta.x * aScale;
    vec3 p = aPos + vec3(aCorner.x * w, aCorner.y * w * uAspect, 0.0);

    // The camera never rotates: the view matrix is a pure translation, which
    // is exactly why every plane faces it without any billboard maths.
    vec3 view = p - uCam;
    vFogDepth = -view.z;
    gl_Position = uProj * vec4(view, 1.0);
}
`

const FRAG = `#version 300 es
precision highp float;
precision highp sampler2DArray;

in vec2 vUv;
in float vLayer;
in float vFogDepth;
out vec4 fragColor;

uniform sampler2DArray uTex;
uniform vec3 uFog;      // linear-light fog / background colour
uniform float uAspect;  // plane height / plane width
uniform float uRounded; // 0..100, percent of the maximum radius

vec3 toLinear(vec3 c){
    return mix(c / 12.92,
               pow((c + 0.055) / 1.055, vec3(2.4)),
               step(0.04045, c));
}
vec3 toSRGB(vec3 c){
    return mix(c * 12.92,
               1.055 * pow(max(c, vec3(0.0031308)), vec3(1.0 / 2.4)) - 0.055,
               step(0.0031308, c));
}

void main(){
    // Cover-crop the square cell into a quad of arbitrary aspect, so an Aspect
    // other than 100 crops the picture instead of stretching it.
    vec2 s = uAspect <= 1.0 ? vec2(uAspect, 1.0) : vec2(1.0, 1.0 / uAspect);
    vec2 uv = (vUv - 0.5) * s + 0.5;

    vec4 tex = texture(uTex, vec3(uv, vLayer));

    // Rounded corners as a signed distance in width-normalised space, so the
    // radius is a percent of the SHORT side at any Aspect.
    vec2 half2 = vec2(0.5, uAspect * 0.5);
    float r = (uRounded / 100.0) * min(half2.x, half2.y);
    vec2 q = (vUv - 0.5) * vec2(1.0, uAspect);
    vec2 d = abs(q) - (half2 - r);
    float sd = length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
    float fw = max(fwidth(sd), 1e-5);
    float cover = 1.0 - smoothstep(-fw, fw, sd);
    if (cover <= 0.0) discard;

    // three mixes fog in LINEAR light and encodes on output; matching that is
    // what keeps a white background from going grey at the far plane.
    vec3 lin = toLinear(tex.rgb);
    float fogFactor = smoothstep(${FOG_NEAR.toFixed(1)}, ${FOG_FAR.toFixed(1)}, vFogDepth);
    lin = mix(lin, uFog, fogFactor);

    // Alpha to coverage: the corner mask resolves against the MSAA buffer, so
    // rounded edges antialias without a sorted transparent pass.
    fragColor = vec4(toSRGB(lin), cover * tex.a);
}
`

/* ------------------------------------------------------------------ helpers */

// Colour dial input may be "#rgb", "#rrggbb", "#rrggbbaa", "rgb()", "rgba()",
// "hsl()", "hsla()" or "var(--token, fallback)" — a hex-only parse would make
// the colour dial look dead on a themed project.
function parseColor(input: string): [number, number, number] {
    if (!input) return [0, 0, 0]
    let s = String(input).trim()
    const v = s.match(/var\(\s*[^,)]+\s*,\s*([^)]+)\)/i)
    if (v) s = v[1].trim()

    const hsl = s.match(/hsla?\(([^)]+)\)/i)
    if (hsl) {
        const p = hsl[1].split(/[,/\s]+/).filter(Boolean)
        const h = ((((parseFloat(p[0]) || 0) % 360) + 360) % 360) / 360
        const sa = (parseFloat(p[1]) || 0) / 100
        const l = (parseFloat(p[2]) || 0) / 100
        const cc = (1 - Math.abs(2 * l - 1)) * sa
        const x = cc * (1 - Math.abs(((h * 6) % 2) - 1))
        const m = l - cc / 2
        const k = Math.floor(h * 6) % 6
        const t: [number, number, number][] = [
            [cc, x, 0], [x, cc, 0], [0, cc, x],
            [0, x, cc], [x, 0, cc], [cc, 0, x],
        ]
        const q = t[k < 0 ? 0 : k]
        return [q[0] + m, q[1] + m, q[2] + m]
    }

    const fn = s.match(/rgba?\(([^)]+)\)/i)
    if (fn) {
        const p = fn[1].split(/[,/\s]+/).filter(Boolean).map((n) => parseFloat(n))
        return [(p[0] || 0) / 255, (p[1] || 0) / 255, (p[2] || 0) / 255]
    }

    let h = s.replace("#", "")
    if (h.length === 3 || h.length === 4) h = h.split("").map((ch) => ch + ch).join("")
    h = h.padEnd(6, "0")
    return [
        parseInt(h.slice(0, 2), 16) / 255,
        parseInt(h.slice(2, 4), 16) / 255,
        parseInt(h.slice(4, 6), 16) / 255,
    ]
}

function srgbToLinear(c: number): number {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

// Deterministic PRNG. Plain Math.random would reshuffle the scatter on every
// reload; a seeded generator keeps one composition across re-renders.
function mulberry32(a: number) {
    return function () {
        a |= 0
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

/* -------------------------------------------------------------------- curve
 * three's CatmullRomCurve3 with closed=true, curveType "catmullrom" and
 * tension 0.5, reimplemented. Two things matter and both are easy to get
 * wrong: the tension form is init(p1, p2, tau*(p2-p0), tau*(p3-p1)), and
 * getPoint is uniform in CONTROL POINT INDEX, not in arc length — the camera's
 * speed therefore varies with the Blender point spacing, which is part of the
 * reference's motion and not a defect to normalise away.
 */

const TENSION = 0.5

function crAxis(p0: number, p1: number, p2: number, p3: number, t: number): number {
    const v0 = (p2 - p0) * TENSION
    const v1 = (p3 - p1) * TENSION
    const t2 = t * t
    const t3 = t2 * t
    return (
        p1 +
        v0 * t +
        (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 +
        (2 * p1 - 2 * p2 + v0 + v1) * t3
    )
}

class ClosedCurve {
    pts: number[][]
    length: number
    constructor(raw: number[][], scale: number) {
        this.pts = raw.map((p) => [p[0] * scale, p[1] * scale, p[2] * scale])
        this.length = 0
        let prev = this.point(0)
        for (let i = 1; i <= 800; i++) {
            const q = this.point(i / 800)
            this.length += Math.hypot(q[0] - prev[0], q[1] - prev[1], q[2] - prev[2])
            prev = q
        }
    }
    point(t: number): [number, number, number] {
        const l = this.pts.length
        const p = l * t
        let i = Math.floor(p)
        const w = p - i
        i = ((i % l) + l) % l
        const at = (k: number) => this.pts[(((k % l) + l) % l)]
        const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2)
        return [
            crAxis(p0[0], p1[0], p2[0], p3[0], w),
            crAxis(p0[1], p1[1], p2[1], p3[1], w),
            crAxis(p0[2], p1[2], p2[2], p3[2], w),
        ]
    }
    // The source's getCurveFrame: a 2D normal from the XY tangent. three's
    // getTangent is a central difference on the same 1e-4 delta.
    frame(t: number): { pos: [number, number, number]; nx: number; ny: number } {
        const d = 1e-4
        const a = this.point(t - d < 0 ? t - d + 1 : t - d)
        const b = this.point(t + d > 1 ? t + d - 1 : t + d)
        let tx = b[0] - a[0], ty = b[1] - a[1], tz = b[2] - a[2]
        const l = Math.hypot(tx, ty, tz) || 1
        tx /= l; ty /= l; tz /= l
        return { pos: this.point(t), nx: -ty, ny: tx }
    }
}

/* ------------------------------------------------------------------ GL utils */

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader | null {
    const sh = gl.createShader(type)
    if (!sh) return null
    gl.shaderSource(sh, src)
    gl.compileShader(sh)
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("CurveGallery shader:", gl.getShaderInfoLog(sh))
        gl.deleteShader(sh)
        return null
    }
    return sh
}

function link(gl: WebGL2RenderingContext, vs: string, fs: string): WebGLProgram | null {
    const v = compile(gl, gl.VERTEX_SHADER, vs)
    const f = compile(gl, gl.FRAGMENT_SHADER, fs)
    if (!v || !f) return null
    const p = gl.createProgram()
    if (!p) return null
    gl.attachShader(p, v)
    gl.attachShader(p, f)
    gl.linkProgram(p)
    gl.deleteShader(v)
    gl.deleteShader(f)
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.error("CurveGallery link:", gl.getProgramInfoLog(p))
        return null
    }
    return p
}

// Cover-crop any image into one square CELL, the shape every array layer must
// share.
function toCell(src: CanvasImageSource, iw: number, ih: number): HTMLCanvasElement {
    const c = document.createElement("canvas")
    c.width = CELL
    c.height = CELL
    const ctx = c.getContext("2d")!
    const s = Math.max(CELL / Math.max(1, iw), CELL / Math.max(1, ih))
    const w = iw * s
    const h = ih * s
    ctx.drawImage(src, (CELL - w) / 2, (CELL - h) / 2, w, h)
    return c
}

// With no Images set, the panel is empty and so is the canvas. Eight soft
// duotone cells keep the composition legible while a designer fills the array.
function placeholderCells(): HTMLCanvasElement[] {
    const hues = [18, 44, 190, 214, 262, 320, 8, 152]
    return hues.map((hue) => {
        const c = document.createElement("canvas")
        c.width = CELL
        c.height = CELL
        const ctx = c.getContext("2d")!
        const g = ctx.createLinearGradient(0, 0, CELL, CELL)
        g.addColorStop(0, `hsl(${hue}, 42%, 78%)`)
        g.addColorStop(1, `hsl(${(hue + 40) % 360}, 34%, 46%)`)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, CELL, CELL)
        return c
    })
}

/* -------------------------------------------------------------------- props */

interface ResponsiveImageLike {
    src?: string
    srcSet?: string
    alt?: string
}

interface CurveGalleryProps {
    images?: ResponsiveImageLike[]
    background?: string
    path?: string
    count?: number
    size?: number
    aspect?: number
    rounded?: number
    scatter?: number
    focus?: number
    zoom?: number
    speed?: number
    damping?: number
    distance?: number
    perspective?: number
    style?: React.CSSProperties
}

const MAX_COUNT = 1500
const SEED = 0x5eed1

const DEFAULT_IMAGES: ResponsiveImageLike[] = [
    { alt: "", src: "https://images.unsplash.com/photo-1741114056868-e9ab2d56ed64?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D\n" },
    { alt: "", src: "https://images.unsplash.com/photo-1654521957182-f0277b65005a?q=80&w=2758&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D\n" },
    { alt: "", src: "https://images.unsplash.com/photo-1683718522443-355f717f3b2a?q=80&w=2760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D\n" },
    { alt: "", src: "https://images.unsplash.com/photo-1656932850123-dbd64a854816?q=80&w=2803&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D\n" },
]

/* ---------------------------------------------------------------- component */

export default function CurveGallery(props: CurveGalleryProps) {
    const {
        images = DEFAULT_IMAGES,
        background = "#000000",
        path = "0",
        count = 400,
        size = 185,
        aspect = 105,
        rounded = 20,
        scatter = 175,
        focus = 70,
        zoom = 1400,
        speed = -20,
        damping = 25,
        distance = 7,
        perspective = 83,
        style,
    } = props

    const hostRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // One deterministic scatter, drawn once for the largest Count the panel
    // allows, so raising Count adds planes instead of reshuffling the ones
    // already placed.
    const rnd = useMemo(() => {
        const r = mulberry32(SEED)
        const lateral = new Float32Array(MAX_COUNT)
        const depth = new Float32Array(MAX_COUNT)
        const sz = new Float32Array(MAX_COUNT)
        const tex = new Float32Array(MAX_COUNT)
        for (let i = 0; i < MAX_COUNT; i++) {
            lateral[i] = LATERAL_RANGE[0] + r() * (LATERAL_RANGE[1] - LATERAL_RANGE[0])
            depth[i] = DEPTH_RANGE[0] + r() * (DEPTH_RANGE[1] - DEPTH_RANGE[0])
            sz[i] = SIZE_RANGE[0] + r() * (SIZE_RANGE[1] - SIZE_RANGE[0])
            tex[i] = r()
        }
        return { lateral, depth, sz, tex }
    }, [])

    // Every live input the loop reads (rule 6). Touching one must never tear
    // the context down and recompile shaders.
    const live = useRef({
        bg: [1, 1, 1] as number[],
        bgCss: [1, 1, 1] as number[],
        path: 0,
        count: 500,
        size: 100,
        aspect: 100,
        rounded: 0,
        scatter: 100,
        focus: 100,
        zoom: 1400,
        speed: 50,
        damping: 17,
        distance: 10,
        perspective: 60,
    })
    const bgRgb = parseColor(background)
    live.current.bgCss = bgRgb
    live.current.bg = bgRgb.map(srgbToLinear)
    live.current.path = Math.max(0, Math.min(PATHS.length - 1, Math.round(Number(path) || 0)))
    live.current.count = Math.max(1, Math.min(MAX_COUNT, Math.round(count)))
    live.current.size = size
    live.current.aspect = aspect
    live.current.rounded = rounded
    live.current.scatter = scatter
    live.current.focus = focus
    live.current.zoom = zoom
    live.current.speed = speed
    live.current.damping = damping
    live.current.distance = distance
    live.current.perspective = perspective

    // Texture cells, handed to the loop through a ref with a dirty flag. Never
    // through state: a re-render that hands back the same canvas node bails
    // out of the upload and the array texture silently keeps the old images.
    const texRef = useRef<{ cells: HTMLCanvasElement[]; dirty: boolean }>({
        cells: [],
        dirty: false,
    })

    const srcKey = (images || []).map((i) => i?.src ?? "").join("|")

    useEffect(() => {
        let cancelled = false
        const srcs = (images || [])
            .map((i) => i?.src)
            .filter((s): s is string => !!s)
            .slice(0, MAX_LAYERS)

        if (srcs.length === 0) {
            texRef.current = { cells: placeholderCells(), dirty: true }
            return
        }

        Promise.all(
            srcs.map(
                (s) =>
                    new Promise<HTMLCanvasElement | null>((res) => {
                        const im = new Image()
                        im.crossOrigin = "anonymous"
                        im.onload = () => res(toCell(im, im.naturalWidth, im.naturalHeight))
                        im.onerror = () => res(null)
                        im.src = s
                    })
            )
        ).then((cells) => {
            if (cancelled) return
            const ok = cells.filter((c): c is HTMLCanvasElement => !!c)
            texRef.current = {
                cells: ok.length ? ok : placeholderCells(),
                dirty: true,
            }
        })

        return () => {
            cancelled = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [srcKey])

    useEffect(() => {
        const canvas = canvasRef.current
        const host = hostRef.current
        if (!canvas || !host) return

        const gl = canvas.getContext("webgl2", {
            antialias: true,
            alpha: false,
            preserveDrawingBuffer: true,
        })
        if (!gl) {
            console.warn("CurveGallery: WebGL2 unavailable")
            return
        }

        const prog = link(gl, VERT, FRAG)
        if (!prog) return
        const uProj = gl.getUniformLocation(prog, "uProj")
        const uCam = gl.getUniformLocation(prog, "uCam")
        const uAspect = gl.getUniformLocation(prog, "uAspect")
        const uTex = gl.getUniformLocation(prog, "uTex")
        const uFog = gl.getUniformLocation(prog, "uFog")
        const uRounded = gl.getUniformLocation(prog, "uRounded")

        /* ---- geometry: one quad, everything else per instance */
        const cornerBuf = gl.createBuffer()!
        gl.bindBuffer(gl.ARRAY_BUFFER, cornerBuf)
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5]),
            gl.STATIC_DRAW
        )
        const posBuf = gl.createBuffer()!
        const metaBuf = gl.createBuffer()!
        const scaleBuf = gl.createBuffer()!

        const vao = gl.createVertexArray()!
        gl.bindVertexArray(vao)
        gl.bindBuffer(gl.ARRAY_BUFFER, cornerBuf)
        gl.enableVertexAttribArray(0)
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
        gl.enableVertexAttribArray(1)
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0)
        gl.vertexAttribDivisor(1, 1)
        gl.bindBuffer(gl.ARRAY_BUFFER, metaBuf)
        gl.enableVertexAttribArray(2)
        gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0)
        gl.vertexAttribDivisor(2, 1)
        gl.bindBuffer(gl.ARRAY_BUFFER, scaleBuf)
        gl.enableVertexAttribArray(3)
        gl.vertexAttribPointer(3, 1, gl.FLOAT, false, 0, 0)
        gl.vertexAttribDivisor(3, 1)
        gl.bindVertexArray(null)

        /* ---- texture array */
        const tex = gl.createTexture()!
        let layers = 0
        function uploadLayers(cells: HTMLCanvasElement[]) {
            const use = cells.slice(0, MAX_LAYERS)
            if (use.length === 0) return
            gl!.bindTexture(gl!.TEXTURE_2D_ARRAY, tex)
            gl!.pixelStorei(gl!.UNPACK_FLIP_Y_WEBGL, 1)
            gl!.texImage3D(
                gl!.TEXTURE_2D_ARRAY, 0, gl!.RGBA8,
                CELL, CELL, use.length, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, null
            )
            for (let i = 0; i < use.length; i++) {
                gl!.texSubImage3D(
                    gl!.TEXTURE_2D_ARRAY, 0, 0, 0, i,
                    CELL, CELL, 1, gl!.RGBA, gl!.UNSIGNED_BYTE, use[i]
                )
            }
            gl!.pixelStorei(gl!.UNPACK_FLIP_Y_WEBGL, 0)
            gl!.generateMipmap(gl!.TEXTURE_2D_ARRAY)
            gl!.texParameteri(gl!.TEXTURE_2D_ARRAY, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR_MIPMAP_LINEAR)
            gl!.texParameteri(gl!.TEXTURE_2D_ARRAY, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR)
            gl!.texParameteri(gl!.TEXTURE_2D_ARRAY, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE)
            gl!.texParameteri(gl!.TEXTURE_2D_ARRAY, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE)
            layers = use.length
        }

        /* ---- instance state */
        const posArr = new Float32Array(MAX_COUNT * 3)
        const metaArr = new Float32Array(MAX_COUNT * 2)
        const scaleArr = new Float32Array(MAX_COUNT).fill(1)
        const tArr = new Float32Array(MAX_COUNT)

        let curve: ClosedCurve | null = null
        let builtKey = ""
        let instances = 0

        function rebuild(pathIdx: number, n: number, sizePct: number, scatterPct: number) {
            curve = new ClosedCurve(PATHS[pathIdx], SCALE)
            const sc = scatterPct / 100
            const sz = sizePct / 100
            const nLayers = Math.max(1, layers)
            for (let i = 0; i < n; i++) {
                const t = i / n
                tArr[i] = t
                const { pos, nx, ny } = curve.frame(t)
                const lat = rnd.lateral[i] * sc
                posArr[i * 3] = pos[0] + nx * lat
                posArr[i * 3 + 1] = pos[1] + ny * lat
                posArr[i * 3 + 2] = pos[2] + rnd.depth[i] * sc
                metaArr[i * 2] = rnd.sz[i] * sz
                metaArr[i * 2 + 1] = Math.min(nLayers - 1, Math.floor(rnd.tex[i] * nLayers))
            }
            gl!.bindBuffer(gl!.ARRAY_BUFFER, posBuf)
            gl!.bufferData(gl!.ARRAY_BUFFER, posArr.subarray(0, n * 3), gl!.DYNAMIC_DRAW)
            gl!.bindBuffer(gl!.ARRAY_BUFFER, metaBuf)
            gl!.bufferData(gl!.ARRAY_BUFFER, metaArr.subarray(0, n * 2), gl!.DYNAMIC_DRAW)
            gl!.bindBuffer(gl!.ARRAY_BUFFER, scaleBuf)
            gl!.bufferData(gl!.ARRAY_BUFFER, scaleArr.subarray(0, n), gl!.DYNAMIC_DRAW)
            instances = n
        }

        /* ---- input. The source's Observer over wheel + drag, and its
         * sensitivity, which is relative to the host height so one flick
         * travels the same fraction of the curve at any size. */
        let targetT = 0
        let camT = 0
        let dragging = false
        let lastY = 0

        const onWheel = (e: WheelEvent) => {
            e.preventDefault()
            targetT += e.deltaY * (SENSITIVITY / Math.max(1, host!.clientHeight))
        }
        const onDown = (e: PointerEvent) => {
            dragging = true
            lastY = e.clientY
        }
        const onMove = (e: PointerEvent) => {
            if (!dragging) return
            targetT += (lastY - e.clientY) * (SENSITIVITY / Math.max(1, host!.clientHeight)) * 6
            lastY = e.clientY
        }
        // Released on window, never on the host: a pointer that leaves
        // mid-drag would otherwise never release (rule K).
        const onUp = () => {
            dragging = false
        }
        host.addEventListener("wheel", onWheel, { passive: false })
        host.addEventListener("pointerdown", onDown)
        window.addEventListener("pointermove", onMove)
        window.addEventListener("pointerup", onUp)
        window.addEventListener("pointercancel", onUp)

        /* ---- frame */
        const proj = new Float32Array(16)
        let raf = 0
        let prev = performance.now()

        const frame = (now: number) => {
            raf = requestAnimationFrame(frame)
            const dt = Math.min(0.05, (now - prev) / 1000)
            prev = now
            const L = live.current

            if (texRef.current.dirty) {
                uploadLayers(texRef.current.cells)
                texRef.current.dirty = false
                builtKey = "" // layer count may have moved; re-pick per plane
            }
            if (layers === 0) return

            const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
            const cw = Math.max(1, Math.round(host!.clientWidth * dpr))
            const ch = Math.max(1, Math.round(host!.clientHeight * dpr))
            if (canvas!.width !== cw || canvas!.height !== ch) {
                canvas!.width = cw
                canvas!.height = ch
            }

            const key = [L.path, L.count, L.size, L.scatter, layers].join(",")
            if (key !== builtKey) {
                rebuild(L.path, L.count, L.size, L.scatter)
                builtKey = key
            }
            if (!curve) return

            /* -- scroll + autoscroll, then one relaxation toward the target */
            targetT += (L.speed / 50) * (1 / SHIPPED_LAP) * dt
            camT += (targetT - camT) * (1 - Math.exp(-Math.max(1, L.damping) * 0.2 * dt))

            // Inverted and wrapped, so scrolling down moves the camera forward.
            const t = (((1 - camT) % 1) + 1) % 1
            const p = curve.point(t)
            const camX = p[0]
            const camY = p[1]
            const camZ = p[2] + L.distance

            /* -- focus pass. The source's three gates, unchanged. */
            const focusDist = Math.max(0.01, (L.focus / 100) * SHIPPED_FOCUS)
            const maxScale = Math.max(1, L.zoom / 100)
            const focusTGate = (focusDist * FOCUS_T_FACTOR) / curve.length
            const k = 1 - Math.exp(-SCALE_K * dt)
            for (let i = 0; i < instances; i++) {
                const dx = camX - posArr[i * 3]
                const dy = camY - posArr[i * 3 + 1]
                const dz = Math.abs(camZ - posArr[i * 3 + 2])
                const distXY = Math.sqrt(dx * dx + dy * dy)
                let dtt = Math.abs(tArr[i] - t)
                if (dtt > 0.5) dtt = 1 - dtt
                const inFocus = dtt < focusTGate && dz < Z_GATE && distXY < focusDist
                const f = 1 - distXY / focusDist
                const target = inFocus ? 1 + f * f * f * (maxScale - 1) : 1
                scaleArr[i] += (target - scaleArr[i]) * k
            }
            gl!.bindBuffer(gl!.ARRAY_BUFFER, scaleBuf)
            gl!.bufferSubData(gl!.ARRAY_BUFFER, 0, scaleArr.subarray(0, instances))

            /* -- projection: a pure translation view, so only proj is needed */
            const asp = cw / ch
            const f2 = 1 / Math.tan((Math.max(5, L.perspective) * Math.PI) / 360)
            proj.fill(0)
            proj[0] = f2 / asp
            proj[5] = f2
            proj[10] = (200 + 0.1) / (0.1 - 200)
            proj[11] = -1
            proj[14] = (2 * 200 * 0.1) / (0.1 - 200)

            /* -- draw */
            gl!.viewport(0, 0, cw, ch)
            gl!.clearColor(L.bgCss[0], L.bgCss[1], L.bgCss[2], 1)
            gl!.enable(gl!.DEPTH_TEST)
            gl!.disable(gl!.CULL_FACE)
            gl!.enable(gl!.SAMPLE_ALPHA_TO_COVERAGE)
            gl!.clear(gl!.COLOR_BUFFER_BIT | gl!.DEPTH_BUFFER_BIT)
            gl!.useProgram(prog)
            gl!.bindVertexArray(vao)
            gl!.activeTexture(gl!.TEXTURE0)
            gl!.bindTexture(gl!.TEXTURE_2D_ARRAY, tex)
            gl!.uniform1i(uTex, 0)
            gl!.uniformMatrix4fv(uProj, false, proj)
            gl!.uniform3f(uCam, camX, camY, camZ)
            gl!.uniform1f(uAspect, Math.max(1, L.aspect) / 100)
            gl!.uniform1f(uRounded, L.rounded)
            gl!.uniform3f(uFog, L.bg[0], L.bg[1], L.bg[2])
            gl!.drawArraysInstanced(gl!.TRIANGLE_STRIP, 0, 4, instances)
        }

        raf = requestAnimationFrame(frame)

        return () => {
            cancelAnimationFrame(raf)
            host.removeEventListener("wheel", onWheel)
            host.removeEventListener("pointerdown", onDown)
            window.removeEventListener("pointermove", onMove)
            window.removeEventListener("pointerup", onUp)
            window.removeEventListener("pointercancel", onUp)
            // No loseContext(): getContext hands back the SAME context on the
            // next StrictMode mount, and a force-lost one renders black.
        }
    }, [])

    return (
        <div
            ref={hostRef}
            style={{
                position: "relative",
                overflow: "hidden",
                touchAction: "none",
                minWidth: 1200,
                minHeight: 800,
                background,
                ...style,
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    display: "block",
                }}
            />
        </div>
    )
}




Interactive Grid
A hover-reactive logo grid that lifts each card and its neighbours in 3D, with an optional glow pulse.

KEY FEATURES

— Hover lifts the card and ripples into its four neighbours for a fabric-pull feel
— Debounced leave keeps the formation intact when moving between cards
— Optional two-colour glow pulse that breathes on the raised cards
— Adjustable 3D perspective and independent X/Y tilt for the whole grid
— Configurable columns, rows, gap, padding, corner radius and logo scale
— Per-card shadow with custom colour, independent of the glow
API Reference
All props map directly to the controls panel sliders and color pickers.

LAYOUT

Props
Type
Default
Description
images
array
The logos shown in the grid, tiled to fill every cell in order.
columns
number
7
How many columns make up the grid.
rows
number
6
How many rows make up the grid.
padding
padding
50px
Space between the grid and the component's edge, keeping raised cards clear of the frame.
gap
number
0
Spacing between cards.
rounded
number
8
Corner radius applied to each card.
logoScale
number
3
How large each logo renders inside its card.
cardFill
color
#000000
Background colour of each card at rest.
cardBorder
color
#292929
Border colour of each card.
shadow
boolean
false
Toggles a drop shadow beneath every card.
cardShadow
color
rgba(217, 251, 232, 0.5)
Colour of the card drop shadow.
glow
boolean
false
Toggles the pulsing glow on hovered and neighbouring cards.
glowStart
color
rgba(56, 239, 125, 0.5)
Colour the glow pulses from.
glowEnd
color
#38EF7D
Colour the glow pulses to.
glowIntensity
number
50
How far the glow's halo reaches at the peak of its pulse.
perspective
number
1600
Depth of the 3D perspective applied to the grid.
rotateX
number
0
Tilts the grid left and right.
rotateY
number
0
Tilts the grid up and down.


Absolutely — here’s a **ready-to-use template** based directly on your `.hover-3d` effect, but turned into a polished **developer portfolio ID/profile card**.

It works as a standalone HTML file, so you can test it immediately.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>3D Portfolio Card</title>

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #09090b;
      font-family: Inter, Arial, sans-serif;
      color: white;
    }

    /* =========================
       3D HOVER CONTAINER
       ========================= */

    .hover-3d {
      display: inline-grid;
      perspective: 75rem;

      --transform: 0, 0;
      --shine: 100% 100%;
      --shadow: 0rem 0rem 0rem;

      --ease: linear(
        0,
        0.931 13.8%,
        1.196 21.4%,
        1.343 29.8%,
        1.378 36%,
        1.365 43.2%,
        1.059 78%,
        1
      );

      filter:
        drop-shadow(var(--shadow) 0.1rem #00000003)
        drop-shadow(var(--shadow) 0.2rem #00000003)
        drop-shadow(var(--shadow) 0.3rem #00000003)
        drop-shadow(var(--shadow) 0.4rem #00000003);

      transition: filter ease-out 400ms;
    }

    /* Invisible hover zones */

    .hover-3d > :nth-child(n + 2) {
      isolation: isolate;
      z-index: 10;
      scale: 1.2;
    }

    .hover-3d > :first-child {
      overflow: hidden;
      grid-area: 1 / 1 / 4 / 4;

      transform: rotate3d(
        var(--transform),
        0,
        10deg
      );

      transition:
        transform var(--ease) 500ms,
        scale var(--ease) 500ms,
        outline-color ease-out 500ms;

      outline: 1px solid transparent;
      outline-offset: -1px;

      position: relative;
    }

    /* =========================
       SHINE EFFECT
       ========================= */

    .hover-3d > :first-child::before {
      content: "";

      pointer-events: none;

      position: absolute;
      z-index: 5;

      width: 33%;
      height: 33%;

      scale: 500%;

      opacity: 0;

      filter: blur(0.75rem);

      background:
        radial-gradient(
          circle at 50%,
          rgba(255, 255, 255, 0.25) 10%,
          transparent 50%
        );

      translate: var(--shine);

      transition:
        translate ease-out 400ms,
        opacity ease-out 400ms;
    }

    /* =========================
       CARD HOVER
       ========================= */

    .hover-3d:hover {
      --ease: linear(
        0,
        0.708 15.2%,
        0.927 23.6%,
        1.067 33%,
        1.12 41%,
        1.13 50.2%,
        1.019 83.2%,
        1
      );
    }

    .hover-3d:hover > :first-child {
      scale: 1.05;
      outline-color: rgba(255, 255, 255, 0.08);
    }

    .hover-3d:hover > :first-child::before {
      opacity: 1;
    }

    /* =========================
       3x3 HOVER GRID
       ========================= */

    .hover-3d > :nth-child(2) {
      grid-area: 1 / 1 / 2 / 2;
    }

    .hover-3d > :nth-child(3) {
      grid-area: 1 / 2 / 2 / 3;
    }

    .hover-3d > :nth-child(4) {
      grid-area: 1 / 3 / 2 / 4;
    }

    .hover-3d > :nth-child(5) {
      grid-area: 2 / 1 / 3 / 2;
    }

    .hover-3d > :nth-child(6) {
      grid-area: 2 / 3 / 3 / 4;
    }

    .hover-3d > :nth-child(7) {
      grid-area: 3 / 1 / 4 / 2;
    }

    .hover-3d > :nth-child(8) {
      grid-area: 3 / 2 / 4 / 3;
    }

    .hover-3d > :nth-child(9) {
      grid-area: 3 / 3 / 4 / 4;
    }

    /* =========================
       8 DIRECTIONS
       ========================= */

    .hover-3d:has(> :nth-child(2):hover) {
      --transform: -1, 1;
      --shine: 0% 0%;
      --shadow: -0.5rem -0.5rem;
    }

    .hover-3d:has(> :nth-child(3):hover) {
      --transform: -1, 0;
      --shine: 100% 0%;
      --shadow: 0rem -0.5rem;
    }

    .hover-3d:has(> :nth-child(4):hover) {
      --transform: -1, -1;
      --shine: 200% 0%;
      --shadow: 0.5rem -0.5rem;
    }

    .hover-3d:has(> :nth-child(5):hover) {
      --transform: 0, 1;
      --shine: 0% 100%;
      --shadow: -0.5rem 0rem;
    }

    .hover-3d:has(> :nth-child(6):hover) {
      --transform: 0, -1;
      --shine: 200% 100%;
      --shadow: 0.5rem 0rem;
    }

    .hover-3d:has(> :nth-child(7):hover) {
      --transform: 1, 1;
      --shine: 0% 200%;
      --shadow: -0.5rem 0.5rem;
    }

    .hover-3d:has(> :nth-child(8):hover) {
      --transform: 1, 0;
      --shine: 100% 200%;
      --shadow: 0rem 0.5rem;
    }

    .hover-3d:has(> :nth-child(9):hover) {
      --transform: 1, -1;
      --shine: 200% 200%;
      --shadow: 0.5rem 0.5rem;
    }

    /* =========================
       PROFILE CARD
       ========================= */

    .profile-card {
      width: 380px;
      height: 520px;

      border-radius: 28px;

      padding: 28px;

      position: relative;

      background:
        linear-gradient(
          145deg,
          #18181b,
          #0f0f11
        );

      border: 1px solid rgba(255, 255, 255, 0.1);

      box-shadow:
        inset 0 1px rgba(255, 255, 255, 0.08),
        0 30px 80px rgba(0, 0, 0, 0.5);

      display: flex;
      flex-direction: column;

      justify-content: space-between;

      transform-style: preserve-3d;
    }

    /* =========================
       CARD HEADER
       ========================= */

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-label {
      font-size: 12px;
      letter-spacing: 2px;
      text-transform: uppercase;

      color: #a1a1aa;
    }

    .status {
      display: flex;
      align-items: center;
      gap: 7px;

      font-size: 12px;
      color: #a1a1aa;
    }

    .status-dot {
      width: 7px;
      height: 7px;

      border-radius: 50%;

      background: #22c55e;

      box-shadow:
        0 0 10px rgba(34, 197, 94, 0.7);
    }

    /* =========================
       PROFILE
       ========================= */

    .profile {
      text-align: center;
    }

    .profile-image {
      width: 150px;
      height: 150px;

      margin: 0 auto 22px;

      border-radius: 50%;

      object-fit: cover;

      border: 3px solid rgba(255, 255, 255, 0.1);

      box-shadow:
        0 15px 40px rgba(0, 0, 0, 0.5);
    }

    .name {
      font-size: 30px;
      font-weight: 700;

      letter-spacing: -1px;

      margin-bottom: 8px;
    }

    .role {
      color: #a1a1aa;

      font-size: 14px;

      margin-bottom: 20px;
    }

    .bio {
      color: #71717a;

      font-size: 13px;

      line-height: 1.6;

      max-width: 270px;

      margin: auto;
    }

    /* =========================
       LINKS
       ========================= */

    .links {
      display: grid;

      grid-template-columns:
        repeat(3, 1fr);

      gap: 10px;
    }

    .link {
      text-decoration: none;

      color: #d4d4d8;

      padding: 12px 8px;

      border-radius: 12px;

      text-align: center;

      font-size: 12px;

      background:
        rgba(255, 255, 255, 0.04);

      border:
        1px solid rgba(255, 255, 255, 0.06);

      transition:
        background 200ms,
        transform 200ms;
    }

    .link:hover {
      background:
        rgba(255, 255, 255, 0.09);

      transform: translateY(-2px);
    }

    /* =========================
       FOOTER
       ========================= */

    .card-footer {
      display: flex;

      justify-content: space-between;

      align-items: center;

      color: #52525b;

      font-size: 10px;

      letter-spacing: 1px;

      text-transform: uppercase;
    }

    /* =========================
       RESPONSIVE
       ========================= */

    @media (max-width: 500px) {
      .profile-card {
        width: 320px;
        height: 470px;
        padding: 22px;
      }

      .profile-image {
        width: 120px;
        height: 120px;
      }

      .name {
        font-size: 25px;
      }
    }
  </style>
</head>

<body>

  <!--
    ==========================================
    3D PROFILE CARD
    ==========================================
  -->

  <div class="hover-3d">

    <!-- REAL CARD -->

    <div class="profile-card">

      <div class="card-header">

        <span class="card-label">
          PORTFOLIO / 2026
        </span>

        <span class="status">
          <span class="status-dot"></span>
          Available
        </span>

      </div>


      <div class="profile">

        <!-- CHANGE THIS IMAGE -->
        <img
          class="profile-image"
          src="your-photo.jpg"
          alt="Your Profile"
        />

        <!-- CHANGE YOUR NAME -->

        <h1 class="name">
          PRANEETH GUPTA
        </h1>

        <!-- CHANGE YOUR ROLE -->

        <p class="role">
          Developer · Builder · Problem Solver
        </p>

        <!-- CHANGE YOUR BIO -->

        <p class="bio">
          I build software, explore systems,
          and turn interesting ideas into
          useful products.
        </p>

      </div>


      <div class="links">

        <!-- CHANGE THESE LINKS -->

        <a
          href="https://linkedin.com"
          target="_blank"
          class="link"
        >
          LinkedIn
        </a>

        <a
          href="https://github.com"
          target="_blank"
          class="link"
        >
          GitHub
        </a>

        <a
          href="mailto:you@example.com"
          class="link"
        >
          Email
        </a>

      </div>


      <div class="card-footer">

        <span>
          DIGITAL IDENTITY
        </span>

        <span>
          PG — 01
        </span>

      </div>

    </div>


    <!--
      ========================================
      INVISIBLE 3 × 3 HOVER ZONES
      ========================================
    -->

    <div></div>
    <div></div>
    <div></div>

    <div></div>
    <div></div>

    <div></div>
    <div></div>
    <div></div>

  </div>

</body>
</html>
```

### What you need to change

Only these parts initially:

```html
<img
  class="profile-image"
  src="your-photo.jpg"
/>
```

Your name:

```html
<h1 class="name">
  PRANEETH GUPTA
</h1>
```

Your role:

```html
<p class="role">
  Developer · Builder · Problem Solver
</p>
```

Your bio:

```html
<p class="bio">
  I build software, explore systems,
  and turn interesting ideas into useful products.
</p>
```

And your actual links:

```html
<a href="YOUR_LINKEDIN_URL">LinkedIn</a>
<a href="YOUR_GITHUB_URL">GitHub</a>
<a href="mailto:YOUR_EMAIL">Email</a>
```

### One thing I'd change for your actual portfolio

I'd **not stop at this version**. The really cool version would make the card look like an actual **premium physical ID/pass**:

* front-facing profile
* subtle holographic/foil effect
* your portrait
* QR code linking to your portfolio
* LinkedIn/GitHub badges
* animated serial number
* glass/metal texture
* cursor-responsive shine
* 3D tilt
* card flips to reveal a **second side** containing your skills/projects

That could become a genuinely memorable centerpiece for your portfolio rather than just another hover animation.
