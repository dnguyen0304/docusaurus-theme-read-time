import type { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';
import * as React from 'react';
import type { GithubUser } from '../docusaurus-theme-editor';
import { useEditorThemeConfig } from '../utils';
import { ReactContextError } from './errors';

type ContextValue = {
    readonly user?: GithubUser;
    readonly api?: RestEndpointMethods;
    readonly setUser: React.Dispatch<React.SetStateAction<GithubUser | undefined>>;
    readonly setApi: React.Dispatch<React.SetStateAction<RestEndpointMethods | undefined>>;
    readonly authorizationRedirectUrl: string;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

function useContextValue(): ContextValue {
    const [user, setUser] = React.useState<GithubUser>();
    const [api, setApi] = React.useState<RestEndpointMethods>();
    const {
        githubAuthorizationRedirectUrl: authorizationRedirectUrl,
    } = useEditorThemeConfig();

    return React.useMemo(
        () => ({
            user,
            api,
            setUser,
            setApi,
            authorizationRedirectUrl,
        }),
        [
            user,
            api,
            setUser,
            setApi,
            authorizationRedirectUrl,
        ],
    );
}

type Props = {
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
