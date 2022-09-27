import * as React from 'react';
import { getViewportHeight } from '../../../../utils';
import type { Band } from '../reading-bands';

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
                style={{
                    margin: 0,
                    position: 'fixed',
                    width: '100%',
                    height: '3px',
                    top: topOfBand,
                    zIndex: 'calc(var(--ifm-z-index-fixed) + 1)',
                }}
            />
        );
        lines.push(
            <hr
                key={`B${i}-bottom`}
                style={{
                    margin: 0,
                    position: 'fixed',
                    width: '100%',
                    height: '3px',
                    top: bottomOfBand,
                    zIndex: 'calc(var(--ifm-z-index-fixed) + 1)',
                }}
            />
        );
    }

    return <>{lines}</>;
};