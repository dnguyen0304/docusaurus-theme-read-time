// See https://github.com/facebook/docusaurus/blob/01ac2e0fcaccaf469992f93a0e8bf04e61cf850e/packages/docusaurus-utils/src/pathUtils.ts#L93
const DOCUSAURUS_ALIASED_SITE_PATH_PREFIX: string = '@site';

// TODO(dnguyen0304): Extract as a configuration option.
const ENDPOINT_EXCHANGE_CODE_TO_TOKEN: string = 'https://z39iitznuj.execute-api.us-west-1.amazonaws.com/production/DocusaurusThemeEditor_getAccessToken';

// TODO(dnguyen0304): Investigate S3 static website redirect workaround.
//
// If the S3 object key "foo" is not found, the user is redirected to "foo/",
// "foo/index.html" is served, but search parameters are removed. In
// Chrome DevTools | Network, this is observed as a 302 Found redirect.
//
// See: https://docs.aws.amazon.com/AmazonS3/latest/userguide/IndexDocumentSupport.html
// See: https://stackoverflow.com/questions/21468600/amazon-s3-static-website-hosting-support-both-trailing-slash-and-not
const GITHUB_AUTHORIZATION_CALLBACK_PATH: string = '/editor/callback/';

export {
    DOCUSAURUS_ALIASED_SITE_PATH_PREFIX,
    ENDPOINT_EXCHANGE_CODE_TO_TOKEN,
    GITHUB_AUTHORIZATION_CALLBACK_PATH,
};
