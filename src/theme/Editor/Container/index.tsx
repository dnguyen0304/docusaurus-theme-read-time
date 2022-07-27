import { styled } from '@mui/material/styles';
import * as React from 'react';
import EditorHandle from '../Handle';
import styles from './styles.module.css';

interface Props {
    children: React.ReactNode;
}

const HANDLE_WIDTH_PX: number = 15;

const EditorHandleContainer = styled('div')({
    width: HANDLE_WIDTH_PX,
});

export default function Container({ children }: Props): JSX.Element {
    return (
        <div className={styles.editor_container}>
            <EditorHandleContainer className={styles.editorHandle_container}>
                <EditorHandle width={HANDLE_WIDTH_PX} />
            </EditorHandleContainer>
            {children}
        </div>
    )
}
