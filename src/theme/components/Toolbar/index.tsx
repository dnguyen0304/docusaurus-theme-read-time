import HomeIcon from '@mui/icons-material/Home';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import * as React from 'react';

type Props = Readonly<{}>;

export default function Toolbar(
    {
    }: Props
): JSX.Element {
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
            {/* TODO(dnguyen0304): Add real onClick implementation. */}
            <IconButton onClick={() => { console.log('hi') }}>
                <HomeIcon />
            </IconButton>
        </Box>
    );
}
