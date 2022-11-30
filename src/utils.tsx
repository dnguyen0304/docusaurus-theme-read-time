import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type { DocupotamusThemeConfig } from './docusaurus-theme-editor';

export function useDocupotamusThemeConfig(): DocupotamusThemeConfig {
    return (
        useDocusaurusContext()
            .siteConfig
            .themeConfig
            .docupotamus
    ) as DocupotamusThemeConfig;
}
