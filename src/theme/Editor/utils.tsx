import * as React from 'react';
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

export const useRefMeasure = <T extends HTMLElement>(
    callback: (clientRect: DOMRect) => number
) => {
    const [measure, setMeasure] = React.useState<number | undefined>();

    const measureRef = React.useCallback((node: T) => {
        if (node !== null) {
            setMeasure(callback(node.getBoundingClientRect()));
        }
    }, []);

    return [measure, measureRef];
}
