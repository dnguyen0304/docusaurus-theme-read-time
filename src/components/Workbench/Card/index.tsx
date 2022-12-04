import * as React from 'react';
import styles from './styles.module.css';

type Props = Readonly<{
    targetId: string;
    readTime: number;
}>;

export default function Card(
    {
        targetId,
        readTime,
    }: Props
): JSX.Element {
    return (
        <div className={styles.Card_container}>
            <span>{targetId}</span>
            <span>{readTime}</span>
        </div>
    );
};
