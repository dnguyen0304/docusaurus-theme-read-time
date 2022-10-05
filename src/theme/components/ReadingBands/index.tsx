import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import * as React from 'react';
import type { DocupotamusThemeConfig } from '../../../utils';
import type { Band, IntersectionSample } from './reading-bands';
import { getElementAll, getViewportHeight } from './services/dom';
import observeVisibility, { IntersectionObserverCallbackWithContext } from './services/visibility';
import styles from './styles.module.css';
import Tooltip from './Tooltip';

const CENTER: number = .5;
const STANDARD_DEVIATION_1: number = .341;
const STANDARD_DEVIATION_2: number = .477;
const B0_MULTIPLIER: number = 1.0;
const B1_MULTIPLIER: number = 0.8;
const B2_MULTIPLIER: number = 0.4;
const BORDER_COLOR: string = 'var(--ifm-hr-background-color)';
const BORDER_HEIGHT_PX: number = 3;
const INTERSECTION_SAMPLING_RATE_MS: number = 1 * 1000;

const bands: Band[] = [
    {
        friendlyKey: 'B2-top',
        topVh: 0,
        bottomVh: CENTER - STANDARD_DEVIATION_2,
        multiplier: B2_MULTIPLIER,
    },
    {
        friendlyKey: 'B1-top',
        topVh: CENTER - STANDARD_DEVIATION_2,
        bottomVh: CENTER - STANDARD_DEVIATION_1,
        multiplier: B1_MULTIPLIER,
    },
    {
        friendlyKey: 'B0',
        topVh: CENTER - STANDARD_DEVIATION_1,
        bottomVh: CENTER + STANDARD_DEVIATION_1,
        multiplier: B0_MULTIPLIER,
    },
    {
        friendlyKey: 'B1-bottom',
        topVh: CENTER + STANDARD_DEVIATION_1,
        bottomVh: CENTER + STANDARD_DEVIATION_2,
        multiplier: B1_MULTIPLIER,
    },
    {
        friendlyKey: 'B2-bottom',
        topVh: CENTER + STANDARD_DEVIATION_2,
        bottomVh: 1.0,
        multiplier: B2_MULTIPLIER,
    },
];

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

        for (const band of bands) {
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
                    // TODO(dnguyen0304): Add real implementation.
                    const sample: IntersectionSample = {
                        timestampMilli: Date.now(),
                        targetRect: typedContext.target.getBoundingClientRect(),
                        band: typedContext.band,
                        isIntersecting: entry.isIntersecting,
                        viewportHeightPx: getViewportHeight(),
                    };
                }, INTERSECTION_SAMPLING_RATE_MS);
                rootToIntervalId.set(observer.rootMargin, intervalId);
            } else {
                const intervalId = rootToIntervalId.get(observer.rootMargin);
                clearInterval(intervalId);
            }
        }
    };

    React.useEffect(() => {
        (async () => await doObserveVisibility())();
        // TODO(dnguyen0304): Add real implemention for observer.disconnect().
        return () => { };
    }, []);

    return (
        debugBandIsEnabled
            ? <>
                {bands.map((band, i) => {
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