import * as React from 'react';
import Cookies from 'universal-cookie';
import URI from 'urijs';
import {
    COOKIE_KEY_SESSION_ID,
    LOCAL_STORAGE_KEY_PULL_BRANCH_NAME,
    LOCAL_STORAGE_KEY_PULL_TITLE,
    LOCAL_STORAGE_KEY_PULL_URL,
    SEARCH_PARAM_KEY_AUTH
} from '../../../constants';
import { useEditor } from '../../../contexts/editor';

export default function App(): null {
    const {
        tabs,
        addTab,
    } = useEditor();

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
