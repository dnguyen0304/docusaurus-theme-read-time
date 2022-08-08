import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';
import * as React from 'react';
import { ReactContextError } from './errors';

interface User {
    readonly username: string;
    readonly emailAddress?: string;
    readonly fullName?: string;
}

interface ContextValue {
    readonly user: User | undefined;
    readonly api: RestEndpointMethodTypes | undefined;
    readonly setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
    readonly setApi: React.Dispatch<React.SetStateAction<RestEndpointMethodTypes | undefined>>;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

function useContextValue(): ContextValue {
    const [user, setUser] = React.useState<User>();
    const [api, setApi] = React.useState<RestEndpointMethodTypes>();

    return React.useMemo(
        () => ({ user, api, setUser, setApi }),
        [user, api, setUser, setApi],
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
