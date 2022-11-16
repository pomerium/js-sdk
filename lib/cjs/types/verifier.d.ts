import * as jose from 'jose';
export interface verifierConfig {
    issuer?: string;
    audience?: string | string[];
    expirationBuffer?: number;
}
export declare class PomeriumVerifier {
    issuer: string;
    audience: string[];
    expirationBuffer: number;
    firstUse: boolean;
    jwtData: jose.JWTPayload;
    verifiedJwtData: jose.JWTPayload;
    constructor({ issuer, audience, expirationBuffer }: verifierConfig);
    verifyBrowserUser(): Promise<jose.JWTVerifyResult & jose.ResolvedKey>;
    verifyJwt(jwt: string): Promise<jose.JWTVerifyResult & jose.ResolvedKey>;
    tofu(): void;
    audToArray(aud: string | string[]): string[];
    isLoggedIn(): boolean;
}
//# sourceMappingURL=verifier.d.ts.map