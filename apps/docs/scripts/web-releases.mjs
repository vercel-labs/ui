// Copies the browser build of every published `@ui-sdk/web` release into
// `public/`, so the site serves each one at its own URL for pages without a
// bundler:
//
//   /web@1.2.0.js         The loader, which defines components as their tags appear.
//   /web@1.2.0/tabs.js    One component, with its shared chunks beside it.
//
// A deploy only has the files of the commit it builds, so every release comes
// back from the registry each time, and a page pinned to an old version keeps
// working. `next.config.mjs` adds the headers and points `/web@1.js` at the
// newest 1.x. A release without a `browser/` folder, from before it existed,
// is skipped, and so is everything when the package isn't published yet.
//
//   node scripts/web-releases.mjs   Runs before `next build`.
//
// WEB_RELEASES_REGISTRY  The registry to read, npm's by default.
// WEB_RELEASES_TOKEN     A token for a private registry.
import { execFileSync } from "node:child_process"
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"

const registry = (process.env.WEB_RELEASES_REGISTRY ?? "https://registry.npmjs.org").replace(/\/$/, "")
const token = process.env.WEB_RELEASES_TOKEN
const publicDir = path.join(import.meta.dirname, "../public")
const headers = token ? { authorization: `Bearer ${token}` } : {}

const response = await fetch(`${registry}/@ui-sdk%2fweb`, { headers })
if (response.status === 404) {
  console.log(`@ui-sdk/web isn't published on ${registry}, so the site serves no releases.`)
  process.exit(0)
}
if (!response.ok) throw new Error(`${registry} answered ${response.status} for @ui-sdk/web.`)
const { versions } = await response.json()

const work = mkdtempSync(path.join(tmpdir(), "ui-sdk-web-releases-"))
let copied = 0
try {
  for (const [version, { dist }] of Object.entries(versions)) {
    if (existsSync(path.join(publicDir, `web@${version}.js`))) continue
    const browser = await download(version, dist.tarball)
    if (!browser) continue
    cpSync(path.join(browser, "web.js"), path.join(publicDir, `web@${version}.js`))
    cpSync(path.join(browser, "web"), path.join(publicDir, `web@${version}`), { recursive: true })
    copied++
  }
} finally {
  rmSync(work, { recursive: true, force: true })
}
console.log(`Copied ${copied} @ui-sdk/web releases into public/.`)

// Unpacks a release's `browser/` folder, or returns nothing when it has none.
async function download(version, tarball) {
  const file = await fetch(tarball, { headers })
  if (!file.ok) throw new Error(`${tarball} answered ${file.status}.`)
  const archive = path.join(work, `${version}.tgz`)
  writeFileSync(archive, Buffer.from(await file.arrayBuffer()))
  const folder = path.join(work, version)
  mkdirSync(folder)
  try {
    execFileSync("tar", ["-xzf", archive, "-C", folder, "package/browser"], { stdio: "ignore" })
  } catch {
    return undefined
  }
  return path.join(folder, "package/browser")
}
