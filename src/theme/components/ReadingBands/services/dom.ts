import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

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

function getViewportHeight(): number {
    if (!ExecutionEnvironment.canUseDOM) {
        return 0;
    }
    return Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0,
    );
}

export {
    getElement,
    getViewportHeight,
};
