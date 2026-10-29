// Runs Prettier with `--check` or `--write` on the files this branch changed
// since it left origin/main, plus untracked ones. Main has hundreds of files
// Prettier would rewrite, so formatting the whole repository would bury every
// diff. Prettier skips files .prettierignore lists and types it can't parse.
// Markdown is skipped too: Prettier realigns whole tables, so one edited row
// would rewrite hundreds. Symlinks are skipped because Prettier refuses them.
import { execFileSync, spawnSync } from "node:child_process"
import { lstatSync } from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const mode = process.argv[2]
if (mode !== "--check" && mode !== "--write") {
  console.error("Usage: node scripts/format-changed.mjs --check | --write")
  process.exit(1)
}

const git = (...args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8" }).split("\0").filter(Boolean)
const [base] = git("merge-base", "HEAD", "origin/main").map((line) => line.trim())
const files = [
  ...new Set([
    ...git("diff", "--name-only", "-z", "--diff-filter=d", base),
    ...git("ls-files", "--others", "--exclude-standard", "-z"),
  ]),
].filter((file) => !file.endsWith(".md") && !lstatSync(path.join(root, file)).isSymbolicLink())
if (!files.length) process.exit(0)

const prettier = path.join(root, "node_modules/.bin/prettier")
const result = spawnSync(prettier, [mode, "--ignore-unknown", "--", ...files], {
  cwd: root,
  stdio: "inherit",
})
if (result.error) throw result.error
process.exitCode = result.status ?? 1
