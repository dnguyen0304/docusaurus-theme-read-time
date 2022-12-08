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
    fontSize: 'var(--font-size--0)',
    padding: 'var(--space-2xs)',
    '&:hover': {
        boxShadow: `
                white 0 0 0rem 0.3rem,
                rgb(100, 255, 218) 0 0 0rem 0.5rem`,
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
            <div>
                <div>{card.targetId}</div>
                <div style={{ fontSize: 'var(--font-size--2)' }}>
                    {card.details}
                </div>
            </div>
            <span>{`${card.readTime.minute}:${card.readTime.second}`}</span>
        </StyledBox>
    );
};
