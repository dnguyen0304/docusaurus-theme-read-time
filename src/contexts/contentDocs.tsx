import { usePluginData } from '@docusaurus/useGlobalData';

// TODO(dnguyen0304): Fix missing type declaration.
// See: https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-plugin-content-docs/src/client/index.ts#L91
export function useContentDocs() {
    return usePluginData('docusaurus-plugin-content-docs');
}
