import { getClientJwt, parseJWT, verifyPomeriumJWT } from './utils';
export class PomeriumVerifier {
    issuer;
    audience;
    expirationBuffer; //doesn't seem like our jwts have the expires part only issued at
    firstUse;
    jwtData;
    constructor({ issuer = '', audience = [], expirationBuffer = 0 }) {
        this.issuer = issuer;
        this.audience = Array.isArray(audience) ? audience : [audience];
        this.expirationBuffer = expirationBuffer;
        this.firstUse = true;
        this.jwtData = {};
    }
    async verifyBrowserUser() {
        const jwt = await getClientJwt();
        return this.verifyJwt(jwt);
    }
    verifyJwt(jwt) {
        this.jwtData = parseJWT(jwt);
        if (this.firstUse) {
            this.firstUse = false;
            this.tofu();
        }
        if (this.jwtData?.iss !== this.issuer) {
            throw new Error('JWT was not issued by the correct authority: ' + this.issuer);
        }
        if (!this.audience.some((item) => this.audToArray(this.jwtData?.aud || []).includes(item))) {
            throw new Error('The audience did not match expected values: ' + this.audience.join(', '));
        }
        return verifyPomeriumJWT(jwt, this.withHttps(this.issuer), this.issuer, this.audience);
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
    withHttps = (url) => (!/^https?:\/\//i.test(url) ? `https://${url}` : url);
}
