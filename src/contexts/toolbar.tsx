import * as React from 'react';
import { ReactContextError } from './errors';

type ContextValue = Readonly<{
    workbenchIsOpen: boolean;
    setWorkbenchIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>;

const Context = React.createContext<ContextValue | undefined>(undefined);

function useContextValue(): ContextValue {
    const [workbenchIsOpen, setWorkbenchIsOpen] =
        React.useState<boolean>(false);

    return React.useMemo(
        () => ({
            workbenchIsOpen,
            setWorkbenchIsOpen,
        }),
        [
            workbenchIsOpen,
            setWorkbenchIsOpen,
        ],
    );
};

type Props = Readonly<{
    children: React.ReactNode;
}>;

export function ToolbarProvider({ children }: Props): JSX.Element {
    const value = useContextValue();

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export function useToolbar(): ContextValue {
    const context = React.useContext(Context);
    if (context === undefined) {
        throw new ReactContextError('ToolbarProvider');
    }
    return context;
};
