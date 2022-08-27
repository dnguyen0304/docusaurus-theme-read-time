import type { WrapperProps } from '@docusaurus/types';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import DocBreadcrumbs from '@theme-init/DocBreadcrumbs';
import type DocBreadcrumbsType from '@theme/DocBreadcrumbs';
import React from 'react';
import { useEditor } from '../../contexts/editor';
import { useRawContent } from '../../contexts/rawContent';
import { useLocation } from '../../contexts/router';
import CloseButton from '../Editor/CloseButton';
import EditButton from '../Editor/EditButton';
import styles from './styles.module.css';

type Props = WrapperProps<typeof DocBreadcrumbsType>;

export default function DocBreadcrumbsWrapper(props: Props): JSX.Element {
    const {
        siteConfig: {
            trailingSlash,
        },
    } = useDocusaurusContext();
    const {
        editorIsOpen,
        setEditorIsOpen,
    } = useEditor();
    const { rawContent } = useRawContent();
    const { currentPath } = useLocation();

    // TODO(dnguyen0304): Set editor focus.
    const toggleEditorIsOpen = () => { setEditorIsOpen(prev => !prev) };

    const getButton = (): JSX.Element | null => {
        if (currentPath in rawContent == false) {
            return null;
        }
        if (!editorIsOpen) {
            return <EditButton onClick={toggleEditorIsOpen} />;
        }
        return <CloseButton toggleEditorIsOpen={toggleEditorIsOpen} />;
    }

    return (
        <nav className={`${styles.breadcrumbsWrapper_container}`}>
            <DocBreadcrumbs {...props} />
            {getButton()}
        </nav>
    );
}
