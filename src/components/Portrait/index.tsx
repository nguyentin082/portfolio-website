import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { loadFrames, loadManifest } from './utils/frames';
import {
    OWNED_TRIGGERS,
    setAllTimeline,
    setPortraitTimeline,
} from '../utils/GsapScroll';
import { useLoading } from '../../context/LoadingProvider';
import { setProgress } from '../Loading';

const Portrait = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { setLoading } = useLoading();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let disposed = false;
        let frames: ImageBitmap[] = [];
        let drawn = -1;

        const progress = setProgress((value) => setLoading(value));

        const rebuild = (count: number) => {
            const draw = (index: number) => {
                const i = Math.max(0, Math.min(count - 1, Math.round(index)));
                if (i === drawn || !frames[i]) return;
                drawn = i;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(frames[i], 0, 0);
            };
            // Timelines are rebuilt on resize, so stale triggers have to go
            // or they stack up. Only kill our own — the text reveal, work and
            // contact triggers must survive.
            OWNED_TRIGGERS.forEach((id) => ScrollTrigger.getById(id)?.kill());
            setPortraitTimeline(draw, count);
            setAllTimeline();
            ScrollTrigger.refresh();
            drawn = -1;
            draw(0);
        };

        let onResize: (() => void) | undefined;

        (async () => {
            const manifest = await loadManifest();
            if (disposed) return;
            canvas.width = manifest.size;
            canvas.height = manifest.size;

            frames = await loadFrames(manifest, () => {});
            if (disposed) {
                frames.forEach((f) => f.close());
                return;
            }

            rebuild(manifest.count);
            onResize = () => rebuild(manifest.count);
            window.addEventListener('resize', onResize);

            // Images and fonts above the portrait triggers can still shift
            // the layout after the first refresh (e.g. a reload restored
            // mid-page), so measure the trigger positions again once settled.
            const settle = () => !disposed && ScrollTrigger.refresh();
            document.fonts.ready.then(settle);
            if (document.readyState === 'complete') settle();
            else window.addEventListener('load', settle, { once: true });

            progress.loaded().then(() => {
                // The intro runs on the container, the scroll exit on
                // .portrait-model. Their opacities multiply, so the intro
                // cannot un-hide a portrait the scroll position has faded out
                // (reloading with the scroll restored past .whatIDO).
                gsap.fromTo(
                    '.portrait-container',
                    { opacity: 0, filter: 'blur(14px)' },
                    {
                        opacity: 1,
                        filter: 'blur(0px)',
                        duration: 1.2,
                        ease: 'power2.out',
                        clearProps: 'filter',
                    },
                );
            });
        })().catch((err) => {
            console.error('Portrait frames failed to load:', err);
            progress.clear();
        });

        return () => {
            disposed = true;
            if (onResize) window.removeEventListener('resize', onResize);
            frames.forEach((f) => f.close());
        };
    }, []);

    return (
        <div className="portrait-container">
            <div className="portrait-model">
                <canvas ref={canvasRef} className="portrait-canvas" />
            </div>
        </div>
    );
};

export default Portrait;
