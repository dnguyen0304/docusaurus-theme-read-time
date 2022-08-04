import { Resizable } from 're-resizable';
import * as React from 'react';
import EditorHandle, { WIDTH_PX } from '../Handle';
import styles from './styles.module.css';

interface Props {
    children: React.ReactNode;
}

export default function Container({ children }: Props): JSX.Element {
    return (
        // TODO(dnguyen0304): Investigate how to set minWidth and maxWidth.
        // Unconfirmed: It might be related to the undocumented bounds and
        // boundByDirection props.
        <Resizable
            className={styles.editorResizableContainer}
            enable={{
                left: true,
            }}
            handleComponent={{
                left: <EditorHandle />,
            }}
            // This prop name is misleading. These styles are actually for a
            // thin wrapper around handleComponent. It is rendered between
            // handleWrapper and handleComponent.
            handleStyles={{
                left: {
                    width: `${WIDTH_PX}px`,
                    left: 0,
                },
            }}
        >
            <div className={styles.editor_container}>
                {children}
            </div>
        </Resizable>
    )
}
