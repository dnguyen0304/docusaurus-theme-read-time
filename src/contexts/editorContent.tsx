import * as React from 'react';
import { ReactContextError } from './errors';

interface ContextValue {
    readonly editorContent: string;
    readonly setEditorContent: React.Dispatch<React.SetStateAction<string>>;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

function useContextValue(content: string): ContextValue {
    const [editorContent, setEditorContent] = React.useState<string>(content);

    return React.useMemo(
        () => ({ editorContent, setEditorContent }),
        [editorContent, setEditorContent],
    );
}

interface Props {
    readonly content: string;
    readonly children: React.ReactNode;
};

function EditorContentProvider(
    {
        content,
        children,
    }: Props
): JSX.Element {
    const value = useContextValue(content);

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

function useEditorContent(): ContextValue {
    const context = React.useContext(Context);
    if (context === undefined) {
        throw new ReactContextError('EditorContentProvider');
    }
    return context;
}

export {
    EditorContentProvider,
    useEditorContent,
};
