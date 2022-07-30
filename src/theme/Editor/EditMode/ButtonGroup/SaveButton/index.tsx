import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';

interface Props {
    readonly isSaving: boolean;
}

export default function SaveButton(
    {
        isSaving,
    }: Props
): JSX.Element {
    return (
        <Tooltip
            title='Save'
            placement='top'
        >
            {/* TODO(dnguyen0304): Investigate if the onClick prop is
                necessary in addition to background saving. */}
            <IconButton aria-label='save'>
                {isSaving
                    // All components must have the same dimensions (size) to
                    // avoid visual studdering.
                    ? <CircularProgress size={24} />
                    : <SaveOutlinedIcon />}
            </IconButton>
        </Tooltip>
    );
}
