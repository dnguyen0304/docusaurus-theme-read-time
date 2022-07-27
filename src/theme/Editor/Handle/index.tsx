import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { styled } from '@mui/material/styles';
import * as React from 'react';

interface Props {
    width: number;
}

const StyledIcon = styled(DragIndicatorIcon)(({ width }: Props) => ({
    width: width,

    position: 'sticky',
    top: 'calc(40vh)',

    color: 'var(--ifm-color-emphasis-500)',
    transform: 'scaleY(1.2)',
}));

export default function Handle({ width }: Props): JSX.Element {
    return (
        <StyledIcon width={width} />
    );
}
