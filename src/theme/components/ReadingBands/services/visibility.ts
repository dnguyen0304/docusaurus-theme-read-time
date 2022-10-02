import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { getElement } from './dom';
import styles from './styles.module.css';

type Props = {
    readonly target: string | Element;
    readonly onChange: IntersectionObserverCallback;
    readonly debugBorderIsEnabled?: boolean;
} & IntersectionObserverInit;

export default async function observeVisibility(
    {
        target,
        onChange,
        root,
        rootMargin,
        threshold,
        debugBorderIsEnabled = false,
    }: Props
): Promise<Array<() => void>> {
    if (!ExecutionEnvironment.canUseIntersectionObserver) {
        return [];
    }

    const cleanUp: Array<() => void> = [];
    const element =
        typeof target === 'string'
            ? await getElement(target)
            : target;
    const observer = new IntersectionObserver(
        onChange,
        {
            root,
            rootMargin,
            threshold,
        },
    );

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