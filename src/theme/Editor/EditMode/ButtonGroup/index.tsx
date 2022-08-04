import Stack from '@mui/material/Stack';
import * as React from 'react';
import DiscardButton from './DiscardButton';
import ProposeButton from './ProposeButton';
import SaveButton from './SaveButton';
import styles from './styles.module.css';

interface Props {
    readonly closeEditor: () => void;
    readonly isSaving: boolean;
    readonly resetMarkdown: () => void;
    readonly setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function EditModeButtonGroup(
    {
        closeEditor,
        isSaving,
        resetMarkdown,
        setIsSaving,
    }: Props
): JSX.Element {
    const discardOnSubmit = () => {
        resetMarkdown();
        closeEditor();
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
                    setIsSaving={setIsSaving}
                />
                <ProposeButton onSubmit={closeEditor} />
            </Stack>
        </div>
    );
}
