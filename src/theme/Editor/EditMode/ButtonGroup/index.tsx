import Stack from '@mui/material/Stack';
import { EditorState } from 'draft-js';
import * as React from 'react';
import { useSite } from '../../../../contexts/site';
import { getLocalStorageKey } from '../../utils';
import DiscardButton from './DiscardButton';
import ProposeButton from './ProposeButton';
import SaveButton from './SaveButton';
import styles from './styles.module.css';

interface Props {
    readonly closeEditor: () => void;
    readonly getMarkdown: () => string;
    readonly resetMarkdown: () => void;
    readonly editorState: EditorState;
}

export default function EditModeButtonGroup(
    {
        closeEditor,
        getMarkdown,
        resetMarkdown,
        editorState,
    }: Props
): JSX.Element {
    const siteContext = useSite();

    const discardOnSubmit = () => {
        resetMarkdown();
        closeEditor();
    };

    const saveOnClick = () => {
        localStorage.setItem(getLocalStorageKey(siteContext), getMarkdown());
    };

    return (
        <div className={styles.editModeButtonGroup_container}>
            <Stack
                direction='row'
                spacing={2}
            >
                <DiscardButton onSubmit={discardOnSubmit} />
                <SaveButton
                    onClick={saveOnClick}
                    editorState={editorState}
                />
                <ProposeButton
                    getMarkdown={getMarkdown}
                    onClick={closeEditor}
                />
            </Stack>
        </div>
    );
}
