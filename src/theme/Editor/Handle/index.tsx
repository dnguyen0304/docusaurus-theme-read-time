import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import styles from './styles.module.css';

interface Props {
    width?: number;
}

export const WIDTH_PX: number = 15;

const StyledIcon = styled(DragIndicatorIcon)(({ width }: Props) => ({
    width: width,

    position: 'sticky',
    top: 'calc(45vh)',

    color: 'var(--ifm-color-emphasis-500)',
    transform: 'scaleY(1.2)',
}));

export default function Handle(
    {
        width = WIDTH_PX
    }: Props
): JSX.Element {
    return (
        // TODO(dnguyen0304): Investigate refactoring to Resizable
        // handleWrapperClass and handleWrapperStyle.
        <div
            className={styles.editorHandle_container}
            style={{ width: width }}
        >
            <StyledIcon width={width} />
        </div>
    );
}
