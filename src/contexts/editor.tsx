import * as React from 'react';
import { ReactContextError } from './errors';

// aliases: table of contents
interface ContextValue {
    readonly editorIsOpen: boolean,
    readonly setEditorIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
};

const Context = React.createContext<ContextValue | undefined>(undefined);

function useContextValue(): ContextValue {
    const [editorIsOpen, setEditorIsOpen] = React.useState<boolean>(false);

    return React.useMemo(
        () => ({ editorIsOpen, setEditorIsOpen }),
        [editorIsOpen, setEditorIsOpen],
    );
}

interface Props {
    readonly children: React.ReactNode,
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
