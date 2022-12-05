// TODO(dnguyen0304): Investigate referencing @docusaurus/module-type-aliases.
/// <reference types="@docusaurus/theme-classic" />

declare module '@docusaurus/types' {
    interface ThemeConfig {
        docupotamusReadTime: DocupotamusThemeConfig;
    }
}

declare module '@theme-init/DocPage/Layout/Main' {
    import DocPageLayoutMain from '@theme/DocPage/Layout/Main';

    export default DocPageLayoutMain;
}

declare module '@theme-init/Layout/Provider' {
    import LayoutProvider from '@theme/Layout/Provider';

    export default LayoutProvider;
}

export type DocupotamusThemeConfig = {
    workbenchIsOpen: boolean;
};
