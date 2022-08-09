import Stack from '@mui/material/Stack';
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
    readonly isSaving: boolean;
    readonly resetMarkdown: () => void;
    readonly setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function EditModeButtonGroup(
    {
        closeEditor,
        getMarkdown,
        isSaving,
        resetMarkdown,
        setIsSaving,
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
                    isSaving={isSaving}
                    onClick={saveOnClick}
                    setIsSaving={setIsSaving}
                />
                <ProposeButton onSubmit={closeEditor} />
            </Stack>
        </div>
    );
}
