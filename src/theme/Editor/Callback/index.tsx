import { Redirect } from '@docusaurus/router';
import { usePluginData } from '@docusaurus/useGlobalData';
import { Octokit } from '@octokit/core';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';
import { RequestError } from '@octokit/request-error';
import * as React from 'react';
import Cookies from 'universal-cookie';
import URI from 'urijs';
import { ENDPOINT_EXCHANGE_CODE_TO_TOKEN } from '../../../constants';
import { useGithub } from '../../../contexts/github';

interface GetAccessTokenResponse {
    accessToken: string;
}

export default function Callback(): JSX.Element | null {
    const { path: docsPath } = usePluginData('docusaurus-plugin-content-docs');
    const { user, setUser, setApi } = useGithub();

    const [redirectPath, setRedirectPath] = React.useState<string>('');

    const exchangeCodeToToken = async (
        authorizationCode: string,
    ): Promise<GetAccessTokenResponse> => {
        const rawResponse = await fetch(
            ENDPOINT_EXCHANGE_CODE_TO_TOKEN,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ authorizationCode }),
            });
        if (rawResponse.status === 400) {
            throw new Error(await rawResponse.text())
        }
        return rawResponse.json();
    };

    const getAuthenticatedUser = async (authorizationCode: string) => {
        let accessToken: string;
        try {
            ({ accessToken } = await exchangeCodeToToken(authorizationCode));
        } catch (error) {
            throw new Error(
                `Failed to exchange code for token: ${error.message}`
            );
        }

        const cookies = new Cookies();
        cookies.set(
            'sessionid',
            // TODO(dnguyen0304): Implement exchanging session ID for access
            // token.
            accessToken,
            {
                path: docsPath,
                maxAge: 28 * 24 * 60 * 60,  // 28 days in seconds
                secure: true,
            },
        );

        const OctokitRest = Octokit.plugin(restEndpointMethods);
        const { hook, rest: api } = new OctokitRest({ auth: accessToken });

        // TODO(dnguyen0304): Investigate naming convention for hooks.
        hook.error('request', async (error) => {
            if (error instanceof RequestError && error.status === 403) {
                // TODO(dnguyen0304): Add error handling.
                console.log(error);
            } else {
                throw error;
            }
        });

        const {
            data: {
                email: emailAddress,
                login: username,
                name: fullName,
            },
        } = await api.users.getAuthenticated();

        setUser({
            username,
            ...emailAddress && { emailAddress },
            ...fullName && { fullName },
        });
        setApi(api);
    };

    React.useEffect(() => {
        const url = new URI();
        const { code, state } = URI.parseQuery(url.query());
        if (!code || !state) {
            // TODO(dnguyen0304): Add error handling.
            return;
        }
        getAuthenticatedUser(code);
        setRedirectPath(state);
    }, []);

    return (
        user
            ? <Redirect to={redirectPath} />
            // TODO(dnguyen0304): Add page for "Please wait while you are being
            // redirected" to improve the UX.
            : null
    );
}
