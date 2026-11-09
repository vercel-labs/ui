// Builds every package, typechecks the packed packages as a strict consumer
// would (`pnpm check:packages`), and uploads them to the registry's private
// Blob store.
//
//   pnpm release                 Needs the Blob store's credentials, from `vercel env pull .env.local`.
//   pnpm release --dir <folder>  Writes to a folder instead, for a local run.
//
// Every package gets the same version, `0.0.0-<UTC time>.g<commit>`, so
// `npm update` moves to the latest release and the lockfile shows which
// commit it came from. The adapters take `@ui-sdk/core` as a peer at that
// exact version, so an app installs one core, the one they were built with. Each package lands at
// `packages/@ui-sdk/<name>/<name>-<version>.tgz`, then its
// `packages/@ui-sdk/<name>/index.json` gains the version and points
// `latest` at it. `lib/registry.ts` serves that layout, at the root of the registry's host.
import { get, put } from "@vercel/blob"
import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { parseArgs } from "node:util"

const { values: flags } = parseArgs({ options: { dir: { type: "string" } } })
const envFile = path.join(import.meta.dirname, "../.env.local")
if (existsSync(envFile)) {
  process.loadEnvFile(envFile)
}

const root = path.resolve(import.meta.dirname, "../../..")
const store = flags.dir ? folderStore(path.resolve(flags.dir)) : blobStore()

const run = (command, args, cwd = root) =>
  execFileSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  }).trim()

if (!flags.dir && run("git", ["status", "--porcelain", "--", "packages"])) {
  throw new Error(
    "packages/ has uncommitted changes. Commit or stash them so the release matches a commit."
  )
}

const stamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14)
const version = `0.0.0-${stamp}.g${run("git", ["rev-parse", "--short=8", "HEAD"])}`
const names = readdirSync(path.join(root, "packages"))

execFileSync("pnpm", ["build"], { cwd: root, stdio: "inherit" })
// Every package ships the docs as Markdown, since the site isn't public.
execFileSync("node", ["scripts/package-docs.mjs"], {
  cwd: root,
  stdio: "inherit",
})
// A declaration that fails in a consumer's typecheck stops the release before anything uploads.
execFileSync("pnpm", ["check:packages"], { cwd: root, stdio: "inherit" })

const work = mkdtempSync(path.join(tmpdir(), "ui-sdk-release-"))
try {
  // Every tarball goes up before any index points at it.
  const releases = names.map((name) => packRelease(name))
  for (const release of releases) {
    await store.write(release.pathname, release.tarball, false)
  }
  for (const release of releases) {
    await addToIndex(release)
  }
} finally {
  rmSync(work, { recursive: true, force: true })
}
console.log(
  `\nReleased ${names.map((name) => `@ui-sdk/${name}`).join(", ")} at ${version}.`
)

// Packs a package as `pnpm pack` publishes it, then stamps the release version on it.
function packRelease(name) {
  const tarball = run(
    "pnpm",
    ["pack", "--pack-destination", work],
    path.join(root, "packages", name)
  )
    .split("\n")
    .at(-1)
  const dir = path.join(work, name)
  mkdirSync(dir)
  run("tar", ["-xzf", tarball, "-C", dir])

  const manifestPath = path.join(dir, "package", "package.json")
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"))
  manifest.version = version
  delete manifest.scripts
  delete manifest.devDependencies
  for (const field of ["dependencies", "peerDependencies"]) {
    for (const dependency of Object.keys(manifest[field] ?? {})) {
      if (dependency.startsWith("@ui-sdk/")) {
        manifest[field][dependency] = version
      }
    }
  }
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

  const file = path.join(work, `${name}-${version}.tgz`)
  run("tar", ["-czf", file, "-C", dir, "package"])
  const bytes = readFileSync(file)
  return {
    manifest,
    tarball: bytes,
    pathname: `packages/${manifest.name}/${name}-${version}.tgz`,
    dist: {
      shasum: createHash("sha1").update(bytes).digest("hex"),
      integrity: `sha512-${createHash("sha512").update(bytes).digest("base64")}`,
    },
  }
}

async function addToIndex({ manifest, pathname, dist }) {
  const indexPath = `packages/${manifest.name}/index.json`
  const index = JSON.parse(
    (await store.read(indexPath)) ?? `{"versions":{},"time":{}}`
  )
  index.name = manifest.name
  // Installers resolve from these fields; the rest of the manifest is in the tarball.
  index.versions[version] = {
    name: manifest.name,
    version,
    type: manifest.type,
    dependencies: manifest.dependencies,
    peerDependencies: manifest.peerDependencies,
    peerDependenciesMeta: manifest.peerDependenciesMeta,
    dist: {
      ...dist,
      tarball: pathname.replace(/^packages\/(.+)\/([^/]+)$/, "$1/-/$2"),
    },
  }
  index["dist-tags"] = { ...index["dist-tags"], latest: version }
  index.time[version] = new Date().toISOString()
  await store.write(indexPath, JSON.stringify(index), true)
  console.log(`${manifest.name}@${version}`)
}

function blobStore() {
  // Stores connected with OIDC get BLOB_STORE_ID and VERCEL_OIDC_TOKEN, older ones BLOB_READ_WRITE_TOKEN.
  if (!process.env.BLOB_STORE_ID && !process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      `No Blob store credentials in ${envFile}. Run \`vercel env pull .env.local\` in apps/registry, after connecting the store to the project's Development environment.`
    )
  }
  return {
    async read(pathname) {
      const result = await get(pathname, { access: "private", useCache: false })
      return result?.statusCode === 200
        ? new Response(result.stream).text()
        : null
    },
    async write(pathname, body, allowOverwrite) {
      await put(pathname, body, {
        access: "private",
        addRandomSuffix: false,
        allowOverwrite,
      })
    },
  }
}

function folderStore(dir) {
  return {
    async read(pathname) {
      try {
        return readFileSync(path.join(dir, pathname), "utf8")
      } catch {
        return null
      }
    },
    async write(pathname, body) {
      mkdirSync(path.dirname(path.join(dir, pathname)), { recursive: true })
      writeFileSync(path.join(dir, pathname), body)
    },
  }
}
