import * as React from 'react';
import { GithubPull } from '../docusaurus-theme-editor';
import { ReactContextError } from './errors';

// TODO(dnguyen0304): Support setState setStatefunctional updates.
// TODO(dnguyen0304): Add markdown and setMarkdown.
// TODO(dnguyen0304): Add lastUpdatedAt.
interface EditorTab {
    tabId: number;
    pull?: GithubPull;
    setPull: (newValue: GithubPull) => void;
    pullTitle: string;
    setPullTitle: (newValue: string) => void;
    // TODO(dnguyen0304): Investigate moving URL into GithubPull.
    pullUrl: string;
    setPullUrl: (newValue: string) => void;
    pullBranchName: string;
    setPullBranchName: (newValue: string) => void;
}

interface AddTabProps {
    pullTitle: string;
    pullUrl: string;
    pullBranchName: string;
}

// aliases: table of contents
interface ContextValue {
    readonly editorIsOpen: boolean;
    readonly activeTabId: number;
    readonly tabs: EditorTab[];
    readonly addTab: (props: AddTabProps) => EditorTab;
    readonly setEditorIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    readonly setActiveTabId: React.Dispatch<React.SetStateAction<number>>
    readonly setTabs: React.Dispatch<React.SetStateAction<EditorTab[]>>
};

const Context = React.createContext<ContextValue | undefined>(undefined);

function useContextValue(): ContextValue {
    const [editorIsOpen, setEditorIsOpen] = React.useState<boolean>(false);
    const [activeTabId, setActiveTabId] = React.useState<number>(0);
    const [tabs, setTabs] = React.useState<EditorTab[]>([]);
    const [tabIdCounter, setTabIdCounter] = React.useState<number>(0);

    const getNextTabId = (): number => {
        const nextTabId = tabIdCounter;
        setTabIdCounter(nextTabId + 1);
        return nextTabId;
    };

    const addTab = (
        {
            pullTitle = '',
            pullUrl = '',
            pullBranchName = '',
        }: AddTabProps
    ): EditorTab => {
        const tabId = getNextTabId();
        // TODO(dnguyen0304): Refactor duplicated code.
        const setPull = (newValue: GithubPull) => {
            setTabs(tabs => tabs.map(tab => {
                if (tab.tabId !== tabId) {
                    return tab;
                }
                return {
                    ...tab,
                    pull: newValue,
                }
            }));
        };
        const setPullTitle = (newValue: string) => {
            setTabs(tabs => tabs.map(tab => {
                if (tab.tabId !== tabId) {
                    return tab;
                }
                return {
                    ...tab,
                    pullTitle: newValue,
                }
            }));
        };
        const setPullUrl = (newValue: string) => {
            setTabs(tabs => tabs.map(tab => {
                if (tab.tabId !== tabId) {
                    return tab;
                }
                return {
                    ...tab,
                    pullUrl: newValue,
                }
            }));
        };
        const setPullBranchName = (newValue: string) => {
            setTabs(tabs => tabs.map(tab => {
                if (tab.tabId !== tabId) {
                    return tab;
                }
                return {
                    ...tab,
                    pullBranchName: newValue,
                }
            }));
        };
        const newTab = {
            tabId,
            setPull,
            pullTitle,
            setPullTitle,
            pullUrl,
            setPullUrl,
            pullBranchName,
            setPullBranchName,
        };

        setTabs(prev => [
            ...prev,
            newTab,
        ]);

        return newTab;
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
        }),
        [
            editorIsOpen,
            activeTabId,
            tabs,
            addTab,
            setEditorIsOpen,
            setActiveTabId,
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
    EditorTab,
    useEditor,
};
