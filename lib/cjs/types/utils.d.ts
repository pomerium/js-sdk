import * as jose from 'jose';
export declare const getClientJwt: () => Promise<string>;
export declare const parseJWT: (token: string) => jose.JWTPayload;
export declare const getJWKsData: (baseUrl: string) => Promise<jose.JSONWebKeySet>;
export declare const verifyPomeriumJWT: (jwt: string, authenticateBaseUrl: string, issuer: string, audience: string | string[]) => Promise<jose.JWTVerifyResult & jose.ResolvedKey>;
export declare const withHttps: (url: string) => string;
//# sourceMappingURL=utils.d.ts.map