import type { Plugin } from '@docusaurus/types';

// TODO(dnguyen0304): Fix missing LoadedContent type declaration.
export default function themeReadTime(): Plugin<undefined> {
    return {
        name: 'docusaurus-theme-read-time',

        getThemePath() {
            return './theme';
        },
    };
};

export { validateThemeConfig } from './validateThemeConfig';
