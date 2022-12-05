import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import * as React from 'react';
import type { DocupotamusThemeConfig } from '../../../docusaurus-theme-read-time';
import { ReactContextError } from './errors';

type ContextValue = Readonly<{
    workbenchIsOpen: boolean;
    setWorkbenchIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>;

const Context = React.createContext<ContextValue | undefined>(undefined);

function useContextValue(): ContextValue {
    const {
        workbenchIsOpen: workbenchIsOpenDefault,
    } = useDocusaurusContext()
        .siteConfig
        .themeConfig
        .docupotamusReadTime as DocupotamusThemeConfig;

    const [workbenchIsOpen, setWorkbenchIsOpen] =
        React.useState<boolean>(workbenchIsOpenDefault);

    return React.useMemo(
        () => ({
            workbenchIsOpen,
            setWorkbenchIsOpen,
        }),
        [
            workbenchIsOpen,
            setWorkbenchIsOpen,
        ],
    );
};

type Props = Readonly<{
    children: React.ReactNode;
}>;

export function ToolbarProvider({ children }: Props): JSX.Element {
    const value = useContextValue();

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export function useToolbar(): ContextValue {
    const context = React.useContext(Context);
    if (context === undefined) {
        throw new ReactContextError('ToolbarProvider');
    }
    return context;
};
