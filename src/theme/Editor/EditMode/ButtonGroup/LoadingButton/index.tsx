import type { ButtonProps } from '@mui/material/Button';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import * as React from 'react';
import { useRefMeasure } from '../../../utils';

// TODO(dnguyen0304): Get from the theme source of truth.
const BUTTON_BORDER_WIDTH_PIXELS: number = 1;
const LOADING_ICON_WIDTH: number = 24;

interface Props extends ButtonProps {
    readonly isLoading: boolean;
}

export default function LoadingButton(
    {
        isLoading,
        children,
        ...buttonProps
    }: Props
): JSX.Element {
    const [measure, measureRef] = useRefMeasure<HTMLAnchorElement>(
        clientRect => clientRect.width,
        [children],
    );
    const [padding, setPadding] = React.useState<number>(0);

    const render = (): JSX.Element => {
        if (isLoading) {
            return (
                <Button
                    {...buttonProps}
                    sx={{
                        px: `${padding}px`,
                    }}
                >
                    <CircularProgress size={LOADING_ICON_WIDTH} />
                </Button>
            );
        } else {
            return (
                <Button
                    // TODO(dnguyen0304): Fix type error.
                    {...buttonProps}
                    ref={measureRef}
                >
                    {children}
                </Button>
            );
        }
    };

    React.useEffect(() => {
        if (measure) {
            // TODO(dnguyen0304): Fix type error.
            setPadding(
                (measure
                    - LOADING_ICON_WIDTH
                    - 2 * BUTTON_BORDER_WIDTH_PIXELS) / 2
            );
        }
    }, [measure])

    return (
        render()
    );
}
