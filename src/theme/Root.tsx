import * as React from 'react';
import App from '../theme/components/App';

type Props = {
    readonly children: React.ReactNode;
}

export default function Root({ children }: Props): JSX.Element {
    return (
        <>
            <App />
            {children}
        </>
    );
}
