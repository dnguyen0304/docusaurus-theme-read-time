import Stack from '@mui/material/Stack';
import * as React from 'react';
import DiscardButton from './DiscardButton';
import ProposeButton from './ProposeButton';
import SaveButton from './SaveButton';
import styles from './styles.module.css';

interface Props {
    readonly closeEditor: () => void;
    readonly isSaving: boolean;
    readonly setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function EditModeButtonGroup(
    {
        closeEditor,
        isSaving,
        setIsSaving,
        // resetMarkdown,
    }: Props
): JSX.Element {
    return (
        <div className={styles.editModeButtonGroup_container}>
            <Stack
                direction='row'
                spacing={2}
            >
                <DiscardButton onSubmit={closeEditor} />
                <SaveButton
                    isSaving={isSaving}
                    setIsSaving={setIsSaving}
                />
                <ProposeButton onSubmit={closeEditor} />
            </Stack>
        </div>
    );
}
