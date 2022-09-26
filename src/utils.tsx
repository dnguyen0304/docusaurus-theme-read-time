import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type { LOCAL_STORAGE_KEYS } from './constants';
import { ContextValue } from './contexts/site';

type EditorThemeConfig = {
    githubAuthorizationRedirectUrl: string;
};

function useEditorThemeConfig(): EditorThemeConfig {
    return (
        useDocusaurusContext()
            .siteConfig
            .themeConfig
            .editor
    ) as EditorThemeConfig;
}

const getLocalStorageKey = (
    {
        owner,
        repository,
        path,
    }: ContextValue,
    key: LOCAL_STORAGE_KEYS,
): string => {
    return `${owner}/${repository}/${path}/${key}`;
};

export {
    getLocalStorageKey,
    useEditorThemeConfig,
};
