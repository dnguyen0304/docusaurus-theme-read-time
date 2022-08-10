import { useLocation } from '@docusaurus/router';
import type { WrapperProps } from '@docusaurus/types';
import DocBreadcrumbs from '@theme-init/DocBreadcrumbs';
import type DocBreadcrumbsType from '@theme/DocBreadcrumbs';
import React from 'react';
import { useEditor } from '../../contexts/editor';
import { useRawContent } from '../../contexts/rawContent';
import CloseButton from '../Editor/CloseButton';
import EditButton from '../Editor/EditButton';
import styles from './styles.module.css';

type Props = WrapperProps<typeof DocBreadcrumbsType>;

export default function DocBreadcrumbsWrapper(props: Props): JSX.Element {
    const {
        editorIsOpen,
        activeTab,
        getNextTabId,
        setEditorIsOpen,
        setTabs,
    } = useEditor();
    const { rawContent } = useRawContent();
    const { pathname } = useLocation();

    // TODO(dnguyen0304): Set editor focus.
    const toggleEditorIsOpen = () => { setEditorIsOpen(prev => !prev) };

    const editHandleClick = () => {
        if (!activeTab) {
            const firstTab = {
                tabId: getNextTabId(),
                pullRequestUrl: '',
            };
            setTabs([firstTab]);
        }
        toggleEditorIsOpen();
    };

    const getButton = (): JSX.Element | null => {
        if (pathname in rawContent === false) {
            return null;
        }
        if (!editorIsOpen) {
            return <EditButton onClick={editHandleClick} />;
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
