import { useLocation } from '@docusaurus/router';
import type { DraftHandleValue, EditorState } from 'draft-js';
import draft from 'draft-js';
import * as React from 'react';
import { useEditor } from '../../contexts/editor';
import { useEditorContent } from '../../contexts/editorContent';
import { useSnackbar } from '../../contexts/snackbar';
import EditorContainer from './Container';
import EditModeButtonGroup from './EditMode/ButtonGroup';
import EditorLine from './Line';

// TODO(dnguyen0304): Extract to a centralized location to facilitate
// maintenance.
type HandleKeyCommandType = (
    command: string,
    editorState: EditorState,
    eventTimeStamp: number,
) => DraftHandleValue;

const HANDLER_NAME_ESCAPE: string = 'editor-escape';
const KEY_CODE_ESCAPE: number = 27;

// TODO: Fix inconsistent padding or margin in edit mode.
export default function Editor({
    // onChange,
    // resetMarkdown,
}): JSX.Element {
    const { setEditorIsOpen } = useEditor();
    const { editorContent } = useEditorContent();
    const { pathname } = useLocation();
    const { snackbar } = useSnackbar();

    const [editorState, setEditorState] = React.useState<draft.EditorState>(
        () => draft.EditorState.createEmpty(),
    );
    const [isSaving, setIsSaving] = React.useState<boolean>(false);

    const closeEditor = () => {
        setEditorIsOpen(false);
    };

    const handleChange = (editorState: draft.EditorState) => {
        setEditorState(editorState);

        // TODO(dnguyen0304): Fix save loading triggering on blur (see handleBeforeInput).
        // TODO(dnguyen0304): Fix save loading triggering on cursor movement.
        // TODO(dnguyen0304): Fix save loading triggering constantly.
        if (editorState.getLastChangeType() !== undefined) {
            setIsSaving(true);
            new Promise(resolve => setTimeout(resolve, 750))
                .then(() => {
                    setIsSaving(false);
                });
        };
    };

    const blockRendererFn = () => ({
        component: EditorLine,
    });

    const handleKeyboardEvent = (
        keyboardEvent: React.KeyboardEvent<{}>
    ): string | null => {
        // TODO(dnguyen0304): Fix deprecated keyCode usage.
        if (keyboardEvent.keyCode === KEY_CODE_ESCAPE) {
            return HANDLER_NAME_ESCAPE;
        }
        return draft.getDefaultKeyBinding(keyboardEvent);
    }

    const handleKeyCommand: HandleKeyCommandType = (command) => {
        if (command === HANDLER_NAME_ESCAPE) {
            closeEditor();
            snackbar.sendSuccessAlert('Successfully saved changes.');
            return 'handled';
        }
        return 'not-handled';
    }

    React.useEffect(() => {
        setEditorState(
            draft.EditorState.createWithContent(
                draft.ContentState.createFromText(editorContent[pathname])));
    }, []);

    return (
        <EditorContainer>
            <draft.Editor
                blockRendererFn={blockRendererFn}
                editorState={editorState}
                handleKeyCommand={handleKeyCommand}
                keyBindingFn={handleKeyboardEvent}
                onChange={handleChange}
            />
            <EditModeButtonGroup
                closeEditor={closeEditor}
                isSaving={isSaving}
                setIsSaving={setIsSaving}
            />
            {/* resetMarkdown={resetMarkdown} */}
        </EditorContainer >
    );
}
