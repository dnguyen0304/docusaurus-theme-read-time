import { useLocation as useDocusaurusLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type ContextValue = {
    readonly currentPath: string;
};

function useLocation(): ContextValue {
    const {
        siteConfig: {
            trailingSlash,
        },
    } = useDocusaurusContext();
    const { pathname } = useDocusaurusLocation();
    return {
        currentPath: trailingSlash ? pathname.slice(0, -1) : pathname,
    };
}

export {
    useLocation,
};
