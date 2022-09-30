import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type { TooltipProps } from '@mui/material/Tooltip';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import type { DocupotamusThemeConfig } from '../../../utils';
import { getViewportHeight } from '../../../utils';
import type { Band } from './reading-bands';
import styles from './styles.module.css';

const CENTER: number = .5;
const STANDARD_DEVIATION_1: number = .341;
const STANDARD_DEVIATION_2: number = .477;
const B0_MULTIPLIER: number = 1.0;
const B1_MULTIPLIER: number = 0.8;
const B2_MULTIPLIER: number = 0.4;
const BORDER_COLOR: string = 'var(--ifm-hr-background-color)';
const BORDER_HEIGHT_PX: number = 3;
const BANDS_WITH_TOOLTIP: number[] = [0, 1, 3, 4];

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

type SubsetTooltipProps = Pick<TooltipProps, 'title' | 'placement'>;

type Props = {
};

const getTooltipProps = (
    index: number,
    topPx: number,
    bottomPx: number,
): SubsetTooltipProps => {
    if (!BANDS_WITH_TOOLTIP.includes(index)) {
        throw new Error(`invalid tooltip index ${index}`);
    }
    if (index < 2) {
        return {
            title: `B${index}: { position: ${Math.floor(bottomPx)}px }`,
            placement: 'bottom-start',
        };
    }
    return {
        title: `B${index}: { position: ${Math.floor(topPx)}px }`,
        placement: 'top-start',
    };
};

export default function ReadingBands(
    {
    }: Props
): JSX.Element | null {
    const {
        readTime: {
            debug: {
                band: {
                    isEnabled: debugBandIsEnabled,
                    colors: bandColors,
                }
            },
        },
    } = useDocusaurusContext()
        .siteConfig
        .themeConfig
        .docupotamus as DocupotamusThemeConfig;

    const viewportHeight = getViewportHeight();

    return (
        debugBandIsEnabled
            ? <>
                {bands.map((band, i) => {
                    const topPx = band.topVh * viewportHeight;
                    const bottomPx = band.bottomVh * viewportHeight;
                    const heightPx = bottomPx - topPx;
                    // TODO(dnguyen0304): Support animation on hover.
                    const bandComponent = (
                        <div
                            // Bands and bands wrapped with tooltips use the
                            // same keys for simplicity.
                            key={band.friendlyKey}
                            className={styles.readingBands}
                            style={{
                                backgroundColor: bandColors[i],
                                borderTop:
                                    (i !== 0)
                                        ? `${BORDER_HEIGHT_PX}px solid ${BORDER_COLOR}`
                                        : ''
                                ,
                                height: `${heightPx}px`,
                                top: `${viewportHeight * band.topVh}px`,
                            }}>
                        </div>
                    );
                    if (BANDS_WITH_TOOLTIP.includes(i)) {
                        const {
                            title,
                            placement,
                        } = getTooltipProps(i, topPx, bottomPx)
                        return (
                            <Tooltip
                                key={band.friendlyKey}
                                title={title}
                                placement={placement}
                                arrow
                                open
                            >
                                {bandComponent}
                            </Tooltip>
                        );
                    }
                    return bandComponent;
                })}
            </>
            : null
    );
}