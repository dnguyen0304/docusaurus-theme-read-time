import * as React from 'react';
import { ReactContextError } from './errors';

// TODO(dnguyen0304): Add lastUpdatedAt.
interface EditorTab {
    pullRequestUrl: string;
}

// aliases: table of contents
interface ContextValue {
    readonly editorIsOpen: boolean;
    readonly activeTab: number | undefined;
    readonly tabs: EditorTab[];
    readonly setEditorIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    readonly setActiveTab: React.Dispatch<React.SetStateAction<number | undefined>>
    readonly setTabs: React.Dispatch<React.SetStateAction<EditorTab[]>>
};

const Context = React.createContext<ContextValue | undefined>(undefined);

function useContextValue(): ContextValue {
    const [editorIsOpen, setEditorIsOpen] = React.useState<boolean>(false);
    const [activeTab, setActiveTab] = React.useState<number | undefined>();
    const [tabs, setTabs] = React.useState<EditorTab[]>([]);

    return React.useMemo(
        () => ({
            editorIsOpen,
            activeTab,
            tabs,
            setEditorIsOpen,
            setActiveTab,
            setTabs,
        }),
        [
            editorIsOpen,
            activeTab,
            tabs,
            setEditorIsOpen,
            setActiveTab,
            setTabs,
        ],
    );
}

interface Props {
    readonly children: React.ReactNode;
};

function EditorProvider({ children }: Props): JSX.Element {
    const value = useContextValue();

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

function useEditor(): ContextValue {
    const context = React.useContext(Context);
    if (context === undefined) {
        throw new ReactContextError('EditorProvider');
    }
    return context;
}

export {
    EditorProvider,
    useEditor,
};
