import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import type { CardViewModel } from '../../../../docusaurus-theme-read-time';

const StyledBox = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgb(48, 56, 70)',
    borderRadius: 'var(--space-2xs)',
    color: 'white',
    fontSize: 'var(--font-size--2)',
    padding: 'var(--space-2xs)',
    '&:hover': {
        boxShadow: `
                white 0 0 0 0.3rem,
                rgb(100, 255, 218) 0 0 0 0.5rem`,
    },
});

interface Props {
    readonly card: CardViewModel;
};

export default function Card(
    {
        card,
    }: Props
): JSX.Element {
    return (
        <StyledBox>
            <Box>
                <Box>{card.targetId}</Box>
                <Box style={{ fontSize: 'var(--font-size--3)' }}>
                    {card.details}
                </Box>
            </Box>
            <Box component='span'>
                {`${card.readTime.minute}m:${card.readTime.second}s`}
            </Box>
        </StyledBox>
    );
};
