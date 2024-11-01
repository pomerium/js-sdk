import * as jose from 'jose';

export interface UserInfo {
  email?: string;
  name?: string;
  groups?: string[];
  /** user ID */
  user?: string;
  /** custom claims */
  [claim: string]: unknown;
}

export const getBrowserUser = (): Promise<UserInfo> =>
  fetch(window.location.origin + '/.pomerium/user').then((r) => r.json());

/**
 * @deprecated Only supported by Pomerium v0.26 and older. Newer deployments
 * should use {@link getBrowserUser} instead.
 */
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

export const signOut = (redirectUrl?: string) => {
  let location = window.location.origin + '/.pomerium/sign_out';
  if (redirectUrl) {
    location += '?pomerium_redirect_uri=' + encodeURIComponent(redirectUrl);
  }
  window.location.href = location;
}
