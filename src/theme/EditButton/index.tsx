import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import styles from './styles.module.css';

export default function EditButton({ toggleEditMode }) {
    const BUTTON_BACKGROUND_COLOR_EMPHASIS = 'red';
    const GRADIENT_STOP_COLOR_TOP = 'white';
    const EDIT_BUTTON_HEIGHT_REM = 4.7;
    const EDIT_BUTTON_WIDTH_REM = EDIT_BUTTON_HEIGHT_REM;

    // TODO: Remove unused classes.
    return (
        <div className={`${styles.floatingActionButton} to-edit-mode edit-button d`}>
            <Tooltip title='Edit (e)' placement='left-end'>
                <Fab
                    data-title='Be the change.'
                    data-intro='Update and fix your docs live.'
                    data-step={1}
                    data-position='top'
                    onClick={toggleEditMode}
                    sx={{
                        backgroundColor: BUTTON_BACKGROUND_COLOR_EMPHASIS,
                        height: `${EDIT_BUTTON_HEIGHT_REM}rem`,
                        width: `${EDIT_BUTTON_WIDTH_REM}rem`,
                    }}>
                    <EditIcon sx={{ color: GRADIENT_STOP_COLOR_TOP }} />
                </Fab>
            </Tooltip>
        </div>
    );
};