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
 * Colour and matte ship as two separate lossy files (f{i}.webp / a{i}.webp)
 * and are recombined here. Encoding the matte as real WebP alpha would force
 * libwebp's lossless alpha path (~50 KB/frame against ~11 KB here), and
 * giving the near-binary matte its own low quality leaves the bitrate for
 * the face.
 */
async function decodeFrame(
    rgbUrl: string,
    alphaUrl: string,
    size: number,
    ctx: CanvasRenderingContext2D,
): Promise<ImageBitmap> {
    const [colorBmp, alphaBmp] = await Promise.all(
        [rgbUrl, alphaUrl].map(async (url) =>
            createImageBitmap(await (await fetch(url)).blob()),
        ),
    );

    // Everything from here to the second getImageData is synchronous, so
    // several workers can share one canvas safely.
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(colorBmp, 0, 0);
    const rgb = ctx.getImageData(0, 0, size, size);

    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(alphaBmp, 0, 0);
    const matte = ctx.getImageData(0, 0, size, size);
    colorBmp.close();
    alphaBmp.close();

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
            const n = String(i).padStart(3, '0');
            frames[i] = await decodeFrame(
                `/portrait/f${n}.webp`,
                `/portrait/a${n}.webp`,
                size,
                ctx,
            );
            onProgress(++done, count);
        }
    };

    await Promise.all(
        Array.from({ length: Math.min(CONCURRENCY, count) }, worker),
    );
    return frames;
}
