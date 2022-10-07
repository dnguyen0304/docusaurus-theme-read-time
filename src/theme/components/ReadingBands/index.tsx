import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import * as React from 'react';
import type { DocupotamusThemeConfig } from '../../../utils';
import { BANDS } from './config';
import type {
    Band,
    BandFriendlyKey,
    IntersectionSample,
    StartIntersectionSample,
    StopIntersectionSample
} from './reading-bands';
import { getElementAll, getViewportHeight } from './services/dom';
import {
    IntersectionObserverCallbackWithContext,
    observeVisibility
} from './services/visibility';
import styles from './styles.module.css';
import Tooltip from './Tooltip';

const BAND_FRIENDLY_KEYS =
    new Set<BandFriendlyKey>(BANDS.map(band => band.friendlyKey));
const BORDER_COLOR: string = 'var(--ifm-hr-background-color)';
const BORDER_HEIGHT_PX: number = 3;
const INTERSECTION_SAMPLING_RATE_MS: number = 1 * 1000;
const COMPUTE_TOTAL_RATE_MILLI: number = 5 * 1000;

type RunningTotal = {
    // Total visible time, in milliseconds.
    visibleTimeMilli: number;

    // Last computed sample.
    lastSample: IntersectionSample | null;
};

export default function ReadingBands(): JSX.Element | null {
    const {
        readTime: {
            contentSelector,
            debug: {
                band: {
                    isEnabled: debugBandIsEnabled,
                    colors: bandColors,
                },
                border: {
                    isEnabled: debugBorderIsEnabled,
                },
            },
        },
    } = useDocusaurusContext()
        .siteConfig
        .themeConfig
        .docupotamus as DocupotamusThemeConfig;

    const samples = React.useRef<Map<BandFriendlyKey, IntersectionSample[]>>(
        new Map([...BAND_FRIENDLY_KEYS].map(bandKey => {
            return [bandKey, []];
        })),
    );
    const runningTotals = React.useRef<Map<BandFriendlyKey, RunningTotal>>(
        new Map([...BAND_FRIENDLY_KEYS].map(bandKey => {
            return [bandKey, { visibleTimeMilli: 0, lastSample: null }];
        })),
    );
    // TODO(dnguyen0304): Support keying by root and rootMargin.
    // Array or tuple keys are not yet supported until ES7 value objects.
    // - See: https://stackoverflow.com/a/21846269
    // - See: https://stackoverflow.com/a/32660218
    const rootToIntervalId = new Map<
        IntersectionObserver['rootMargin'],
        number
    >();
    const viewportHeight = getViewportHeight();

    const doObserveVisibility = async () => {
        // TODO(dnguyen0304): Fix code blocks not being included because
        // of "Node cannot be found in the current page." error.
        const targets = await getElementAll(contentSelector);

        for (const band of BANDS) {
            const rootMargin =
                `-${band.topVh * viewportHeight}px `
                + `0px `
                + `-${viewportHeight - band.bottomVh * viewportHeight}px`;

            for (const target of targets) {
                await observeVisibility({
                    target: target,
                    onChange: handleOnVisibilityChange,
                    rootMargin,
                    context: {
                        target,
                        band,
                    },
                    debugBorderIsEnabled,
                });
            }
        }
    };

    const handleOnVisibilityChange: IntersectionObserverCallbackWithContext = (
        entries,
        observer,
        context,
    ) => {
        if (!context || !context.band || !context.target) {
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
                    samples
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
                samples
                    .current
                    .get(typedContext.band.friendlyKey)
                    ?.push(sample);
            }
        }
    };

    React.useEffect(() => {
        // TODO(dnguyen0304): Add real implementation.
        const intervalId = window.setInterval(() => {
            for (const [bandKey, bandSamples] of samples.current.entries()) {
                const runningTotal = runningTotals.current.get(bandKey)!;

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

                samples.current.set(bandKey, []);
                console.log(`${bandKey} | visibleTime | ${runningTotal.visibleTimeMilli / 1000}`)
            }
        }, COMPUTE_TOTAL_RATE_MILLI);
        return () => clearInterval(intervalId);
    }, [samples]);

    React.useEffect(() => {
        (async () => await doObserveVisibility())();
        // TODO(dnguyen0304): Add real implemention for observer.disconnect().
        return () => { };
    }, []);

    return (
        debugBandIsEnabled
            ? <>
                {BANDS.map((band, i) => {
                    const topPx = band.topVh * viewportHeight;
                    const bottomPx = band.bottomVh * viewportHeight;
                    const heightPx = bottomPx - topPx;
                    // TODO(dnguyen0304): Support animation on hover.
                    return (
                        <Tooltip
                            key={band.friendlyKey}
                            index={i}
                            topPx={topPx}
                            bottomPx={bottomPx}
                        >
                            <div
                                className={styles.readingBands}
                                style={{
                                    backgroundColor: bandColors[i],
                                    borderTop:
                                        (i !== 0)
                                            ? `${BORDER_HEIGHT_PX}px solid ${BORDER_COLOR}`
                                            : ''
                                    ,
                                    height: `${heightPx}px`,
                                    top: `${topPx}px`,
                                }}
                            />
                        </Tooltip>
                    );
                })}
            </>
            : null
    );
}