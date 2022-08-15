import DoneIcon from '@mui/icons-material/Done';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { EditorState } from 'draft-js';
import * as React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useEditor } from '../../../../../contexts/editor';
import { useSnackbar } from '../../../../../contexts/snackbar';
import type { KeyBinding as KeyBindingType } from '../../../../../docusaurus-theme-editor';

interface Props {
    readonly onClick: () => void;
    readonly editorState: EditorState;
}

const KeyBinding: KeyBindingType = {
    key: 'shift+option+s',
    friendlyLabel: '^⌥S',
};

// TODO(dnguyen0304): Fix memory leak on closing the editor while still saving.
export default function SaveButton(
    {
        onClick,
        editorState,
    }: Props
): JSX.Element {
    const { snackbar } = useSnackbar();
    const { registerBeforeEditorCloseHook } = useEditor();

    const [isSaving, setIsSaving] = React.useState<boolean>(false);
    const [isConfirmed, setIsConfirmed] = React.useState<boolean>(false);
    const backgroundSaveTimerId = React.useRef<number>();
    const doneIconTimerId = React.useRef<number>();

    const handleClick = (shouldAlert: boolean) => {
        setIsSaving(true);
        onClick();
        new Promise(resolve => setTimeout(resolve, 2500))
            .then(() => {
                setIsSaving(false);
                setIsConfirmed(true);
                if (shouldAlert) {
                    snackbar.sendSuccessAlert('Successfully saved changes.');
                }
            })
            .then(() => {
                doneIconTimerId.current = window.setTimeout(() => {
                    setIsConfirmed(false);
                }, 1250);
            });
    };

    const getIcon = (): JSX.Element => {
        if (isConfirmed) {
            return <DoneIcon color='primary' />;
        } else if (isSaving) {
            // All components must have the same dimensions (size) to avoid
            // visual studdering.
            return <CircularProgress size={24} />;
        } else {
            return <SaveOutlinedIcon />;
        };
    };

    useHotkeys(
        KeyBinding.key,
        () => handleClick(
            true  // shouldAlert
        ),
        [editorState],
    );

    React.useEffect(() => {
        // TODO(dnguyen0304): Send notification.
        registerBeforeEditorCloseHook(onClick, 'save');
    }, [editorState]);

    React.useEffect(() => {
        backgroundSaveTimerId.current = window.setInterval(() => {
            handleClick(
                false  // shouldAlert
            );
        }, 60 * 1000);

        return () => {
            clearTimeout(backgroundSaveTimerId.current);
            clearTimeout(doneIconTimerId.current);
        };
    }, [editorState]);

    return (
        <Tooltip
            title={`Save (${KeyBinding.friendlyLabel})`}
            placement='top'
        >
            <IconButton
                aria-label='save'
                onClick={() => handleClick(
                    true  // shouldAlert
                )}
            >
                {getIcon()}
            </IconButton>
        </Tooltip>
    );
}
