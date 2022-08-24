// See https://github.com/facebook/docusaurus/blob/01ac2e0fcaccaf469992f93a0e8bf04e61cf850e/packages/docusaurus-utils/src/pathUtils.ts#L93
const DOCUSAURUS_ALIASED_SITE_PATH_PREFIX: string = '@site';

// Keep in sync:
// GitHub > Developer Settings > OAuth Apps > "Authorization callback URL"
// TODO(dnguyen0304): Extract as a configuration option.
const GITHUB_AUTHORIZATION_REDIRECT_URL: string = 'https://kgevadn5a2.execute-api.us-east-1.amazonaws.com/production/DocusaurusEditor_handleOAuthRedirect';
const SEARCH_PARAM_KEY_AUTH: string = 'auth';
const SEARCH_PARAM_KEY_IS_LOGGED_IN: string = 'is_logged_in';
const COOKIE_KEY_SESSION_ID: string = 'session_id';
const LOCAL_STORAGE_KEY_PULL: string = 'pull';
const LOCAL_STORAGE_KEY_PULL_BRANCH_NAME: string = 'pull_branch_name';
const LOCAL_STORAGE_KEY_PULL_TITLE: string = 'pull_title';
const LOCAL_STORAGE_KEY_PULL_URL: string = 'pull_url';

export {
    COOKIE_KEY_SESSION_ID,
    DOCUSAURUS_ALIASED_SITE_PATH_PREFIX,
    GITHUB_AUTHORIZATION_REDIRECT_URL,
    LOCAL_STORAGE_KEY_PULL_BRANCH_NAME,
    LOCAL_STORAGE_KEY_PULL_TITLE,
    LOCAL_STORAGE_KEY_PULL_URL,
    LOCAL_STORAGE_KEY_PULL,
    SEARCH_PARAM_KEY_AUTH,
    SEARCH_PARAM_KEY_IS_LOGGED_IN,
};
