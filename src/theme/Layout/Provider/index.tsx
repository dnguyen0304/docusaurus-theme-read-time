import type { WrapperProps } from '@docusaurus/types';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import LayoutProvider from '@theme-init/Layout/Provider';
import type LayoutProviderType from '@theme/Layout/Provider';
import * as React from 'react';
import { ToolbarProvider } from '../../../contexts/toolbar';
import Workbench from '../../components/Workbench';

const StyledLayout = styled(Box)({
    display: 'grid',
    gridAutoFlow: 'column',
    // TODO(dnguyen0304): Fix pre elements not overflowing at smaller screen
    //   sizes. See: https://css-tricks.com/preventing-a-grid-blowout/
    // TODO(dnguyen0304): Change to use fit-content for the sidebar so the text
    //   does not overflow at smaller screen sizes.
    gridAutoColumns: `
        minmax(0, 1fr)
        minmax(auto, 20vw)`,
});

// TODO(dnguyen0304): Migrate to interface for declaration merging.
type Props = Readonly<WrapperProps<typeof LayoutProviderType>>;

export default function LayoutProviderWrapper(props: Props): JSX.Element {
    return (
        <ToolbarProvider>
            <StyledLayout>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <LayoutProvider {...props} />
                </Box>
                <Workbench />
            </StyledLayout>
        </ToolbarProvider>
    );
};
