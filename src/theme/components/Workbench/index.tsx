import Box from '@mui/material/Box';
import * as React from 'react';
import { useToolbar } from '../../../contexts/toolbar';
import Card from './Card';

const KEY_PREFIX: string = 'workbenchCard';
const BOX_SHADOW_WIDTH_PX: number = 15;
const fakeData: { targetId: string; details: string; readTime: number }[] = [
    {
        targetId: 'abc',
        details: 'islaskdjf',
        readTime: 8,
    },
    {
        targetId: 'ijk',
        details: 'fskis',
        readTime: 3,
    },
    {
        targetId: 'xyz',
        details: '123424zis',
        readTime: 11,
    },
];

interface Props { };

export default function Workbench(
    {
    }: Props
): JSX.Element {
    const { workbenchIsOpen } = useToolbar();

    return (
        <Box
            sx={theme => ({
                position: 'sticky',
                top: 0,
                // TODO(dnguyen0304): Add responsive design.
                width: '300px',
                height: '100vh',
                display: workbenchIsOpen ? 'flex' : 'none',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                background: `linear-gradient(
                    to bottom,
                    ${theme.palette.grey[600]} 0%,
                    ${theme.palette.grey[700]} 100%
                )`,
                borderTopLeftRadius: '0.6rem',
                // TODO(dnguyen0304): Add responsive design.
                padding: '1rem 0.7rem',
                // TODO(dnguyen0304): Investigate refactoring to box-shadow
                // style to reduce complexity.
                '&::before': {
                    'content': '""',
                    'position': 'absolute',
                    'width': `${BOX_SHADOW_WIDTH_PX}px`,
                    'height': '100vh',
                    'top': '0',
                    'left': `-${BOX_SHADOW_WIDTH_PX}px`,
                    'background': `linear-gradient(
                        to right,
                        transparent,
                        rgba(60, 64, 67, 0.15) 70%,
                        rgba(60, 64, 67, 0.4) 100%)`,
                },
                '& > *': {
                    marginBottom: '1rem',
                },
                '& > *:last-child': {
                    marginBottom: 0,
                },
            })}
        >
            {fakeData.map((card, i) =>
                <Card
                    key={`${KEY_PREFIX}-${i}`}
                    card={card}
                />
            )}
        </Box>
    );
};
