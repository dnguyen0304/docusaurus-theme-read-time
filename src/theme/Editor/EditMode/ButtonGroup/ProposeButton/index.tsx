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
import { RequestError } from '@octokit/request-error';
import draft from 'draft-js';
import * as React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import {
    LocalStoragePullType,
    LOCAL_STORAGE_KEY_PULL
} from '../../../../../constants';
import { useEditor } from '../../../../../contexts/editor';
import { useGithub } from '../../../../../contexts/github';
import { useSite } from '../../../../../contexts/site';
import { useSnackbar } from '../../../../../contexts/snackbar';
import type { KeyBinding as KeyBindingType } from '../../../../../docusaurus-theme-editor';
import Transition from '../../../../components/Transition';
import {
    getLocalStorageObject,
    setLocalStorageObject
} from '../../../../Editor/utils';
import { initializeAuth } from '../../../../services/Github';
import StyledDialog from '../Dialog';
import LoadingButton from '../LoadingButton';

interface Props {
    readonly closeEditor: () => void;
    readonly getMarkdown: (state?: draft.EditorState) => string;
    readonly saveMarkdown: (state?: draft.EditorState) => void;
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
    '& label.MuiInputLabel-root': {
        fontStyle: 'italic',
    },
    '& div.MuiOutlinedInput-root': {
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: '2px',
        },
    },
}));

export default function ProposeButton(
    {
        closeEditor,
        getMarkdown,
        saveMarkdown,
    }: Props
): JSX.Element {
    const {
        activeTabId,
        tabs,
    } = useEditor();
    const { pathname: currentPath } = useLocation();
    const { snackbar } = useSnackbar();
    const githubContext = useGithub();
    const siteContext = useSite();

    const [confirmationIsOpen, setConfirmationIsOpen] =
        React.useState<boolean>(false);
    const [title, setTitle] = React.useState<string>(
        getLocalStorageObject<LocalStoragePullType>(
            LOCAL_STORAGE_KEY_PULL,
            'title',
        )
    );
    const [externalRedirect, setExternalRedirect] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const checkPullStatusTimerId = React.useRef<number>();

    const { pullRequestUrl } = tabs[activeTabId];

    const toggleConfirmation = () => {
        setConfirmationIsOpen(prev => !prev);
    };

    const handleClick = async () => {
        setIsLoading(true);
        // TODO(dnguyen0304): Investigate if an explicit save is required.
        saveMarkdown();

        const { setPullRequestUrl } = tabs[activeTabId];

        // TODO(dnguyen0304): Fix duplicated auth code.
        const {
            authRedirectUrl,
            github,
        } = await initializeAuth(
            githubContext,
            siteContext,
            currentPath,
        );

        if (authRedirectUrl) {
            setExternalRedirect(authRedirectUrl);
            return;
        }
        if (!github) {
            throw new Error('expected Github service to be defined');
        }

        await github.createBranch(
            `docusaurus-theme-editor`
            + `-${github.getUser().username}`
            + `-${Math.floor(Date.now() / 1000)}`
        );
        try {
            await github.createCommit(
                getMarkdown(),
                '[Auto-generated] [docusaurus-theme-editor] Partial save.',
            );
        } catch (error) {
            if (error instanceof RequestError
                && error.status === 404
                && error.message.includes('No commit found for the ref')
            ) {
                snackbar.sendWarningAlert(
                    `Failed to propose changes. The local version is unchanged `
                    + `from the site version.`
                );
                setIsLoading(false);
                toggleConfirmation();
                return;
            } else {
                throw error;
            }
        }
        const pullUrl = await github.createPull(title);
        setPullRequestUrl(pullUrl);
        localStorage.setItem(LOCAL_STORAGE_KEY_PULL, JSON.stringify(
            {
                url: pullUrl,
            } as LocalStoragePullType
        ));
        window.open(pullUrl, '_blank')!.focus();

        setIsLoading(false);

        // TODO(dnguyen0304): Add validation for title text field.
        // TODO(dnguyen0304): Investigate adding delay to wait for the
        // transition animation.
        snackbar.sendSuccessAlert(
            `Successfully proposed changes for "${title}".`
        );
        toggleConfirmation();
        closeEditor();
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
        setLocalStorageObject<LocalStoragePullType>(
            LOCAL_STORAGE_KEY_PULL,
            'title',
            event.target.value,
        );
    };

    const handleTitleKeyUp = (event: React.KeyboardEvent) => {
        // TODO(dnguyen0304): Add command+enter keyboard shortcut.
        if (event.key === 'Enter') {
            handleClick();
        }
    };

    useHotkeys(
        KeyBinding.key,
        toggleConfirmation,
    );

    React.useEffect(() => {
        if (!pullRequestUrl) {
            return;
        }

        checkPullStatusTimerId.current = window.setInterval(async () => {
            // TODO(dnguyen0304): Fix duplicated auth code.
            const {
                authRedirectUrl,
                github,
            } = await initializeAuth(
                githubContext,
                siteContext,
                currentPath,
            );

            if (authRedirectUrl) {
                setExternalRedirect(authRedirectUrl);
                return;
            }
            if (!github) {
                throw new Error('expected Github service to be defined');
            }

            const { setPull } = tabs[activeTabId];
            const status = await github.checkPullStatus(pullRequestUrl);
            setPull(status);
        }, 60 * 1000);

        return () => {
            clearTimeout(checkPullStatusTimerId.current);
        };
    }, [pullRequestUrl]);

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
                {/* TODO(dnguyen0304): Merge into StyledDialog. */}
                <StyledBox>
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
                                onChange={handleTitleChange}
                                onKeyUp={handleTitleKeyUp}
                                value={title}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={toggleConfirmation}>Go Back</Button>
                        <LoadingButton
                            onClick={handleClick}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                            variant='outlined'
                        >
                            Propose
                        </LoadingButton>
                    </DialogActions>
                </StyledBox>
            </StyledDialog>
        </React.Fragment>
    );
}
