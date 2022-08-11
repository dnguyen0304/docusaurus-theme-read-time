// import { useLocation } from '@docusaurus/router';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import * as React from 'react';
import { useEditor } from '../../../../../../contexts/editor';
// import { useGithub } from '../../../../../../contexts/github';
// import { useSite } from '../../../../../../contexts/site';
// import { initializeAuth } from '../../../../../services/Github';

const MENU_ITEM_KEY_PREFIX: string = 'menu-item'
const MENU_ITEM_OPTIONS: string[] = [
    'Discard',
    'Close',
];

interface Props {
    readonly handleSubmit: () => void;
}

// TODO(dnguyen0304): Add danger style.
export default function SplitButton({ handleSubmit }: Props): JSX.Element {
    // const { pathname: currentPath } = useLocation();
    // const githubContext = useGithub();
    // const siteContext = useSite();
    const {
        activeTabId,
        tabs,
    } = useEditor();

    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [isMenuItemOpen, setIsMenuItemOpen] = React.useState<boolean>(false);
    const [menuItemIndex, setMenuItemIndex] = React.useState<number>(0);
    // const [externalRedirect, setExternalRedirect] = React.useState<string>('');

    // TODO(dnguyen0304): Remove duplicated active tab code.
    const {
        pullRequestUrl,
        // setPullRequestUrl,
    } = tabs[activeTabId];

    const handleClick = async () => {
        if (MENU_ITEM_OPTIONS[menuItemIndex].includes('Discard')) {
            handleSubmit();
        }
        // if (MENU_ITEM_OPTIONS[menuItemIndex].includes('Close')) {
        //     // TODO(dnguyen0304): Fix duplicated auth code.
        //     const {
        //         authRedirectUrl,
        //         github,
        //     } = await initializeAuth(
        //         githubContext,
        //         siteContext,
        //         currentPath,
        //     );

        //     if (authRedirectUrl) {
        //         setExternalRedirect(authRedirectUrl);
        //         return;
        //     }
        //     if (!github) {
        //         throw new Error('expected Github service to be defined');
        //     }

        //     github.closePull(pullRequestUrl);
        //     setPullRequestUrl('');
        // }
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
        if (text.includes('Discard') && pullRequestUrl) {
            return 'Discard and Close';
        }
        return text;
    };

    // React.useEffect(() => {
    //     if (externalRedirect) {
    //         window.location.replace(externalRedirect);
    //     }
    // }, [externalRedirect]);

    return (
        <React.Fragment>
            <ButtonGroup
                ref={anchorRef}
                sx={{
                    // Add the margin-left style because this component is not
                    // included in .MuiDialogActions-root>:not(:first-of-type).
                    ml: '.5rem',
                }}
                variant='outlined'
            >
                <Button onClick={handleClick}>
                    {getText(MENU_ITEM_OPTIONS[menuItemIndex])}
                </Button>
                <Button
                    onClick={toggleMenuItem}
                    size='small'
                >
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>
            <Popper
                anchorEl={anchorRef.current}
                disablePortal
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
                        <Paper>
                            <ClickAwayListener onClickAway={handleMenuItemClose}>
                                <MenuList autoFocusItem>
                                    {MENU_ITEM_OPTIONS.map((option, index) => (
                                        <MenuItem
                                            key={`${MENU_ITEM_KEY_PREFIX}-${option}`}
                                            disabled={option.includes('Close') && !pullRequestUrl}
                                            onClick={event => handleMenuItemClick(event, index)}
                                            selected={index === menuItemIndex}
                                        >
                                            {getText(option)}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </React.Fragment>
    );
}
