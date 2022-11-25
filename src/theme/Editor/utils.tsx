import * as React from 'react';

export const useRefMeasure = <T extends HTMLElement>(
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
