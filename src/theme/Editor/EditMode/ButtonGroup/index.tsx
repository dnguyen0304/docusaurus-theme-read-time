import Stack from '@mui/material/Stack';
import * as React from 'react';
import DiscardButton from './DiscardButton';
import styles from './styles.module.css';
// import GetApprovalButton from './GetApprovalButton';
// import SaveButton from './SaveButton';

interface Props {
    readonly toggleEditorIsOpen: () => void;
}

export default function EditModeButtonGroup(
    {
        toggleEditorIsOpen,
        // resetMarkdown,
        // toggleIsSaving,
    }: Props
): JSX.Element {
    return (
        <div className={styles.editModeButtonGroup_container}>
            <Stack
                direction='row'
                spacing={2}
            >
                <DiscardButton onClick={toggleEditorIsOpen} />
                {/* <SaveButton
                    toggleEditMode={toggleEditMode}
                    toggleIsSaving={toggleIsSaving}
                    snackbarService={snackbarService} />
                <GetApprovalButton
                    toggleEditMode={toggleEditMode}
                    snackbarService={snackbarService} /> */}
            </Stack>
        </div>
    );
}
