import { useLocation } from '@docusaurus/router';
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
import { useHotkeys } from 'react-hotkeys-hook';
import URI from 'urijs';
import { GITHUB_AUTHORIZATION_CALLBACK_PATH } from '../../../../../constants';
import { useGithub } from '../../../../../contexts/github';
import { useSnackbar } from '../../../../../contexts/snackbar';
import type { KeyBinding as KeyBindingType } from '../../../../../docusaurus-theme-editor';
import Transition from '../../../../components/Transition';

interface Props {
    readonly onSubmit: () => void;
}

const KeyBinding: KeyBindingType = {
    key: 'command+enter',
    friendlyLabel: '⌘↩︎',
};

// TODO(dnguyen0304): Extract to a centralized location to facilitate
// maintenance.
const StyledBox = styled(Box)({
    padding: '1rem',
    '& .MuiDialogContent-root': {
        // TODO(dnguyen0304): Migrate to theme.spacing.
        paddingTop: '1rem',
    },
});

// TODO(dnguyen0304): Extract as a configuration option.
const APP_CLIENT_ID: string = 'ce971b93f5383248a42b';
const GITHUB_AUTHORIZATION_CODE_URL: string = 'https://github.com/login/oauth/authorize';
// const GITHUB_AUTHORIZATION_SCOPES: string = ['public_repo'].join(' ');

export default function ProposeButton({ onSubmit }: Props): JSX.Element {
    const { username } = useGithub();
    const { pathname } = useLocation();
    const { snackbar } = useSnackbar();

    const [confirmationIsOpen, setConfirmationIsOpen] =
        React.useState<boolean>(false);
    const [description, setDescription] = React.useState<string>('');
    const [externalRedirect, setExternalRedirect] = React.useState('');

    const toggleConfirmation = () => {
        setConfirmationIsOpen(prev => !prev);
    };

    const initializeAuth = async () => {
        const authRedirectUrl =
            new URI(GITHUB_AUTHORIZATION_CODE_URL)
                .query({
                    client_id: APP_CLIENT_ID,
                    // scope: GITHUB_AUTHORIZATION_SCOPES,
                    redirect_uri:
                        new URI().path(GITHUB_AUTHORIZATION_CALLBACK_PATH),
                    state: pathname,
                })
                .toString();
        setExternalRedirect(authRedirectUrl);
    };

    const handleSubmit = async () => {
        if (username) {
            // TODO(dnguyen0304): Add validation for description text field.
            // TODO(dnguyen0304): Investigate adding delay to wait for the
            // transition animation.
            toggleConfirmation();
            onSubmit();
            snackbar.sendSuccessAlert(
                `Successfully proposed changes for "${description}".`
            );
        } else {
            await initializeAuth();
        }
    };

    const handleDescriptionKeyUp = (event: React.KeyboardEvent) => {
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
