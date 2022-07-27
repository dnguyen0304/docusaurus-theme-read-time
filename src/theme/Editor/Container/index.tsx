import * as React from 'react';
import styles from './styles.module.css';

interface Props {
    children: React.ReactNode;
}

export default function Container({ children }: Props): JSX.Element {
    return (
        <div className={styles.editor_container}>
            {children}
        </div>
    )
}
