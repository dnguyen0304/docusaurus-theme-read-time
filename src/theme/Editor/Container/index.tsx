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
            style={{
                // Set the position as an inline style to override the
                // specificity of a workaround implemented by the underlying
                // code.
                // See https://github.com/bokuweb/re-resizable/blob/0e9055cb1fe80ea824d78061961d76b0a4fadb8d/src/index.tsx#L931
                //
                // Warning: width and height styles are always overridden.
                // See https://github.com/bokuweb/re-resizable/blob/0e9055cb1fe80ea824d78061961d76b0a4fadb8d/src/index.tsx#L934
                position: 'sticky',
            }}
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
