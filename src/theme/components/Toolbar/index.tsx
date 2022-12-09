import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { useToolbar } from '../../../contexts/toolbar';

// TODO(dnguyen0304): Add paddingRight for the scrollbar.
const StyledBox = styled(Box)({
    // TODO(dnguyen0304): Fix missing responsive design.
    width: '110px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderLeft: '1px solid var(--ifm-toc-border-color)',
    paddingTop: 'var(--space-s)',
});

interface Props { };

export default function Toolbar(
    {
    }: Props
): JSX.Element {
    const { setWorkbenchIsOpen } = useToolbar();

    return (
        <StyledBox>
            <IconButton onClick={() => { setWorkbenchIsOpen(prev => !prev) }}>
                <InsightsOutlinedIcon />
            </IconButton>
        </StyledBox>
    );
};
