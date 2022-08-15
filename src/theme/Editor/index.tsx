import * as React from 'react';
import EditorContainer from './Container';
import EditorTab from './Tab';

// TODO: Fix inconsistent padding or margin in edit mode.
export default function Editor(): JSX.Element {
    return (
        <EditorContainer>
            <EditorTab />
        </EditorContainer >
    );
}
