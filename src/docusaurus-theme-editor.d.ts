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

export type InternalGithubState = 'open' | 'closed' | 'merged';

export interface GithubPullState {
    state: InternalGithubState;
    // Gotcha: When a pull request is closed, both closedAt and mergedAt are
    // updated. Therefore, mergedAt must be directly checked to determine if a
    // pull request has been merged.
    closedAt: string | null;
    mergedAt: string | null;
}
