import { ContextValue } from '../../contexts/site';

export const getLocalStorageKey = (
    {
        owner,
        repository,
        path,
    }: ContextValue
): string => {
    return `${owner}/${repository}/${path}`;
}
