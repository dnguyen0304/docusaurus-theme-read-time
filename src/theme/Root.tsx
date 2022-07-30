import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { EditorProvider } from '../contexts/editor';
import KeyBindings from '../services/KeyBindings';

interface Props {
    readonly children: React.ReactNode;
}

const COLOR_ACCENT_GREEN: string = '#64ffda';
// TODO(dnguyen0304): Rename to COLOR_GREY_600.
const COLOR_BLUEISH_BLACK: string = '#2e4561';
const COLOR_GREY_700: string = '#363732';

const theme = createTheme({
    palette: {
        primary: {
            main: COLOR_ACCENT_GREEN,
            contrastText: COLOR_BLUEISH_BLACK,
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
            },
        },
    },
});

export default function Root({ children }: Props): JSX.Element {
    return (
        <>
            <ThemeProvider theme={theme}>
                <EditorProvider>
                    <KeyBindings />
                    {children}
                </EditorProvider>
            </ThemeProvider>
        </>
    );
}
