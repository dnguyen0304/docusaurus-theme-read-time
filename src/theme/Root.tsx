import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { EditorProvider } from '../contexts/editor';
import { GithubProvider } from '../contexts/github';
import { SnackbarProvider } from '../contexts/snackbar';
import App from '../theme/components/App';
import Snackbar from '../theme/services/Snackbar';
import './styles.css';

type Props = {
    readonly children: React.ReactNode;
}

const COLOR_ACCENT_GREEN: string = '#64ffda';
const COLOR_GREY_400: string = '#8996a5';
const COLOR_GREY_600: string = '#2e4561';  // blueish
const COLOR_GREY_700: string = '#363732';

const theme = createTheme({
    breakpoints: {
        values: {
            // See: https://docusaurus.io/docs/styling-layout#mobile-view
            mobile: 996,
        },
    },
    palette: {
        primary: {
            main: COLOR_ACCENT_GREEN,
            contrastText: COLOR_GREY_600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                // See Button CSS class name documentation:
                // https://mui.com/material-ui/api/button/#css
                textPrimary: {
                    color: COLOR_GREY_700,
                    // Use the double ampersand to increase CSS specificity.
                    // See also:
                    // https://spectrum.chat/styled-components/general/how-does-the-ampersand-that-increases-specificity-work~89c28653-e27c-49f0-9d8c-d89dc05c59dc
                    // https://stackoverflow.com/questions/56169750/change-ripple-color-on-click-of-material-ui-button
                    '&& .MuiTouchRipple-child': {
                        backgroundColor: COLOR_ACCENT_GREEN,
                    },
                },
                outlinedPrimary: {
                    borderColor: COLOR_GREY_400,
                    color: COLOR_GREY_700,
                    '&:focus': {
                        borderColor: COLOR_ACCENT_GREEN,
                    },
                    '&& .MuiTouchRipple-child': {
                        backgroundColor: COLOR_ACCENT_GREEN,
                    },
                },
            },
        },
    },
});

export default function Root({ children }: Props): JSX.Element {
    const snackbar = Snackbar();

    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider snackbar={snackbar}>
                {/* TODO(dnguyen0304): Investigate if this should be moved 1
                    parent scope higher. */}
                {snackbar.create()}
                <GithubProvider>
                    {/* TODO(dnguyen0304): Investigate if this provider can be
                        moved to a smaller scope such as DocPage/Layout. */}
                    <EditorProvider>
                        <App />
                        {children}
                    </EditorProvider>
                </GithubProvider>
            </SnackbarProvider>
        </ThemeProvider>
    );
}
