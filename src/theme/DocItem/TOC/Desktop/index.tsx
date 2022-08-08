import type { WrapperProps } from '@docusaurus/types';
import Desktop from '@theme-init/DocItem/TOC/Desktop';
import type DesktopType from '@theme/DocItem/TOC/Desktop';
import React from 'react';
import { useEditor } from '../../../../contexts/editor';
import { GithubProvider } from '../../../../contexts/github';
import Editor from '../../../Editor';

type Props = WrapperProps<typeof DesktopType>;

export default function DesktopWrapper(props: Props): JSX.Element {
    const context = useEditor();

    const editor = (
        <GithubProvider>
            <Editor />
        </GithubProvider>
    );

    return (
        <>
            {context.editorIsOpen
                ? editor
                : <Desktop {...props} />}
        </>
    );
}
