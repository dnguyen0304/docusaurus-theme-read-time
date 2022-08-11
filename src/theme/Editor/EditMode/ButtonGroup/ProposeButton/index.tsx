import { useLocation } from '@docusaurus/router';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { RequestError } from '@octokit/request-error';
import * as React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useEditor } from '../../../../../contexts/editor';
import { useGithub } from '../../../../../contexts/github';
import { useSite } from '../../../../../contexts/site';
import { useSnackbar } from '../../../../../contexts/snackbar';
import type { KeyBinding as KeyBindingType } from '../../../../../docusaurus-theme-editor';
import Transition from '../../../../components/Transition';
import { initializeAuth } from '../../../../services/Github';
import { useRefMeasure } from '../../../utils';
import StyledDialog from '../Dialog';

const LOCAL_STORAGE_KEY_TITLE: string = 'pull-title';
const BUTTON_SUBMIT_BORDER_WIDTH_PIXELS: number = 1;

interface Props {
    readonly getMarkdown: () => string;
    readonly onClick: () => void;
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

export default function ProposeButton(
    {
        getMarkdown,
        onClick,
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
        LOCAL_STORAGE_KEY_TITLE in localStorage
            ? localStorage.getItem(LOCAL_STORAGE_KEY_TITLE)!
            : ''
    );
    const [externalRedirect, setExternalRedirect] = React.useState<string>('');
    const [measure, measureRef] = useRefMeasure<HTMLButtonElement>(
        clientRect => clientRect.width
    );
    const workingIconWidthRef = React.useRef<number>(24);
    const [workingButtonPadding, setWorkingButtonPadding] =
        React.useState<number>(0);
    const [isWorking, setIsWorking] = React.useState<boolean>(false);

    const toggleConfirmation = () => {
        setConfirmationIsOpen(prev => !prev);
    };

    const handleClick = async () => {
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

        setIsWorking(true);
        const { setPullRequestUrl } = tabs[activeTabId];

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
                setIsWorking(false);
                toggleConfirmation();
                return;
            } else {
                throw error;
            }
        }
        const pullUrl = await github.createPull(title);
        setPullRequestUrl(pullUrl);
        window.open(pullUrl, '_blank')!.focus();
        snackbar.sendSuccessAlert(
            `Successfully proposed changes for "${title}".`
        );

        // TODO(dnguyen0304): Add validation for title text field.
        // TODO(dnguyen0304): Investigate adding delay to wait for the
        // transition animation.
        setIsWorking(false);
        toggleConfirmation();
        onClick();
    };

    const handleTitleKeyUp = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleClick();
        }
    };

    const getSubmitButton = (): JSX.Element => {
        if (isWorking) {
            return (
                <Button
                    onClick={handleClick}
                    sx={{
                        px: `${workingButtonPadding}px`,
                    }}
                    variant='outlined'
                >
                    <CircularProgress size={workingIconWidthRef.current} />
                </Button>
            );
        } else {
            return (
                <Button
                    ref={measureRef}
                    onClick={handleClick}
                    variant='outlined'
                >
                    Propose
                </Button>
            );
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

    React.useEffect(() => {
        if (measure) {
            // TODO(dnguyen0304): Fix type error.
            setWorkingButtonPadding(
                (measure
                    - workingIconWidthRef.current
                    - 2 * BUTTON_SUBMIT_BORDER_WIDTH_PIXELS) / 2
            );
        }
    }, [measure])

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
                        {getSubmitButton()}
                    </DialogActions>
                </StyledBox>
            </StyledDialog>
        </React.Fragment>
    );
}
