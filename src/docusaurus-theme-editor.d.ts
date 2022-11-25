/// <reference types="@docusaurus/module-type-aliases" />

declare module '@mui/material/styles' {
    interface BreakpointOverrides {
        xs: false;
        sm: false;
        md: false;
        lg: false;
        xl: false;
        mobile: true;
    }
}

declare module '@theme/DocBreadcrumbs'

declare module '@theme-init/DocBreadcrumbs' {
    export type Props = {
        readonly children: JSX.Element;
    }
    export default function DocBreadcrumbs(props: Props): JSX.Element;
}

export type EditorThemeConfig = {
    githubAuthorizationRedirectUrl: string;
};

export type DocupotamusThemeConfig = {
    readTime: {
        contentRootSelector: string;
        contentSelector: string;
        debug: {
            band: {
                isEnabled: boolean;
                colors: string[];
            };
            border: {
                isEnabled: boolean;
            };
        };
    };
};

export type KeyBinding = {
    readonly key: string;
    readonly friendlyLabel: string;
}

export type GithubUser = {
    readonly username: string;
    readonly emailAddress?: string;
    readonly fullName?: string;
}

// TODO(dnguyen0304): Consider adding a null option to represent a pull request
// does not exist.
export type InternalGithubState = 'open' | 'closed' | 'merged';

export type GithubPullStatus = {
    readonly state: InternalGithubState;
    // Gotcha: When a pull request is closed, both closedAt and mergedAt are
    // updated. Therefore, mergedAt must be directly checked to determine if a
    // pull request has been merged.
    readonly closedAt: string | null;
    readonly mergedAt: string | null;
}
