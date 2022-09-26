import { Octokit } from '@octokit/core';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';
import type { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';
import { RequestError } from '@octokit/request-error';
import { encode } from 'js-base64';
import Cookies from 'universal-cookie';
import URI from 'urijs';
import { COOKIE_KEY_SESSION_ID } from '../../../constants';
import type { ContextValue as GithubContextValue } from '../../../contexts/github';
import type { ContextValue as SiteContextValue } from '../../../contexts/site';
import type {
    GithubPullStatus,
    GithubUser,
    InternalGithubState
} from '../../../docusaurus-theme-editor';

interface AuthenticateType {
    user: GithubUser;
    api: RestEndpointMethods;
}

interface GithubType {
    readonly getUser: () => GithubUser;
    readonly createBranch: (name: string) => Promise<void>;
    readonly createCommit: (
        content: string,
        message: string,
        branchName?: string,
        pullUrl?: string,
    ) => Promise<void>;
    readonly checkPullStatus: (pullUrl: string) => Promise<GithubPullStatus>;
    readonly createPull: (title: string) => Promise<string>;
    readonly closePull: (pullUrl: string) => Promise<void>;
}

// TODO(dnguyen0304): Extract as a configuration option.
const APP_CLIENT_ID: string = 'ce971b93f5383248a42b';
const GITHUB_AUTHORIZATION_CODE_URL: string =
    'https://github.com/login/oauth/authorize';
const GITHUB_AUTHORIZATION_SCOPES: string = ['repo'].join(' ');
const GITHUB_REF_PREFIX = 'refs/heads/';

export const initializeAuth = async (
    githubContext: GithubContextValue,
    siteContext: SiteContextValue,
): Promise<{
    authRedirectUrl: string,
    github: GithubType | undefined,
}> => {
    const {
        user: existingUser,
        api: existingApi,
        setUser,
        setApi,
        authorizationRedirectUrl,
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
    const accessToken = cookies.get(COOKIE_KEY_SESSION_ID);
    if (accessToken) {
        try {
            const newAuth = await authenticate(accessToken);

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
        } catch (error) {
            if (error.status === 401) {
                cookies.remove(COOKIE_KEY_SESSION_ID);
                initializeAuth(
                    githubContext,
                    siteContext,
                );
            }
        }
    }

    const authRedirectUrl = (
        new URI(GITHUB_AUTHORIZATION_CODE_URL)
            .query({
                client_id: APP_CLIENT_ID,
                scope: GITHUB_AUTHORIZATION_SCOPES,
                redirect_uri: authorizationRedirectUrl,
                state: new URI(),
            })
            .toString()
    );
    return {
        authRedirectUrl,
        github: undefined,
    };
};

const authenticate = async (
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

const convertToInternalState = (
    state: 'open' | 'closed',
    mergedAt: string | null,
): InternalGithubState => {
    if (state === 'open') {
        return state;
    }
    if (mergedAt) {
        return 'merged';
    } else {
        return 'closed';
    }
};

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
    let _branchName = '';
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

    const getContentSha = async (
        branchName: string,
        pullUrl: string,
    ): Promise<string> => {
        let ref: string = '';

        if (pullUrl) {
            const pullId = new URI(pullUrl).filename();
            if (pullId === '') {
                throw new Error(`failed to parse pull number from ${pullUrl}`);
            }
            ref = `refs/pull/${pullId}/head`;
        } else if (branchName) {
            ref = `${GITHUB_REF_PREFIX}${branchName}`;
        } else {
            throw new Error('branch not found and pull not found');
        }

        const {
            // TODO(dnguyen0304): Fix missing type declaration.
            data: {
                sha,
            },
        } = await api?.repos.getContent({
            owner,
            repo: repository,
            path,
            ref,
        });

        return sha;
    }

    const getUser = (): GithubUser => {
        return user;
    };

    const createBranch = async (name: string): Promise<void> => {
        if (_branchName) {
            throw new Error(`branch "${_branchName}" already exists`);
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
            if (error instanceof RequestError
                && error.status === 422
                && error.message.includes('Reference already exists')
            ) {
                throw new Error(`branch "${name}" already exists`);
            } else {
                throw error;
            }
        }

        _branchName = name;
    }

    const createCommit = async (
        content: string,
        message: string,
        branchName: string = '',
        pullUrl: string = '',
    ) => {
        if (!content) {
            throw new Error(
                `creating a commit with no content is not yet supported`
            );
        }
        const targetBranchName = branchName || _branchName;
        const contentSha = await getContentSha(
            targetBranchName,
            pullUrl,
        );

        try {
            await api?.repos.createOrUpdateFileContents({
                owner,
                repo: repository,
                branch: targetBranchName,
                path,
                sha: contentSha,
                content: encode(content),
                message,
            });
        } catch (error) {
            if (error instanceof RequestError
                && error.status === 409
                && error.message.includes('does not match')
            ) {
                throw new Error(
                    `GitHub API not yet propagated: please try again in ~60 `
                    + `seconds when the content SHA conflict has been `
                    + `resolved: ${error.message}`
                );
            } else {
                throw error;
            }
        }

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
            head: `${user?.username}:${_branchName}`,
            title,
        });

        return html_url;
    };

    const checkPullStatus = async (pullUrl: string): Promise<GithubPullStatus> => {
        const pullId = new URI(pullUrl).filename();

        if (pullId === '') {
            throw new Error(`failed to parse pull number from ${pullUrl}`);
        }

        const {
            data: {
                state,
                closed_at: closedAt,
                merged_at: mergedAt,
            },
        } = await api?.pulls.get({
            owner,
            repo: repository,
            pull_number: Number(pullId),
        });

        return {
            state: convertToInternalState(state, mergedAt),
            closedAt,
            mergedAt,
        };
    };

    const closePull = async (pullUrl: string): Promise<void> => {
        const pullId = new URI(pullUrl).filename();

        if (pullId === '') {
            throw new Error(`failed to parse pull number from ${pullUrl}`);
        }

        await api?.pulls.update({
            owner,
            repo: repository,
            pull_number: Number(pullId),
            state: 'closed',
        });
    };

    return {
        getUser,
        createBranch,
        createCommit,
        createPull,
        checkPullStatus,
        closePull,
    };
}
