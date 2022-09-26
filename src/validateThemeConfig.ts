import type {
    ThemeConfig,
    ThemeConfigValidationContext
} from '@docusaurus/types';
import { Joi } from '@docusaurus/utils-validation';

export const DEFAULT_CONFIG = {
    githubAuthorizationRedirectUrl: 'https://kgevadn5a2.execute-api.us-east-1.amazonaws.com/production/DocusaurusEditor_handleOAuthRedirect',
};

export const ThemeConfigSchema = Joi.object<ThemeConfig>({
    editor: Joi.object({
        githubAuthorizationRedirectUrl:
            Joi.string().default(DEFAULT_CONFIG.githubAuthorizationRedirectUrl),
    })
        .label('themeConfig.editor')
        .default(DEFAULT_CONFIG),
});

export function validateThemeConfig({
    validate,
    themeConfig,
}: ThemeConfigValidationContext<ThemeConfig>): ThemeConfig {
    return validate(ThemeConfigSchema, themeConfig);
}
