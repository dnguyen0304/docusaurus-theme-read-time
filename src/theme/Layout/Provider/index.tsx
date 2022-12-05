import type { WrapperProps } from '@docusaurus/types';
import Box from '@mui/material/Box';
import LayoutProvider from '@theme-init/Layout/Provider';
import type LayoutProviderType from '@theme/Layout/Provider';
import * as React from 'react';
import { ToolbarProvider } from '../../../contexts/toolbar';
import Workbench from '../../components/Workbench';

// TODO(dnguyen0304): Migrate to interface for declaration merging.
type Props = Readonly<WrapperProps<typeof LayoutProviderType>>;

export default function LayoutProviderWrapper(props: Props): JSX.Element {
    return (
        <ToolbarProvider>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
            }}>
                <Box sx={{
                    flexGrow: 1,
                }}>
                    <LayoutProvider {...props} />
                </Box>
                <Workbench />
            </Box>
        </ToolbarProvider>
    );
};
