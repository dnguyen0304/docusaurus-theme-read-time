import styled from '@emotion/styled';
import MergeIcon from '@mui/icons-material/Merge';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import * as React from 'react';
import { PullType, useEditor } from '../../contexts/editor';
import EditorContainer from './Container';
import EditorTab from './Tab';

type iconFontSize = 'small' | 'inherit' | 'large' | 'medium' | undefined;

interface TabLabelProps {
    pull: PullType | undefined;
    pullRequestUrl: string;
}

interface TabContentProps {
    index: number,
    activeIndex: number,
}

const StyledTabLabel = styled('span')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

function TabLabel(
    {
        pull,
        pullRequestUrl,
    }: TabLabelProps
): JSX.Element {

    const getIcon = (): JSX.Element | null => {
        if (pullRequestUrl) {
            const fontSize: iconFontSize = 'inherit';
            const iconProps = {
                fontSize: fontSize,
                sx: { ml: '0.25rem' },
            };
            if (pull && pull.state === 'closed') {
                if (pull.closedAt) {
                    <ReportOutlinedIcon {...iconProps} />
                }
                if (pull.mergedAt) {
                    return (
                        <MergeIcon {...iconProps} />
                    );
                }
            }
            return (
                <ScheduleIcon {...iconProps} />
            );
        }
        return null;
    };

    return (
        <StyledTabLabel>
            default{getIcon()}
        </StyledTabLabel>
    );
};

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
                {/* TODO(dnguyen0304): Set textColor and indicatorColor based on
                    the pull request status. */}
                <Tabs
                    onChange={handleChange}
                    value={activeIndex}
                >
                    {tabs.map((tab, index) =>
                        <Tab
                            key={`tab-${index}`}
                            label={
                                <TabLabel
                                    pull={tab.pull}
                                    pullRequestUrl={tab.pullRequestUrl}
                                />
                            }
                        />
                    )}
                </Tabs>
            </Box>
            {tabs.map((tab, index) =>
                <TabContent
                    key={`tab-content-${index}`}
                    index={index}
                    activeIndex={activeIndex}
                />
            )}
        </EditorContainer >
    );
}
