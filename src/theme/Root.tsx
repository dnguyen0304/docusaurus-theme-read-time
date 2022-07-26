import React from 'react';

interface Props {
    readonly children: React.ReactNode;
}

export default function Root({ children }: Props): JSX.Element {
    return (
        <>
            {children}
        </>
    );
}
