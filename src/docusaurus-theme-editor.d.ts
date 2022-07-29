declare module '@theme/DocBreadcrumbs'

declare module '@theme-init/DocBreadcrumbs' {
    export interface Props {
        readonly children: JSX.Element;
    }
    export default function DocBreadcrumbs(props: Props): JSX.Element;
}

export interface KeyBinding {
    key: string;
    friendlyLabel: string;
}
