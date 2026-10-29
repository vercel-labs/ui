import { readdirSync } from "node:fs"

// The routes for the `@ui-sdk/web` releases `scripts/web-releases.mjs` copies
// into `public/`. An exact version, like `/web@1.2.0.js`, never changes, so it
// caches for good, and allows other sites: a module script from another
// origin loads only with CORS. `proxy.ts` sends a major, like `/web@1.js`, to
// its newest release.
const exact = "web@\\d+\\.\\d+\\.\\d+[^/]*"

/** The released versions in `publicDir`, like `["1.2.0", "1.3.0"]`. */
function releasesIn(publicDir) {
  return readdirSync(publicDir).flatMap((file) => file.match(/^web@(\d+\.\d+\.\d+.*)\.js$/)?.[1] ?? [])
}

function webReleaseHeaders() {
  const headers = [
    { key: "Access-Control-Allow-Origin", value: "*" },
    { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
  ]
  return [
    { source: `/:file(${exact}\\.js)`, headers },
    { source: `/:folder(${exact})/:path*`, headers },
  ]
}

/**
 * The newest version of each major, by semver precedence. Like `^1` in npm,
 * a major skips prereleases, unless it has nothing else yet, as before 1.0.
 */
function newestByMajor(versions) {
  const newest = new Map()
  for (const version of versions) {
    const major = version.split(".")[0]
    const current = newest.get(major)
    const isNewer =
      !current ||
      (isPrerelease(current) === isPrerelease(version)
        ? compareVersions(version, current) > 0
        : isPrerelease(current))
    if (isNewer) newest.set(major, version)
  }
  return newest
}

const isPrerelease = (version) => splitVersion(version)[1].length > 0

// https://semver.org/#spec-item-11: numbers compare as numbers, and a
// prerelease, like `1.0.0-beta`, comes before its release.
function compareVersions(a, b) {
  const [aRelease, aPre] = splitVersion(a)
  const [bRelease, bPre] = splitVersion(b)
  return (
    compareIdentifiers(aRelease, bRelease) ||
    (!aPre.length || !bPre.length ? bPre.length - aPre.length : compareIdentifiers(aPre, bPre))
  )
}

function splitVersion(version) {
  const [release, ...pre] = version.split("+")[0].split("-")
  return [release.split("."), pre.length ? pre.join("-").split(".") : []]
}

function compareIdentifiers(a, b) {
  for (let index = 0; index < Math.max(a.length, b.length); index++) {
    if (a[index] === undefined || b[index] === undefined) return a[index] === undefined ? -1 : 1
    const numeric = /^\d+$/.test(a[index]) && /^\d+$/.test(b[index])
    if (numeric && Number(a[index]) !== Number(b[index])) return Number(a[index]) < Number(b[index]) ? -1 : 1
    if (!numeric && a[index] !== b[index]) return a[index] < b[index] ? -1 : 1
  }
  return 0
}

export { compareVersions, newestByMajor, releasesIn, webReleaseHeaders }
