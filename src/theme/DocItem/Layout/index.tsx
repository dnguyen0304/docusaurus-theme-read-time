import type { WrapperProps } from '@docusaurus/types';
import Layout from '@theme-init/DocItem/Layout';
import type LayoutType from '@theme/DocItem/Layout';
import React from 'react';
import { EditButtonProvider } from '../../../contexts/editButton';

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): JSX.Element {
    return (
        <>
            <EditButtonProvider>
                <Layout {...props} />
            </EditButtonProvider>
        </>
    );
}
