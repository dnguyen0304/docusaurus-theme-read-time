import { Redirect } from '@docusaurus/router';
import { usePluginData } from '@docusaurus/useGlobalData';
import * as React from 'react';
import URI from 'urijs';
import { useGithub } from '../../../contexts/github';
import { authenticate, parseCallbackUrl } from '../../services/Github';

export default function Callback(): JSX.Element | null {
    // TODO(dnguyen0304): Fix missing type declaration.
    // See: https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-plugin-content-docs/src/client/index.ts#L91
    const { path: docsPath } = usePluginData('docusaurus-plugin-content-docs');
    const { user, setUser, setApi } = useGithub();

    const [redirectPath, setRedirectPath] = React.useState<string>('');

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

    return (
        user
            ? <Redirect to={redirectPath} />
            // TODO(dnguyen0304): Add page for "Please wait while you are being
            // redirected" to improve the UX.
            : null
    );
}
