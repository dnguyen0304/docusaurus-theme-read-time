import type { Plugin } from '@docusaurus/types';

function themeEditor(): Plugin<void> {
    return {
        name: 'docusaurus-theme-editor',

        getThemePath() {
            return './theme';
        },
    };
}

export default themeEditor;