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

const getLocalStorageObject = <T,>(
    localStorageKey: string,
    objectKey: keyof T,
): string => {
    const item = localStorage.getItem(localStorageKey);
    if (item === null || item === '') {
        return '';
    }
    const parsed = JSON.parse(item) as T;
    // TODO(dnguyen00304): Investigate type error.
    return parsed[objectKey];
};

const setLocalStorageObject = <T,>(
    localStorageKey: string,
    objectKey: keyof T,
    objectValue: string,
) => {
    let parsed: T = {} as T;

    const item = localStorage.getItem(localStorageKey);
    if (item !== null && item === '') {
        parsed = JSON.parse(item);
    }

    // TODO(dnguyen00304): Investigate type error.
    parsed[objectKey] = objectValue;
    localStorage.setItem(localStorageKey, JSON.stringify(parsed));
};

const clearLocalStorageObject = <T,>(
    localStorageKey: string,
    objectKey: keyof T,
) => {
    const item = localStorage.getItem(localStorageKey);
    if (item === null || item === '') {
        return;
    }
    setLocalStorageObject(localStorageKey, objectKey, '');
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
    clearLocalStorageObject,
    getLocalStorageKey,
    getLocalStorageObject,
    setLocalStorageObject,
    useRefMeasure,
};
