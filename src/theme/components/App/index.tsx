// If you need the DocItem-specific ("page-specific") root, use
// theme/DocItem/Layout.

import * as React from 'react';
import Cookies, { CookieSetOptions } from 'universal-cookie';
import URI from 'urijs';
import {
    COOKIE_KEY_SESSION_ID,
    SEARCH_PARAM_KEY_AUTH
} from '../../../constants';

function setCookieWithFallback(
    name: string,
    value: any,
    options?: CookieSetOptions | undefined,
): void {
    // Set the cookie twice. First without options and second with them.
    // This fallback is necessary for hosting providers such as AWS S3 that
    // do not support cookie attributes (reproduced but no source
    // documentation). For example:
    //
    //   document.cookie = 'without_options=works'
    //   document.cookie = 'with_options=does_not_work;Secure'
    const cookies = new Cookies();
    cookies.set(name, value);
    cookies.set(name, value, options);
};

export default function App(): null {
    // TODO(dnguyen0304): Move to Editor/Callback to hide the refresh.
    React.useEffect(() => {
        const encodedAuth =
            new URLSearchParams(window.location.search)
                .get(SEARCH_PARAM_KEY_AUTH);
        if (!encodedAuth) {
            return;
        }
        const auth = JSON.parse(atob(encodedAuth));
        setCookieWithFallback(
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
