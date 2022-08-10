import Stack from '@mui/material/Stack';
import { EditorState } from 'draft-js';
import * as React from 'react';
import { useEditor } from '../../../../contexts/editor';
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
    const {
        activeTab: {
            // TODO(dnguyen0304): Fix type error.
            // See: https://stackoverflow.com/questions/45210111/destructuring-nullable-objects
            pullRequestUrl,
            setPullRequestUrl,
        },
    } = useEditor();
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
                <DiscardButton
                    pullRequestUrl={pullRequestUrl}
                    onSubmit={discardOnSubmit}
                />
                <SaveButton
                    onClick={saveOnClick}
                    editorState={editorState}
                />
                <ProposeButton
                    getMarkdown={getMarkdown}
                    onClick={closeEditor}
                    setPullRequestUrl={setPullRequestUrl}
                />
            </Stack>
        </div>
    );
}
