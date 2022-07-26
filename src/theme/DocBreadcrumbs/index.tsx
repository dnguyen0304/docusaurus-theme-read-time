import type { WrapperProps } from '@docusaurus/types';
import DocBreadcrumbs from '@theme-init/DocBreadcrumbs';
import type DocBreadcrumbsType from '@theme/DocBreadcrumbs';
import React from 'react';
import { useEditButton } from '../../contexts/editButton';
import EditButton from '../EditButton';
import styles from './styles.module.css';

type Props = WrapperProps<typeof DocBreadcrumbsType>;

export default function DocBreadcrumbsWrapper(props: Props): JSX.Element {
    const context = useEditButton();

    const toggleEditorIsOpen = () => { context.setEditorIsOpen(prev => !prev) };

    return (
        <nav className={`${styles.breadcrumbsWrapper_container}`}>
            <DocBreadcrumbs {...props} />
            <EditButton toggleEditorIsOpen={toggleEditorIsOpen} />
        </nav>
    );
}
