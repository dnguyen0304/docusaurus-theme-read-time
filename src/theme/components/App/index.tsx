import BrowserOnly from '@docusaurus/BrowserOnly';
import * as React from 'react';
import ReadingBands from '../ReadingBands';

export default function App(): JSX.Element {
    return (
        <BrowserOnly>
            {() => <ReadingBands />}
        </BrowserOnly>
    );
}
