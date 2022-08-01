import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import { useSnackbar } from '../../../../../contexts/snackbar';
import Transition from '../../../../components/Transition';

interface Props {
    readonly onSubmit: () => void;
}

// TODO(dnguyen0304): Extract to a centralized location to facilitate
// maintenance.
const StyledBox = styled(Box)({
    padding: '1rem',
    '& .MuiDialogContent-root': {
        // TODO(dnguyen0304): Migrate to theme.spacing.
        paddingTop: '1rem',
    },
});

export default function ProposeButton({ onSubmit }: Props): JSX.Element {
    const snackbar = useSnackbar().snackbar;

    const [confirmationIsOpen, setConfirmationIsOpen] =
        React.useState<boolean>(false);
    const [description, setDescription] = React.useState<string>('');

    const toggleConfirmation = () => {
        setConfirmationIsOpen(prev => !prev);
    };

    const handleSubmit = () => {
        // TODO(dnguyen0304): Add validation for description text field.
        // TODO(dnguyen0304): Investigate adding delay to wait for the
        // transition animation.
        toggleConfirmation();
        onSubmit();
        snackbar.sendSuccessAlert(
            `Successfully proposed changes for "${description}".`
        );
    };

    const handleDescriptionKeyUp = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <React.Fragment>
            {/* TODO(dnguyen0304): Extract to a centralized location to
                facilitate maintenance. */}
            <Tooltip
                title='Propose'
                placement='top'
            >
                <Button
                    onClick={toggleConfirmation}
                    startIcon={<SendIcon />}
                    variant='contained'
                >
                    Propose
                </Button>
            </Tooltip>
            <Dialog
                TransitionComponent={Transition}
                onClose={toggleConfirmation}
                open={confirmationIsOpen}
                keepMounted
            >
                <StyledBox
                    autoComplete='off'
                    component='form'
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <DialogTitle>Propose Changes</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2}>
                            <DialogContentText>
                                Provide a short, helpful background of your
                                changes.
                                <br /><br />
                                This opens a pull request to get your changes
                                reviewed by the documentation owners.
                            </DialogContentText>
                            {/* TODO(dnguyen0304): Add autoFocus. */}
                            <TextField
                                helperText='Description'
                                onChange={(e) => setDescription(e.target.value)}
                                onKeyUp={handleDescriptionKeyUp}
                            />
                            <TextField
                                helperText='Optional Details'
                                multiline
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={toggleConfirmation}>Go Back</Button>
                        <Button type='submit'>Propose</Button>
                    </DialogActions>
                </StyledBox>
            </Dialog>
        </React.Fragment>
    );
}