import * as jose from "jose";

const getClientJwt = () =>
  fetch(window.location.origin + '/.pomerium/jwt')
    .then((d) => d.text());

export const parseJWT = (token) => {
  return jose.decodeJwt(token)
}

export const getJWKsData = async (baseUrl) => {
  const url = baseUrl + '/.well-known/pomerium/jwks.json';
  try {
    const r = await fetch(url);
    return await r.json();
  } catch (e) {
    console.log(e);
    throw new Error("Error accessing JWKS endpoint!");
  }
}

export const verifyPomeriumJWT = async (
  jwt,
  authenticateBaseUrl,
  issuer,
  audience
)  => {
  const jwksUrl = authenticateBaseUrl + '/.well-known/pomerium/jwks.json';
  console.log(jwksUrl);
  const test = await jose.jwtVerify(jwt, jose.createRemoteJWKSet(new URL(jwksUrl)), { issuer, audience })
  console.log('there');
  return test;
}
