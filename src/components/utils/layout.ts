/**
 * The desktop layout (scroll-driven portrait beside the copy) needs a wide
 * landscape screen. A portrait screen wider than 1024px (iPad Pro 13" at
 * 1032x1376) gets the stacked tablet layout instead: the portrait box is
 * sized by width there, so it would sit small at the bottom with the face
 * pushed off screen when it slides left for About.
 *
 * The CSS media queries must use the same split:
 *   desktop: (min-width: 1025px) and (orientation: landscape)
 *   tablet:  (max-width: 1024px), (orientation: portrait)
 */
export const DESKTOP_LAYOUT_QUERY =
    '(min-width: 1025px) and (orientation: landscape)';

export const isDesktopLayout = () =>
    window.matchMedia(DESKTOP_LAYOUT_QUERY).matches;
