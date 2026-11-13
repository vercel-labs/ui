import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, test } from "vitest"
import { quickStartPrompt, setupPrompt } from "./setup-prompts"

const promptsDir = path.join(
  import.meta.dirname,
  "../content/shared/setup-prompt"
)

function quickStartFile(name: string) {
  const source = readFileSync(path.join(promptsDir, `${name}.mdx`), "utf8")
  return source.match(/```text prompt\n([\s\S]*?)\n```/)?.[1]
}

const site = "https://ui-sdk.dev"

describe("setup prompts", () => {
  test.each(["react", "vue", "svelte", "solid", "web-components"] as const)(
    "rebuilds the %s Quick Start prompt word for word",
    (stackId) => {
      expect(quickStartPrompt(stackId)).toBe(quickStartFile(stackId))
    }
  )

  test("names the project and how to create it", () => {
    const prompt = setupPrompt({
      stackId: "svelte",
      projectId: "sveltekit",
      site,
    })
    expect(prompt).toMatch(
      /^Set up ui-sdk in this Svelte project with SvelteKit\. It needs Svelte 5\.33 or newer\.\n/
    )
    expect(prompt).toContain(
      "If the folder is empty, create the project first: npx sv create ."
    )
  })

  test("imports web.css after installing", () => {
    const prompt = setupPrompt({ stackId: "react", projectId: "next", site })
    expect(prompt).toContain(
      `2. Import the default styles once at the app's entry: import "@ui-sdk/core/web.css". If the app uses Tailwind CSS, start its global stylesheet with these lines instead, in place of its own @import "tailwindcss", so Tailwind's base styles don't reset them:\n   @layer ui-sdk;\n   @import "tailwindcss";\n   @import "@ui-sdk/core/web.css" layer(components);\n`
    )
  })

  test("adds the module and web.css to nuxt.config.ts for Nuxt", () => {
    const prompt = setupPrompt({ stackId: "vue", projectId: "nuxt", site })
    expect(prompt).toContain(
      `2. Add "@ui-sdk/vue" to modules in nuxt.config.ts.\n3. Add the default styles once to css in nuxt.config.ts: css: ["@ui-sdk/core/web.css"]. If the app uses Tailwind CSS`
    )
  })

  test.each([
    ["web-components", "html"],
    ["artifacts", undefined],
  ])("loads web.js and web.css from the site for %s", (stackId, projectId) => {
    const prompt = setupPrompt({ stackId, projectId, site })
    expect(prompt).toContain(
      `<script type="module" src="https://ui-sdk.dev/web.js"></script>`
    )
    expect(prompt).toContain(
      `<link rel="stylesheet" href="https://ui-sdk.dev/web.css" />`
    )
    expect(prompt).toContain("read https://ui-sdk.dev/web.md.")
  })

  test("creates the project without prompts and checks the build", () => {
    const prompt = setupPrompt({ stackId: "vue", projectId: "nuxt", site })
    expect(prompt).toContain(
      "create the project first: npm create nuxt@latest . -- --template minimal --packageManager npm --no-gitInit --force\n"
    )
    expect(prompt).toMatch(
      /\n\d\. Run the project's build and make sure it passes\.\n\nWhen you're done/
    )
  })

  test("asks what to build once the setup is done", () => {
    expect(setupPrompt({ stackId: "solid", projectId: "start", site })).toMatch(
      /\n\nWhen you're done, ask me what I'd like to build\.$/
    )
  })
})
