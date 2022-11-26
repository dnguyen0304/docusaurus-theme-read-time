import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import * as React from 'react';
import type { DocupotamusThemeConfig } from '../../../docusaurus-theme-editor';
import { BANDS, BAND_FRIENDLY_KEYS } from './config';
import type {
    BandFriendlyKey,
    IntersectionSample,
    Target
} from './reading-bands';
// TODO(dnguyen0304): Fix missing module declaration.
import { RangeAnchor } from './services/annotator/anchoring/types';
import { getElement, getElementAll, getViewportHeight } from './services/dom';
import { createUpdateRunningTotals } from './services/sampleConsumer';
import { createOnVisibilityChange } from './services/sampleProducer';
import { observeVisibility } from './services/visibility';
import styles from './styles.module.css';
import Tooltip from './Tooltip';

const BORDER_COLOR: string = 'var(--ifm-hr-background-color)';
const BORDER_HEIGHT_PX: number = 3;
const UPDATE_RUNNING_TOTALS_RATE_MILLI: number = 5 * 1000;

export default function ReadingBands(): JSX.Element | null {
    const {
        readTime: {
            contentRootSelector,
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
    const viewportHeight = getViewportHeight();

    // Produce intersection samples.
    React.useEffect(() => {
        (async () => {
            const rootElement = await getElement(contentRootSelector);
            const rootRange = new Range();
            rootRange.selectNodeContents(rootElement);

            // TODO(dnguyen0304): Fix code blocks not being included because
            // of "Node cannot be found in the current page." error.
            const elements = await getElementAll(contentSelector);

            for (const band of BANDS) {
                const rootMargin =
                    `-${band.topVh * viewportHeight}px `
                    + `0px `
                    + `-${viewportHeight - band.bottomVh * viewportHeight}px`;

                for (const element of elements) {
                    const range = new Range();
                    range.selectNodeContents(element);

                    const target: Target = {
                        document: {
                            href: document.location.href,
                        },
                        root: new RangeAnchor(document.body, rootRange).toSelector(),
                        selectors: [
                            new RangeAnchor(rootElement, range).toSelector(),
                        ],
                    };

                    await observeVisibility({
                        element,
                        onChange: createOnVisibilityChange(
                            samples.current,
                            target,
                            band,
                            element.getBoundingClientRect.bind(element),
                        ),
                        rootMargin,
                        debugBorderIsEnabled,
                    });
                }
            }
        })();
        // TODO(dnguyen0304): Add real implemention for observer.disconnect().
        return () => { };
    }, []);

    // Consume intersection samples.
    React.useEffect(() => {
        const intervalId = window.setInterval(
            createUpdateRunningTotals(samples.current),
            UPDATE_RUNNING_TOTALS_RATE_MILLI,
        );
        return () => clearInterval(intervalId);
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