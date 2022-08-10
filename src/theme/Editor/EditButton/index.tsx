import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useEditor } from '../../../contexts/editor';
import type { KeyBinding } from '../../../docusaurus-theme-editor';

interface Props {
    readonly onClick: () => void;
}

export const EditButtonKeyBinding: KeyBinding = {
    key: 'e',
    friendlyLabel: 'e',
};

export default function EditButton({ onClick }: Props): JSX.Element {
    const {
        tabs,
        addTab,
    } = useEditor();

    const handleClick = () => {
        if (tabs.length === 0) {
            addTab();
        }
        onClick();
    };

    useHotkeys(
        EditButtonKeyBinding.key,
        handleClick,
        {
            // Bind to KeyUp instead of KeyDown to avoid the KeyPress event
            // being captured when the editor is open.
            keydown: false,
            keyup: true,
        },
        [tabs],
    );

    return (
        <Tooltip
            title={`Open editor panel (${EditButtonKeyBinding.friendlyLabel})`}
            placement='bottom'
        >
            <Button
                // TODO(dnguyen0304): Add product tour intro step.
                data-title='Be the change.'
                data-intro='Update and fix your docs live.'
                data-step={1}
                data-position='top'
                onClick={handleClick}
                startIcon={<EditIcon />}
                // See "MUI - Change Button text color in theme" for an
                // explanation of Button color:
                // https://stackoverflow.com/a/69879572
                variant='contained'
            >
                Edit
            </Button>
        </Tooltip>
    );
};
