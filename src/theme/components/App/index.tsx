import * as React from 'react';
import Cookies from 'universal-cookie';
import {
    COOKIE_KEY_SESSION_ID,
    SEARCH_PARAM_KEY_IS_LOGGED_IN
} from '../../../constants';
import { useSnackbar } from '../../../contexts/snackbar';

export default function App(): null {
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

    return null;
}
