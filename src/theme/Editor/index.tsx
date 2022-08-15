import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import * as React from 'react';
import { useEditor } from '../../contexts/editor';
import EditorContainer from './Container';
import EditorTab from './Tab';

interface TabContentProps {
    index: number,
    activeIndex: number,
}

function TabContent(
    {
        index,
        activeIndex,
    }: TabContentProps
): JSX.Element | null {
    return (
        index === activeIndex
            ? <EditorTab />
            : null
    );
}

// TODO: Fix inconsistent padding or margin in edit mode.
export default function Editor(): JSX.Element {
    const { tabs } = useEditor();
    const [activeIndex, setActiveIndex] = React.useState<number>(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveIndex(newValue);
    };

    return (
        <EditorContainer>
            {/* TODO(dguyen0304): Add bottom box-shadow style. */}
            <Box sx={{
                width: '100%',
                borderBottom: 1,
                borderColor: 'divider',
            }}>
                <Tabs
                    onChange={handleChange}
                    value={activeIndex}
                >
                    <Tab label='default' />
                </Tabs>
            </Box>
            {tabs.map((tab, index) => {
                return (
                    <TabContent
                        key={`tab-content-${index}`}
                        index={index}
                        activeIndex={activeIndex}
                    />
                );
            })}
        </EditorContainer >
    );
}
