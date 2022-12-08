import Box from '@mui/material/Box';
import * as React from 'react';
import type { CardViewModel } from '../../../../docusaurus-theme-read-time';

interface Props {
    readonly card: CardViewModel;
};

export default function Card(
    {
        card,
    }: Props
): JSX.Element {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: 'var(--space-2xs)',
            borderRadius: 'var(--space-2xs)',
            backgroundColor: 'rgb(48, 56, 70)',
            color: 'white',
            fontSize: 'var(--font-size--0);           ',
            '&:hover': {
                'boxShadow': `
                    white 0 0 0rem 0.3rem,
                    rgb(100, 255, 218) 0 0 0rem 0.5rem`,
            },
        }}>
            <span>{card.targetId}</span>
            <span>{card.details}</span>
            <span>{card.readTime}</span>
        </Box>
    );
};
