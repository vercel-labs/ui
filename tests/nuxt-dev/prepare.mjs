import { execFileSync } from "node:child_process"
import { mkdirSync, readdirSync, renameSync, rmSync } from "node:fs"
import { fileURLToPath } from "node:url"

// The app installs packed copies, like an app installing from npm. Vite never
// pre-bundles a linked workspace package, so a link can't show two copies.
const here = (path) => fileURLToPath(new URL(path, import.meta.url))
const vendor = here("./.vendor/")
const app = here("./app/")
const run = (command, args, cwd) =>
  execFileSync(command, args, { cwd, stdio: "inherit" })

rmSync(vendor, { recursive: true, force: true })
mkdirSync(vendor)
for (const name of ["core", "vue"]) {
  const dir = here(`../../packages/${name}/`)
  run("pnpm", ["build"], dir)
  run("pnpm", ["pack", "--pack-destination", vendor], dir)
}
for (const file of readdirSync(vendor)) {
  renameSync(vendor + file, vendor + file.replace(/-\d.*\.tgz$/, ".tgz"))
}
for (const dir of ["node_modules", ".nuxt", ".output"]) {
  rmSync(app + dir, { recursive: true, force: true })
}
run("pnpm", ["install", "--ignore-workspace", "--lockfile=false"], app)
