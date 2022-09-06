import { Resizable } from 're-resizable';
import * as React from 'react';
import EditorHandle, { WIDTH_PX as HANDLE_WIDTH_PX } from '../Handle';
import styles from './styles.module.css';

const WIDTH_IDEAL_PX: number = 400;
const WIDTH_MAX_PERCENT: number = .40;
const PADDING_PX: number = 16;

type Props = {
    readonly children: React.ReactNode;
}

export default function Container({ children }: Props): JSX.Element {
    const [maxWidth, setMaxWidth] = React.useState<number>(WIDTH_IDEAL_PX);

    // TODO(dnguyen0304): Trigger on resize.
    React.useEffect(() => {
        const containerWidth =
            document
                .querySelector(`main[class*='docMainContainer']`)
                ?.getBoundingClientRect()
                .width;
        if (!containerWidth || containerWidth < WIDTH_IDEAL_PX) {
            setMaxWidth(WIDTH_IDEAL_PX);
        } else {
            setMaxWidth(
                containerWidth * WIDTH_MAX_PERCENT
                // The resizable container contains a left handle, center
                // content, and right padding. maxWidth refers to the width of
                // the center content. Subtract the width of the handle and
                // padding so the content does not overflow.
                - HANDLE_WIDTH_PX
                - PADDING_PX
                // Subtract an additional buffer to fix the visual stutter.
                - 1);
        }
    }, []);

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
                    width: `${HANDLE_WIDTH_PX}px`,
                    left: 0,
                },
            }}
            maxWidth={`${maxWidth}px`}
            // TODO(dnguyen0304): Replace placeholder default value.
            minWidth='275px'
        >
            <div className={styles.editor_container}>
                {children}
            </div>
        </Resizable>
    )
}
