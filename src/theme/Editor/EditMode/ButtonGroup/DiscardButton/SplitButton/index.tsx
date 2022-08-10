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

const MENU_ITEM_KEY_PREFIX: string = 'menu-item'
const MENU_ITEM_OPTIONS: string[] = [
    'Discard',
    'Discard and Close',
    'Close',
];

interface Props {
    readonly handleSubmit: () => void;
    readonly pullRequestUrl: string;
}

// TODO(dnguyen0304): Add danger style.
export default function SplitButton(
    {
        handleSubmit,
        pullRequestUrl,
    }: Props
): JSX.Element {
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [isMenuItemOpen, setIsMenuItemOpen] = React.useState<boolean>(false);
    const [menuItemIndex, setMenuItemIndex] = React.useState<number>(0);

    const handleClick = () => {
        if (MENU_ITEM_OPTIONS[menuItemIndex] === 'Discard') {
            handleSubmit();
        } else {
            console.log(`pressed ${MENU_ITEM_OPTIONS[menuItemIndex]}`);
        }
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

    return (
        <React.Fragment>
            <ButtonGroup
                ref={anchorRef}
                sx={{
                    // Add the margin-left style because this component is not
                    // included in .MuiDialogActions-root>:not(:first-of-type).
                    ml: '.5rem',
                }}
                variant='contained'
            >
                <Button onClick={handleClick}>
                    {MENU_ITEM_OPTIONS[menuItemIndex]}
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
                                            {option}
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
