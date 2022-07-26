import draft from 'draft-js';
import * as React from 'react';
// import EditModeButtonGroup from './EditModeButtonGroup';
import EditorLine from './Line';

// const KEY_HANDLED_ACK = 'handled';
// const KEY_HANDLED_NACK = 'not-handled';
// const KEY_COMMAND_ESC = 'escape';
// const KEYCODE_ESC = 27;

// const SAVE_LOADING_DURATION_MILLISECONDS = 750;

// TODO: Fix inconsistent padding or margin in edit mode.
export default function Editor({
    // editorState,
    // onChange,
    // toggleEditMode,
    // resetMarkdown,
    // snackbarService,
}): JSX.Element {
    const [editorState, setEditorState] = React.useState<draft.EditorState>(
        () => draft.EditorState.createEmpty(),
    );
    // const [toggleIsSaving, setToggleIsSaving] = React.useState<boolean>(false);

    const handleChange = (editorState: draft.EditorState) => {
        setEditorState(editorState);
    }

    // const _onChange = (editorState) => {
    //     onChange(editorState);

    //     // TODO: Fix save loading triggering on focus (see handleBeforeInput).
    //     // TODO: Fix save loading triggering on cursor movement.
    //     // TODO: Fix save loading triggering constantly.
    //     if (editorState.getLastChangeType() !== undefined) {
    //         setToggleIsSaving(true);
    //         sleep(SAVE_LOADING_DURATION_MILLISECONDS).then(() => {
    //             setToggleIsSaving(false)
    //         });
    //     }
    // }

    const blockRendererFn = () => ({
        component: EditorLine,
    });

    // const handleKeyCommand = (keyCommand) => {
    //     if (keyCommand === KEY_COMMAND_ESC) {
    //         toggleEditMode();
    //         snackbarService.sendSuccessAlert('Successfully saved changes.')
    //         return KEY_HANDLED_ACK;
    //     }
    //     return KEY_HANDLED_NACK;
    // }

    // const handleKeyboardEvent = (keyboardEvent) => {
    //     if (keyboardEvent.keyCode === KEYCODE_ESC) {
    //         return KEY_COMMAND_ESC;
    //     }
    //     return draft.getDefaultKeyBinding(keyboardEvent);
    // }

    React.useEffect(() => {
        setEditorState(
            draft.EditorState.createWithContent(
                draft.ContentState.createFromText('Hello, World!')));
    }, []);

    return (
        <div>
            <draft.Editor
                editorState={editorState}
                blockRendererFn={blockRendererFn}
                onChange={handleChange} />
            {/* handleKeyCommand={handleKeyCommand} */}
            {/* keyBindingFn={handleKeyboardEvent} */}
            {/* <EditModeButtonGroup
                toggleEditMode={toggleEditMode}
                resetMarkdown={resetMarkdown}
                toggleIsSaving={toggleIsSaving}
                snackbarService={snackbarService} /> */}
        </div >
    );
}
