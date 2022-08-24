import { Redirect } from '@docusaurus/router';
import * as React from 'react';
import URI from 'urijs';
import { SEARCH_PARAM_KEY_IS_LOGGED_IN } from '../../../constants';
import { useContentDocs } from '../../../contexts/contentDocs';
import { useGithub } from '../../../contexts/github';
import { authenticate, parseCallbackUrl } from '../../services/Github';

export default function Callback(): JSX.Element | null {
    const { path: docsPath } = useContentDocs();
    const { user, setUser, setApi } = useGithub();
    // const { snackbar } = useSnackbar();

    const [redirectPath, setRedirectPath] = React.useState<string>('');
    // const [haveShownWelcome, setHaveShownWelcome] =
    //     React.useState<boolean>(false);

    React.useEffect(() => {
        const doAuthenticate = async () => {
            const {
                authorizationCode,
                redirectPath,
            } = parseCallbackUrl(new URI());
            const {
                user,
                api,
            } = await authenticate(authorizationCode, docsPath);

            setUser(user);
            setApi(api);
            setRedirectPath(redirectPath);
        };
        doAuthenticate();
    }, []);

    // React.useEffect(() => {
    //     if (haveShownWelcome) {
    //         return;
    //     }

    //     const cookies = new Cookies();
    //     const param =
    //         new URLSearchParams(window.location.search)
    //             .get(SEARCH_PARAM_KEY_IS_LOGGED_IN);
    //     const justRedirectedFromAuthWorkflow = param !== null;
    //     const isReturningAuthenticatedUser =
    //         cookies.get(COOKIE_KEY_SESSION_ID) !== undefined;

    //     if (!justRedirectedFromAuthWorkflow || isReturningAuthenticatedUser) {
    //         return;
    //     }

    //     snackbar.sendSuccessAlert(
    //         'Welcome back! You\'re all logged in now.',
    //         (previous) => previous * 1.5,
    //     );
    //     setHaveShownWelcome(true);
    // }, []);

    return (
        user
            ? <Redirect to={{
                pathname: redirectPath,
                search: `?${SEARCH_PARAM_KEY_IS_LOGGED_IN}=true`,
            }} />
            // TODO(dnguyen0304): Add page for "Please wait while you are being
            // redirected" to improve the UX.
            : null
    );
}
