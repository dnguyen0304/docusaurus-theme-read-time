import type { DraftHandleValue, EditorState } from 'draft-js';
import draft, { convertToRaw } from 'draft-js';
import * as React from 'react';
import { LOCAL_STORAGE_KEY_MARKDOWN } from '../../../constants';
import { useEditor } from '../../../contexts/editor';
import { useRawContent } from '../../../contexts/rawContent';
import { useLocation } from '../../../contexts/router';
import { useSite } from '../../../contexts/site';
import { useSnackbar } from '../../../contexts/snackbar';
import { GithubPullStatus } from '../../../docusaurus-theme-editor';
import { getLocalStorageKey } from '../../../utils';
import EditModeButtonGroup from '../EditMode/ButtonGroup';
import EditorLine from '../Line';

type Props = {
    readonly pullStatus: GithubPullStatus | undefined;
}

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
export default function Tab(
    {
        pullStatus,
    }: Props
): JSX.Element {
    const { setEditorIsOpen } = useEditor();
    const { rawContent } = useRawContent();
    const { currentPath } = useLocation();
    const { snackbar } = useSnackbar();
    const siteContext = useSite();

    const originalMarkdownRef = React.useRef<string>(rawContent[currentPath]);
    const editorRef = React.useRef<draft.Editor>(null);
    const [editorState, setEditorState] = React.useState<draft.EditorState>(
        () => {
            const localStorageKey =
                getLocalStorageKey(siteContext, LOCAL_STORAGE_KEY_MARKDOWN);
            const savedMarkdown = localStorage.getItem(localStorageKey);
            const text =
                savedMarkdown
                    ? savedMarkdown
                    : originalMarkdownRef.current;
            return draft.EditorState.createWithContent(
                draft.ContentState.createFromText(text));
        },
    );

    const closeEditor = () => {
        setEditorIsOpen(false);
    };

    // Copied from:
    // https://stackoverflow.com/questions/51665544/how-retrieve-text-from-draftjs
    const getMarkdown = (state?: draft.EditorState): string => {
        const currentContent =
            state === undefined
                ? editorState.getCurrentContent()
                : state.getCurrentContent()
        const rawBlocks = convertToRaw(currentContent).blocks;
        const processed = rawBlocks.map(block =>
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

    const saveMarkdown = (state?: draft.EditorState) => {
        localStorage.setItem(
            getLocalStorageKey(siteContext, LOCAL_STORAGE_KEY_MARKDOWN),
            getMarkdown(state),
        );
    };

    const resetMarkdown = () => {
        const localStorageKey =
            getLocalStorageKey(siteContext, LOCAL_STORAGE_KEY_MARKDOWN);
        localStorage.removeItem(localStorageKey);

        if (!originalMarkdownRef.current) {
            throw new Error('expected originalMarkdownRef to be defined');
        }

        setEditorState(
            draft.EditorState.createWithContent(
                draft.ContentState.createFromText(
                    originalMarkdownRef.current)));
    };

    const handleChange = (editorState: draft.EditorState) => {
        // TODO(dnguyen0304): Investigate how saving on every change affects
        // performance.
        saveMarkdown(editorState);
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
        if (editorRef.current) {
            editorRef.current.focus();
        }
    }, []);

    return (
        <>
            <draft.Editor
                blockRendererFn={blockRendererFn}
                editorState={editorState}
                handleKeyCommand={handleKeyCommand}
                keyBindingFn={handleKeyboardEvent}
                onChange={handleChange}
                ref={editorRef}
            />
            <EditModeButtonGroup
                closeEditor={closeEditor}
                getMarkdown={getMarkdown}
                resetMarkdown={resetMarkdown}
                saveMarkdown={saveMarkdown}
                // TODO(dnguyen0304): Investigate a better way to handle
                // keybinding dependencies.
                editorState={editorState}
                pullStatus={pullStatus}
            />
        </>
    );
}
