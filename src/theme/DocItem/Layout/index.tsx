import Layout from '@theme-init/DocItem/Layout';
import * as React from 'react';
import EditButton from '../../EditButton';

interface Props {
    readonly children: JSX.Element;
}

export default function LayoutWrapper(props: Props): JSX.Element {
    return (
        <>
            <Layout {...props} />
            <EditButton toggleEditMode={() => { console.log('clicked') }} />
        </>
    );
}