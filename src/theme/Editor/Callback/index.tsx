import { Redirect } from '@docusaurus/router';
import { usePluginData } from '@docusaurus/useGlobalData';
import * as React from 'react';
import URI from 'urijs';
import { useGithub } from '../../../contexts/github';
import Github from '../../services/Github';

export default function Callback(): JSX.Element | null {
    // TODO(dnguyen0304): Fix missing type declaration.
    const { path: docsPath } = usePluginData('docusaurus-plugin-content-docs');
    const { user, setUser, setApi } = useGithub();

    const [redirectPath, setRedirectPath] = React.useState<string>('');

    React.useEffect(() => {
        const authenticate = async () => {
            const {
                authorizationCode,
                redirectPath,
            } = Github().parseCallbackUrl(new URI());
            const {
                user,
                api,
            } = await Github().authenticate(authorizationCode, docsPath);

            setUser(user);
            setApi(api);
            setRedirectPath(redirectPath);
        };
        authenticate();
    }, []);

    return (
        user
            ? <Redirect to={redirectPath} />
            // TODO(dnguyen0304): Add page for "Please wait while you are being
            // redirected" to improve the UX.
            : null
    );
}
