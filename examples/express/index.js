const express = require("express");
const { PomeriumVerifier } = require('../../lib/cjs/verifier');
const app = express();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; //just for dev

app.get("/test", (request, response) => {
  const jwtVerifier = new PomeriumVerifier({});
  jwtVerifier.verifyJwt(request.get('X-Pomerium-Jwt-Assertion')).then(r => response.send(r))
});

app.listen(3010, () => {
  console.log("Listen on the port 3010...");
});