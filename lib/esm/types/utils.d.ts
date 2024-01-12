import * as jose from 'jose';
export declare const getClientJwt: () => Promise<string>;
export declare const parseJWT: (token: string) => jose.JWTPayload;
export declare const getJWKsData: (baseUrl: string) => Promise<jose.JSONWebKeySet>;
export declare const verifyPomeriumJWT: (jwt: string, authenticateBaseUrl: string, issuer: string, audience: string | string[]) => Promise<jose.JWTVerifyResult & jose.ResolvedKey<jose.KeyLike>>;
export declare const withHttps: (url: string) => string;
export declare const signOut: (redirectUrl?: string) => void;
//# sourceMappingURL=utils.d.ts.map