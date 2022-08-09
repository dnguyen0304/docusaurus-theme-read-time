import { Octokit } from '@octokit/core';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';
import { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';
import { RequestError } from '@octokit/request-error';
import Cookies from 'universal-cookie';
import URI from 'urijs';
import {
    ENDPOINT_EXCHANGE_CODE_TO_TOKEN,
    GITHUB_AUTHORIZATION_CALLBACK_PATH
} from '../../../constants';
import { GithubUser } from '../../../docusaurus-theme-editor';

interface ParseCallbackUrlType {
    authorizationCode: string;
    redirectPath: string;
}

interface AuthenticateType {
    user: GithubUser;
    api: RestEndpointMethods;
}

interface GetAccessTokenResponse {
    accessToken: string;
}

interface GithubType {
    initializeAuth: (currentPath: string) => Promise<string>;
    parseCallbackUrl: (url: URI) => ParseCallbackUrlType;
    authenticate: (
        authorizationCode: string,
        cookiePath: string,
    ) => Promise<AuthenticateType>;
}

// TODO(dnguyen0304): Extract as a configuration option.
const APP_CLIENT_ID: string = 'ce971b93f5383248a42b';
const GITHUB_AUTHORIZATION_CODE_URL: string =
    'https://github.com/login/oauth/authorize';
const GITHUB_AUTHORIZATION_SCOPES: string = ['repo'].join(' ');
const COOKIE_SESSION_ID_KEY: string = 'sessionid';

export default function Github(): GithubType {
    const initializeAuth = async (currentPath: string): Promise<string> => {
        const authRedirectUrl =
            new URI(GITHUB_AUTHORIZATION_CODE_URL)
                .query({
                    client_id: APP_CLIENT_ID,
                    scope: GITHUB_AUTHORIZATION_SCOPES,
                    redirect_uri:
                        new URI().path(GITHUB_AUTHORIZATION_CALLBACK_PATH),
                    state: currentPath,
                })
                .toString();
        return authRedirectUrl;
    };

    const parseCallbackUrl = (url: URI): ParseCallbackUrlType => {
        const { code, state } = URI.parseQuery(url.query());
        if (!code || !state) {
            // TODO(dnguyen0304): Add error handling.
            return {
                authorizationCode: '',
                redirectPath: '',
            };
        }
        return {
            authorizationCode: code,
            redirectPath: state,
        };
    };

    const authenticate = async (
        authorizationCode: string,
        cookiePath: string,
    ): Promise<AuthenticateType> => {
        let accessToken: string;
        try {
            ({ accessToken } = await exchangeCodeToToken(authorizationCode));
        } catch (error) {
            throw new Error(
                `Failed to exchange code for token: ${error.message}.`
            );
        }

        const cookies = new Cookies();
        cookies.set(
            COOKIE_SESSION_ID_KEY,
            // TODO(dnguyen0304): Implement exchanging session ID for access
            // token.
            accessToken,
            {
                path: cookiePath,
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
                login: username,
                email: emailAddress,
                name: fullName,
            },
        } = await api.users.getAuthenticated();

        return {
            user: {
                username,
                ...emailAddress && { emailAddress },
                ...fullName && { fullName },
            },
            api,
        };
    };

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

    return {
        initializeAuth,
        parseCallbackUrl,
        authenticate,
    };
}
