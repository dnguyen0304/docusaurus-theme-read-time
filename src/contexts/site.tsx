// TODO(dnguyen0304): Fix missing type declarations.
import { useDoc } from '@docusaurus/theme-common/internal';
import { usePluginData } from '@docusaurus/useGlobalData';
import URI from 'urijs';
import { DOCUSAURUS_ALIASED_SITE_PATH_PREFIX } from '../constants';

interface ContextValue {
    readonly owner: string;
    readonly repository: string;
    readonly docsRoot: string;
    readonly path: string;
};

function useSite(): ContextValue {
    // TODO(dnguyen0304): Fix missing type declaration.
    // See: https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-plugin-content-docs/src/client/index.ts#L91
    const { path: docsRoot } = usePluginData('docusaurus-plugin-content-docs');
    const {
        metadata: {
            editUrl,
            source,
        },
    } = useDoc();

    const [siteOwner, siteRepository] = new URI(editUrl).segment();

    return {
        owner: siteOwner,
        repository: siteRepository,
        docsRoot,
        path: source.replace(`${DOCUSAURUS_ALIASED_SITE_PATH_PREFIX}/`, ''),
    }
}

export {
    useSite,
    ContextValue,
};
