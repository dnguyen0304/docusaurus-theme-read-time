import type { WrapperProps } from '@docusaurus/types';
import Box from '@mui/material/Box';
import LayoutProvider from '@theme-init/Layout/Provider';
import type LayoutProviderType from '@theme/Layout/Provider';
import * as React from 'react';

type Props = Readonly<WrapperProps<typeof LayoutProviderType>>;

export default function LayoutProviderWrapper(props: Props): JSX.Element {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
        }}>
            <Box sx={{
                flexGrow: 1,
            }}>
                <LayoutProvider {...props} />
            </Box>
            {/* TODO(dnguyen0304): Add real Workbench implementation. */}
            <Box sx={{
                width: '100px',
                backgroundColor: 'red',
            }} />
        </Box>
    );
}
