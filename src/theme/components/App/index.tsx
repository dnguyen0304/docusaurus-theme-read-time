// If you need the DocItem-specific ("page-specific") root, use
// theme/DocItem/Layout.

import * as React from 'react';
import Cookies from 'universal-cookie';
import URI from 'urijs';
import {
    COOKIE_KEY_SESSION_ID,
    SEARCH_PARAM_KEY_AUTH
} from '../../../constants';

export default function App(): null {
    // TODO(dnguyen0304): Move to Editor/Callback to hide the refresh.
    React.useEffect(() => {
        const encodedAuth =
            new URLSearchParams(window.location.search)
                .get(SEARCH_PARAM_KEY_AUTH);
        if (!encodedAuth) {
            console.log('no encoded auth');
            return;
        }
        const cookies = new Cookies();
        cookies.addChangeListener((options) => console.log(options));
        const auth = JSON.parse(atob(encodedAuth));
        cookies.set(
            COOKIE_KEY_SESSION_ID,
            auth.accessToken,
            // TODO(dnguyen0304): Investigate if path is necessary.
            {
                maxAge: 28 * 24 * 60 * 60,  // 28 days in seconds
                secure: true,
            },
        );
        window.location.href =
            new URI()
                .removeSearch(SEARCH_PARAM_KEY_AUTH)
                .toString();
    }, []);

    return null;
}
