import * as React from 'react';
import { getViewportHeight } from '../../../utils';

type DOMRectSubset = Pick<DOMRect, 'top' | 'bottom'>;

async function getElement(selector: string): Promise<HTMLElement | null> {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function getContainerRect(target: HTMLElement): DOMRectSubset {
    const containerRect = target.parentElement?.getBoundingClientRect();
    if (!containerRect) {
        throw new Error('no parent container');
    }
    return {
        top: Math.max(containerRect.top, 0),
        bottom: Math.min(containerRect.bottom, getViewportHeight()),
    }
}

function isVisible(target: HTMLElement): boolean {
    const targetRect = target.getBoundingClientRect() as DOMRectSubset;
    const containerRect = getContainerRect(target);

    const topIsVisible =
        targetRect.top > containerRect.top
        && targetRect.top < containerRect.bottom;
    const bottomIsVisible =
        targetRect.bottom < containerRect.bottom
        && targetRect.bottom > containerRect.top;

    return topIsVisible || bottomIsVisible;
}

function onVisibilityChange(
    target: HTMLElement,
    callback: (current: boolean) => void,
) {
    let prev: boolean | undefined;
    return () => {
        const curr = isVisible(target);
        console.log(`curr: ${curr}`)
        if (prev === undefined || curr != prev) {
            console.log('differ!')
            prev = curr;
            callback(curr);
        }
    }
}

export default function VisibilityTracker(): JSX.Element {
    const [target, setTarget] = React.useState<HTMLElement | null>(null);

    React.useEffect(() => {
        const getTarget = async () => {
            const target = await getElement(`main[class*='docMainContainer'] article .markdown h2`);
            setTarget(target);
        }
        getTarget();
    }, []);

    React.useEffect(() => {
        if (!target) {
            return;
        }
        const handleScroll = onVisibilityChange(target, console.log);

        window.removeEventListener('scroll', handleScroll);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [target]);

    return (
        <></>
    )
};