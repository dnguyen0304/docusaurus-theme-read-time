import { useLocation } from '@docusaurus/router';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Cookies from 'universal-cookie';
import { useGithub } from '../../../../../contexts/github';
import { useSnackbar } from '../../../../../contexts/snackbar';
import type { KeyBinding as KeyBindingType } from '../../../../../docusaurus-theme-editor';
import Transition from '../../../../components/Transition';
import { initializeAuth } from '../../../../services/Github';
import StyledDialog from '../Dialog';

const LOCAL_STORAGE_KEY_TITLE: string = 'pull-title';

interface Props {
    readonly onSubmit: () => void;
}

const KeyBinding: KeyBindingType = {
    key: 'command+enter',
    friendlyLabel: '⌘↩︎',
};

const StyledBox = styled(Box)({
    '& .MuiDialogContent-root': {
        // TODO(dnguyen0304): Migrate to theme.spacing.
        paddingTop: '1rem',
        '& .MuiDialogContentText-root': {
            paddingBottom: '1rem',
        },
    },
});

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: '2px',
        },
    }
}));

export default function ProposeButton({ onSubmit }: Props): JSX.Element {
    const { user } = useGithub();
    const { pathname: currentPath } = useLocation();
    const { snackbar } = useSnackbar();

    const [confirmationIsOpen, setConfirmationIsOpen] =
        React.useState<boolean>(false);
    const [title, setTitle] = React.useState<string>(
        LOCAL_STORAGE_KEY_TITLE in localStorage
            ? localStorage.getItem(LOCAL_STORAGE_KEY_TITLE)!
            : ''
    );
    const [externalRedirect, setExternalRedirect] = React.useState<string>('');

    const toggleConfirmation = () => {
        setConfirmationIsOpen(prev => !prev);
    };

    const handleSubmit = async () => {
        const cookies = new Cookies();

        if (user || cookies.get('sessionid')) {
            // TODO(dnguyen0304): Add validation for title text field.
            // TODO(dnguyen0304): Investigate adding delay to wait for the
            // transition animation.
            toggleConfirmation();
            onSubmit();
            snackbar.sendSuccessAlert(
                `Successfully proposed changes for "${title}".`
            );
        } else {
            const authRedirectUrl = await initializeAuth(currentPath);
            setExternalRedirect(authRedirectUrl);
        }
    };

    const handleTitleKeyUp = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    useHotkeys(
        KeyBinding.key,
        toggleConfirmation,
    );

    React.useEffect(() => {
        if (externalRedirect) {
            window.location.replace(externalRedirect);
        }
    }, [externalRedirect]);

    return (
        <React.Fragment>
            {/* TODO(dnguyen0304): Extract to a centralized location to
                facilitate maintenance. */}
            <Tooltip
                title={`Propose (${KeyBinding.friendlyLabel})`}
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
            <StyledDialog
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
                            <StyledTextField
                                helperText={<>Press <b>↩︎ Enter</b> to send</>}
                                label='Title'
                                onChange={(e) => {
                                    setTitle(e.target.value)
                                    localStorage.setItem(
                                        LOCAL_STORAGE_KEY_TITLE,
                                        e.target.value,
                                    );
                                }}
                                onKeyUp={handleTitleKeyUp}
                                value={title}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={toggleConfirmation}>Go Back</Button>
                        <Button
                            type='submit'
                            variant='outlined'
                        >
                            Propose
                        </Button>
                    </DialogActions>
                </StyledBox>
            </StyledDialog>
        </React.Fragment>
    );
}
