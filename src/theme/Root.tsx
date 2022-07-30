import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { EditorProvider } from '../contexts/editor';
import KeyBindings from '../services/KeyBindings';

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
