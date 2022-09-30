import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styled from '@emotion/styled';
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

type StyledDivProps = {
    readonly backgroundColor: string;
    readonly borderTop: string;
    readonly height: string;
    readonly top: string;
}

type Props = {
};

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

// TODO(dnguyen0304): Support animation on hover.
const StyledDiv = styled('div', {
    shouldForwardProp: (prop) => !(prop in [
        'backgroundColor',
        'borderTop',
        'height',
        'top',
    ]),
})<StyledDivProps>(({ backgroundColor, height, borderTop, top }) => ({
    backgroundColor,
    borderTop,
    height,
    top,
}));

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
                    const heightPx =
                        (band.bottomVh - band.topVh) * viewportHeight;
                    return (
                        <StyledDiv
                            key={band.friendlyKey}
                            className={styles.readingBands}
                            backgroundColor={bandColors[i]}
                            borderTop={
                                (i !== 0)
                                    ? `${BORDER_HEIGHT_PX}px solid ${BORDER_COLOR}`
                                    : ''
                            }
                            height={`${heightPx}px`}
                            top={`${viewportHeight * band.topVh}px`}>
                        </StyledDiv>
                    )
                })}
            </>
            : null
    );
}