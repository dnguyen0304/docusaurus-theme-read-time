import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';

interface Props {
    readonly toggleEditorIsOpen: () => void;
}

// TODO(dnguyen0304): Extract keybindings to a centralized location to
// facilitate maintenance.
const KEYBINDING: string = 'esc';

export default function CloseButton(
    {
        toggleEditorIsOpen,
    }: Props
): JSX.Element {
    return (
        <Tooltip
            title={`Close editor panel (${KEYBINDING})`}
            placement='bottom'
        >
            <Button
                onClick={toggleEditorIsOpen}
                startIcon={<CloseIcon />}
                variant='contained'
            >
                Close
            </Button>
        </Tooltip>
    );
};
