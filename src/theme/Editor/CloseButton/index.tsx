import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import type { KeyBinding } from '../../../docusaurus-theme-editor';

interface Props {
    readonly toggleEditorIsOpen: () => void;
}

export const CloseButtonKeyBinding: KeyBinding = {
    key: 'escape',
    friendlyLabel: 'esc',
};

const COLOR_GREY_400: string = '#8996a5';

// TODO(dnguyen0304): Investigate changing color on hover.
const StyledButton = styled(Button)({
    borderColor: COLOR_GREY_400,
    color: COLOR_GREY_400,
})

export default function CloseButton(
    {
        toggleEditorIsOpen,
    }: Props
): JSX.Element {
    useHotkeys(
        CloseButtonKeyBinding.key,
        toggleEditorIsOpen,
    );

    return (
        <Tooltip
            title={`Close editor panel (${CloseButtonKeyBinding.friendlyLabel})`}
            placement='bottom'
        >
            <StyledButton
                onClick={toggleEditorIsOpen}
                startIcon={<CloseIcon />}
                variant='outlined'
            >
                Close
            </StyledButton>
        </Tooltip>
    );
};
