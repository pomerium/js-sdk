import { getClientJwt, parseJWT, verifyPomeriumJWT } from './utils';
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

  constructor({ issuer = '', audience = [], expirationBuffer = 0 }: verifierConfig) {
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

  verifyJwt(jwt: string) {
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

  audToArray(aud: string | string[]) {
    return Array.isArray(aud) ? aud : [aud];
  }

  withHttps = (url: string) => (!/^https?:\/\//i.test(url) ? `https://${url}` : url);
}
