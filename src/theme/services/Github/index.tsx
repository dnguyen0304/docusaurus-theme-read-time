import { Octokit } from '@octokit/core';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';
import type { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';
import { RequestError } from '@octokit/request-error';
import { encode } from 'js-base64';
import Cookies from 'universal-cookie';
import URI from 'urijs';
import {
    ENDPOINT_EXCHANGE_CODE_TO_TOKEN,
    GITHUB_AUTHORIZATION_CALLBACK_PATH
} from '../../../constants';
import type { ContextValue as GithubContextValue } from '../../../contexts/github';
import type { ContextValue as SiteContextValue } from '../../../contexts/site';
import type { GithubUser } from '../../../docusaurus-theme-editor';

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
    readonly getUser: () => GithubUser;
    readonly getApi: () => RestEndpointMethods;
    readonly createBranch: (name: string) => Promise<void>;
    readonly createCommit: (content: string, message: string) => Promise<void>;
    readonly createPull: (title: string) => Promise<string>;
}

// TODO(dnguyen0304): Extract as a configuration option.
const APP_CLIENT_ID: string = 'ce971b93f5383248a42b';
const GITHUB_AUTHORIZATION_CODE_URL: string =
    'https://github.com/login/oauth/authorize';
const GITHUB_AUTHORIZATION_SCOPES: string = ['repo'].join(' ');
const GITHUB_REF_PREFIX = 'refs/heads/';
const COOKIE_SESSION_ID_KEY: string = 'sessionid';

export const initializeAuth = async (
    githubContext: GithubContextValue,
    siteContext: SiteContextValue,
    currentPath: string,
): Promise<{
    authRedirectUrl: string,
    github: GithubType | undefined,
}> => {
    const {
        user: existingUser,
        api: existingApi,
        setUser,
        setApi,
    } = githubContext;

    if (existingUser && existingApi) {
        return {
            authRedirectUrl: '',
            github: Github(
                {
                    user: existingUser,
                    api: existingApi,
                },
                siteContext,
            ),
        };
    }

    const cookies = new Cookies();
    const accessToken = cookies.get(COOKIE_SESSION_ID_KEY);
    if (accessToken) {
        const newAuth = await doAuthenticate(accessToken);

        setUser(newAuth.user)
        setApi(newAuth.api)

        return {
            authRedirectUrl: '',
            github: Github(
                {
                    user: newAuth.user,
                    api: newAuth.api,
                },
                siteContext,
            ),
        };
    }

    const authRedirectUrl = (
        new URI(GITHUB_AUTHORIZATION_CODE_URL)
            .query({
                client_id: APP_CLIENT_ID,
                scope: GITHUB_AUTHORIZATION_SCOPES,
                redirect_uri:
                    new URI().path(GITHUB_AUTHORIZATION_CALLBACK_PATH),
                state: currentPath,
            })
            .toString()
    );
    return {
        authRedirectUrl,
        github: undefined,
    };
};

export const parseCallbackUrl = (url: URI): ParseCallbackUrlType => {
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

export const authenticate = async (
    authorizationCode: string,
    cookiePath: string,
): Promise<AuthenticateType> => {
    const cookies = new Cookies();

    // TODO(dnguyen0304): Implement exchanging session ID for access token.
    let accessToken = cookies.get(COOKIE_SESSION_ID_KEY);
    if (!accessToken) {
        try {
            ({ accessToken } =
                await exchangeCodeToToken(authorizationCode));
        } catch (error) {
            throw new Error(
                `Failed to exchange code for token: ${error.message}.`
            );
        }
    }

    cookies.set(
        COOKIE_SESSION_ID_KEY,
        accessToken,
        {
            path: cookiePath,
            maxAge: 28 * 24 * 60 * 60,  // 28 days in seconds
            secure: true,
        },
    );

    return doAuthenticate(accessToken);
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

const doAuthenticate = async (
    accessToken: string,
): Promise<AuthenticateType> => {
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
            // TODO(dnguyen0304): Implement NavbarItem/ComponentTypes
            // accessible through useThemeConfig for login avatar.
            // avatar_url: avatarUrl,
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
}

export default function Github(
    githubContext: AuthenticateType,
    siteContext: SiteContextValue,
): GithubType {
    const {
        user,
        api,
    } = githubContext;
    const {
        owner,
        repository,
        path,
    } = siteContext;

    let defaultBranch = '';
    let branchName = '';
    let commitExists = false;

    const getDefaultBranch = async (): Promise<string> => {
        if (!defaultBranch) {
            const {
                data: {
                    default_branch: siteDefaultBranch,
                }
            } = await api?.repos.get({
                owner,
                repo: repository,
            });
            defaultBranch = siteDefaultBranch;
        }
        return defaultBranch;
    };

    const getUser = (): GithubUser => {
        return user;
    };

    const getApi = (): RestEndpointMethods => {
        return api;
    };

    const createBranch = async (name: string): Promise<void> => {
        if (branchName) {
            throw new Error(`branch "${branchName}" already exists`);
        }
        if (!defaultBranch) {
            await getDefaultBranch();
        }

        const {
            // TODO(dnguyen0304): Fix missing type declaration.
            data: {
                commit: {
                    sha,
                },
            },
        } = await api?.repos.getBranch({
            owner,
            repo: repository,
            branch: defaultBranch,
        });

        try {
            await api?.git.createRef({
                owner,
                repo: repository,
                sha,
                ref: `${GITHUB_REF_PREFIX}${name}`,
            });
        } catch (error) {
            if (
                error.name === 'HttpError'
                && error.message === 'Reference already exists'
            ) {
                throw new Error(`branch "${name}" already exists`);
            }
        }

        branchName = name;
    }

    const createCommit = async (content: string, message: string) => {
        if (!branchName) {
            throw new Error('branch not found');
        }

        const {
            // TODO(dnguyen0304): Fix missing type declaration.
            data: {
                sha: contentSha,
            },
        } = await api?.repos.getContent({
            owner,
            repo: repository,
            path: path,
            ref: `${GITHUB_REF_PREFIX}${branchName}`,
        });

        await api?.repos.createOrUpdateFileContents({
            owner,
            repo: repository,
            branch: branchName,
            path: path,
            sha: contentSha,
            content: encode(content),
            message,
        });

        commitExists = true;
    };

    const createPull = async (title: string): Promise<string> => {
        if (!commitExists) {
            throw new Error('commits not found');
        }

        const {
            // TODO(dnguyen0304): Fix missing type declaration.
            data: {
                html_url,
            },
        } = await api?.pulls.create({
            owner,
            repo: repository,
            base: defaultBranch,
            head: `${user?.username}:${branchName}`,
            title: title,
        });

        return html_url;
    };

    return {
        getUser,
        getApi,
        createBranch,
        createCommit,
        createPull,
    };
}
