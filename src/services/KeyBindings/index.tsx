import { useHotkeys } from 'react-hotkeys-hook';
import { useEditor } from '../../contexts/editor';
import { CloseButtonKeyBinding } from '../../theme/Editor/CloseButton';
import { EditButtonKeyBinding } from '../../theme/Editor/EditButton';

export default function KeyBindings() {
    const context = useEditor();

    const openEditor = () => context.setEditorIsOpen(true);
    const closeEditor = () => context.setEditorIsOpen(false);

    useHotkeys(
        EditButtonKeyBinding.key,
        openEditor,
        {
            // Bind to KeyUp instead of KeyDown to avoid the KeyPress event
            // being captured when the editor is open.
            keydown: false,
            keyup: true,
        },
    );
    useHotkeys(
        CloseButtonKeyBinding.key,
        closeEditor,
    );

    return null;
}
