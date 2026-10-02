import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type DrawFrame = (index: number) => void;

/** Gap between the portrait's right edge and the left edge of .about-me. */
const ABOUT_GAP = 40;

/**
 * ScrollTriggers owned by this file. On rebuild (resize) only these may be
 * killed. Killing every trigger would also destroy the ones setSplitText
 * creates, which hold .title/.para at autoAlpha 0 until they fire — every
 * heading and paragraph on the page would disappear.
 */
export const OWNED_TRIGGERS = [
    'portrait-landing',
    'portrait-about',
    'portrait-exit',
    'portrait-mobile',
    'career',
];

/**
 * Scrubs the portrait frame sequence against scroll.
 *
 *   .landing-section  frames 0 -> last, and slides left
 *   .about-section    holds the last frames, face turned toward the copy
 *   .whatIDO          fades out before Career & Experience takes over
 */
export function setPortraitTimeline(draw: DrawFrame, count: number) {
    const state = { frame: 0 };
    const render = () => draw(state.frame);

    const tl1 = gsap.timeline({
        scrollTrigger: {
            id: 'portrait-landing',
            trigger: '.landing-section',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
        },
    });
    const tl2 = gsap.timeline({
        scrollTrigger: {
            id: 'portrait-about',
            trigger: '.about-section',
            start: 'center 55%',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
        },
    });

    if (window.innerWidth > 1024) {
        gsap.set('.portrait-model', { xPercent: -50 });

        // The box scales with the viewport, so measure its real width.
        // .about-me starts at the container midpoint, so shifting left by
        // half the box plus a gap is just enough to clear it.
        const model = document.querySelector<HTMLElement>('.portrait-model');
        const shiftX = -((model?.offsetWidth ?? 924) / 2 + ABOUT_GAP);

        // Run the whole head turn while scrolling past landing, so the
        // portrait is already on its last frames when .about-section arrives.
        tl1.fromTo(
            state,
            { frame: 0 },
            { frame: count - 1, duration: 1, ease: 'none', onUpdate: render },
            0,
        )
            .to('.landing-container', { opacity: 0, duration: 0.4 }, 0)
            .to('.landing-container', { y: '40%', duration: 0.8 }, 0)
            // Slide left during the landing scroll, starting as the landing
            // text fades, so the space is already clear when About arrives.
            .to(
                '.portrait-model',
                { x: shiftX, duration: 0.65, delay: 0.35, ease: 'none' },
                0,
            )
            .fromTo('.about-me', { y: '-50%' }, { y: '0%' }, 0);

        tl2.to('.about-section', { y: '30%', duration: 9 }, 0).to(
            '.about-section',
            { opacity: 0, delay: 4, duration: 3 },
            0,
        );

        // Fade out before Career & Experience becomes the main content: runs
        // from .whatIDO filling the screen until it is pushed to mid-screen.
        gsap.timeline({
            scrollTrigger: {
                id: 'portrait-exit',
                trigger: '.whatIDO',
                start: 'top top',
                end: 'bottom center',
                scrub: true,
                invalidateOnRefresh: true,
            },
        }).fromTo(
            '.portrait-model',
            // Explicit start values: a plain .to() would record whatever the
            // element holds at the first render, which on a reload past
            // .whatIDO is the faded-out state, leaving it hidden for good.
            { opacity: 1, filter: 'blur(0px)' },
            {
                opacity: 0,
                filter: 'blur(14px)',
                ease: 'power2.in',
                duration: 1,
            },
        );
    } else {
        const tM2 = gsap.timeline({
            scrollTrigger: {
                id: 'portrait-mobile',
                trigger: '.what-box-in',
                start: 'top 70%',
                end: 'bottom top',
            },
        });
        tM2.to('.what-box-in', { display: 'flex', duration: 0.1, delay: 0 }, 0);
    }
}

export function setAllTimeline() {
    const careerTimeline = gsap.timeline({
        scrollTrigger: {
            id: 'career',
            trigger: '.career-section',
            start: 'top 50%',
            end: 'bottom 30%',
            scrub: 1.5,
            invalidateOnRefresh: true,
        },
    });
    careerTimeline
        .fromTo(
            '.career-timeline',
            { maxHeight: '0%' },
            { maxHeight: '100%', duration: 1, ease: 'none' },
            0,
        )

        .fromTo(
            '.career-timeline',
            { opacity: 0 },
            { opacity: 1, duration: 0.2 },
            0,
        )
        .fromTo(
            '.career-info-box',
            { opacity: 0 },
            { opacity: 1, stagger: 0.1, duration: 0.5 },
            0,
        )
        .fromTo(
            '.career-dot',
            { animationIterationCount: 'infinite' },
            {
                animationIterationCount: '1',
                delay: 0.3,
                duration: 0.1,
            },
            0,
        );

    if (window.innerWidth > 1024) {
        careerTimeline.fromTo(
            '.career-section',
            { y: 0 },
            { y: '20%', duration: 0.5, delay: 0.2 },
            0,
        );
    } else {
        careerTimeline.fromTo(
            '.career-section',
            { y: 0 },
            { y: 0, duration: 0.5, delay: 0.2 },
            0,
        );
    }
}
