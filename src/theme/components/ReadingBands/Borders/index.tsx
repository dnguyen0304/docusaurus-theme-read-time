import * as React from 'react';
import { getViewportHeight } from '../../../../utils';
import type { Band } from '../reading-bands';
import styles from '../styles.module.css';

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
                className={styles.readingBands}
                style={{
                    margin: 0,
                    height: '3px',
                    top: topOfBand,
                }}
            />
        );
        lines.push(
            <hr
                key={`B${i}-bottom`}
                className={styles.readingBands}
                style={{
                    height: '3px',
                    top: bottomOfBand,
                    margin: 0,
                }}
            />
        );
    }

    return <>{lines}</>;
};