import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import { useSnackbar } from '../../../../../contexts/snackbar';
import Transition from '../../../../components/Transition';

interface Props {
    readonly onSubmit: () => void;
}

const StyledDialog = styled(Dialog)({
    '& .MuiPaper-root': {
        padding: '1rem',
    },
});

export default function DiscardButton({ onSubmit }: Props): JSX.Element {
    const snackbar = useSnackbar().snackbar;

    const [confirmationIsOpen, setConfirmationIsOpen] =
        React.useState<boolean>(false);

    const toggleConfirmation = () => {
        setConfirmationIsOpen(prev => !prev);
    };

    const closeEditor = () => {
        toggleConfirmation();
        onSubmit();
        snackbar.sendSuccessAlert('Successfully discarded changes.');
    };

    return (
        <React.Fragment>
            {/* TODO(dnguyen0304): Extract to a centralized location to
                facilitate maintenance. */}
            <Tooltip
                title='Discard'
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
                        Do you want to discard your changes without saving? Your
                        changes will be permanently lost if you don't save them.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={toggleConfirmation}
                        variant='contained'
                        autoFocus
                    >
                        Go Back
                    </Button>
                    <Button onClick={closeEditor}>
                        Discard
                    </Button>
                </DialogActions>
            </StyledDialog>
        </React.Fragment>
    );
}