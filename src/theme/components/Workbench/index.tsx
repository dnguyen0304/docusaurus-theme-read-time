import Box from '@mui/material/Box';
import * as React from 'react';
import { useToolbar } from '../../../contexts/toolbar';
import Card from './Card';

const KEY_PREFIX: string = 'workbenchCard';
const fakeData: { targetId: string; readTime: number }[] = [
    {
        targetId: 'abc',
        readTime: 8,
    },
    {
        targetId: 'ijk',
        readTime: 3,
    },
    {
        targetId: 'xyz',
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
                boxShadow: `
                    0px 4px 5px 0px rgb(0 0 0 / 14%),
                    0px 1px 10px 0px rgb(0 0 0 / 12%),
                    0px 2px 4px -1px rgb(0 0 0 / 20%)`,
                padding: '1rem .7rem',
                '& > *': {
                    marginBottom: '1rem',
                },
                '& > *:last-child': {
                    marginBottom: 0,
                },
            })}
        >
            {fakeData.map((data, i) =>
                <Card
                    key={`${KEY_PREFIX}-${i}`}
                    targetId={data.targetId}
                    readTime={data.readTime}
                />
            )}
        </Box>
    );
};
