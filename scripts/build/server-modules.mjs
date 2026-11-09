import { spawnSync } from "node:child_process"
import { readFileSync, readdirSync } from "node:fs"
import path from "node:path"

const directive = '"use client";'

/**
 * Checks a React package's build for Server Components: every module starts
 * with "use client" but `serverModules`, which must not, and each public
 * entry built from a server module imports under the `react-server`
 * condition, from `dist`, like a Server Component's bundler would. An entry
 * that exports `renderElement` must return an element from it there.
 */
function findServerModuleProblems({ packageDir, outDir, serverModules }) {
  const problems = []
  const servers = new Set(
    serverModules.map((file) => file.replace(/\.tsx?$/, ".js"))
  )
  const manifest = JSON.parse(
    readFileSync(path.join(packageDir, "package.json"), "utf8")
  )
  const published = Object.entries(manifest.publishConfig.exports).map(
    ([key, target]) => ({
      entry: `${manifest.name}${key.slice(1)}`,
      file: path.relative("dist", target.default ?? target),
    })
  )
  const entryFiles = new Set(published.map(({ file }) => file))
  for (const file of readdirSync(outDir, { recursive: true })) {
    if (!file.endsWith(".js")) {
      continue
    }
    const code = readFileSync(path.join(outDir, file), "utf8")
    const client = code.startsWith(directive)
    if (servers.has(file) && client) {
      problems.push(
        `${file} starts with "use client", but it's a server module.`
      )
    }
    if (!servers.has(file) && !client) {
      problems.push(`${file} doesn't start with "use client".`)
    }
    // Under "use client" an entry's re-export becomes a client reference too.
    if (
      client &&
      entryFiles.has(file) &&
      /export \{[^}]*\brenderElement\b/.test(code)
    ) {
      problems.push(
        `${file} exports renderElement under "use client", so a Server Component can't call it.`
      )
    }
  }
  for (const { entry } of published.filter(({ file }) => servers.has(file))) {
    const probe = `
      import { isValidElement } from "react"
      const module = await import(${JSON.stringify(entry)})
      if (module.renderElement) {
        const element = module.renderElement("div", { className: () => "card", "data-card": "" }, undefined, {})
        if (!isValidElement(element) || element.props.className !== "card") throw new Error("renderElement returned no element.")
      }`
    const run = spawnSync(
      process.execPath,
      [
        "--conditions=react-server",
        "--import",
        `data:text/javascript,import{register}from"node:module";register(${JSON.stringify(new URL("./published-resolve.mjs", import.meta.url).href)})`,
        "--input-type=module",
        "--eval",
        probe,
      ],
      { cwd: packageDir, encoding: "utf8" }
    )
    if (run.status !== 0) {
      problems.push(
        `${entry} doesn't run in a Server Component: ${run.stderr.trim().split("\n").at(-1)}`
      )
    }
  }
  return problems
}

export { findServerModuleProblems }
