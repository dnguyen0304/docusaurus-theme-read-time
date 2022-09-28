import type {
    ThemeConfig,
    ThemeConfigValidationContext
} from '@docusaurus/types';
import { Joi } from '@docusaurus/utils-validation';

export const DEFAULT_CONFIG = {
    githubAuthorizationRedirectUrl: 'https://kgevadn5a2.execute-api.us-east-1.amazonaws.com/production/DocusaurusEditor_handleOAuthRedirect',
};

export const DOCUPOTAMUS_DEFAULT_CONFIG = {
    readTime: {
        debug: {
            isEnabled: false,
            // From B0 to B2, use decreasing alpha (opacity) because bands are
            // implemented as box shadows and therefore stack.
            // See: https://colorbox.io/
            bandColors: [
                'hsla(356.7, 82%, 43%, 0.25)',  // B0
                'hsla(356.2, 61%, 65%, 0.2)',   // B1
                'hsla(356.2, 61%, 65%, 0.15)',  // B2
            ],
        },
        debugBorder: {
            isEnabled: false,
        },
    },
};

// TODO(dnguyen0304): Fix incorrect ThemeConfig type.
export const ThemeConfigSchema = Joi.object<ThemeConfig>({
    editor: Joi.object({
        githubAuthorizationRedirectUrl:
            Joi.string().default(DEFAULT_CONFIG.githubAuthorizationRedirectUrl),
    })
        .label('themeConfig.editor')
        .default(DEFAULT_CONFIG),
    docupotamus: Joi.object({
        readTime: Joi.object({
            debug: Joi.object({
                isEnabled: Joi
                    .boolean()
                    .default(DOCUPOTAMUS_DEFAULT_CONFIG.readTime.debug.isEnabled),
                bandColors: Joi
                    .array()
                    .items(Joi.string())
                    .length(3)
                    .default(DOCUPOTAMUS_DEFAULT_CONFIG.readTime.debug.bandColors)
                    .when(
                        'isEnabled',
                        {
                            is: Joi.boolean().valid(true),
                            // TODO(dnguyen0304): Improve error messaging.
                            then: Joi.forbidden(),
                        },
                    )
            })
                .default(DOCUPOTAMUS_DEFAULT_CONFIG.readTime.debug),
            debugBorder: Joi.object({
                isEnabled: Joi
                    .boolean()
                    .default(DOCUPOTAMUS_DEFAULT_CONFIG.readTime.debugBorder.isEnabled),
            })
                .default(DOCUPOTAMUS_DEFAULT_CONFIG.readTime.debugBorder),
        })
            .default(DOCUPOTAMUS_DEFAULT_CONFIG.readTime),
    })
        .label('themeConfig.docupotamus')
        .default(DOCUPOTAMUS_DEFAULT_CONFIG),
});

export function validateThemeConfig({
    validate,
    themeConfig,
}: ThemeConfigValidationContext<ThemeConfig>): ThemeConfig {
    return validate(ThemeConfigSchema, themeConfig);
}
