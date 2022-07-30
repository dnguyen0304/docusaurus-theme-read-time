import Stack from '@mui/material/Stack';
import * as React from 'react';
import DiscardButton from './DiscardButton';
import styles from './styles.module.css';
// import GetApprovalButton from './GetApprovalButton';
import SaveButton from './SaveButton';

interface Props {
    readonly isSaving: boolean;
    readonly closeEditor: () => void;
}

export default function EditModeButtonGroup(
    {
        isSaving,
        closeEditor,
        // resetMarkdown,
    }: Props
): JSX.Element {
    return (
        <div className={styles.editModeButtonGroup_container}>
            <Stack
                direction='row'
                spacing={2}
            >
                <DiscardButton onClick={closeEditor} />
                <SaveButton isSaving={isSaving} />
                {/* <GetApprovalButton
                    toggleEditMode={toggleEditMode}
                    snackbarService={snackbarService} /> */}
            </Stack>
        </div>
    );
}
