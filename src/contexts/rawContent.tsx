import * as React from 'react';
import { ReactContextError } from './errors';

// TODO(dnguyen0304): Import from docusaurus-plugin-editor.
interface RawContent {
    [key: string]: string;
}

interface ContextValue {
    readonly rawContent: RawContent;
    readonly setRawContent: React.Dispatch<React.SetStateAction<RawContent>>;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

function useContextValue(content: RawContent): ContextValue {
    const [rawContent, setRawContent] = React.useState<RawContent>(content);

    return React.useMemo(
        () => ({ rawContent, setRawContent }),
        [rawContent, setRawContent],
    );
}

interface Props {
    readonly rawContent: RawContent;
    readonly children: React.ReactNode;
};

export function RawContentProvider(
    {
        rawContent,
        children,
    }: Props
): JSX.Element {
    const value = useContextValue(rawContent);

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export function useRawContent(): ContextValue {
    const context = React.useContext(Context);
    if (context === undefined) {
        throw new ReactContextError('RawContentProvider');
    }
    return context;
}
