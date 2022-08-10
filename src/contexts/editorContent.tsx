import * as React from 'react';
import { ReactContextError } from './errors';

// TODO(dnguyen0304): Add lastUpdatedAt.
interface EditorTab {
    pullRequestUrl: string;
}

// TODO(dnguyen0304): Import from docusaurus-plugin-editor.
interface EditorContent {
    [key: string]: string;
}

interface ContextValue {
    readonly editorTabs: EditorTab[];
    readonly editorContent: EditorContent;
    readonly setEditorTabs: React.Dispatch<React.SetStateAction<EditorTab[]>>
    readonly setEditorContent: React.Dispatch<React.SetStateAction<EditorContent>>;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

function useContextValue(content: EditorContent): ContextValue {
    const [editorTabs, setEditorTabs] = React.useState<EditorTab[]>([]);
    const [editorContent, setEditorContent] =
        React.useState<EditorContent>(content);

    return React.useMemo(
        () => ({ editorTabs, editorContent, setEditorTabs, setEditorContent }),
        [editorTabs, editorContent, setEditorTabs, setEditorContent],
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
