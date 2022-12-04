import type {
    ThemeConfig,
    ThemeConfigValidationContext
} from '@docusaurus/types';
import { Joi } from '@docusaurus/utils-validation';
import type { DocupotamusThemeConfig } from './docusaurus-theme-read-time';

export const DOCUPOTAMUS_DEFAULT_CONFIG: DocupotamusThemeConfig = {
    readTime: {
        workbenchIsOpen: true,
    },
};

// TODO(dnguyen0304): Fix incorrect ThemeConfig type.
export const ThemeConfigSchema = Joi.object<ThemeConfig>({
    docupotamus: Joi.object({
        readTime: Joi.object({
            contentRootSelector: Joi
                .boolean()
                .default(DOCUPOTAMUS_DEFAULT_CONFIG.readTime.workbenchIsOpen),
        })
            .default(DOCUPOTAMUS_DEFAULT_CONFIG.readTime),
    })
        .default(DOCUPOTAMUS_DEFAULT_CONFIG),
});

export function validateThemeConfig({
    validate,
    themeConfig,
}: ThemeConfigValidationContext<ThemeConfig>): ThemeConfig {
    return validate(ThemeConfigSchema, themeConfig);
};
