import type {
    Band,
    BandFriendlyKey,
    IntersectionSample,
    StartIntersectionSample,
    StopIntersectionSample
} from '../reading-bands';
import { getViewportHeight } from './dom';

const INTERSECTION_SAMPLING_RATE_MS: number = 1 * 1000;

export function createOnVisibilityChange(
    samples: Map<BandFriendlyKey, IntersectionSample[]>,
    target: Element,
    band: Band,
    samplingRateMilli: number = INTERSECTION_SAMPLING_RATE_MS,
): IntersectionObserverCallback {
    // TODO(dnguyen0304): Support keying by root and rootMargin.
    // Array or tuple keys are not yet supported until ES7 value objects.
    // - See: https://stackoverflow.com/a/21846269
    // - See: https://stackoverflow.com/a/32660218
    const rootToIntervalId = new Map<
        IntersectionObserver['rootMargin'],
        number
    >();

    const handle: IntersectionObserverCallback = (entries, observer) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                const intervalId = window.setInterval(() => {
                    const sample: StartIntersectionSample = {
                        timestampMilli: Date.now(),
                        targetRect: target.getBoundingClientRect(),
                        band,
                        isIntersecting: true,
                        deviceInfo: {
                            viewportHeightPx: getViewportHeight(),
                        },
                    };
                    samples.get(band.friendlyKey)?.push(sample);
                }, samplingRateMilli);
                rootToIntervalId.set(observer.rootMargin, intervalId);
            } else {
                const intervalId = rootToIntervalId.get(observer.rootMargin);
                clearInterval(intervalId);

                const sample: StopIntersectionSample = {
                    timestampMilli: Date.now(),
                    band,
                    isIntersecting: false,
                };
                samples.get(band.friendlyKey)?.push(sample);
            }
        }
    };
    return handle;
};