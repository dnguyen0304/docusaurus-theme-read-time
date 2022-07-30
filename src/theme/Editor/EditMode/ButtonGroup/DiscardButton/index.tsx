import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { TransitionProps } from '@mui/material/transitions';
import * as React from 'react';

interface Props {
    readonly onClick: () => void;
}

// Copied from:
// https://mui.com/material-ui/react-dialog/#transitions
const Transition = React.forwardRef(function Transition(
    props: TransitionProps
        & {
            children: React.ReactElement<any, any>;
        },
    ref: React.Ref<unknown>,
) {
    return (
        <Slide
            ref={ref}
            direction='up'
            {...props}
        />
    );
});

const StyledDialog = styled(Dialog)({
    '& .MuiPaper-root': {
        padding: '1rem',
    },
});

export default function DiscardButton({ onClick }: Props): JSX.Element {
    const [confirmationIsOpen, setConfirmationIsOpen] =
        React.useState<boolean>(false);

    const toggleConfirmation = () => {
        setConfirmationIsOpen(prev => !prev);
    };

    const closeEditor = () => {
        toggleConfirmation();
        onClick();
    };

    return (
        <React.Fragment>
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
                    <DeleteIcon />
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
