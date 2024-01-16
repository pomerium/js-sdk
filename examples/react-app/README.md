# React Integration Test

This is an integration test for Browser Environments. You can run the simple React App locally
and then add a route to your Pomerium instance for it configured with a basic policy.

You will be able to see the output from your user's JWT on the main App landing page.

Run the React App from this directory using Node 18 or later:
```yarn start```

Then in you Pomerium Config or the Enterprise Console add a route similar to this:
```
- from: https://react.localhost.pomerium.io
  to: http://localhost:3000
  pass_identity_headers: true
  allowed_domains:
    - pomerium.com
    - gmail.com
```

Navigate in your browser to:
```
https://react.localhost.pomerium.io
```

You should see the output of your verified JWT or an error in the console if something is off.

You can view the sample code on App.js