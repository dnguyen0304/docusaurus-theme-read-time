import * as React from 'react';
import type { CardViewModel } from '../../../../docusaurus-theme-read-time';
import styles from './styles.module.css';

interface Props {
    readonly card: CardViewModel;
};

export default function Card(
    {
        card,
    }: Props
): JSX.Element {
    return (
        <div className={styles.Card_container}>
            <span>{card.targetId}</span>
            <span>{card.details}</span>
            <span>{card.readTime}</span>
        </div>
    );
};
