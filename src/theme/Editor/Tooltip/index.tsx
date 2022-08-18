import GitHubIcon from '@mui/icons-material/GitHub';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import MuiTooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import * as React from 'react';
import { InternalGithubState } from '../../../docusaurus-theme-editor';
import { KeyBinding } from '../EditMode/ButtonGroup/DiscardButton';

interface Props extends Omit<TooltipProps, 'title'> {
    pullUrl: string;
    pullState: InternalGithubState;
    pullStateIcon: JSX.Element | null;
}

const STATE_TO_DESCRIPTION: Record<NonNullable<InternalGithubState>, string> = {
    'open': 'Your pull request has been sent and is now awaiting review.',
    'closed':
        `Your pull request has been closed and is now safe to discard `
        + `(${KeyBinding.friendlyLabel}) locally.`,
    'merged':
        `Yay! Your pull request has been merged successfully and is now safe ` +
        `to discard (${KeyBinding.friendlyLabel}) locally.`,
};

const StyledTooltip = styled(({ className, ...props }: TooltipProps): JSX.Element => (
    <MuiTooltip classes={{ popper: className }} {...props} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        boxShadow: theme.shadows[1],
        '& th, & td': {
            color: '#fff',
        },
    },
    // Override Docusaurus Infima background-color style.
    'table tr:nth-child(2n)': {
        backgroundColor: 'inherit',
    },
}));

export default function Tooltip(
    {
        children,
        pullUrl,
        pullState,
        pullStateIcon,
        ...tooltipProps
    }: Props
): JSX.Element {
    if (!pullUrl || !pullState || !pullStateIcon) {
        return children;
    }

    const tableRowProps = {
        hover: true,
        sx: {
            '& td, & th': {
                border: 0,
            },
        },
    };

    return (
        <StyledTooltip
            {...tooltipProps}
            title={
                // Override Docusaurus Infima border-top and margin-bottom
                // styles.
                <Table sx={{
                    mb: 0,
                    '& tr:first-child': {
                        borderTop: 'inherit',
                    },
                }}>
                    <TableBody>
                        <TableRow {...tableRowProps}>
                            <TableCell
                                component='th'
                                scope='row'
                            >
                                Status
                            </TableCell>
                            <TableCell>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    textTransform: 'capitalize',
                                }}>
                                    <span>{pullState}</span>{pullStateIcon}
                                </Box>
                            </TableCell>
                        </TableRow>
                        <TableRow {...tableRowProps}>
                            <TableCell
                                component='th'
                                scope='row'
                            >
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                }}>
                                    <GitHubIcon sx={{ mr: '0.5rem' }} />GitHub
                                </Box>
                            </TableCell>
                            <TableCell align='right'>
                                <Link
                                    href={pullUrl}
                                    rel='noopener noreferrer'
                                    target='_blank'
                                    underline='none'
                                >
                                    Open in New Tab
                                </Link>
                            </TableCell>
                        </TableRow>
                        <TableRow {...tableRowProps}>
                            <TableCell colSpan={2}>
                                {STATE_TO_DESCRIPTION[pullState]}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            }
        >
            {children}
        </StyledTooltip>
    );
}
