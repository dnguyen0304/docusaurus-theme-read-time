import type { LOCAL_STORAGE_KEYS } from './constants';
import { ContextValue } from './contexts/site';

const getLocalStorageKey = (
    {
        owner,
        repository,
        path,
    }: ContextValue,
    key: LOCAL_STORAGE_KEYS,
): string => {
    return `${owner}/${repository}/${path}/${key}`;
};

export {
    getLocalStorageKey,
};
