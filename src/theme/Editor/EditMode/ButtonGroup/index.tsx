import Stack from '@mui/material/Stack';
import draft from 'draft-js';
import * as React from 'react';
import DiscardButton from './DiscardButton';
import ProposeButton from './ProposeButton';
import SaveButton from './SaveButton';
import styles from './styles.module.css';

interface Props {
    readonly closeEditor: () => void;
    readonly getMarkdown: (state: draft.EditorState | undefined) => string;
    readonly saveMarkdown: () => void;
    readonly resetMarkdown: () => void;
    readonly editorState: draft.EditorState;
}

export default function EditModeButtonGroup(
    {
        closeEditor,
        getMarkdown,
        saveMarkdown,
        resetMarkdown,
        editorState,
    }: Props
): JSX.Element {
    return (
        <div className={styles.editModeButtonGroup_container}>
            <Stack
                direction='row'
                spacing={2}
            >
                <DiscardButton
                    closeEditor={closeEditor}
                    resetMarkdown={resetMarkdown}
                />
                <SaveButton
                    onClick={saveMarkdown}
                    editorState={editorState}
                />
                <ProposeButton
                    closeEditor={closeEditor}
                    getMarkdown={getMarkdown}
                    saveMarkdown={saveMarkdown}
                />
            </Stack>
        </div>
    );
}
