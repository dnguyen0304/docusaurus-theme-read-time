import Box from '@mui/material/Box';
import * as React from 'react';
import { useToolbar } from '../../../contexts/toolbar';
import Card from './Card';
import styles from './styles.module.css';

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

type Props = Readonly<{}>;

// `${targetId}\n`
// + `| visibleTime\n`
// + `| ${runningTotal.visibleTimeMilli / 1000}`);

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
            {fakeData.map(data =>
                <Card
                    targetId={data.targetId}
                    readTime={data.readTime}
                />
            )}
        </Box>
    );
}
