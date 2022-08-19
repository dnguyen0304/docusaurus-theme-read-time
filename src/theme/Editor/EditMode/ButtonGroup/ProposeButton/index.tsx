import { useLocation } from '@docusaurus/router';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
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
    LOCAL_STORAGE_KEY_PULL_BRANCH_NAME,
    LOCAL_STORAGE_KEY_PULL_TITLE,
    LOCAL_STORAGE_KEY_PULL_URL
} from '../../../../../constants';
import { useEditor } from '../../../../../contexts/editor';
import { useGithub } from '../../../../../contexts/github';
import { useSite } from '../../../../../contexts/site';
import { useSnackbar } from '../../../../../contexts/snackbar';
import type { KeyBinding as KeyBindingType } from '../../../../../docusaurus-theme-editor';
import Transition from '../../../../components/Transition';
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

    const {
        pullTitle,
        pullUrl,
        setPullTitle,
        setPullBranchName,
    } = tabs[activeTabId];

    const [confirmationIsOpen, setConfirmationIsOpen] =
        React.useState<boolean>(false);
    const [externalRedirect, setExternalRedirect] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const checkPullStatusTimerId = React.useRef<number>();

    const toggleConfirmation = () => {
        setConfirmationIsOpen(prev => !prev);
    };

    const handleClick = async () => {
        setIsLoading(true);
        // TODO(dnguyen0304): Investigate if an explicit save is required.
        saveMarkdown();

        const { setPullUrl } = tabs[activeTabId];

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

        const branchName =
            `docusaurus-theme-editor`
            + `-${github.getUser().username}`
            + `-${Math.floor(Date.now() / 1000)}`
        await github.createBranch(branchName);
        setPullBranchName(branchName);
        localStorage.setItem(LOCAL_STORAGE_KEY_PULL_BRANCH_NAME, branchName);
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
        const pullUrl = await github.createPull(pullTitle);
        setPullUrl(pullUrl);
        localStorage.setItem(LOCAL_STORAGE_KEY_PULL_URL, pullUrl);
        window.open(pullUrl, '_blank')!.focus();

        setIsLoading(false);

        // TODO(dnguyen0304): Add validation for pullTitle text field.
        // TODO(dnguyen0304): Investigate adding delay to wait for the
        // transition animation.
        snackbar.sendSuccessAlert(
            `Successfully proposed changes for "${pullTitle}".`
        );
        toggleConfirmation();
        closeEditor();
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPullTitle(event.target.value);
        localStorage.setItem(
            LOCAL_STORAGE_KEY_PULL_TITLE,
            event.target.value,
        );
    };

    const handleTitleKeyUp = (event: React.KeyboardEvent) => {
        // TODO(dnguyen0304): Add command+enter keyboard shortcut.
        if (event.key === 'Enter') {
            handleClick();
        }
    };

    const getLabel = (pullUrl: string): string => {
        return pullUrl ? 'Sync' : 'Propose';
    }

    const checkPullStatus = async () => {
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
        const status = await github.checkPullStatus(pullUrl);
        setPull(status);
    };

    // Support syncing local changes.
    useHotkeys(
        KeyBinding.key,
        toggleConfirmation,
    );

    React.useEffect(() => {
        if (!pullUrl) {
            return;
        }

        checkPullStatus();
        checkPullStatusTimerId.current = window.setInterval(async () => {
            await checkPullStatus();
        }, 60 * 1000);

        return () => {
            clearTimeout(checkPullStatusTimerId.current);
        };
    }, [pullUrl]);

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
                title={
                    `${getLabel(pullUrl)} (${KeyBinding.friendlyLabel})`
                }
                placement='top'
            >
                <Button
                    // Support syncing local changes.
                    onClick={toggleConfirmation}
                    startIcon={
                        pullUrl
                            ? <CloudUploadOutlinedIcon />
                            : <SendIcon />
                    }
                    variant='contained'
                >
                    {getLabel(pullUrl)}
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
                                value={pullTitle}
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
