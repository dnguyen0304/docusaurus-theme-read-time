import DoneIcon from '@mui/icons-material/Done';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import { useSnackbar } from '../../../../../contexts/snackbar';

interface Props {
    readonly isSaving: boolean;
    readonly setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function SaveButton(
    {
        isSaving,
        setIsSaving,
    }: Props
): JSX.Element {
    const snackbar = useSnackbar().snackbar;
    const [isConfirmed, setIsConfirmed] = React.useState<boolean>(false);
    const timerId = React.useRef<number>();

    // TODO(dnguyen0304): Investigate if a real implementation is necessary in
    // addition to background saving.
    const handleClick = () => {
        setIsSaving(true);
        new Promise(resolve => setTimeout(resolve, 750))
            .then(() => {
                setIsSaving(false);
                setIsConfirmed(true);
                snackbar.sendSuccessAlert('Successfully saved changes.');
            })
            .then(() => {
                timerId.current = window.setTimeout(() => {
                    setIsConfirmed(false);
                }, 1000);
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

    React.useEffect(() => {
        return () => {
            clearTimeout(timerId.current);
        };
    }, []);

    return (
        <Tooltip
            title='Save'
            placement='top'
        >
            <IconButton
                aria-label='save'
                onClick={handleClick}
            >
                {getIcon()}
            </IconButton>
        </Tooltip>
    );
}
