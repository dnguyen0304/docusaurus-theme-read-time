import type { WrapperProps } from '@docusaurus/types';
import DocBreadcrumbs from '@theme-init/DocBreadcrumbs';
import type DocBreadcrumbsType from '@theme/DocBreadcrumbs';
import React from 'react';
import { useEditor } from '../../contexts/editor';
import EditButton from '../EditButton';
import CloseButton from '../Editor/CloseButton';
import styles from './styles.module.css';

type Props = WrapperProps<typeof DocBreadcrumbsType>;

export default function DocBreadcrumbsWrapper(props: Props): JSX.Element {
    const context = useEditor();

    const toggleEditorIsOpen = () => { context.setEditorIsOpen(prev => !prev) };

    return (
        <nav className={`${styles.breadcrumbsWrapper_container}`}>
            <DocBreadcrumbs {...props} />
            {!context.editorIsOpen
                ? <EditButton toggleEditorIsOpen={toggleEditorIsOpen} />
                : <CloseButton toggleEditorIsOpen={toggleEditorIsOpen} />}
        </nav>
    );
}
