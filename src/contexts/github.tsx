import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';
import * as React from 'react';
import { ReactContextError } from './errors';

interface ContextValue {
    readonly api: RestEndpointMethodTypes | undefined;
    readonly username: string;
    readonly setApi: React.Dispatch<React.SetStateAction<RestEndpointMethodTypes | undefined>>;
    readonly setUsername: React.Dispatch<React.SetStateAction<string>>;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

function useContextValue(): ContextValue {
    const [api, setApi] = React.useState<RestEndpointMethodTypes>();
    const [username, setUsername] = React.useState<string>('');

    return React.useMemo(
        () => ({ api, username, setApi, setUsername }),
        [api, username, setApi, setUsername],
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
