import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import * as React from 'react';
import type { DocupotamusThemeConfig } from '../../../utils';
import { getViewportHeight } from '../../../utils';
import Borders from './Borders';
import type { Band } from './reading-bands';

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

function getViewportWidth(): number {
    return Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0,
    );
}

export default function ReadingBands(
    {
    }: Props
): JSX.Element {
    const {
        readTime: {
            debug: {
                isEnabled: debugIsEnabled,
                colors,
            },
        },
    } = useDocusaurusContext()
        .siteConfig
        .themeConfig
        .docupotamus as DocupotamusThemeConfig;

    const viewportHeight = getViewportHeight();
    const boxShadows = bands.map((band, i) => {
        const heightFromCenter = viewportHeight * band.heightFromCenterPercent;
        return `0px 0px 0px ${heightFromCenter}px ${colors[i]}`;
    });

    return (
        <>
            <div style={{
                position: 'fixed',
                width: '100%',
                top: `${viewportHeight / 2}px`,
                zIndex: 'calc(var(--ifm-z-index-fixed) + 1)',
                ...(debugIsEnabled && { boxShadow: boxShadows.join(', ') })
            }} />
            <Borders bands={bands} />
        </>
    );
}
