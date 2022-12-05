import type {
    ThemeConfig,
    ThemeConfigValidationContext
} from '@docusaurus/types';
import { Joi } from '@docusaurus/utils-validation';
import type { DocupotamusThemeConfig } from './docusaurus-theme-read-time';

const DEFAULT_THEME_CONFIG: DocupotamusThemeConfig = {
    workbenchIsOpen: true,
};

export const ThemeConfigSchema = Joi.object<ThemeConfig>({
    docupotamusReadTime: Joi.object({
        workbenchIsOpen: Joi
            .boolean()
            .default(DEFAULT_THEME_CONFIG.workbenchIsOpen),
    })
        .default(DEFAULT_THEME_CONFIG),
});

export function validateThemeConfig({
    validate,
    themeConfig,
}: ThemeConfigValidationContext<ThemeConfig>): ThemeConfig {
    return validate(ThemeConfigSchema, themeConfig);
};
