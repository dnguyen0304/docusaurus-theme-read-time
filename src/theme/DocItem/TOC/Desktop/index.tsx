import type { WrapperProps } from '@docusaurus/types';
import Desktop from '@theme-init/DocItem/TOC/Desktop';
import type DesktopType from '@theme/DocItem/TOC/Desktop';
import React from 'react';
import { useEditButton } from '../../../../contexts/editButton';

type Props = WrapperProps<typeof DesktopType>;

export default function DesktopWrapper(props: Props): JSX.Element {
    const context = useEditButton();

    return (
        <>
            {!context.editorIsOpen && <Desktop {...props} />}
        </>
    );
}