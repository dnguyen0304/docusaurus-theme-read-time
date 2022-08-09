import DoneIcon from '@mui/icons-material/Done';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSnackbar } from '../../../../../contexts/snackbar';
import type { KeyBinding as KeyBindingType } from '../../../../../docusaurus-theme-editor';

interface Props {
    readonly onClick: () => void;
}

const KeyBinding: KeyBindingType = {
    key: 'shift+option+s',
    friendlyLabel: '^⌥S',
};

export default function SaveButton({ onClick }: Props): JSX.Element {
    const { snackbar } = useSnackbar();

    const [isSaving, setIsSaving] = React.useState<boolean>(false);
    const [isConfirmed, setIsConfirmed] = React.useState<boolean>(false);
    const backgroundSaveTimerId = React.useRef<number>();
    const doneIconTimerId = React.useRef<number>();

    const handleClick = (alert: boolean) => {
        setIsSaving(true);
        onClick();
        new Promise(resolve => setTimeout(resolve, 2500))
            .then(() => {
                setIsSaving(false);
                setIsConfirmed(true);
                if (alert) {
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
            true  // alert
        ),
    );

    React.useEffect(() => {
        backgroundSaveTimerId.current = window.setInterval(() => {
            handleClick(
                false  // alert
            );
        }, 60 * 1000);

        return () => {
            clearTimeout(backgroundSaveTimerId.current);
            clearTimeout(doneIconTimerId.current);
        };
    }, []);

    return (
        <Tooltip
            title={`Save (${KeyBinding.friendlyLabel})`}
            placement='top'
        >
            <IconButton
                aria-label='save'
                onClick={() => handleClick(
                    true  // alert
                )}
            >
                {getIcon()}
            </IconButton>
        </Tooltip>
    );
}
