import Box from '@mui/material/Box';
import * as React from 'react';
import { useToolbar } from '../../../contexts/toolbar';
import Card from './Card';
import styles from './styles.module.css';

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
]

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
                display: workbenchIsOpen ? 'block' : 'none',
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
}
