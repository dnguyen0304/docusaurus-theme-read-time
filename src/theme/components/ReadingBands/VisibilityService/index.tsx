import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import styles from './styles.module.css';

type Props = {
    readonly selector: string;
    readonly debugBorderIsEnabled?: boolean;
} & IntersectionObserverInit;

async function getElement(selector: string): Promise<Element> {
    return new Promise(resolve => {
        const element = document.querySelector(selector);
        if (element) {
            return resolve(element);
        }
        const observer = new MutationObserver(mutations => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                observer.disconnect();
            }
        });
        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            },
        );
    });
}

export default async function observeVisibility(
    {
        selector,
        root,
        rootMargin,
        threshold,
        debugBorderIsEnabled = false,
    }: Props
): Promise<Array<() => void>> {
    if (!ExecutionEnvironment.canUseIntersectionObserver) {
        return [];
    }
    if (rootMargin && !rootMargin.includes('px')) {
        throw new Error('rootMargin must include the "px" and/or "%" suffixes');
    }

    const cleanUp: Array<() => void> = [];
    const element = await getElement(selector);
    const observer = new IntersectionObserver((entries, observer) => {
        // TODO(dnguyen0304): Add real implementation.
        console.log(entries);
        // classList.toggle
    }, {
        root,
        rootMargin,
        threshold,
    });

    // TODO(dnguyen0304): Add tooltip with visibility.
    if (debugBorderIsEnabled
        && !element.classList.contains(styles.visibilityObserver_target)
    ) {
        element.classList.add(styles.visibilityObserver_target);
        cleanUp.push(() => {
            element.classList.remove(styles.visibilityObserver_target);
        });
    }

    observer.observe(element);
    cleanUp.push(() => observer.unobserve(element));

    return cleanUp;
}