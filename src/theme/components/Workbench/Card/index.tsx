import * as React from 'react';
import styles from './styles.module.css';

interface Props {
    readonly targetId: string;
    readonly details: string;
    readonly readTime: number;
};

export default function Card(
    {
        targetId,
        details,
        readTime,
    }: Props
): JSX.Element {
    return (
        <div className={styles.Card_container}>
            <span>{targetId}</span>
            <span>{details}</span>
            <span>{readTime}</span>
        </div>
    );
};
