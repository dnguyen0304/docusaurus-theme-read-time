import type { WrapperProps } from '@docusaurus/types';
import type LayoutType from '@theme-init/DocItem/Layout';
import Layout from '@theme-init/DocItem/Layout';
import React from 'react';
import {
    LOCAL_STORAGE_KEY_PULL_BRANCH_NAME,
    LOCAL_STORAGE_KEY_PULL_TITLE,
    LOCAL_STORAGE_KEY_PULL_URL
} from '../../../constants';
import { useEditor } from '../../../contexts/editor';
import { useSite } from '../../../contexts/site';
import { getLocalStorageKey } from '../../../utils';

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): JSX.Element {
    const {
        tabs,
        addTab,
    } = useEditor();
    const siteContext = useSite();

    React.useEffect(() => {
        const pullTitle =
            localStorage.getItem(
                getLocalStorageKey(
                    siteContext,
                    LOCAL_STORAGE_KEY_PULL_TITLE));
        const pullUrl =
            localStorage.getItem(
                getLocalStorageKey(
                    siteContext,
                    LOCAL_STORAGE_KEY_PULL_URL));
        const pullBranchName =
            localStorage.getItem(
                getLocalStorageKey(
                    siteContext,
                    LOCAL_STORAGE_KEY_PULL_BRANCH_NAME));
        if (tabs.length === 0) {
            // TODO(dnguyen0304): Investigate if the empty string fallback is
            // necessary.
            addTab({
                pullTitle: pullTitle ? pullTitle : '',
                pullUrl: pullUrl ? pullUrl : '',
                pullBranchName: pullBranchName ? pullBranchName : '',
            });
        }
    }, []);

    return (
        <>
            <Layout {...props} />
        </>
    );
}
