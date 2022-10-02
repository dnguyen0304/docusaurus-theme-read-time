import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

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
    getViewportHeight,
};
