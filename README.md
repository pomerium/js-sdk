# Pomerium Javascript SDK

An easy way to verify and parse Pomerium's JWT.

Getting Started
`yarn add @pomerium/js-sdk`

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

## Releasing

Releases are automated with [release-please](https://github.com/googleapis/release-please) in the [release workflow](.github/workflows/release.yaml).

1. Merge changes to `main` using [conventional commits](https://www.conventionalcommits.org/) (e.g. `fix:`, `feat:`, `feat!:`).
2. release-please opens or updates a release PR that bumps `version` in `package.json` and updates `CHANGELOG.md`.
3. Merging the release PR creates the `vX.Y.Z` tag and GitHub release, then publishes the package to npm via [Trusted Publishing](https://docs.npmjs.com/trusted-publishers/) (OIDC, no npm token) with a [provenance statement](https://docs.npmjs.com/generating-provenance-statements/).

To release a specific version, such as a prerelease, add a `Release-As: 1.3.0-beta.1` footer to a commit message. Prerelease versions are marked as pre-releases on GitHub and published under the `next` dist-tag instead of `latest`.

release-please keeps the prerelease suffix on later releases (e.g. `1.3.0-beta.1` → `1.3.1-beta.1`). To go back to a stable version, add a `Release-As: 1.3.0` footer.

### Prerequisites

1. **npm Trusted Publisher** must be configured by an npm org admin at `https://www.npmjs.com/package/@pomerium/js-sdk/access`:
   - Select **GitHub Actions** as the trusted publisher.
   - Set **Organization** to `pomerium`, **Repository** to `js-sdk`, **Workflow** to `release.yaml`, and **Environment** to `npm-publish`.
2. **GitHub Environment:** the publish job always runs in the `npm-publish` environment, which must match the Trusted Publisher setting above. Optionally, add required reviewers to it in the repository settings to require manual approval before publishing.
