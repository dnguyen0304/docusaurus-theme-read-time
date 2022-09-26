import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import * as React from 'react';
import type { DocupotamusThemeConfig } from '../../../utils';

const STANDARD_DEVIATION_1: number = .341;
const STANDARD_DEVIATION_2: number = .477;
const STANDARD_DEVIATION_ALL: number = .5;
const B0_MULTIPLIER: number = 1.0;
const B1_MULTIPLIER: number = 0.8;
const B2_MULTIPLIER: number = 0.4;
const DEBUG_B0_COLOR: string = 'red';
const DEBUG_B1_COLOR: string = 'blue';
const DEBUG_B2_COLOR: string = 'green';

type Band = {
    heightFromCenterPercent: number;
    multiplier: number;
    _debug: {
        color: string,
    };
};

type Props = {

};

const bands: Band[] = [
    {
        heightFromCenterPercent: STANDARD_DEVIATION_1,
        multiplier: B0_MULTIPLIER,
        _debug: {
            color: DEBUG_B0_COLOR,
        },
    },
    {
        heightFromCenterPercent: STANDARD_DEVIATION_2,
        multiplier: B1_MULTIPLIER,
        _debug: {
            color: DEBUG_B1_COLOR,
        },
    },
    {
        heightFromCenterPercent: STANDARD_DEVIATION_ALL,
        multiplier: B2_MULTIPLIER,
        _debug: {
            color: DEBUG_B2_COLOR,
        },
    },
];

function getViewportWidth(): number {
    return Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0,
    );
}

function getViewportHeight(): number {
    return Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0,
    );
}

export default function ReadingBands(
    {
    }: Props
): JSX.Element {
    const {
        readTime: {
            inDebugMode,
        },
    } = useDocusaurusContext()
        .siteConfig
        .themeConfig
        .docupotamus as DocupotamusThemeConfig;

    const viewportHeight = getViewportHeight();
    const boxShadows = bands.map(band => {
        const heightFromCenter = viewportHeight * band.heightFromCenterPercent;
        return `0px 0px 0px ${heightFromCenter}px ${band._debug.color}`;
    });

    return (
        <div style={{
            position: 'fixed',
            width: '100%',
            top: `${viewportHeight / 2}px`,
            zIndex: 'calc(var(--ifm-z-index-fixed) + 1)',
            ...(inDebugMode && { boxShadow: boxShadows.join(', ') })
        }} />
    );
}
