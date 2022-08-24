import * as React from 'react';
import Cookies from 'universal-cookie';
import URI from 'urijs';
import {
    COOKIE_KEY_SESSION_ID,
    LOCAL_STORAGE_KEY_PULL_BRANCH_NAME,
    LOCAL_STORAGE_KEY_PULL_TITLE,
    LOCAL_STORAGE_KEY_PULL_URL,
    SEARCH_PARAM_KEY_AUTH,
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

    // TODO(dnguyen0304): Move to Editor/Callback to hide the refresh.
    React.useEffect(() => {
        const encodedAuth =
            new URLSearchParams(window.location.search)
                .get(SEARCH_PARAM_KEY_AUTH);
        if (!encodedAuth) {
            return;
        }
        const cookies = new Cookies();
        const auth = JSON.parse(atob(encodedAuth));
        cookies.set(COOKIE_KEY_SESSION_ID, auth.accessToken);
        window.location.href =
            new URI()
                .removeSearch(SEARCH_PARAM_KEY_AUTH)
                .toString();
    }, []);

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
        const pullBranchName =
            localStorage.getItem(LOCAL_STORAGE_KEY_PULL_BRANCH_NAME);
        if (tabs.length === 0) {
            addTab({
                pullTitle: pullTitle ? pullTitle : '',
                pullUrl: pullUrl ? pullUrl : '',
                pullBranchName: pullBranchName ? pullBranchName : '',
            });
        }
    }, []);

    return null;
}
