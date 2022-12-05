import Box from '@mui/material/Box';
import * as React from 'react';
import { useToolbar } from '../../../contexts/toolbar';
import Card from './Card';
import styles from './styles.module.css';

// TODO(dnguyen0304): Extract to a centralized location to facilitate
// maintenance.
const GRADIENT_STOP_COLOR_TOP: string = 'rgb(46, 69, 97)';
const GRADIENT_STOP_COLOR_BOTTOM: string = 'rgb(39, 60, 85)';
const GRADIENT = `linear-gradient(
    to bottom,
    ${GRADIENT_STOP_COLOR_TOP} 0%,
    ${GRADIENT_STOP_COLOR_BOTTOM} 100%
)`;

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
            className={styles.Workbench_container}
            sx={{
                display: workbenchIsOpen ? 'flex' : 'none',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                background: GRADIENT,
                boxShadow: `
                    0px 4px 5px 0px rgb(0 0 0 / 14%),
                    0px 1px 10px 0px rgb(0 0 0 / 12%),
                    0px 2px 4px -1px rgb(0 0 0 / 20%)`,
                '& > *': {
                    marginBottom: '1rem',
                },
                '& > *:last-child': {
                    marginBottom: 0,
                },
            }}
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
