import { BAND_FRIENDLY_KEYS } from '../config';
import type {
    BandFriendlyKey,
    IntersectionSample,
    StartIntersectionSample
} from '../reading-bands';

type RunningTotal = {
    // Total visible time, in milliseconds.
    visibleTimeMilli: number;

    // Last sample included in the calculation.
    lastSample: IntersectionSample | null;
};

// stale closure can't use entry
function getIntersectionRatio(sample: IntersectionSample): number {
    if (!sample.isIntersecting) {
        return 0;
    }
    const startSample = sample as StartIntersectionSample;

    const intersectingWidth = startSample.targetRect.width;
    let intersectingHeight: number = 0;

    const { viewportHeightPx } = startSample.deviceInfo;
    const bandTopPx = startSample.band.topVh * viewportHeightPx;
    const bandBottomPx = startSample.band.bottomVh * viewportHeightPx;

    const isInsideTop = startSample.targetRect.top >= bandTopPx;
    const isInsideBottom = startSample.targetRect.bottom < bandBottomPx;

    const insideBoth = isInsideTop && isInsideBottom;
    const outsideOnlyBottom = isInsideTop && !isInsideBottom;
    const outsideOnlyTop = !isInsideTop && isInsideBottom;
    const outsideBoth = !isInsideTop && !isInsideBottom;

    if (insideBoth) {
        intersectingHeight = startSample.targetRect.height;
    } else if (outsideOnlyBottom) {
        intersectingHeight = bandBottomPx - startSample.targetRect.top;
    } else if (outsideOnlyTop) {
        intersectingHeight = startSample.targetRect.bottom - bandTopPx;
    } else if (outsideBoth) {
        intersectingHeight = bandBottomPx - bandTopPx;
    }

    const intersectionRatio =
        (intersectingWidth * intersectingHeight) /
        (startSample.targetRect.width * startSample.targetRect.height);

    return intersectionRatio;
};

export function createUpdateRunningTotals(
    samples: Map<string, Map<BandFriendlyKey, IntersectionSample[]>>,
): () => void {
    const runningTotals = new Map<BandFriendlyKey, RunningTotal>(
        [...BAND_FRIENDLY_KEYS].map(bandKey => {
            return [bandKey, { visibleTimeMilli: 0, lastSample: null }];
        })
    );

    return () => {
        for (const [targetId, targetSamples] of samples.entries()) {
            for (const [bandKey, bandSamples] of targetSamples.entries()) {
                const runningTotal = runningTotals.get(bandKey)!;

                if (!runningTotal.lastSample && !bandSamples.length) {
                    continue;
                }

                const lastSample = runningTotal.lastSample || bandSamples[0];
                const tempSamples =
                    (runningTotal.lastSample)
                        ? bandSamples
                        : bandSamples.slice(1);

                let prevTimestampMilli = lastSample.timestampMilli;
                let prevIntersectionRatio = getIntersectionRatio(lastSample)

                for (const bandSample of tempSamples) {
                    const currVisibleTime =
                        (bandSample.timestampMilli - prevTimestampMilli)
                        * prevIntersectionRatio
                        * bandSample.band.multiplier;
                    runningTotal.visibleTimeMilli += currVisibleTime;

                    prevTimestampMilli = bandSample.timestampMilli;
                    prevIntersectionRatio = getIntersectionRatio(bandSample);
                }

                samples.get(targetId)?.set(bandKey, []);
                // TODO(dnguyen0304): Add real implementation.
                console.log(
                    `${targetId}\n`
                    + `| ${bandKey}\n`
                    + `| visibleTime\n`
                    + `| ${runningTotal.visibleTimeMilli / 1000}`);
            }
        }
    };
};
