import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useEditor } from '../../../contexts/editor';
import type { KeyBinding } from '../../../docusaurus-theme-editor';

interface Props {
    readonly toggleEditorIsOpen: () => void;
}

export const CloseButtonKeyBinding: KeyBinding = {
    key: 'escape',
    friendlyLabel: 'esc',
};

// TODO(dnguyen0304): Fix duplicated definition.
const COLOR_GREY_400: string = '#8996a5';

const StyledButton = styled(Button)({
    color: COLOR_GREY_400,
})

export default function CloseButton(
    {
        toggleEditorIsOpen,
    }: Props
): JSX.Element {
    const { beforeEditorCloseHooks } = useEditor();

    const handleClick = () => {
        Object.values(beforeEditorCloseHooks).forEach(hook => hook());
        toggleEditorIsOpen();
    };

    useHotkeys(
        CloseButtonKeyBinding.key,
        handleClick,
    );

    return (
        <Tooltip
            title={`Close editor panel (${CloseButtonKeyBinding.friendlyLabel})`}
            placement='bottom'
        >
            <StyledButton
                onClick={handleClick}
                startIcon={<CloseIcon />}
                variant='outlined'
            >
                Close
            </StyledButton>
        </Tooltip>
    );
};
