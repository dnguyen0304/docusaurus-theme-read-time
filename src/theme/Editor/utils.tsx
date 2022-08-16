import * as React from 'react';
import { ContextValue } from '../../contexts/site';

const getLocalStorageKey = (
    {
        owner,
        repository,
        path,
    }: ContextValue
): string => {
    return `${owner}/${repository}/${path}`;
};

const removeLocalStorageObject = <T,>(
    localStorageKey: string,
    objectKey: keyof T,
) => {
    const pull = localStorage.getItem(localStorageKey);
    if (pull === null || pull === '') {
        return
    }
    const parsed = JSON.parse(pull) as T;
    // TODO(dnguyen00304): Investigate type error.
    parsed[objectKey] = '';
    localStorage.setItem(localStorageKey, JSON.stringify(parsed));
};

const useRefMeasure = <T extends HTMLElement>(
    callback: (clientRect: DOMRect) => number,
    deps: ReadonlyArray<unknown> = [],
) => {
    const [measure, setMeasure] = React.useState<number | undefined>();

    const measureRef = React.useCallback((node: T) => {
        if (node !== null) {
            setMeasure(callback(node.getBoundingClientRect()));
        }
    }, deps);

    return [measure, measureRef];
};

export {
    getLocalStorageKey,
    removeLocalStorageObject,
    useRefMeasure,
};
