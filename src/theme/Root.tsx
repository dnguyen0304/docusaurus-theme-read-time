import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { EditorProvider } from '../contexts/editor';

interface Props {
    readonly children: React.ReactNode;
}

const COLOR_ACCENT_GREEN: string = '#64ffda';
const COLOR_BLUEISH_BLACK: string = '#2e4561';

const theme = createTheme({
    palette: {
        primary: {
            main: COLOR_ACCENT_GREEN,
            contrastText: COLOR_BLUEISH_BLACK,
        },
    },
});

export default function Root({ children }: Props): JSX.Element {
    return (
        <>
            <ThemeProvider theme={theme}>
                <EditorProvider>
                    {children}
                </EditorProvider>
            </ThemeProvider>
        </>
    );
}
