import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type { LOCAL_STORAGE_KEYS } from './constants';
import { ContextValue } from './contexts/site';

// TODO: Extract to a centralized location to facilitate maintenance.
type EditorThemeConfig = {
    githubAuthorizationRedirectUrl: string;
};

// TODO: Extract to a centralized location to facilitate maintenance.
type DocupotamusThemeConfig = {
    readTime: {
        contentRootSelector: string;
        contentSelector: string;
        debug: {
            band: {
                isEnabled: boolean;
                colors: string[];
            };
            border: {
                isEnabled: boolean;
            };
        };
    };
};

function useEditorThemeConfig(): EditorThemeConfig {
    return (
        useDocusaurusContext()
            .siteConfig
            .themeConfig
            .editor
    ) as EditorThemeConfig;
}

function getLocalStorageKey(
    {
        owner,
        repository,
        path,
    }: ContextValue,
    key: LOCAL_STORAGE_KEYS,
): string {
    return `${owner}/${repository}/${path}/${key}`;
};

export {
    DocupotamusThemeConfig,
    EditorThemeConfig,
    getLocalStorageKey,
    useEditorThemeConfig,
};
