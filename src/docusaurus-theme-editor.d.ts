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
