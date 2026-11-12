// Copies the browser build of `@ui-sdk/web` into `public/`, so the site
// serves each version at its own URL for pages without a bundler:
//
//   /web@1.2.0.js         The loader, which defines components as their tags appear.
//   /web@1.2.0/tabs.js    One component, with its shared chunks beside it.
//
// A deploy only has the files of the commit it builds, so every published
// release comes back from the registry each time, and a page pinned to an old
// version keeps working. A release without a `browser/` folder, from before it
// existed, is skipped. The commit's own source is built too, as a prerelease
// named after the commit, like `0.4.1-g1dc2c96`, so a deploy works before
// anything is published. `next.config.mjs` adds the headers and points
// `/web@1.js` at the newest 1.x, which is a release once there is one.
//
//   node scripts/web-releases.mjs   Runs before `next build`.
//
// WEB_RELEASES_REGISTRY  The registry to read, npm's by default.
import { execFileSync } from "node:child_process"
import {
  cpSync,
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

const registry = (
  process.env.WEB_RELEASES_REGISTRY ?? "https://registry.npmjs.org"
).replace(/\/$/, "")
const publicDir = path.join(import.meta.dirname, "../public")
const packageDir = path.join(import.meta.dirname, "../../../packages/web")

const response = await fetch(`${registry}/@ui-sdk%2fweb`)
if (!response.ok && response.status !== 404) {
  throw new Error(`${registry} answered ${response.status} for @ui-sdk/web.`)
}
const { versions } = response.ok ? await response.json() : { versions: {} }

const work = mkdtempSync(path.join(tmpdir(), "ui-sdk-web-releases-"))
let copied = 0
try {
  for (const [version, { dist }] of Object.entries(versions)) {
    if (existsSync(path.join(publicDir, `web@${version}.js`))) {
      continue
    }
    const browser = await download(version, dist.tarball)
    if (!browser) {
      continue
    }
    cpSync(
      path.join(browser, "web.js"),
      path.join(publicDir, `web@${version}.js`)
    )
    cpSync(path.join(browser, "web"), path.join(publicDir, `web@${version}`), {
      recursive: true,
    })
    if (existsSync(path.join(browser, "web.css"))) {
      cpSync(
        path.join(browser, "web.css"),
        path.join(publicDir, `web@${version}.css`)
      )
    }
    copied++
  }
} finally {
  rmSync(work, { recursive: true, force: true })
}
console.log(
  `Copied ${copied} @ui-sdk/web releases from ${registry} into public/.`
)

const commit = (
  process.env.VERCEL_GIT_COMMIT_SHA ??
  execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" })
).slice(0, 7)
const { version } = JSON.parse(
  readFileSync(path.join(packageDir, "package.json"), "utf8")
)
// The leading 0 ranks it below every release of its version, betas too.
const source = `${version.split("-")[0]}-0.g${commit}`
// An earlier commit's build, from a local run, would compete for `/web@0.js`.
for (const file of readdirSync(publicDir)) {
  if (/^web@\d+\.\d+\.\d+-0\.g[0-9a-f]{7}(\.js|\.css)?$/.test(file)) {
    rmSync(path.join(publicDir, file), { recursive: true })
  }
}
execFileSync("node", ["../../scripts/build/browser.mjs"], {
  cwd: packageDir,
  stdio: "inherit",
})
cpSync(
  path.join(packageDir, "browser/web.js"),
  path.join(publicDir, `web@${source}.js`)
)
cpSync(
  path.join(packageDir, "browser/web"),
  path.join(publicDir, `web@${source}`),
  { recursive: true }
)
cpSync(
  path.join(packageDir, "browser/web.css"),
  path.join(publicDir, `web@${source}.css`)
)
console.log(`Built @ui-sdk/web ${source} from source into public/.`)

// Unpacks a release's `browser/` folder, or returns nothing when it has none.
async function download(version, tarball) {
  const file = await fetch(tarball)
  if (!file.ok) {
    throw new Error(`${tarball} answered ${file.status}.`)
  }
  const archive = path.join(work, `${version}.tgz`)
  writeFileSync(archive, Buffer.from(await file.arrayBuffer()))
  const folder = path.join(work, version)
  mkdirSync(folder)
  try {
    execFileSync("tar", ["-xzf", archive, "-C", folder, "package/browser"], {
      stdio: "ignore",
    })
  } catch {
    return undefined
  }
  return path.join(folder, "package/browser")
}
