import React from 'react';

interface Props {
    readonly children: React.ReactNode;
}

// TODO(dnguyen0304): Add custom theme.
// https://mui.com/material-ui/customization/theming/
export default function Root({ children }: Props): JSX.Element {
    return (
        <>
            {children}
        </>
    );
}
