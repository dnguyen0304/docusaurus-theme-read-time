import * as React from 'react';
import { SnackbarType } from '../theme/services/Snackbar';
import { ReactContextError } from './errors';

interface ContextValue {
    readonly snackbar: SnackbarType;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

function useContextValue(snackbar: SnackbarType): ContextValue {
    return React.useMemo(
        () => ({ snackbar }),
        [snackbar],
    );
}

interface Props {
    readonly snackbar: SnackbarType;
    readonly children: React.ReactNode;
};

export function SnackbarProvider(
    {
        snackbar,
        children,
    }: Props
): JSX.Element {
    const value = useContextValue(snackbar);

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export function useSnackbar(): ContextValue {
    const context = React.useContext(Context);
    if (context === undefined) {
        throw new ReactContextError('SnackbarProvider');
    }
    return context;
}
