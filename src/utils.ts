import * as jose from 'jose';

export const getClientJwt = (): Promise<string> =>
  fetch(window.location.origin + '/.pomerium/jwt').then((d) => d.text());

export const parseJWT = (token: string): jose.JWTPayload => {
  return jose.decodeJwt(token);
};

export const getJWKsData = (baseUrl: string): Promise<jose.JSONWebKeySet> => {
  const url = withHttps(baseUrl) + '/.well-known/pomerium/jwks.json';
  try {
   return fetch(url).then(r => r.json());
  } catch (e) {
    console.log(e);
    throw new Error('Error accessing JWKS endpoint!');
  }
};

export const verifyPomeriumJWT = async (
  jwt: string,
  authenticateBaseUrl: string,
  issuer: string,
  audience: string | string[],
) => {
  const data = await getJWKsData(authenticateBaseUrl);
  const JWKS = jose.createLocalJWKSet(data);
  return jose.jwtVerify(jwt, JWKS, { issuer, audience });
};

export const withHttps = (url: string) => (!/^https?:\/\//i.test(url) ? `https://${url}` : url);