import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type { LOCAL_STORAGE_KEYS } from './constants';
import { ContextValue } from './contexts/site';

type EditorThemeConfig = {
    githubAuthorizationRedirectUrl: string;
};

type DocupotamusThemeConfig = {
    readTime: {
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

function getViewportHeight(): number {
    if (!ExecutionEnvironment.canUseDOM) {
        return 0;
    }
    return Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0,
    );
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
    getViewportHeight,
    useEditorThemeConfig,
};
