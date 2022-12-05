// TODO(dnguyen0304): Investigate referencing @docusaurus/module-type-aliases.
/// <reference types="@docusaurus/theme-classic" />

import type { Props as DocPageLayoutMainProps } from '@theme/DocPage/Layout/Main';
import type { Props as LayoutProviderProps } from '@theme/Layout/Provider';

declare module '@docusaurus/types' {
    interface ThemeConfig {
        docupotamusReadTime: DocupotamusThemeConfig;
    }
}

declare module '@theme-init/DocPage/Layout/Main' {
    interface DocPageLayoutMain {
        (props: DocPageLayoutMainProps): JSX.Element;
    }
}

declare module '@theme-init/Layout/Provider' {
    interface LayoutProvider {
        (props: LayoutProviderProps): JSX.Element;
    }
}

export type DocupotamusThemeConfig = {
    workbenchIsOpen: boolean;
};
