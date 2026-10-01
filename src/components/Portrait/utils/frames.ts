export interface PortraitManifest {
    count: number;
    size: number;
    /** First frame of the head turn — the landing/about boundary. */
    turnStart: number;
}

const CONCURRENCY = 8;

export async function loadManifest(): Promise<PortraitManifest> {
    const res = await fetch('/portrait/manifest.json');
    if (!res.ok) throw new Error('portrait manifest not found');
    return res.json();
}

/**
 * Each file is "packed": RGB on the left half, alpha as grayscale on the
 * right. This lets both halves be lossy-compressed (~12 KB/frame against
 * ~32 KB for WebP RGBA, since libwebp always encodes alpha losslessly).
 */
async function decodePacked(
    url: string,
    size: number,
    ctx: CanvasRenderingContext2D,
): Promise<ImageBitmap> {
    const res = await fetch(url);
    const packed = await createImageBitmap(await res.blob());

    // Everything from here to the second getImageData is synchronous, so
    // several workers can share one canvas safely.
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(packed, 0, 0, size, size, 0, 0, size, size);
    const rgb = ctx.getImageData(0, 0, size, size);

    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(packed, size, 0, size, size, 0, 0, size, size);
    const matte = ctx.getImageData(0, 0, size, size);
    packed.close();

    const px = rgb.data;
    const am = matte.data;
    for (let i = 0; i < px.length; i += 4) {
        px[i + 3] = am[i];
    }
    return createImageBitmap(rgb);
}

export async function loadFrames(
    manifest: PortraitManifest,
    onProgress: (loaded: number, total: number) => void,
): Promise<ImageBitmap[]> {
    const { count, size } = manifest;
    const work = document.createElement('canvas');
    work.width = size;
    work.height = size;
    const ctx = work.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('2d context unavailable');

    const frames = new Array<ImageBitmap>(count);
    let next = 0;
    let done = 0;

    const worker = async () => {
        while (next < count) {
            const i = next++;
            const name = `f${String(i).padStart(3, '0')}.webp`;
            frames[i] = await decodePacked(`/portrait/${name}`, size, ctx);
            onProgress(++done, count);
        }
    };

    await Promise.all(
        Array.from({ length: Math.min(CONCURRENCY, count) }, worker),
    );
    return frames;
}
