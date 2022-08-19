import * as React from 'react';
import Cookies from 'universal-cookie';
import {
    COOKIE_KEY_SESSION_ID,
    LOCAL_STORAGE_KEY_PULL_TITLE,
    LOCAL_STORAGE_KEY_PULL_URL,
    SEARCH_PARAM_KEY_IS_LOGGED_IN
} from '../../../constants';
import { useEditor } from '../../../contexts/editor';
import { useSnackbar } from '../../../contexts/snackbar';

export default function App(): null {
    const {
        tabs,
        addTab,
    } = useEditor();
    const { snackbar } = useSnackbar();

    const [haveShownWelcome, setHaveShownWelcome] =
        React.useState<boolean>(false);

    React.useEffect(() => {
        if (haveShownWelcome) {
            return;
        }

        const cookies = new Cookies();
        const param =
            new URLSearchParams(window.location.search)
                .get(SEARCH_PARAM_KEY_IS_LOGGED_IN);
        const justRedirectedFromAuthWorkflow = param !== null;
        const isReturningAuthenticatedUser =
            cookies.get(COOKIE_KEY_SESSION_ID) !== undefined;

        if (!justRedirectedFromAuthWorkflow || isReturningAuthenticatedUser) {
            return;
        }

        snackbar.sendSuccessAlert(
            'Welcome back! You\'re all logged in now.',
            (previous) => previous * 1.5,
        );
        setHaveShownWelcome(true);
    }, []);

    React.useEffect(() => {
        const pullTitle = localStorage.getItem(LOCAL_STORAGE_KEY_PULL_TITLE);
        const pullUrl = localStorage.getItem(LOCAL_STORAGE_KEY_PULL_URL);
        if (tabs.length === 0) {
            addTab({
                pullTitle: pullTitle ? pullTitle : '',
                pullUrl: pullUrl ? pullUrl : '',
                pullBranchName: '',
            });
        }
    }, []);

    return null;
}
