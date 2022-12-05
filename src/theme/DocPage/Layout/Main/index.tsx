import type { WrapperProps } from '@docusaurus/types';
import DocPageLayoutMain from '@theme-init/DocPage/Layout/Main';
import type DocPageLayoutMainType from '@theme/DocPage/Layout/Main';
import * as React from 'react';
import Toolbar from '../../../components/Toolbar';

// TODO(dnguyen0304): Migrate to interface for declaration merging.
type Props = Readonly<WrapperProps<typeof DocPageLayoutMainType>>;

export default function DocPageLayoutMainWrapper(props: Props): JSX.Element {
    return (
        <>
            <DocPageLayoutMain {...props} />
            <Toolbar />
        </>
    );
}
