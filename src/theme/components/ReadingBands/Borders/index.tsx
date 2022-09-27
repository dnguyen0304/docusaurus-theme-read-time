import * as React from 'react';
import { getViewportHeight } from '../../../../utils';
import type { Band } from '../reading-bands';
import readingBandsStyles from '../styles.module.css';
import styles from './styles.module.css';

type Props = {
    bands: Band[];
};

export default function Borders(
    {
        bands,
    }: Props
): JSX.Element {
    const viewportHeight = getViewportHeight();
    const lines = [];

    // Skip the last band because it includes the entire viewport.
    for (let i = 0; i < bands.length - 1; i++) {
        const heightFromCenter =
            viewportHeight * bands[i].heightFromCenterPercent;
        const topOfBand = viewportHeight / 2 - heightFromCenter;
        const bottomOfBand = viewportHeight / 2 + heightFromCenter;
        lines.push(
            <hr
                key={`B${i}-top`}
                className={
                    `${readingBandsStyles.readingBands} `
                    + `${styles.readingBands_border}`
                }
                style={{ top: topOfBand }}
            />
        );
        lines.push(
            <hr
                key={`B${i}-bottom`}
                className={
                    `${readingBandsStyles.readingBands} `
                    + `${styles.readingBands_border}`
                }
                style={{ top: bottomOfBand }}
            />
        );
    }

    return <>{lines}</>;
};