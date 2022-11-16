import { getClientJwt, parseJWT, verifyPomeriumJWT, withHttps } from './utils';
export class PomeriumVerifier {
    issuer;
    audience;
    expirationBuffer; //doesn't seem like our jwts have the expires part only issued at
    firstUse;
    jwtData;
    verifiedJwtData;
    constructor({ issuer = '', audience = [], expirationBuffer = 0 }) {
        this.issuer = issuer;
        this.audience = Array.isArray(audience) ? audience : [audience];
        this.expirationBuffer = expirationBuffer;
        this.firstUse = true;
        this.jwtData = {};
        this.verifiedJwtData = {};
    }
    async verifyBrowserUser() {
        const jwt = await getClientJwt();
        return this.verifyJwt(jwt);
    }
    async verifyJwt(jwt) {
        this.jwtData = parseJWT(jwt);
        if (this.firstUse) {
            this.firstUse = false;
            this.tofu();
        }
        if (this.jwtData?.iss !== this.issuer) {
            throw new Error('JWT was not issued by the correct authority: ' + this.issuer);
        }
        if (!this.audience.some((item) => this.audToArray(this.jwtData?.aud || []).indexOf(item) > -1)) {
            throw new Error('The audience did not match expected values: ' + this.audience.join(', '));
        }
        const verified = await verifyPomeriumJWT(jwt, withHttps(this.issuer), this.issuer, this.audience);
        this.verifiedJwtData = verified.payload;
        if (!this.isLoggedIn()) {
            throw new Error('The jwt is expired!');
        }
        return verified;
    }
    tofu() {
        if (!this.issuer) {
            this.issuer = this.jwtData?.iss || '';
        }
        if (!this.audience?.length) {
            this.audience = this.audToArray(this.jwtData?.aud || []);
        }
    }
    audToArray(aud) {
        return Array.isArray(aud) ? aud : [aud];
    }
    isLoggedIn() {
        const exp = this?.verifiedJwtData?.exp;
        if (!exp) {
            return false;
        }
        return exp < (Date.now() + this.expirationBuffer);
    }
}
