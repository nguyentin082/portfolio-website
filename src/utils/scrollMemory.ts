const KEY = 'scroll-y';

/**
 * The browser's own scroll restoration can't be relied on here: on reload
 * the lazy sections haven't rendered yet (the page is one screen tall) and
 * body is overflow: hidden behind the loading screen, so it usually lands
 * at the top. Take it over and restore the position once loading is done.
 */
export function rememberScroll() {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.addEventListener('pagehide', () => {
        try {
            sessionStorage.setItem(KEY, String(window.scrollY));
        } catch {
            // Storage blocked (private mode etc.) — just start at the top.
        }
    });
}

/** Returns the position saved before the reload, once. */
export function takeSavedScroll(): number {
    try {
        const y = Number(sessionStorage.getItem(KEY));
        sessionStorage.removeItem(KEY);
        return y > 0 ? y : 0;
    } catch {
        return 0;
    }
}
