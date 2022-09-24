import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import type { KeyBinding as KeyBindingType } from '../../../../../docusaurus-theme-editor';
import Transition from '../../../../components/Transition';
import StyledDialog from '../Dialog';
import SplitButton from './SplitButton';

type Props = {
    readonly closeEditor: () => void;
    readonly resetMarkdown: () => void;
}

const KeyBinding: KeyBindingType = {
    key: 'shift+option+d',
    friendlyLabel: '^⌥D',
};

export default function DiscardButton(
    {
        closeEditor,
        resetMarkdown,
    }: Props
): JSX.Element {
    const [confirmationIsOpen, setConfirmationIsOpen] =
        React.useState<boolean>(false);

    const toggleConfirmation = () => {
        setConfirmationIsOpen(prev => !prev);
    };

    useHotkeys(
        KeyBinding.key,
        toggleConfirmation,
    );

    return (
        <>
            <Tooltip
                title={`Discard (${KeyBinding.friendlyLabel})`}
                placement='top'
            >
                <IconButton
                    aria-label='discard'
                    // TODO(dnguyen0304): Add red color for theme palette.
                    color='error'
                    onClick={toggleConfirmation}
                >
                    <DeleteOutlineRoundedIcon />
                </IconButton>
            </Tooltip>
            {/* TODO(dnguyen0304): Fix dark mode color styles. */}
            <StyledDialog
                TransitionComponent={Transition}
                onClose={toggleConfirmation}
                open={confirmationIsOpen}
                keepMounted
            >
                <DialogTitle>Discard changes?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to discard your changes? Your changes will
                        be permanently lost.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleConfirmation}>Go Back</Button>
                    <SplitButton
                        closeEditor={closeEditor}
                        resetMarkdown={resetMarkdown}
                        toggleConfirmation={toggleConfirmation}
                    />
                </DialogActions>
            </StyledDialog>
        </>
    );
}

export {
    KeyBinding,
};
