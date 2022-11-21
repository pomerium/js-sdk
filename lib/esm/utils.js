import * as jose from 'jose';
export const getClientJwt = () => fetch(window.location.origin + '/.pomerium/jwt').then((d) => d.text());
export const parseJWT = (token) => {
    return jose.decodeJwt(token);
};
export const getJWKsData = (baseUrl) => {
    const url = withHttps(baseUrl) + '/.well-known/pomerium/jwks.json';
    try {
        return fetch(url).then(r => r.json());
    }
    catch (e) {
        console.log(e);
        throw new Error('Error accessing JWKS endpoint!');
    }
};
export const verifyPomeriumJWT = async (jwt, authenticateBaseUrl, issuer, audience) => {
    const data = await getJWKsData(authenticateBaseUrl);
    const JWKS = jose.createLocalJWKSet(data);
    return jose.jwtVerify(jwt, JWKS, { issuer, audience });
};
export const withHttps = (url) => (!/^https?:\/\//i.test(url) ? `https://${url}` : url);
export const signOut = (redirectUrl) => {
    let location = window.location.origin + '/.pomerium/sign_out';
    if (redirectUrl) {
        location += '?pomerium_redirect_uri=' + encodeURIComponent(redirectUrl);
    }
    window.location.href = location;
};
