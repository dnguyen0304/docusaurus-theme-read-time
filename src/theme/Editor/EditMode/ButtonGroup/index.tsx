import Stack from '@mui/material/Stack';
import * as React from 'react';
import styles from './styles.module.css';
// import DiscardButton from './DiscardButton';
// import GetApprovalButton from './GetApprovalButton';
// import SaveButton from './SaveButton';

export default function EditModeButtonGroup(
    {
        // toggleEditMode,
        // resetMarkdown,
        // toggleIsSaving,
    }
): JSX.Element {
    return (
        <div className={styles.editModeButtonGroup_container}>
            <Stack
                direction='row'
                spacing={2}
            >
                {/* <DiscardButton
                    toggleEditMode={toggleEditMode}
                    resetMarkdown={resetMarkdown}
                    snackbarService={snackbarService} />
                <SaveButton
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
