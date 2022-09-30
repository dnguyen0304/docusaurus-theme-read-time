import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import * as React from 'react';
import type { DocupotamusThemeConfig } from '../../../utils';
import { getViewportHeight } from '../../../utils';
import VisibilityTracker from '../VisibilityTracker';
import Borders from './Borders';
import type { Band } from './reading-bands';
import styles from './styles.module.css';

const STANDARD_DEVIATION_1: number = .341;
const STANDARD_DEVIATION_2: number = .477;
const STANDARD_DEVIATION_ALL: number = .5;
const B0_MULTIPLIER: number = 1.0;
const B1_MULTIPLIER: number = 0.8;
const B2_MULTIPLIER: number = 0.4;

type Props = {

};

const bands: Band[] = [
    {
        heightFromCenterPercent: STANDARD_DEVIATION_1,
        multiplier: B0_MULTIPLIER,
    },
    {
        heightFromCenterPercent: STANDARD_DEVIATION_2,
        multiplier: B1_MULTIPLIER,
    },
    {
        heightFromCenterPercent: STANDARD_DEVIATION_ALL,
        multiplier: B2_MULTIPLIER,
    },
];

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

    // TODO(dnguyen0304): Investigate migrating from box-shadow styles to
    // support richer interactions such as hovering.
    const viewportHeight = getViewportHeight();
    const boxShadows = bands.map((band, i) => {
        const heightFromCenter = viewportHeight * band.heightFromCenterPercent;
        return `0px 0px 0px ${heightFromCenter}px ${bandColors[i]}`;
    });

    return (
        <>
            <VisibilityTracker />
            {
                debugBandIsEnabled
                    ? <>
                        <div
                            className={styles.readingBands}
                            style={{
                                top: `${viewportHeight / 2}px`,
                                boxShadow: boxShadows.join(', '),
                            }}
                        />
                        <Borders bands={bands} />
                    </>
                    : null
            }
        </>
    );
}
