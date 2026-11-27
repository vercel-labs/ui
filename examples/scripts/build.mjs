// Builds the examples the docs load and their stylesheets, or the ones named:
// `node scripts/build.mjs react styles`. Each framework but web is also
// rendered to HTML in Node, which the docs show until an example mounts.
import { execFileSync } from "node:child_process"
import { writeFile } from "node:fs/promises"
import { build } from "vite"

const all = ["react", "vue", "svelte", "solid", "web", "angular", "styles"]
const named = process.argv.slice(2)
const unknown = named.filter((framework) => !all.includes(framework))
if (unknown.length) {
  throw new Error(`No examples build for ${unknown.join(", ")}`)
}

const root = new URL("..", import.meta.url).pathname
if (named.length === 0 || named.includes("angular")) {
  execFileSync("npx", ["ngc", "-p", "tsconfig.angular.json"], {
    cwd: root,
    stdio: "inherit",
  })
}
await Promise.all(
  (named.length ? named : all).map(async (mode) => {
    await build({ root, mode, logLevel: "warn" })
    if (mode !== "web" && mode !== "styles") {
      await prerender(mode)
    }
  })
)

async function prerender(mode) {
  await build({ root, mode, logLevel: "warn", build: { ssr: true } })
  const { examples, render } = await import(
    `${root}node_modules/.prerender/${mode}/${mode}.js`
  )
  const html = {}
  const failed = []
  for (const [file, load] of Object.entries(examples)) {
    const name = file
      .replace(/^\.\.\/(components\/)?/, "")
      .replace(/\.\w+$/, "")
      .replace(`/${mode}/`, "/")
    try {
      html[name] = withoutComments(await render(await load()))
    } catch {
      failed.push(name)
    }
  }
  await writeFile(
    `${root}../apps/docs/public/examples/${mode}/prerender.json`,
    JSON.stringify(html)
  )
  if (failed.length) {
    console.warn(`${mode}: ${failed.join(", ")} render only in the browser.`)
  }
}

// The markers are for hydration, and the docs replace this HTML instead.
// Taking one out can join the text around it into another, so it runs again.
function withoutComments(html) {
  let before
  do {
    before = html
    html = html.replace(/<!--[^]*?-->/g, "")
  } while (html !== before)
  return html
}
