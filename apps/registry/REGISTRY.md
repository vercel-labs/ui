# Registry

`apps/registry` is an npm registry for the `@ui-sdk` packages, deployed as its own Vercel project and served at the root of its host, so people can install them on any machine without access to this repo. Tarballs live in a private Blob store, and the registry streams them to anyone who asks. No token is needed.

## Set up once

1. In the registry's Vercel project, create a **private** Blob store, or connect the one the docs project used while it served the registry, for Production, Preview and Development, so the site and `vercel env pull` both get it. Vercel then sets `BLOB_STORE_ID` (or `BLOB_READ_WRITE_TOKEN` on older stores). Redeploy after connecting a store.
2. Turn on Web Analytics for the registry project. Each tarball download is a `download` event with `package` and `version`, under Events in the Analytics tab. Custom events need a Pro or Enterprise team.
3. The registry project uses Standard Protection, so preview deployments stay behind Vercel SSO and only production is public. npm can't sign in. The docs project keeps its full protection, since it no longer serves the registry.

## Release

```bash
cd apps/registry && vercel env pull .env.local   # The Blob credentials. Pull again if they expire.
pnpm release
```

This builds every package, typechecks the packed packages as a strict consumer would (`pnpm check:packages`) and stops if any declaration fails, writes the docs into each one as Markdown (`docs/`, from `scripts/package-docs.mjs`), stamps them all with `0.0.0-<UTC time>.g<commit>`, uploads the tarballs and points `latest` at them. `pnpm release --dir <folder>` writes to a folder instead, to check a release locally.

## Install

Point the `@ui-sdk` scope at the registry in the project's `.npmrc` (or `~/.npmrc`), then install as usual:

```ini
@ui-sdk:registry=https://<registry domain>/
```

```bash
npm install @ui-sdk/react @ui-sdk/core   # npm update picks up new releases.
pnpm add @ui-sdk/react @ui-sdk/core      # pnpm update --latest picks up new releases.
```

An older `.npmrc` with an `_authToken` line for the registry keeps working. The registry ignores the token.

## How it works

`app/[[...path]]/route.ts` hands every request to `lib/registry.ts`, which answers the requests installers make: a package's versions (`/@ui-sdk%2f<name>`) and a version's tarball (`/@ui-sdk/<name>/-/<file>.tgz`), streamed from the private store. `lib/registry-store.ts` reads the Blob store. `scripts/release.mjs` writes the layout the registry reads: `packages/@ui-sdk/<name>/index.json` beside each tarball.
