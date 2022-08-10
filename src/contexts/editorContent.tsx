import * as React from 'react';
import { ReactContextError } from './errors';

// TODO(dnguyen0304): Import from docusaurus-plugin-editor.
interface EditorContent {
    [key: string]: string;
}

interface ContextValue {
    readonly editorContent: EditorContent;
    readonly setEditorContent: React.Dispatch<React.SetStateAction<EditorContent>>;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

function useContextValue(content: EditorContent): ContextValue {
    const [editorContent, setEditorContent] =
        React.useState<EditorContent>(content);

    return React.useMemo(
        () => ({ editorContent, setEditorContent }),
        [editorContent, setEditorContent],
    );
}

interface Props {
    readonly content: EditorContent;
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
