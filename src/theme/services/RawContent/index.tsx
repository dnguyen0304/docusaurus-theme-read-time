// TODO(dnguyen0304): Support react-router options such as exact and strict.
// TODO(dnguyen0304): Add retrying on loading the raw content.
function getRawContent(
    pathname: string,
    rawContent: { [key: string]: string },
    trailingSlash: boolean | undefined,
): string | undefined {
    let processed = pathname;

    if (trailingSlash && !pathname.endsWith('/')) {
        processed = pathname + '/';
    }
    if (!trailingSlash && pathname.endsWith('/')) {
        processed = pathname.slice(0, -1);
    }
    return (
        processed in rawContent === false
            ? undefined
            : rawContent[processed]
    );
}

export {
    getRawContent,
};
