import { BAND_FRIENDLY_KEYS } from '../config';
import type {
    Band,
    BandFriendlyKey,
    IntersectionSample,
    StartIntersectionSample,
    StopIntersectionSample,
    Target
} from '../reading-bands';
import { getViewportHeight } from './dom';

const INTERSECTION_SAMPLING_RATE_MILLI: number = 1 * 1000;

export function createOnVisibilityChange(
    samples: Map<string, Map<BandFriendlyKey, IntersectionSample[]>>,
    target: Target,
    band: Band,
    getBoundingClientRect: () => DOMRect,
    samplingRateMilli: number = INTERSECTION_SAMPLING_RATE_MILLI,
): IntersectionObserverCallback {
    // TODO(dnguyen0304): Support keying by root and rootMargin.
    // Array or tuple keys are not yet supported until ES7 value objects.
    // - See: https://stackoverflow.com/a/21846269
    // - See: https://stackoverflow.com/a/32660218
    const rootToIntervalId = new Map<
        IntersectionObserver['rootMargin'],
        number
    >();

    return (entries, observer) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                const intervalId = window.setInterval(() => {
                    const sample: StartIntersectionSample = {
                        timestampMilli: Date.now(),
                        target,
                        band,
                        isIntersecting: true,
                        targetRect: getBoundingClientRect(),
                        deviceInfo: {
                            viewportHeightPx: getViewportHeight(),
                        },
                    };
                    pushSample(samples, target.id, band.friendlyKey, sample);
                }, samplingRateMilli);
                rootToIntervalId.set(observer.rootMargin, intervalId);
            } else {
                const intervalId = rootToIntervalId.get(observer.rootMargin);
                clearInterval(intervalId);

                const sample: StopIntersectionSample = {
                    timestampMilli: Date.now(),
                    target,
                    band,
                    isIntersecting: false,
                };
                pushSample(samples, target.id, band.friendlyKey, sample);
            }
        }
    };
};

function pushSample(
    samples: Map<string, Map<BandFriendlyKey, IntersectionSample[]>>,
    targetId: string,
    bandKey: BandFriendlyKey,
    sample: IntersectionSample,
) {
    let targetSamples = samples.get(targetId);
    if (targetSamples === undefined) {
        targetSamples =
            new Map([...BAND_FRIENDLY_KEYS].map(bandKey => {
                return [bandKey, []];
            }));
        samples.set(targetId, targetSamples);
    }
    targetSamples.get(bandKey)!.push(sample);
};
