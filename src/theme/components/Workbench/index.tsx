import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { useToolbar } from '../../../contexts/toolbar';
import { CardViewModel } from '../../../docusaurus-theme-read-time';
import Card from './Card';

const KEY_PREFIX: string = 'workbenchCard';
const fakeData: CardViewModel[] = [
    {
        targetId: 'ABC',
        details: 'Setting up your environment',
        readTime: {
            minute: 61,
            second: 87,
        },
    },
    {
        targetId: 'IJK',
        details: 'Database backup',
        readTime: {
            minute: 11,
            second: 32,
        },
    },
    {
        targetId: 'XYZ',
        details: 'It is important to...',
        readTime: {
            minute: 130,
            second: 49,
        },
    },
];

interface StyledBoxProps {
    readonly workbenchIsOpen: boolean;
    readonly boxShadowWidth: string;
}

const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'workbenchIsOpen' && prop !== 'boxShadowWidth',
})<StyledBoxProps>(({ theme, workbenchIsOpen, boxShadowWidth }) => ({
    position: 'sticky',
    top: 0,
    height: '100vh',
    display: workbenchIsOpen ? 'flex' : 'none',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    background: `linear-gradient(
        to bottom,
        ${theme.palette.grey[600]} 0%,
        ${theme.palette.grey[700]} 100%)`,
    borderTopLeftRadius: 'var(--space-2xs)',
    // TODO(dnguyen0304): Add overflow to scroll through cards. However, this
    // breaks the box-shadow.
    // overflow: 'scroll',
    padding: 'var(--space-xs) var(--space-2xs)',
    // TODO(dnguyen0304): Investigate refactoring to box-shadow
    // style to reduce complexity.
    '&::before': {
        content: '""',
        position: 'absolute',
        top: '0',
        left: `calc(-1 * ${boxShadowWidth})`,
        width: boxShadowWidth,
        height: '100vh',
        background: `linear-gradient(
            to right,
            transparent,
            rgba(60, 64, 67, 0.15) 70%,
            rgba(60, 64, 67, 0.4) 100%)`,
    },
}));

const StyledOrderedList = styled('ol')({
    width: '100%',
    margin: 0,
    padding: 0,
    '& > *': {
        marginBottom: 'var(--space-xs)',
    },
    '& > *:last-child': {
        marginBottom: 0,
    },
});

interface Props { };

export default function Workbench(
    {
    }: Props
): JSX.Element {
    const { workbenchIsOpen } = useToolbar();

    return (
        // TODO(dnguyen0304): Migrate to use MUI List.
        //   See: https://mui.com/material-ui/react-list/
        <StyledBox
            workbenchIsOpen={workbenchIsOpen}
            boxShadowWidth={'var(--space-xs)'}
        >
            <StyledOrderedList>
                {fakeData.map((card, i) =>
                    <Card
                        key={`${KEY_PREFIX}-${i}`}
                        card={card}
                    />
                )}
            </StyledOrderedList>
        </StyledBox>
    );
};
