import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';

interface Props {
    readonly toggleEditorIsOpen: () => void;
}

// TODO(dnguyen0304): Extract keybindings to a centralized location to
// facilitate maintenance.
const KEYBINDING: string = 'e';

export default function EditButton({ toggleEditorIsOpen }: Props): JSX.Element {
    return (
        <Tooltip
            title={`Open editor panel (${KEYBINDING})`}
            placement='bottom'
        >
            <Button
                // TODO(dnguyen0304): Add product tour intro step.
                data-title='Be the change.'
                data-intro='Update and fix your docs live.'
                data-step={1}
                data-position='top'
                onClick={toggleEditorIsOpen}
                variant='contained'
                startIcon={<EditIcon />}
            >
                Edit
            </Button>
        </Tooltip>
    );
};
