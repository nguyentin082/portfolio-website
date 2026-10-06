import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Season } from '../utils/season';
import './styles/SeasonalBackground.css';

type Particle = {
    x: number;
    y: number;
    size: number;
    depth: number; // 0 (far) → 1 (near)
    vx: number;
    vy: number;
    angle: number;
    spin: number;
    sway: number;
    swaySpeed: number;
    color: string;
};

type SeasonConfig = {
    density: number; // pixels² per particle
    size: [number, number];
    speed: [number, number]; // vertical, negative = rising
    colors: string[]; // CSS variable names
};

const CONFIG: Record<Season, SeasonConfig> = {
    spring: {
        density: 28000,
        size: [6, 12],
        speed: [0.3, 0.8],
        colors: ['--accentColor', '--glowOuter', '--accentStrong'],
    },
    summer: {
        density: 32000,
        size: [2, 6],
        speed: [-0.4, -0.1],
        colors: ['--accentColor', '--secondaryColor', '--glowOuter'],
    },
    autumn: {
        density: 32000,
        size: [8, 16],
        speed: [0.4, 1],
        colors: [
            '--accentColor',
            '--accentVivid',
            '--secondaryColor',
            '--accentDeep',
        ],
    },
    winter: {
        density: 14000,
        size: [1.5, 4],
        speed: [0.3, 1.1],
        colors: ['--glowOuter', '--accentColor', '--cursorColor'],
    },
};

const MAX_PARTICLES = 80;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

const getSeason = (): Season =>
    (document.documentElement.dataset.season as Season) || 'autumn';

const readColors = (names: string[]) => {
    const styles = getComputedStyle(document.documentElement);
    return names.map((name) => styles.getPropertyValue(name).trim());
};

const createParticle = (
    config: SeasonConfig,
    colors: string[],
    width: number,
    height: number,
    anywhere: boolean,
): Particle => {
    const depth = Math.random();
    const scale = 0.5 + depth * 0.7;
    const vy = rand(...config.speed) * scale;
    return {
        x: rand(0, width),
        // New particles enter from the edge they travel away from
        y: anywhere ? rand(0, height) : vy > 0 ? -20 : height + 20,
        size: rand(...config.size) * scale,
        depth,
        vx: rand(-0.2, 0.2),
        vy,
        angle: rand(0, Math.PI * 2),
        spin: rand(-0.02, 0.02),
        sway: rand(0, Math.PI * 2),
        swaySpeed: rand(0.005, 0.02),
        color: colors[Math.floor(Math.random() * colors.length)],
    };
};

const drawPetal = (ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    // Flip effect: squash horizontally as the petal turns
    ctx.scale(Math.abs(Math.cos(p.sway)) * 0.7 + 0.3, 1);
    const s = p.size;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.9, -s * 0.6, s * 0.7, s * 0.7, 0, s);
    ctx.bezierCurveTo(-s * 0.7, s * 0.7, -s * 0.9, -s * 0.6, 0, -s);
    ctx.fillStyle = p.color;
    ctx.fill();
};

const drawLeaf = (ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.scale(1, Math.abs(Math.cos(p.sway)) * 0.6 + 0.4);
    const s = p.size;
    ctx.beginPath();
    ctx.moveTo(-s, 0);
    ctx.quadraticCurveTo(0, -s * 0.7, s, 0);
    ctx.quadraticCurveTo(0, s * 0.7, -s, 0);
    ctx.fillStyle = p.color;
    ctx.fill();
    // Midrib
    ctx.beginPath();
    ctx.moveTo(-s * 1.3, 0);
    ctx.lineTo(s * 0.9, 0);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();
};

const drawGlow = (ctx: CanvasRenderingContext2D, p: Particle) => {
    const r = p.size * 3;
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
    gradient.addColorStop(0, p.color);
    gradient.addColorStop(1, 'transparent');
    ctx.globalAlpha *= 0.6 + Math.sin(p.sway) * 0.4; // twinkle
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
};

const drawSnow = (ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
};

const DRAW: Record<
    Season,
    (ctx: CanvasRenderingContext2D, p: Particle) => void
> = {
    spring: drawPetal,
    summer: drawGlow,
    autumn: drawLeaf,
    winter: drawSnow,
};

const SeasonalBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        let width = 0;
        let height = 0;
        let season = getSeason();
        let particles: Particle[] = [];
        let frameId = 0;

        const populate = () => {
            const config = CONFIG[season];
            const colors = readColors(config.colors);
            const count = Math.min(
                MAX_PARTICLES,
                Math.round((width * height) / config.density),
            );
            particles = Array.from({ length: count }, () =>
                createParticle(config, colors, width, height, true),
            );
        };

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            populate();
        };

        const tick = () => {
            const config = CONFIG[season];
            const draw = DRAW[season];
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.sway += p.swaySpeed;
                p.angle += p.spin;
                p.x += p.vx + Math.sin(p.sway) * 0.4 * (0.5 + p.depth);
                p.y += p.vy;

                const out =
                    p.y > height + 30 ||
                    p.y < -30 ||
                    p.x < -30 ||
                    p.x > width + 30;
                if (out) {
                    particles[i] = createParticle(
                        config,
                        [p.color],
                        width,
                        height,
                        false,
                    );
                    continue;
                }

                ctx.save();
                ctx.globalAlpha = 0.25 + p.depth * 0.55;
                draw(ctx, p);
                ctx.restore();
            }

            frameId = requestAnimationFrame(tick);
        };

        // Re-populate when the season (data-season on <html>) changes
        const observer = new MutationObserver(() => {
            const next = getSeason();
            if (next !== season) {
                season = next;
                populate();
            }
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-season'],
        });

        resize();
        window.addEventListener('resize', resize);
        frameId = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
            window.removeEventListener('resize', resize);
        };
    }, []);

    // Rendered into <body> so it sits beneath #root (see SeasonalBackground.css)
    return createPortal(
        <canvas
            ref={canvasRef}
            className="seasonal-background"
            aria-hidden="true"
        />,
        document.body,
    );
};

export default SeasonalBackground;
