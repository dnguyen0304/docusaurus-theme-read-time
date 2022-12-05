import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import * as React from 'react';
import { useToolbar } from '../../../contexts/toolbar';

interface Props { };

export default function Toolbar(
    {
    }: Props
): JSX.Element {
    const { setWorkbenchIsOpen } = useToolbar();

    return (
        <Box
            // TODO(dnguyen0304): Add paddingRight for the scrollbar.
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '110px',
                borderLeft: '1px solid var(--ifm-toc-border-color)',
                paddingTop: '1rem',
            }}
        >
            <IconButton onClick={() => { setWorkbenchIsOpen(prev => !prev) }}>
                <InsightsOutlinedIcon />
            </IconButton>
        </Box>
    );
}
