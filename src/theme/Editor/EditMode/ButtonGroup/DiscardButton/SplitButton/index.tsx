import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import { useEditor } from '../../../../../../contexts/editor';
import { useGithub } from '../../../../../../contexts/github';
import { useSite } from '../../../../../../contexts/site';
import { useSnackbar } from '../../../../../../contexts/snackbar';
import { initializeAuth } from '../../../../../services/Github';
import LoadingButton from '../../LoadingButton';

const TOOLTIP_TEXT: JSX.Element = (
    <span>
        <i>Discarding</i> resets local editor changes. <i>Closing</i> closes the
        remote pull request on GitHub.
    </span>
);
const MENU_ITEM_OPTION_DISCARD: string = 'Discard';
const MENU_ITEM_OPTION_CLOSE: string = 'Close';
const MENU_ITEM_KEY_PREFIX: string = 'menu-item'
const MENU_ITEM_OPTIONS: string[] = [
    MENU_ITEM_OPTION_DISCARD,
    MENU_ITEM_OPTION_CLOSE,
];

type Props = {
    readonly closeEditor: () => void;
    readonly resetMarkdown: () => void;
    readonly toggleConfirmation: () => void;
}

// Add back the ButtonGroup styles broken by adding a Tooltip.
const StyledLoadingButton = styled(LoadingButton)({
    'borderTopRightRadius': 0,
    'borderBottomRightRadius': 0,
    'borderRightColor': 'transparent',
});

// Add back the ButtonGroup styles broken by adding a Tooltip.
const StyledMenuButton = styled(Button)({
    'borderTopLeftRadius': 0,
    'borderBottomLeftRadius': 0,
    'marginLeft': '-1px',
});

const StyledPaper = styled(Paper)({
    '&&.MuiPaper-root': {
        borderRadius: '5px',
        padding: '0 0.5rem',
    },
});

// TODO(dnguyen0304): Add danger style.
export default function SplitButton(
    {
        closeEditor,
        resetMarkdown,
        toggleConfirmation,
    }: Props
): JSX.Element {
    const { snackbar } = useSnackbar();
    const githubContext = useGithub();
    const siteContext = useSite();
    const {
        activeTabId,
        tabs,
    } = useEditor();

    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [isMenuItemOpen, setIsMenuItemOpen] = React.useState<boolean>(false);
    const [menuItemIndex, setMenuItemIndex] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [externalRedirect, setExternalRedirect] = React.useState<string>('');

    // TODO(dnguyen0304): Remove duplicated active tab code.
    const {
        pullUrl,
        setPullTitle,
        setPullUrl,
        setPullBranchName,
    } = tabs[activeTabId];

    const handleClick = async () => {
        const text = getText(MENU_ITEM_OPTIONS[menuItemIndex]);

        setPullTitle('', true, siteContext);

        if (text.includes(MENU_ITEM_OPTION_DISCARD)) {
            resetMarkdown();
        }
        if (text.includes(MENU_ITEM_OPTION_CLOSE)) {
            setIsLoading(true);

            // TODO(dnguyen0304): Fix duplicated auth code.
            const {
                authRedirectUrl,
                github,
            } = await initializeAuth(
                githubContext,
                siteContext,
            );

            if (authRedirectUrl) {
                setExternalRedirect(authRedirectUrl);
                return;
            }
            if (!github) {
                throw new Error('expected Github service to be defined');
            }

            await github.closePull(pullUrl);
            setPullUrl('', true, siteContext);
            setPullBranchName('', true, siteContext);
            setIsLoading(false);
        }

        let message: string = '';

        if (text.includes(MENU_ITEM_OPTION_DISCARD)
            && text.includes(MENU_ITEM_OPTION_CLOSE)
        ) {
            message =
                'Successfully discarded changes and closed the pull request.';
        } else if (text.includes(MENU_ITEM_OPTION_DISCARD)) {
            message = 'Successfully discarded changes.';
        } else if (text.includes(MENU_ITEM_OPTION_CLOSE)) {
            message = 'Successfully closed the pull request.';
        }

        snackbar.sendSuccessAlert(message);
        toggleConfirmation();
        closeEditor();
    };

    const toggleMenuItem = () => {
        setIsMenuItemOpen(prev => !prev);
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number,
    ) => {
        setMenuItemIndex(index);
        setIsMenuItemOpen(false);
    };

    const handleMenuItemClose = (event: Event) => {
        if (anchorRef.current
            && anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }
        setIsMenuItemOpen(false);
    };

    const getText = (text: string): string => {
        // TODO(dnguyen0304): Investigate if there is a use case for discarding
        // local changes without closing the remote pull.
        if (text.includes(MENU_ITEM_OPTION_DISCARD) && pullUrl) {
            return `${MENU_ITEM_OPTION_DISCARD} and ${MENU_ITEM_OPTION_CLOSE}`;
        }
        return text;
    };

    React.useEffect(() => {
        if (externalRedirect) {
            window.location.replace(externalRedirect);
        }
    }, [externalRedirect]);

    return (
        <>
            <ButtonGroup
                ref={anchorRef}
                sx={{
                    // Add the margin-left style because this component is not
                    // included in .MuiDialogActions-root>:not(:first-of-type).
                    ml: '.5rem',
                }}
                variant='outlined'
            >
                <Tooltip
                    title={TOOLTIP_TEXT}
                    enterDelay={1000}
                    enterNextDelay={1000}
                    placement='top'
                >
                    <span>
                        <StyledLoadingButton
                            onClick={handleClick}
                            isLoading={isLoading}
                        >
                            {getText(MENU_ITEM_OPTIONS[menuItemIndex])}
                        </StyledLoadingButton>
                    </span>
                </Tooltip>
                <StyledMenuButton
                    onClick={toggleMenuItem}
                    size='small'
                >
                    <ArrowDropDownIcon />
                </StyledMenuButton>
            </ButtonGroup>
            <Popper
                anchorEl={anchorRef.current}
                disablePortal
                // See:
                // https://mui.com/material-ui/react-popper/#scroll-playground
                // https://popper.js.org/docs/v2/modifiers/offset/
                modifiers={[
                    {
                        name: 'offset',
                        enabled: true,
                        options: {
                            offset: [0, 10],
                        },
                    },
                    {
                        name: 'preventOverflow',
                        enabled: true,
                        options: {
                            padding: 12,
                        },
                    },
                ]}
                open={isMenuItemOpen}
                placement='top'
                role={undefined}
                sx={{
                    zIndex: 1,
                }}
                transition
            >
                {({ TransitionProps }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            // TODO(dnguyen0304): Investigate what this does.
                            transformOrigin: 'center bottom',
                        }}
                    >
                        <StyledPaper>
                            <ClickAwayListener onClickAway={handleMenuItemClose}>
                                <MenuList autoFocusItem>
                                    {MENU_ITEM_OPTIONS.map((option, index) => (
                                        <MenuItem
                                            key={`${MENU_ITEM_KEY_PREFIX}-${option}`}
                                            disabled={
                                                option.includes(MENU_ITEM_OPTION_CLOSE)
                                                && !pullUrl
                                            }
                                            onClick={event => handleMenuItemClick(event, index)}
                                            selected={index === menuItemIndex}
                                        >
                                            {getText(option)}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </StyledPaper>
                    </Grow>
                )}
            </Popper>
        </>
    );
}
