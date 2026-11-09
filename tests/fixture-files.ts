import { existsSync, readdirSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

// Which playground fixtures exist, read from the files the playground loads:
// /?fixture=menu&framework=react-ssr loads fixtures/menu/react-ssr.tsx (see
// apps/playground/src/main.ts). Specs skip themselves where a fixture is
// missing, so knowing it up front saves a page load per skipped test, and
// keeps specs that only skip out of a project, which matters because shards
// split projects by test count.

const fixtureRoot = fileURLToPath(
  new URL("../apps/playground/src/fixtures/", import.meta.url)
)
const specRoot = fileURLToPath(new URL("specs/", import.meta.url))

/** Whether the playground has `fixture` for `framework`, like "menu" for "react-ssr". */
function hasFixture(fixture: string, framework: string) {
  return ["ts", "tsx"].some((extension) =>
    existsSync(`${fixtureRoot}${fixture}/${framework}.${extension}`)
  )
}

/**
 * Spec files that only skip for `framework`: none of the fixtures they open
 * exist for it. Kitchen sinks load their page themselves and run only for
 * the composition frameworks, so they're listed too, except for those.
 */
function specsThatSkip(framework: string) {
  const composition = ["react", "vue", "web"].includes(framework)
  return specFixtures().flatMap(({ file, fixtures }) => {
    if (file.endsWith(".kitchen-sink.spec.ts")) {
      return composition ? [] : [file]
    }
    if (file.endsWith(".ssr.spec.ts") && !framework.endsWith("-ssr")) {
      return [file]
    }
    const skips =
      fixtures.length > 0 &&
      fixtures.every((fixture) => !hasFixture(fixture, framework))
    return skips ? [file] : []
  })
}

// Each spec file and the fixtures it opens, read once per process.
let opened: { file: string; fixtures: string[] }[] | undefined
function specFixtures() {
  opened ??= readdirSync(specRoot)
    .filter((file) => file.endsWith(".spec.ts"))
    .map((file) => ({
      file,
      fixtures: [
        ...readFileSync(`${specRoot}${file}`, "utf8").matchAll(
          /\bopen\(\s*"([\w-]+)"/g
        ),
      ].map(([, fixture]) => fixture),
    }))
  return opened
}

/** Kitchen sink specs, which load their page without the project's fixture options. */
const kitchenSinks = "**/*.kitchen-sink.spec.ts"

/** Count gates, which measure work, not where a popup renders. */
const countGates = "**/*.counts.spec.ts"

/** Leak specs, which read the heap through the Chrome DevTools Protocol. */
const leakSpecs = "**/leaks.spec.ts"

export { countGates, hasFixture, kitchenSinks, leakSpecs, specsThatSkip }
