import { ContentBlock, ContentState, EditorBlock } from 'draft-js';
import * as React from 'react';
import styles from './styles.module.css';

interface Props {
    readonly block: ContentBlock,
    readonly contentState: ContentState,
}

export default function Line({ block, contentState }: Props): JSX.Element {
    const lineNumber =
        contentState
            .getBlockMap()
            .toList()
            .findIndex(
                currentBlock => currentBlock?.getKey() === block.getKey()) + 1;

    return (
        <div
            className={styles.editor_line}
            data-line-number={lineNumber}
        >
            <div className={styles.editor_lineText}>
                <EditorBlock {...props} />
            </div>
        </div>
    );
}
