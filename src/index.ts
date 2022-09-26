import type { Plugin } from '@docusaurus/types';

export default function themeEditor(): Plugin<undefined> {
    return {
        name: 'docusaurus-theme-editor',

        getThemePath() {
            return './theme';
        },
    };
}