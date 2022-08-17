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
    useRefMeasure,
};
