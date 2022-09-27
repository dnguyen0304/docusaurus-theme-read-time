import Tooltip from '@mui/material/Tooltip';
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

    const getTitles = (
        name: number,
        heightFromCenterPercent: number,
        topPosition: number,
        bottomPosition: number,
    ): {
        topTitle: string;
        bottomTitle: string;
    } => {
        return {
            topTitle: `B${name}: { `
                + `coverage: ${Math.floor(heightFromCenterPercent * 200)}%, `
                + `position: ${Math.floor(topPosition)}px }`,
            bottomTitle: `B${name}: { `
                + `coverage: ${Math.floor(heightFromCenterPercent * 200)}%, `
                + `position: ${Math.floor(bottomPosition)}px }`,
        };
    };

    // Skip the last band because it includes the entire viewport.
    for (let i = 0; i < bands.length - 1; i++) {
        const heightFromCenter =
            viewportHeight * bands[i].heightFromCenterPercent;
        const topOfBand = viewportHeight / 2 - heightFromCenter;
        const bottomOfBand = viewportHeight / 2 + heightFromCenter;
        const { topTitle, bottomTitle } = getTitles(
            i,
            bands[i].heightFromCenterPercent,
            topOfBand,
            bottomOfBand,
        );
        lines.push(
            <Tooltip
                key={`B${i}-top`}
                title={topTitle}
                placement='bottom'
                arrow
                open
            >
                <hr
                    className={
                        `${readingBandsStyles.readingBands} `
                        + `${styles.readingBands_border}`
                    }
                    style={{ top: topOfBand }}
                />
            </Tooltip >
        );
        lines.push(
            <Tooltip
                key={`B${i}-bottom`}
                title={bottomTitle}
                placement='top'
                arrow
                open
            >
                <hr
                    className={
                        `${readingBandsStyles.readingBands} `
                        + `${styles.readingBands_border}`
                    }
                    style={{ top: bottomOfBand }}
                />
            </Tooltip>
        );
    }

    return <>{lines}</>;
};