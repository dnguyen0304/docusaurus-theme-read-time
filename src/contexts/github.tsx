import type { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';
import * as React from 'react';
import type { GithubUser } from '../docusaurus-theme-editor';
import { ReactContextError } from './errors';

interface ContextValue {
    readonly user: GithubUser | undefined;
    readonly api: RestEndpointMethods | undefined;
    readonly setUser: React.Dispatch<React.SetStateAction<GithubUser | undefined>>;
    readonly setApi: React.Dispatch<React.SetStateAction<RestEndpointMethods | undefined>>;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

function useContextValue(): ContextValue {
    const [user, setUser] = React.useState<GithubUser>();
    const [api, setApi] = React.useState<RestEndpointMethods>();

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
    ContextValue,
};
