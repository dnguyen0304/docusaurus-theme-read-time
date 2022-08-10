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
import { useSnackbar } from '../../../../../contexts/snackbar';
import type { KeyBinding as KeyBindingType } from '../../../../../docusaurus-theme-editor';
import Transition from '../../../../components/Transition';
import StyledDialog from '../Dialog';
import SplitButton from './SplitButton';

interface Props {
    readonly onSubmit: () => void;
}

const KeyBinding: KeyBindingType = {
    key: 'shift+option+d',
    friendlyLabel: '^⌥D',
};

export default function DiscardButton({ onSubmit }: Props): JSX.Element {
    const snackbar = useSnackbar().snackbar;

    const [confirmationIsOpen, setConfirmationIsOpen] =
        React.useState<boolean>(false);

    const toggleConfirmation = () => {
        setConfirmationIsOpen(prev => !prev);
    };

    const handleSubmit = () => {
        toggleConfirmation();
        onSubmit();
        snackbar.sendSuccessAlert('Successfully discarded changes.');
    };

    useHotkeys(
        KeyBinding.key,
        toggleConfirmation,
    );

    return (
        <React.Fragment>
            {/* TODO(dnguyen0304): Extract to a centralized location to
                facilitate maintenance. */}
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
                    <SplitButton handleSubmit={handleSubmit} />
                </DialogActions>
            </StyledDialog>
        </React.Fragment>
    );
}
