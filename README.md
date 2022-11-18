# Pomerium Javascript SDK

Eventually will work with both Node and Browsers. Initially concentrating on Browsers.

Getting Started

```yarn```

```yarn link```

Then in the repo you want to use it:

```yarn link @pomerium/pomerium-js-sdk```

Basic Usage:

```
const jwtVerifier = new PomeriumVerifier({
    issuer = 'myauthenticate.com', 
    audience = [
      'mydomain.com'
    ], 
    expirationBuffer = 20
});
```
The parameters are optional. Issuer and Audience can be trusted on first use from parsing the JWT. 

ExpirationBuffer is used to add padding in seconds to prevent throwing errors for expired JWTs that 
may have differing server times. It defaults to 0.

For browsers: 

```
jwtVerifier.verifyBrowserUser().then((r) => console.log(r));
```

In node you will want to verify the X-Pomerium-Jwt-Assertion header:

```
jwtVerifier.verifyJwt(jwt).then((r) => console.log(r));
```

See the /examples directory for Express and React samples.