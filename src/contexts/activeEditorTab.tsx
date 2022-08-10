import { EditorTab, useEditor } from './editor';

// TODO(dnguyen0304): Add real implementation.
function useActiveEditorTab(): EditorTab {
    const { tabs } = useEditor();

    return tabs[0];
}

export {
    useActiveEditorTab,
};
