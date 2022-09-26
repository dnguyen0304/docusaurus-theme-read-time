import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type EditorThemeConfig = {
    githubAuthorizationRedirectUrl: string;
};

export function useEditorThemeConfig(): EditorThemeConfig {
    return (
        useDocusaurusContext()
            .siteConfig
            .themeConfig
            .editor
    ) as EditorThemeConfig;
}