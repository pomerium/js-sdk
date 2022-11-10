import * as jose from "jose";
export declare const getClientJwt: () => Promise<string>;
export declare const parseJWT: (token: string) => jose.JWTPayload;
export declare const getJWKsData: (baseUrl: string) => Promise<any>;
export declare const verifyPomeriumJWT: (jwt: string, authenticateBaseUrl: string, issuer: string, audience: string) => Promise<jose.JWTVerifyResult & jose.ResolvedKey>;
//# sourceMappingURL=index.d.ts.map