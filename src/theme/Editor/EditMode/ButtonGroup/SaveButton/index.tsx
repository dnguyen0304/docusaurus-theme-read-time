import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';

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
    // TODO(dnguyen0304): Investigate if a real implementation is necessary in
    // addition to background saving.
    const handleClick = () => {
        setIsSaving(true);
        new Promise(resolve => setTimeout(resolve, 750))
            .then(() => {
                setIsSaving(false);
            })
    };

    return (
        <Tooltip
            title='Save'
            placement='top'
        >
            <IconButton
                aria-label='save'
                onClick={handleClick}
            >
                {isSaving
                    // All components must have the same dimensions (size) to
                    // avoid visual studdering.
                    ? <CircularProgress size={24} />
                    : <SaveOutlinedIcon />}
            </IconButton>
        </Tooltip>
    );
}
