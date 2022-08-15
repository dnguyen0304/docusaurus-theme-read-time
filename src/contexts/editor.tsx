import * as React from 'react';
import { ReactContextError } from './errors';

// TODO(dnguyen0304): Add lastUpdatedAt.
interface EditorTab {
    tabId: number;
    pullRequestUrl: string;
    setPullRequestUrl: (newValue: string) => void;
}

// aliases: table of contents
interface ContextValue {
    readonly editorIsOpen: boolean;
    readonly activeTabId: number;
    readonly tabs: EditorTab[];
    readonly addTab: () => EditorTab;
    readonly setEditorIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    readonly setActiveTabId: React.Dispatch<React.SetStateAction<number>>
    readonly setTabs: React.Dispatch<React.SetStateAction<EditorTab[]>>

    // Lifecycle API
    readonly beforeEditorCloseHooks: { [keys: string]: () => void };
    readonly registerBeforeEditorCloseHook: (hook: () => void, key: string) => void;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

function useContextValue(): ContextValue {
    const [editorIsOpen, setEditorIsOpen] = React.useState<boolean>(false);
    const [activeTabId, setActiveTabId] = React.useState<number>(0);
    const [tabs, setTabs] = React.useState<EditorTab[]>([]);
    const [tabIdCounter, setTabIdCounter] = React.useState<number>(0);

    const [beforeEditorCloseHooks, setBeforeEditorCloseHooks] =
        React.useState<{ [keys: string]: () => void }>({});

    const getNextTabId = (): number => {
        const nextTabId = tabIdCounter;
        setTabIdCounter(nextTabId + 1);
        return nextTabId;
    };

    const addTab = (): EditorTab => {
        const tabId = getNextTabId();
        const setPullRequestUrl = (newValue: string) => {
            setTabs(tabs => tabs.map(tab => {
                if (tab.tabId !== tabId) {
                    return tab;
                }
                return {
                    ...tab,
                    pullRequestUrl: newValue,
                }
            }));
        };
        const newTab = {
            tabId,
            pullRequestUrl: '',
            setPullRequestUrl,
        };

        setTabs(prev => [
            ...prev,
            newTab,
        ]);

        return newTab;
    };

    const registerBeforeEditorCloseHook = (hook: () => void, key: string) => {
        setBeforeEditorCloseHooks(prev => {
            return {
                ...prev,
                key: hook,
            };
        });
    };

    return React.useMemo(
        () => ({
            editorIsOpen,
            activeTabId,
            tabs,
            addTab,
            setEditorIsOpen,
            setActiveTabId,
            setTabs,
            beforeEditorCloseHooks,
            registerBeforeEditorCloseHook,
        }),
        [
            editorIsOpen,
            activeTabId,
            tabs,
            addTab,
            setEditorIsOpen,
            setActiveTabId,
            setTabs,
            beforeEditorCloseHooks,
            registerBeforeEditorCloseHook,
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
    EditorTab,
    useEditor,
};
