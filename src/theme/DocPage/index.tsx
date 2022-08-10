import type { WrapperProps } from '@docusaurus/types';
import type DocPageType from '@theme-init/DocPage';
import DocPage from '@theme-init/DocPage';
import React from 'react';
import { RawContentProvider } from '../../contexts/editorContent';

type Props = WrapperProps<typeof DocPageType>;

export default function DocPageWrapper(props: Props): JSX.Element {
    const { rawContent } = props;

    return (
        <RawContentProvider content={rawContent}>
            <DocPage {...props} />
        </RawContentProvider>
    );
}
