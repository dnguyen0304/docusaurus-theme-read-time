import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { EditorProvider } from '../contexts/editor';
import { GithubProvider } from '../contexts/github';
import { SnackbarProvider } from '../contexts/snackbar';
import Snackbar, { SnackbarType } from '../theme/services/Snackbar';

interface Props {
    readonly children: React.ReactNode;
}

const COLOR_ACCENT_GREEN: string = '#64ffda';
const COLOR_GREY_600: string = '#2e4561';  // blueish
const COLOR_GREY_700: string = '#363732';

const theme = createTheme({
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
                },
                outlinedPrimary: {
                    borderColor: COLOR_GREY_700,
                    color: COLOR_GREY_700,
                    '&:focus': {
                        borderColor: COLOR_ACCENT_GREEN,
                    },
                    '& .MuiTouchRipple-child': {
                        backgroundColor: COLOR_ACCENT_GREEN,
                    },
                },
            },
        },
    },
});

export default function Root({ children }: Props): JSX.Element {
    const snackbar: SnackbarType = Snackbar();

    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider snackbar={snackbar}>
                {snackbar.create()}
                <GithubProvider>
                    {/* TODO(dnguyen0304): Investigate if this provider can be
                        moved to a smaller scope such as DocPage/Layout. */}
                    <EditorProvider>
                        {children}
                    </EditorProvider>
                </GithubProvider>
            </SnackbarProvider>
        </ThemeProvider>
    );
}
