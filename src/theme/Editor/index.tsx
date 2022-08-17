import styled from '@emotion/styled';
import MergeIcon from '@mui/icons-material/Merge';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Box from '@mui/material/Box';
import type { Theme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import * as React from 'react';
import { PullType, useEditor } from '../../contexts/editor';
import EditorContainer from './Container';
import EditorTab from './Tab';
import EditorTooltip from './Tooltip';

const PURPLE_MERGED: string = '#8250df';

type iconFontSize = 'small' | 'inherit' | 'large' | 'medium' | undefined;

interface StyledTabsProps {
    pull: PullType | undefined;
}

interface StyledTabProps {
    pull: PullType | undefined;
}

interface TabLabelProps {
    pullStateIcon: JSX.Element | null;
}

interface TabContentProps {
    index: number,
    activeIndex: number,
}

const getColor = (theme: Theme, pull: PullType | undefined): string => {
    if (pull && pull.state === 'closed') {
        if (pull.mergedAt) {
            return PURPLE_MERGED;
        } else {
            // TODO(dnguyen0304): Add red color for theme palette.
            return theme.palette.error.main;
        }
    }
    return theme.palette.primary.main;
};

const getIcon = (
    pull: PullType | undefined,
    pullRequestUrl: string,
): JSX.Element | null => {
    if (pullRequestUrl && pull) {
        let state: 'Open' | 'Closed' | 'Merged' | undefined;
        let icon: JSX.Element | undefined;
        const fontSize: iconFontSize = 'inherit';
        const iconProps = {
            fontSize: fontSize,
            sx: { ml: '0.25rem' },
        };
        if (pull.state === 'closed') {
            if (pull.mergedAt) {
                icon = <MergeIcon {...iconProps} />;
                state = 'Merged';
            } else {
                icon = <ReportOutlinedIcon {...iconProps} />;
                state = 'Closed';
            }
        } else {
            icon = <ScheduleIcon {...iconProps} />;
            state = 'Open';
        }
        if (state == undefined) {
            throw new Error('expected state to be defined');
        }
        if (icon === undefined) {
            throw new Error('expected icon to be defined');
        }
        return icon;
    }
    return null;
};

const StyledTabs = styled(Tabs, {
    shouldForwardProp: (prop) => prop !== 'pull',
})<StyledTabsProps>(({ theme, pull }) => ({
    '.MuiTabs-indicator': {
        // TODO(dnguyen0304): Fix type error.
        backgroundColor: getColor(theme, pull),
    },
    '.MuiTouchRipple-child': {
        // TODO(dnguyen0304): Fix type error.
        backgroundColor: getColor(theme, pull),
    },
}));

const StyledTab = styled(Tab, {
    shouldForwardProp: (prop) => prop !== 'pull',
})<StyledTabProps>(({ theme, pull }) => ({
    '& > span:first-of-type': {
        // TODO(dnguyen0304): Fix type error.
        color: getColor(theme, pull),
    },
}));

const TabLabel = ({ pullStateIcon }: TabLabelProps): JSX.Element => {
    const StyledTabLabel = styled('span')({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    });

    return (
        <StyledTabLabel>
            default{pullStateIcon}
        </StyledTabLabel>
    );
};

const TabContent = (
    {
        index,
        activeIndex,
    }: TabContentProps
): JSX.Element | null => {
    return (
        index === activeIndex
            ? <EditorTab />
            : null
    );
};

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
                <StyledTabs
                    onChange={handleChange}
                    pull={tabs[activeIndex].pull}
                    value={activeIndex}
                >
                    {tabs.map((tab, index) => {
                        const pullStateIcon = getIcon(
                            tab.pull,
                            tab.pullRequestUrl,
                        );
                        return (
                            <EditorTooltip
                                arrow
                                placement='left-start'
                                pullState={tab.pull?.state}
                                pullStateIcon={pullStateIcon}
                                pullUrl={tab.pullRequestUrl}
                            >
                                <StyledTab
                                    key={`tab-${index}`}
                                    label={<TabLabel pullStateIcon={pullStateIcon} />}
                                    pull={tab.pull}
                                />
                            </EditorTooltip>
                        );
                    })}
                </StyledTabs>
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
