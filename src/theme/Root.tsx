import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';

const COLOR_ACCENT_GREEN: string = '#64ffda';
const COLOR_GREY_400: string = '#8996a5';
const COLOR_GREY_600: string = '#2e4561';  // blueish
const COLOR_GREY_700: string = '#363732';

const theme = createTheme({
    // breakpoints: {
    //     values: {
    //         // See: https://docusaurus.io/docs/styling-layout#mobile-view
    //         mobile: 996,
    //     },
    // },
    // palette: {
    //     primary: {
    //         main: COLOR_ACCENT_GREEN,
    //         contrastText: COLOR_GREY_600,
    //     },
    // },
});

interface Props {
    readonly children: React.ReactNode;
}

export default function Root({ children }: Props): JSX.Element {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
};
