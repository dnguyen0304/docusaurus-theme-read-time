/// <reference types="@docusaurus/module-type-aliases" />

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

export interface GithubUser {
    readonly username: string;
    readonly emailAddress?: string;
    readonly fullName?: string;
}
