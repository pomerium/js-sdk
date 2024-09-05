# Pomerium Javascript SDK
An easy way to verify and parse Pomerium's JWT.

Getting Started
```yarn add @pomerium/js-sdk```

Basic Usage:

```
const jwtVerifier = new PomeriumVerifier({
    issuer: 'myauthenticate.com', 
    audience: [
      'mydomain.com'
    ], 
    expirationBuffer: 20
});
```
The parameters are optional. Issuer and Audience can be trusted on first use from parsing the JWT. 

ExpirationBuffer is used to add padding in seconds to prevent throwing errors for expired JWTs that 
may have differing server times. It defaults to 0.

For browsers: 

```
getBrowserUser().then((r) => console.log(r));
```

In node you will want to verify the X-Pomerium-Jwt-Assertion header:

```
jwtVerifier.verifyJwt(jwt).then((r) => console.log(r));
```

See the /examples directory for Express and React samples.

Using the verifier class is the easiest way to verify your JWT. However the class itself uses the functions
in util.js which are also exported. One useful function there is the logout one which will log you out from the browser.
