export type LOCAL_STORAGE_KEYS =
    | 'markdown'
    | 'pull_branch_name'
    | 'pull_title'
    | 'pull_url';

// See https://github.com/facebook/docusaurus/blob/01ac2e0fcaccaf469992f93a0e8bf04e61cf850e/packages/docusaurus-utils/src/pathUtils.ts#L93
export const DOCUSAURUS_ALIASED_SITE_PATH_PREFIX: string = '@site';

// Keep in sync:
// GitHub > Developer Settings > OAuth Apps > "Authorization callback URL"
export const SEARCH_PARAM_KEY_AUTH: string = 'auth';
export const SEARCH_PARAM_KEY_LOGGED_IN_AT: string = 'logged_in_at';
export const COOKIE_KEY_SESSION_ID: string = 'session_id';
export const LOCAL_STORAGE_KEY_MARKDOWN: LOCAL_STORAGE_KEYS = 'markdown';
export const LOCAL_STORAGE_KEY_PULL_BRANCH_NAME: LOCAL_STORAGE_KEYS = 'pull_branch_name';
export const LOCAL_STORAGE_KEY_PULL_TITLE: LOCAL_STORAGE_KEYS = 'pull_title';
export const LOCAL_STORAGE_KEY_PULL_URL: LOCAL_STORAGE_KEYS = 'pull_url';
