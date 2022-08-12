import type { Plugin } from '@docusaurus/types';
import { GITHUB_AUTHORIZATION_CALLBACK_PATH } from './constants';

export default function themeEditor(): Plugin<void> {
    return {
        name: 'docusaurus-theme-editor',

        getThemePath() {
            return './theme';
        },

        async contentLoaded({ actions: { addRoute } }) {
            addRoute({
                path: GITHUB_AUTHORIZATION_CALLBACK_PATH,
                component: '@theme/Editor/Callback',
                exact: true,
                // TODO(dnguyen0304): See the associated comment for
                // GITHUB_AUTHORIZATION_CALLBACK_PATH.
                strict: true,
            });
        }
    };
}
