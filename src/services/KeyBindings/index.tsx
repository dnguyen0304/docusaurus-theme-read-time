import { useHotkeys } from 'react-hotkeys-hook';
import { useEditor } from '../../contexts/editor';
import { CloseButtonKeyBinding } from '../../theme/Editor/CloseButton';

export default function KeyBindings() {
    const context = useEditor();

    const closeEditor = () => context.setEditorIsOpen(false);

    useHotkeys(
        CloseButtonKeyBinding.key,
        closeEditor,
    );

    return null;
}
