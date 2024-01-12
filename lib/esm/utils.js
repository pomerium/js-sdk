"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signOut = exports.withHttps = exports.verifyPomeriumJWT = exports.getJWKsData = exports.parseJWT = exports.getClientJwt = void 0;
const jose = __importStar(require("jose"));
const getClientJwt = () => fetch(window.location.origin + '/.pomerium/jwt').then((d) => d.text());
exports.getClientJwt = getClientJwt;
const parseJWT = (token) => {
    return jose.decodeJwt(token);
};
exports.parseJWT = parseJWT;
const getJWKsData = (baseUrl) => {
    const url = (0, exports.withHttps)(baseUrl) + '/.well-known/pomerium/jwks.json';
    try {
        return fetch(url).then(r => r.json());
    }
    catch (e) {
        console.log(e);
        throw new Error('Error accessing JWKS endpoint!');
    }
};
exports.getJWKsData = getJWKsData;
const verifyPomeriumJWT = async (jwt, authenticateBaseUrl, issuer, audience) => {
    const data = await (0, exports.getJWKsData)(authenticateBaseUrl);
    const JWKS = jose.createLocalJWKSet(data);
    return jose.jwtVerify(jwt, JWKS, { issuer, audience });
};
exports.verifyPomeriumJWT = verifyPomeriumJWT;
const withHttps = (url) => (!/^https?:\/\//i.test(url) ? `https://${url}` : url);
exports.withHttps = withHttps;
const signOut = (redirectUrl) => {
    let location = window.location.origin + '/.pomerium/sign_out';
    if (redirectUrl) {
        location += '?pomerium_redirect_uri=' + encodeURIComponent(redirectUrl);
    }
    window.location.href = location;
};
exports.signOut = signOut;
