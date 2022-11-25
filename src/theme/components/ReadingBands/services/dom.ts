import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// TODO(dnguyen0304): Maybe refactor to reduce duplicated code with
// getElementAll.
export async function getElement(selector: string): Promise<Element> {
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

// TODO(dnguyen0304): Maybe refactor to reduce duplicated code with getElement.
export async function getElementAll(selector: string): Promise<Element[]> {
    return new Promise(resolve => {
        const elements = document.querySelectorAll(selector);
        if (elements) {
            return resolve(Array.from(elements));
        }
        const observer = new MutationObserver(mutations => {
            const elements = document.querySelectorAll(selector);
            if (elements) {
                resolve(Array.from(elements));
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

export function getViewportHeight(): number {
    if (!ExecutionEnvironment.canUseDOM) {
        return 0;
    }
    return Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0,
    );
}
