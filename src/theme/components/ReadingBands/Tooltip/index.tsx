import type { TooltipProps } from '@mui/material/Tooltip';
import MuiTooltip from '@mui/material/Tooltip';
import * as React from 'react';

const BANDS_WITH_TOOLTIP: Set<number> = new Set([0, 1, 3, 4]);

type GetTooltipPropsProps = {
    readonly index: number;
    readonly topPx: number;
    readonly bottomPx: number;
}

type SubsetTooltipProps = Pick<TooltipProps, 'title' | 'placement'>;

const getTooltipProps = (
    {
        index,
        topPx,
        bottomPx,
    }: GetTooltipPropsProps
): SubsetTooltipProps => {
    if (!BANDS_WITH_TOOLTIP.has(index)) {
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

type Props = {
    readonly children: React.ReactElement<any, any>,
} & GetTooltipPropsProps;

export default function Tooltip(
    {
        index,
        topPx,
        bottomPx,
        children,
    }: Props
): JSX.Element {
    if (BANDS_WITH_TOOLTIP.has(index)) {
        const {
            title,
            placement,
        } = getTooltipProps({ index, topPx, bottomPx })
        return (
            <MuiTooltip
                title={title}
                placement={placement}
                arrow
                open
            >
                {children}
            </MuiTooltip>
        );
    }
    return children;
}