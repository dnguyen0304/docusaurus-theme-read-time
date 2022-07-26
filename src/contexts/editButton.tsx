import * as React from 'react';
import { ReactContextError } from './errors';

// aliases: table of contents
interface ContextValue {
    readonly tocIsHidden: boolean,
    readonly setTocIsHidden: React.Dispatch<React.SetStateAction<boolean>>,
};

const Context = React.createContext<ContextValue | undefined>(undefined);

function useContextValue(): ContextValue {
    const [tocIsHidden, setTocIsHidden] = React.useState<boolean>(false);

    return React.useMemo(
        () => ({ tocIsHidden, setTocIsHidden }),
        [tocIsHidden, setTocIsHidden],
    );
}

interface Props {
    readonly children: React.ReactNode,
};

function EditButtonProvider({ children }: Props): JSX.Element {
    const value = useContextValue();

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

function useEditButton(): ContextValue {
    const context = React.useContext(Context);
    if (context === undefined) {
        throw new ReactContextError('EditButtonProvider');
    }
    return context;
}

export {
    EditButtonProvider,
    useEditButton,
};
