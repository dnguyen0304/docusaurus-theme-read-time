const https = require('https');
const url = require('node:url');
const util = require('util');

const githubEndpoint = 'https://github.com/login/oauth/access_token';
const defaultPort = 443;
const defaultHeaders = {
    'Access-Control-Allow-Origin': '*',
};
const defaultHeadersResponse = {
    ...defaultHeaders,
    'Content-Type': 'application/json',
};

function toStringDeep(object) {
    return util.inspect(object, {
        showHidden: false,
        depth: null,
        colors: false,
    });
}

function updateSearchParams(uri, accessToken) {
    const parsedUri = url.parse(uri);
    const searchParams = new URLSearchParams(parsedUri.search);
    searchParams.set(
        'auth',
        Buffer.from(JSON.stringify({ accessToken })).toString('base64'),
    );
    parsedUri.search = searchParams;
    // TODO(dnguyen0304): Fix deprecation warning.
    return url.format(parsedUri);
}

async function httpPost(url, options) {
    return new Promise((resolve, reject) => {
        // TODO(dnguyen0304): Investigate if the GitHub server ever returns a
        // non-200 status code.
        const request = https.request(url, options, (response) => {
            response.setEncoding('utf8');

            let body = '';

            response.on('data', (chunk) => {
                body += chunk;
            });
            response.on('end', () => {
                resolve({
                    body: body,
                });
            });
        });

        request.on('error', (error) => {
            reject(error);
        });

        request.end();
    });
}

async function getAccessToken(authorizationCode) {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    const url = githubEndpoint + '?' + new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: authorizationCode,
    });
    const options = {
        port: defaultPort,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    };

    const { body } = await httpPost(url, options);
    // TODO(dnguyen0304): Handle non-JSON content-type such as "Cookies must
    // be enabled to use GitHub".
    const parsedResponseBody = JSON.parse(body);

    if ('error' in parsedResponseBody) {
        return {
            statusCode: 400,
            headers: defaultHeadersResponse,
            body,
        };
    }
    return {
        statusCode: 200,
        headers: defaultHeadersResponse,
        body: JSON.stringify({
            accessToken: parsedResponseBody.access_token,
        }),
    };
}

async function main(event) {
    console.log(`Started handleOAuthRedirect: ${toStringDeep(event)}`);

    const refererAllowlist = process.env.REFERER_ALLOWLIST.split(',');
    const authorizationCode = event.queryStringParameters.code;
    const siteRedirectUrl = event.queryStringParameters.state;

    const refererFound =
        refererAllowlist
        && refererAllowlist.includes(event.headers.referer);
    const isExistingUser = siteRedirectUrl.includes(event.headers.referer);

    if (!event.headers.referer && !refererFound && !isExistingUser) {
        return {
            statusCode: 400,
            headers: defaultHeadersResponse,
            body: JSON.stringify({
                errorMessage: `Referer not allowed: ${event.headers.referer}`,
            }),
        };
    }

    try {
        const response = await getAccessToken(authorizationCode);
        if (response.statusCode === 200) {
            const location = updateSearchParams(
                siteRedirectUrl,
                JSON.parse(response.body).accessToken,
            );
            return {
                statusCode: 303,
                headers: {
                    ...response.headers,
                    Location: location,
                },
            };
        }
        if (response.statusCode === 400) {
            return response;
        }
    } catch (error) {
        console.log(`Failed handleOAuthRedirect: ${error}`);
    }
}

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                ...defaultHeaders,
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Accept, Content-Type',
            },
        };
    } else if (event.httpMethod === 'GET') {
        return main(event);
    } else {
        return {
            statusCode: 405,
            headers: {
                ...defaultHeaders,
                'Allow': 'GET, OPTIONS',
            },
        };
    }
};
