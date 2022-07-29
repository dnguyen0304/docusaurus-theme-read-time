import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import type { KeyBinding } from '../../../docusaurus-theme-editor';

interface Props {
    readonly toggleEditorIsOpen: () => void;
}

export const CloseButtonKeyBinding: KeyBinding = {
    key: 'escape',
    friendlyLabel: 'esc',
};

export default function CloseButton(
    {
        toggleEditorIsOpen,
    }: Props
): JSX.Element {
    return (
        <Tooltip
            title={`Close editor panel (${CloseButtonKeyBinding.friendlyLabel})`}
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
