import URI from 'urijs';
import { GITHUB_AUTHORIZATION_CALLBACK_PATH } from '../../../constants';

export interface GithubType {
    initializeAuth: (currentPath: string) => Promise<string>;
}

// TODO(dnguyen0304): Extract as a configuration option.
const APP_CLIENT_ID: string = 'ce971b93f5383248a42b';
const GITHUB_AUTHORIZATION_CODE_URL: string =
    'https://github.com/login/oauth/authorize';
const GITHUB_AUTHORIZATION_SCOPES: string = ['repo'].join(' ');

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

    return {
        initializeAuth,
    };
}