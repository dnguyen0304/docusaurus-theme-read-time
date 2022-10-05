import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { getElement } from './dom';
import styles from './styles.module.css';

// Mapping from a height range to an intersection observer threshold.
type HeightRangeToThresholdType = {
    // Unique identifier that is human-readable.
    readonly friendlyName: string;

    // Minimum element height. This range endpoint is inclusive:
    // [minHeight, maxHeight).
    readonly heightMinPx: number;

    // Minimum element height. This range endpoint is exclusive:
    // [minHeight, maxHeight).
    readonly heightMaxPx: number;

    // See: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds
    readonly threshold: number[];
};

// Friendly name of the height range that uses a dynamically generated
// intersection observer threshold.
const DYNAMICALLY_GENERATED_RANGE: string = 'xl';

// Intersection observer minimum threshold chunk size. _Only_ in the "s" height
// range, this is found by heightMaxPx / threshold.length.
const THRESHOLD_MIN_PX: number = 16;

// Intersection observer maximum threshold chunk size. This is found by
// heightMaxPx / threshold.length. For example, in the "m" height range, this is
// 960 / 4 === 240.
const THRESHOLD_MAX_PX: number = 240;

const HEIGHT_RANGE_TO_THRESHOLD: HeightRangeToThresholdType[] = [
    {
        friendlyName: 'xs',
        heightMinPx: 0,
        heightMaxPx: 32,
        threshold: [1.0],
    },
    {
        friendlyName: 's',
        heightMinPx: 32,
        heightMaxPx: 480,
        threshold: [0.5, 1.0],
    },
    {
        friendlyName: 'm',
        heightMinPx: 480,
        heightMaxPx: 960,
        threshold: [0.25, 0.5, 0.75, 1.0],
    },
    {
        friendlyName: 'l',
        heightMinPx: 960,
        heightMaxPx: 2400,
        threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    },
    {
        friendlyName: DYNAMICALLY_GENERATED_RANGE,
        heightMinPx: 2400,
        heightMaxPx: Infinity,
        threshold: [],
    },
];

function getThreshold(element: Element): number[] {
    for (const range of HEIGHT_RANGE_TO_THRESHOLD) {
        const height = element.getBoundingClientRect().height;
        if (height < range.heightMinPx || height >= range.heightMaxPx) {
            continue;
        }
        if (range.friendlyName === DYNAMICALLY_GENERATED_RANGE) {
            return getDynamicThreshold(height);
        }
        return range.threshold;
    }
    throw new Error(
        `invalid height: ${element.getBoundingClientRect().height}`);
}

function getDynamicThreshold(
    height: number,
    thresholdMinPx: number = THRESHOLD_MIN_PX,
    thresholdMaxPx: number = THRESHOLD_MAX_PX,
): number[] {
    const remainder = height % thresholdMaxPx;
    const tempHeight =
        (remainder && remainder <= thresholdMinPx)
            ? height - thresholdMinPx
            : height;

    const defaultChunkSize = thresholdMaxPx;
    const defaultChunkCount = Math.floor(tempHeight / defaultChunkSize);
    const threshold = new Array(defaultChunkCount).fill(defaultChunkSize);

    const restChunk = tempHeight - (defaultChunkCount * defaultChunkSize);
    if (restChunk) {
        threshold.push(restChunk);
    }
    if (remainder && remainder <= thresholdMinPx) {
        threshold.push(thresholdMinPx);
    }
    return threshold.map(chunk => chunk / height);
}

type Props = {
    readonly target: string | Element;
    readonly onChange: IntersectionObserverCallback;
    readonly debugBorderIsEnabled?: boolean;
} & IntersectionObserverInit;

export default async function observeVisibility(
    {
        target,
        onChange,
        root,
        rootMargin,
        threshold,
        debugBorderIsEnabled = false,
    }: Props
): Promise<Array<() => void>> {
    const env = ExecutionEnvironment;
    if (!env.canUseDOM || !env.canUseIntersectionObserver) {
        return [];
    }

    const cleanUp: Array<() => void> = [];
    const element =
        typeof target === 'string'
            ? await getElement(target)
            : target;
    const observer = new IntersectionObserver(
        onChange,
        {
            root,
            rootMargin,
            threshold,
        },
    );

    // TODO(dnguyen0304): Add tooltip with visibility.
    if (debugBorderIsEnabled
        && !element.classList.contains(styles.visibilityObserver_target)
    ) {
        element.classList.add(styles.visibilityObserver_target);
        cleanUp.push(() => {
            element.classList.remove(styles.visibilityObserver_target);
        });
    }

    observer.observe(element);
    cleanUp.push(() => observer.unobserve(element));

    return cleanUp;
}