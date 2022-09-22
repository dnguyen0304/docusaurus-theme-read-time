import styled from '@emotion/styled';
import MergeIcon from '@mui/icons-material/Merge';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Box from '@mui/material/Box';
import type { Theme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import * as React from 'react';
import { useEditor } from '../../contexts/editor';
import { GithubPullStatus } from '../../docusaurus-theme-editor';
import EditorContainer from './Container';
import EditorTab from './Tab';
import EditorTooltip from './Tooltip';

const PURPLE_MERGED: string = '#8250df';

type iconFontSize = 'small' | 'inherit' | 'large' | 'medium' | undefined;

type StyledTabsProps = {
    readonly pullUrl: string;
    readonly pullStatus: GithubPullStatus | undefined;
}

type StyledTabProps = {
    readonly pullUrl: string;
    readonly pullStatus: GithubPullStatus | undefined;
}

type TabLabelProps = {
    readonly pullStateIcon: JSX.Element | null;
}

type TabContentProps = {
    readonly index: number;
    readonly activeIndex: number;
    readonly pullStatus: GithubPullStatus | undefined;
}

const checkPullExists = (
    pullUrl: string,
    pullStatus: GithubPullStatus | undefined,
): boolean => {
    // If a pull request is closed remotely, check the pull URL locally as a
    // proxy for whether the pull exists.
    return [pullUrl, pullStatus].every(Boolean);
}

const getColor = (
    pullUrl: string,
    pullStatus: GithubPullStatus | undefined,
    theme: Theme,
): string => {
    if (checkPullExists(pullUrl, pullStatus)) {
        if (pullStatus!.state === 'closed') {
            // TODO(dnguyen0304): Add red color for theme palette.
            return theme.palette.error.main;
        }
        if (pullStatus!.state === 'merged') {
            return PURPLE_MERGED;
        }
    }
    return theme.palette.primary.main;
};

const getIcon = (
    pullUrl: string,
    pullStatus: GithubPullStatus | undefined,
): JSX.Element | null => {
    if (checkPullExists(pullUrl, pullStatus)) {
        const iconProps = {
            fontSize: 'inherit' as iconFontSize,
            sx: { ml: '0.25rem' },
        };
        if (pullStatus!.state === 'open') {
            return <ScheduleIcon {...iconProps} />;
        }
        if (pullStatus!.state === 'closed') {
            return <ReportOutlinedIcon {...iconProps} />;
        }
        if (pullStatus!.state === 'merged') {
            return <MergeIcon {...iconProps} />;
        }
    }
    return null;
};

const StyledTabs = styled(Tabs, {
    shouldForwardProp: (prop) => prop !== 'pullUrl' && prop !== 'pullStatus',
})<StyledTabsProps>(({ theme, pullUrl, pullStatus }) => ({
    '.MuiTabs-indicator': {
        // TODO(dnguyen0304): Fix type error.
        backgroundColor: getColor(pullUrl, pullStatus, theme),
    },
    '.MuiTouchRipple-child': {
        // TODO(dnguyen0304): Fix type error.
        backgroundColor: getColor(pullUrl, pullStatus, theme),
    },
}));

const StyledTab = styled(Tab, {
    shouldForwardProp: (prop) => prop !== 'pullUrl' && prop !== 'pullStatus',
})<StyledTabProps>(({ theme, pullUrl, pullStatus }) => ({
    '& > span:first-of-type': {
        // TODO(dnguyen0304): Fix type error.
        color: getColor(pullUrl, pullStatus, theme),
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
        pullStatus,
    }: TabContentProps
): JSX.Element | null => {
    return (
        index === activeIndex
            ? <EditorTab pullStatus={pullStatus} />
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
                <StyledTabs
                    onChange={handleChange}
                    pullUrl={tabs[activeIndex].pullUrl}
                    pullStatus={tabs[activeIndex].pullStatus}
                    value={activeIndex}
                >
                    {tabs.map((tab, index) => {
                        const pullStateIcon = getIcon(
                            tab.pullUrl,
                            tab.pullStatus,
                        );
                        return (
                            <EditorTooltip
                                key={`tab-tooltip-${index}`}
                                arrow
                                leaveDelay={500}
                                placement='left-start'
                                pullState={tab.pullStatus?.state}
                                pullStateIcon={pullStateIcon}
                                pullUrl={tab.pullUrl}
                            >
                                <StyledTab
                                    label={<TabLabel pullStateIcon={pullStateIcon} />}
                                    pullUrl={tab.pullUrl}
                                    pullStatus={tab.pullStatus}
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
                    pullStatus={tab.pullStatus}
                />
            )}
        </EditorContainer >
    );
}
