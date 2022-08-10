// TODO(dnguyen0304): Investigate why moving this module to src/services
// throws "ReferenceError: exports is not defined".

// Copied from:
// https://mui.com/material-ui/react-snackbar/#customization

import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import MuiSnackbar from '@mui/material/Snackbar';
import * as React from 'react';

export interface SnackbarType {
    create: () => JSX.Element;
    sendAlert: (severity: AlertColor, content: React.ReactNode) => void;
    sendSuccessAlert: (content: React.ReactNode) => void;
    sendWarningAlert: (content: React.ReactNode) => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props: AlertProps,
    ref: React.Ref<HTMLDivElement>,
) {
    return (
        <MuiAlert
            ref={ref}
            elevation={6}
            {...props}
        />
    );
});

export default function Snackbar(): SnackbarType {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [content, setContent] =
        React.useState<JSX.Element | undefined>(undefined);

    const create = (): JSX.Element => {
        return (
            <MuiSnackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                // TODO(dnguyen0304): Extract as a configuration option.
                autoHideDuration={10 * 1000}  // 10 seconds in milliseconds
                onClose={close}
                open={isOpen}
            >
                {content}
            </MuiSnackbar>
        );
    };

    const open = (content: JSX.Element) => {
        setContent(content);
        setIsOpen(true);
    };

    const close = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            // Do nothing.
            return;
        }
        setIsOpen(false);
    };

    const sendAlert = (severity: AlertColor, content: React.ReactNode) => {
        open(
            <Alert severity={severity} onClose={close}>
                {content}
            </Alert>
        );
    };
    const sendSuccessAlert = (content: React.ReactNode) => {
        sendAlert('success', content);
    };
    const sendWarningAlert = (content: React.ReactNode) => {
        sendAlert('warning', content);
    };

    return {
        create: create,
        sendAlert: sendAlert,
        sendSuccessAlert: sendSuccessAlert,
        sendWarningAlert: sendWarningAlert,
    };
}
