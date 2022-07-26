import React from 'react';
import DocBreadcrumbs from '@theme-init/DocBreadcrumbs';
import type DocBreadcrumbsType from '@theme/DocBreadcrumbs';
import type { WrapperProps } from '@docusaurus/types';
import EditButton from '../EditButton';
import styles from './styles.module.css';

type Props = WrapperProps<typeof DocBreadcrumbsType>;

export default function DocBreadcrumbsWrapper(props: Props): JSX.Element {
    return (
        <nav className={`${styles.breadcrumbsWrapper_Container}`}>
            <DocBreadcrumbs {...props} />
            <EditButton toggleEditMode={() => { console.log('clicked') }} />
        </nav>
    );
}
