// TODO(dnguyen0304): Fix missing type declarations.
import { useDoc } from '@docusaurus/theme-common/internal';
import URI from 'urijs';
import { DOCUSAURUS_ALIASED_SITE_PATH_PREFIX } from '../constants';

interface ContextValue {
    readonly owner: string;
    readonly repository: string;
    readonly path: string;
};

function useSite(): ContextValue {
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
        path: source.replace(`${DOCUSAURUS_ALIASED_SITE_PATH_PREFIX}/`, ''),
    }
}

export {
    useSite,
    ContextValue,
};
