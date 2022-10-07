import type {
    Band,
    StartIntersectionSample,
    StopIntersectionSample
} from '../reading-bands';
import { getViewportHeight } from './dom';
import { IntersectionObserverCallbackWithContext } from './visibility';

const INTERSECTION_SAMPLING_RATE_MS: number = 1 * 1000;

// TODO(dnguyen0304): Support keying by root and rootMargin.
// Array or tuple keys are not yet supported until ES7 value objects.
// - See: https://stackoverflow.com/a/21846269
// - See: https://stackoverflow.com/a/32660218
const rootToIntervalId = new Map<
    IntersectionObserver['rootMargin'],
    number
>();

export const handleOnVisibilityChange: IntersectionObserverCallbackWithContext = (
    entries,
    observer,
    context,
) => {
    if (!context || !context.samples || !context.band || !context.target) {
        throw new Error('expected context to be defined');
    }
    const typedContext = context as {
        target: Element;
        band: Band;
    };
    for (const entry of entries) {
        if (entry.isIntersecting) {
            const intervalId = window.setInterval(() => {
                const sample: StartIntersectionSample = {
                    timestampMilli: Date.now(),
                    targetRect: typedContext.target.getBoundingClientRect(),
                    band: typedContext.band,
                    isIntersecting: true,
                    deviceInfo: {
                        viewportHeightPx: getViewportHeight(),
                    },
                };
                context
                    .samples
                    .current
                    .get(typedContext.band.friendlyKey)
                    ?.push(sample);
            }, INTERSECTION_SAMPLING_RATE_MS);
            rootToIntervalId.set(observer.rootMargin, intervalId);
        } else {
            const intervalId = rootToIntervalId.get(observer.rootMargin);
            clearInterval(intervalId);

            const sample: StopIntersectionSample = {
                timestampMilli: Date.now(),
                band: typedContext.band,
                isIntersecting: false,
            };
            context
                .samples
                .current
                .get(typedContext.band.friendlyKey)
                ?.push(sample);
        }
    }
};