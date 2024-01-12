# Express Integration Test

This is an integration test for Node Environments. You can run the simple Express server locally
and then add a route to your Pomerium instance for it configured with a basic policy. 

You will be able to see the output from your user's JWT on the /tofu endpoint. 

Run the express server from this directory using Node 18 or later:
```node index.js --experimental-fetch```

Then in you Pomerium Config or the Enterprise Console add a route similar to this:
```
- from: https://express.localhost.pomerium.io
  to: http://localhost:3010
  pass_identity_headers: true
  allowed_domains:
    - pomerium.com
    - gmail.com
```

Navigate in your browser to:
```
https://express.localhost.pomerium.io/tofu
```

You should see the output of your verified JWT or an error will be thrown if something is off.