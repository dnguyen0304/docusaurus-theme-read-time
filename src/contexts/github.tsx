import * as React from 'react';
import { ReactContextError } from './errors';

interface ContextValue {
    readonly username: string;
    readonly setUsername: React.Dispatch<React.SetStateAction<string>>;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

function useContextValue(): ContextValue {
    const [username, setUsername] = React.useState<string>('');

    return React.useMemo(
        () => ({ username, setUsername }),
        [username, setUsername],
    );
}

interface Props {
    readonly children: React.ReactNode;
};

function GithubProvider({ children }: Props): JSX.Element {
    const value = useContextValue();

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

function useGithub(): ContextValue {
    const context = React.useContext(Context);
    if (context === undefined) {
        throw new ReactContextError('GithubProvider');
    }
    return context;
}

export {
    GithubProvider,
    useGithub,
};
