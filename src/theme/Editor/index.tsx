import { useLocation } from '@docusaurus/router';
import type { DraftHandleValue, EditorState } from 'draft-js';
import draft, { convertToRaw } from 'draft-js';
import * as React from 'react';
import { useEditor } from '../../contexts/editor';
import { useRawContent } from '../../contexts/rawContent';
import { useSite } from '../../contexts/site';
import { useSnackbar } from '../../contexts/snackbar';
import EditorContainer from './Container';
import EditModeButtonGroup from './EditMode/ButtonGroup';
import EditorLine from './Line';
import { getLocalStorageKey } from './utils';

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
export default function Editor(): JSX.Element {
    const { setEditorIsOpen } = useEditor();
    const { rawContent } = useRawContent();
    const { pathname } = useLocation();
    const { snackbar } = useSnackbar();
    const siteContext = useSite();

    const [editorState, setEditorState] = React.useState<draft.EditorState>(
        () => draft.EditorState.createEmpty(),
    );
    const originalMarkdown = React.useRef<string>(rawContent[pathname]);

    const closeEditor = () => {
        setEditorIsOpen(false);
    };

    // Copied from:
    // https://stackoverflow.com/questions/51665544/how-retrieve-text-from-draftjs
    const getMarkdown = (): string => {
        const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
        const processed = blocks.map(block =>
            // If the block is empty, return a newline. Otherwise, return the
            // block text.
            (!block.text.trim() && '\n') || block.text
        );

        let rawMarkdown = '';

        for (let i = 0; i < processed.length; i++) {
            const blockText = processed[i];

            // Handle the last block.
            if (i === processed.length - 1) {
                if (blockText === '\n') {
                    // Skip this block to avoid appending an extra newline.
                    continue;
                }
                rawMarkdown += blockText;
            } else {
                // Handle blocks that contain only a newline character.
                if (blockText === '\n') {
                    rawMarkdown += blockText;
                } else {
                    rawMarkdown += blockText + '\n';
                }
            }
        }
        return rawMarkdown;
    };

    const resetMarkdown = () => {
        const localStorageKey = getLocalStorageKey(siteContext);
        localStorage.removeItem(localStorageKey);

        setEditorState(
            draft.EditorState.createWithContent(
                draft.ContentState.createFromText(originalMarkdown.current)));
    };

    const handleChange = (editorState: draft.EditorState) => {
        setEditorState(editorState);
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
        const localStorageKey = getLocalStorageKey(siteContext);
        const savedMarkdown = localStorage.getItem(localStorageKey);

        if (savedMarkdown) {
            setEditorState(
                draft.EditorState.createWithContent(
                    draft.ContentState.createFromText(savedMarkdown)));
        } else {
            resetMarkdown();
        }
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
                getMarkdown={getMarkdown}
                resetMarkdown={resetMarkdown}
                // TODO(dnguyen0304): Investigate a better way to handle
                // keybinding dependencies.
                editorState={editorState}
            />
        </EditorContainer >
    );
}
