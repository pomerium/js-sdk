import { getBrowserUser, getClientJwt, parseJWT, verifyPomeriumJWT, withHttps } from './utils.js';
import * as jose from 'jose';

export interface verifierConfig {
  issuer?: string;
  audience?: string | string[];
  expirationBuffer?: number;
}

export class PomeriumVerifier {
  public issuer: string;
  public audience: string[];
  public expirationBuffer: number; //doesn't seem like our jwts have the expires part only issued at
  public firstUse: boolean;
  public jwtData: jose.JWTPayload;
  public verifiedJwtData: jose.JWTPayload;

  constructor({ issuer = '', audience = [], expirationBuffer = 0 }: verifierConfig) {
    this.issuer = issuer;
    this.audience = Array.isArray(audience) ? audience : [audience];
    this.expirationBuffer = expirationBuffer;
    this.firstUse = true;
    this.jwtData = {};
    this.verifiedJwtData = {};
  }

  /**
   * @deprecated Only supported by Pomerium v0.26 and older. Newer deployments
   * should use {@link getBrowserUser} instead.
   */
  async verifyBrowserUser() {
    const jwt = await getClientJwt();
    return this.verifyJwt(jwt);
  }

  async verifyJwt(jwt: string) {
    this.jwtData = parseJWT(jwt);

    if (this.firstUse) {
      this.firstUse = false;
      this.tofu();
    }

    if (this.jwtData?.iss !== this.issuer) {
      throw new Error('JWT was not issued by the correct authority: ' + this.issuer);
    }
    if (!this.audience.some((item) => this.audToArray(this.jwtData?.aud || []).indexOf(item) > -1)) {
      throw new Error('The audience did not match expected value(s): ' + this.audience.join(', '));
    }

    const verified = await verifyPomeriumJWT(jwt, withHttps(this.issuer), this.issuer, this.audience);
    this.verifiedJwtData = verified.payload;
    if (!this.isLoggedIn()){
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

  audToArray(aud: string | string[]) {
    return Array.isArray(aud) ? aud : [aud];
  }

  isLoggedIn() {
    const exp = this?.verifiedJwtData?.exp;
    if (!exp) {
      return false;
    }
    const currentDateInSeconds = new Date().getTime() / 1000;
    return currentDateInSeconds < (exp + this.expirationBuffer);
  }
}
