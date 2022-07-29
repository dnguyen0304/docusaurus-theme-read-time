import type { WrapperProps } from '@docusaurus/types';
import Layout from '@theme-init/DocItem/Layout';
import type LayoutType from '@theme/DocItem/Layout';
import React from 'react';
import { EditorProvider } from '../../../contexts/editor';

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): JSX.Element {
    return (
        <>
            <EditorProvider>
                <Layout {...props} />
            </EditorProvider>
        </>
    );
}
