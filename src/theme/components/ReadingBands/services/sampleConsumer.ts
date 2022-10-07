import { BAND_FRIENDLY_KEYS } from '../config';
import type { BandFriendlyKey, IntersectionSample } from '../reading-bands';

type RunningTotal = {
    // Total visible time, in milliseconds.
    visibleTimeMilli: number;

    // Last sample included in the calculation.
    lastSample: IntersectionSample | null;
};

export function createCalculateRunningTotals(
    samples: Map<BandFriendlyKey, IntersectionSample[]>,
): () => void {
    const runningTotals = new Map<BandFriendlyKey, RunningTotal>(
        [...BAND_FRIENDLY_KEYS].map(bandKey => {
            return [bandKey, { visibleTimeMilli: 0, lastSample: null }];
        })
    );

    return () => {
        for (const [bandKey, bandSamples] of samples.entries()) {
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
            let prevIntersectionRatio =
                (lastSample.isIntersecting)
                    ? 1
                    : 0;

            for (const bandSample of tempSamples) {
                const currVisibleTime =
                    (bandSample.timestampMilli - prevTimestampMilli)
                    * prevIntersectionRatio;
                runningTotal.visibleTimeMilli += currVisibleTime;

                prevTimestampMilli = bandSample.timestampMilli;
                prevIntersectionRatio =
                    (bandSample.isIntersecting)
                        ? 1
                        : 0;
            }

            samples.set(bandKey, []);
            // TODO(dnguyen0304): Add real implementation.
            console.log(`${bandKey} | visibleTime | ${runningTotal.visibleTimeMilli / 1000}`)
        }
    };
};