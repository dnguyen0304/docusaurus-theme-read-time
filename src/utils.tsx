import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type { LOCAL_STORAGE_KEYS } from './constants';
import { ContextValue } from './contexts/site';
import type { EditorThemeConfig } from './docusaurus-theme-editor';

export function useEditorThemeConfig(): EditorThemeConfig {
    return (
        useDocusaurusContext()
            .siteConfig
            .themeConfig
            .editor
    ) as EditorThemeConfig;
}

export function getLocalStorageKey(
    {
        owner,
        repository,
        path,
    }: ContextValue,
    key: LOCAL_STORAGE_KEYS,
): string {
    return `${owner}/${repository}/${path}/${key}`;
};
