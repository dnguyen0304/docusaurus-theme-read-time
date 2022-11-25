import * as React from 'react';
import {
    LOCAL_STORAGE_KEY_PULL_BRANCH_NAME,
    LOCAL_STORAGE_KEY_PULL_TITLE,
    LOCAL_STORAGE_KEY_PULL_URL
} from '../constants';
import {
    GithubPullStatus,
    LOCAL_STORAGE_KEYS
} from '../docusaurus-theme-editor';
import { getLocalStorageKey } from '../utils';
import { ReactContextError } from './errors';
import { ContextValue as SiteContextValue } from './site';

// TODO(dnguyen0304): Add function overloading when not including local storage.
type TabSetter = (
    newValue: string,
    includeLocalStorage: boolean,
    siteContext: SiteContextValue,
) => void;

// TODO(dnguyen0304): Investigate refactoring to useReducer, which supports
//   functional updates (unconfirmed requirement).
// TODO(dnguyen0304): Add markdown and setMarkdown.
// TODO(dnguyen0304): Add lastUpdatedAt.
export type EditorTab = {
    readonly tabId: number;
    readonly pullTitle: string;
    readonly pullUrl: string;
    readonly pullBranchName: string;
    readonly pullStatus?: GithubPullStatus;
    readonly setPullTitle: TabSetter;
    readonly setPullUrl: TabSetter;
    readonly setPullBranchName: TabSetter;
    readonly setPullStatus: (newValue: GithubPullStatus) => void;
}

type AddTabProps = {
    readonly pullTitle: string;
    readonly pullUrl: string;
    readonly pullBranchName: string;
}

type ContextValue = {
    readonly editorIsOpen: boolean;
    readonly activeTabId: number;
    readonly tabs: EditorTab[];
    readonly addTab: (props: AddTabProps) => EditorTab;
    readonly setEditorIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    readonly setActiveTabId: React.Dispatch<React.SetStateAction<number>>
};

const Context = React.createContext<ContextValue | undefined>(undefined);

function useContextValue(): ContextValue {
    const [editorIsOpen, setEditorIsOpen] = React.useState<boolean>(false);
    const [activeTabId, setActiveTabId] = React.useState<number>(0);
    const [tabs, setTabs] = React.useState<EditorTab[]>([]);
    const [tabIdCounter, setTabIdCounter] = React.useState<number>(0);

    const addTab = (
        {
            pullTitle = '',
            pullUrl = '',
            pullBranchName = '',
        }: AddTabProps
    ): EditorTab => {
        // Get the next tab ID.
        const tabId = tabIdCounter;
        setTabIdCounter(prev => prev + 1);

        const createSetter = (
            objectKey: string,
            localStorageKey: LOCAL_STORAGE_KEYS,
        ): TabSetter => {
            const setter = (
                newValue: string,
                includeLocalStorage: boolean,
                siteContext: SiteContextValue,
            ) => {
                setTabs(tabs => tabs.map(tab => {
                    if (tab.tabId !== tabId) {
                        return tab;
                    }
                    return {
                        ...tab,
                        [objectKey]: newValue,
                    }
                }));
                if (includeLocalStorage) {
                    const key =
                        getLocalStorageKey(siteContext, localStorageKey);
                    if (newValue) {
                        localStorage.setItem(key, newValue);
                    } else {
                        localStorage.removeItem(key);
                    }
                }
            };
            return setter;
        };
        // TODO(dnguyen0304): Refactor duplicated code.
        const setPullStatus = (newValue: GithubPullStatus) => {
            setTabs(tabs => tabs.map(tab => {
                if (tab.tabId !== tabId) {
                    return tab;
                }
                return {
                    ...tab,
                    pullStatus: newValue,
                }
            }));
        };
        const newTab = {
            tabId,
            pullTitle,
            pullUrl,
            pullBranchName,
            setPullTitle:
                createSetter('pullTitle', LOCAL_STORAGE_KEY_PULL_TITLE),
            setPullUrl:
                createSetter('pullUrl', LOCAL_STORAGE_KEY_PULL_URL),
            setPullBranchName:
                createSetter('pullBranchName', LOCAL_STORAGE_KEY_PULL_BRANCH_NAME),
            setPullStatus,
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
        }),
        [
            editorIsOpen,
            activeTabId,
            tabs,
            addTab,
            setEditorIsOpen,
            setActiveTabId,
        ],
    );
}

type Props = {
    readonly children: React.ReactNode;
};

export function EditorProvider({ children }: Props): JSX.Element {
    const value = useContextValue();

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export function useEditor(): ContextValue {
    const context = React.useContext(Context);
    if (context === undefined) {
        throw new ReactContextError('EditorProvider');
    }
    return context;
}
