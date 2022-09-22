import Stack from '@mui/material/Stack';
import draft from 'draft-js';
import * as React from 'react';
import type { GithubPullStatus } from '../../../../docusaurus-theme-editor';
import DiscardButton from './DiscardButton';
import ProposeButton from './ProposeButton';
import SaveButton from './SaveButton';
import styles from './styles.module.css';

type Props = {
    readonly closeEditor: () => void;
    readonly getMarkdown: (state?: draft.EditorState) => string;
    readonly saveMarkdown: (state?: draft.EditorState) => void;
    readonly resetMarkdown: () => void;
    readonly editorState: draft.EditorState;
    readonly pullStatus: GithubPullStatus | undefined;
}

export default function EditModeButtonGroup(
    {
        closeEditor,
        getMarkdown,
        saveMarkdown,
        resetMarkdown,
        editorState,
        pullStatus,
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
                    pullStatus={pullStatus}
                />
                <ProposeButton
                    closeEditor={closeEditor}
                    getMarkdown={getMarkdown}
                    saveMarkdown={saveMarkdown}
                    pullStatus={pullStatus}
                />
            </Stack>
        </div>
    );
}
