"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PomeriumVerifier = void 0;
const utils_1 = require("./utils");
class PomeriumVerifier {
    constructor({ issuer = '', audience = [], expirationBuffer = 0 }) {
        this.withHttps = (url) => (!/^https?:\/\//i.test(url) ? `https://${url}` : url);
        this.issuer = issuer;
        this.audience = Array.isArray(audience) ? audience : [audience];
        this.expirationBuffer = expirationBuffer;
        this.firstUse = true;
        this.jwtData = {};
    }
    verifyBrowserUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const jwt = yield (0, utils_1.getClientJwt)();
            return this.verifyJwt(jwt);
        });
    }
    verifyJwt(jwt) {
        var _a;
        this.jwtData = (0, utils_1.parseJWT)(jwt);
        if (this.firstUse) {
            this.firstUse = false;
            this.tofu();
        }
        if (((_a = this.jwtData) === null || _a === void 0 ? void 0 : _a.iss) !== this.issuer) {
            throw new Error('JWT was not issued by the correct authority: ' + this.issuer);
        }
        if (!this.audience.some((item) => { var _a; return this.audToArray(((_a = this.jwtData) === null || _a === void 0 ? void 0 : _a.aud) || []).includes(item); })) {
            throw new Error('The audience did not match expected values: ' + this.audience.join(', '));
        }
        return (0, utils_1.verifyPomeriumJWT)(jwt, this.withHttps(this.issuer), this.issuer, this.audience);
    }
    tofu() {
        var _a, _b, _c;
        if (!this.issuer) {
            this.issuer = ((_a = this.jwtData) === null || _a === void 0 ? void 0 : _a.iss) || '';
        }
        if (!((_b = this.audience) === null || _b === void 0 ? void 0 : _b.length)) {
            this.audience = this.audToArray(((_c = this.jwtData) === null || _c === void 0 ? void 0 : _c.aud) || []);
        }
    }
    audToArray(aud) {
        return Array.isArray(aud) ? aud : [aud];
    }
}
exports.PomeriumVerifier = PomeriumVerifier;
